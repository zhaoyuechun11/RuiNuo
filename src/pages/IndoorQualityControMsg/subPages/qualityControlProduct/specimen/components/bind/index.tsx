import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { message, Table } from 'antd';
import { getNotBindQcListForReqItem, controlsItemAdd } from '../../../../../models/server';
const Bind = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const [list, setList] = useState([]);
  const [qcId, setQcId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (labClassId: any, qcId: any) => {
      getList({ labClassId, qcId });
      setQcId(qcId)
      dialogRef.current && dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const columns = [
    {
      title: '项目类别',
      dataIndex: 'className',
      align: 'center',
    },
    {
      title: '项目编号',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
  ];
  const onOk = () => {
    controlsItemAdd({
      qcId,
      itemIds: selectedRowKeysVal,
    }).then((res:any) => {
      if (res.code === 200) {
        message.success('绑定成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };

  const getList = (params: any) => {
    getNotBindQcListForReqItem(params).then((res: any) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return {
            key: item.id,
            ...item,
          };
        });
        setList(result);
      }
    });
  };

  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  return (
    <Dialog ref={dialogRef} width={864} title={'绑定'} onOk={onOk}>
      <Table
        dataSource={list}
        columns={columns}
        size="small"
        rowSelection={rowSelection}
        pagination={false}
      />
    </Dialog>
  );
};
export default Bind;
