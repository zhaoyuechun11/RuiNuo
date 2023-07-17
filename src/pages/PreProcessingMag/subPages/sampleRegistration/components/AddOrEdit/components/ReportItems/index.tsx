import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table } from 'antd';
import { Dialog } from '@components';
import { useDispatch } from 'umi';
const ReportItems = ({ refs }) => {
  const [list, setList] = useState([]);
  const dialog = useRef();
  const dispatch = useDispatch();
  useImperativeHandle(refs, () => ({
    show: (val) => {
      dialog.current && dialog.current.show();
      getList({ reqItemId: val });
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));

  const columns = [
    {
      title: '顺序',
      dataIndex: 'seq',
      key: 'seq',
    },
    {
      title: '报告项目编码',
      dataIndex: 'labItemCode',
      key: 'labItemCode',
    },
    {
      title: '报告项目名称',
      dataIndex: 'labItemName',
      key: 'labItemName',
    },

    {
      title: '默认值',
      key: 'defaultValue',
      dataIndex: 'defaultValue',
    },
  ];
  const getList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchReportItems',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            setList(res.data.records);
          }
        },
      },
    });
  };
  return (
    <Dialog ref={dialog} footer={null} width={864}>
      <Table columns={columns} dataSource={list} />
    </Dialog>
  );
};
export default ReportItems;
