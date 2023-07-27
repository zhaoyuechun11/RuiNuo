import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, message, Table, Transfer, Switch } from 'antd';
import {
  transferInstrList,
  reportUnitInstrBinds,
  reportUnitInstrAddBind,
} from '../../../../../../models/server';
import style from '../../../../index.less';
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [targetKeys, setTargetKeys] = useState([]);
  const [leftListData, setLeftListData] = useState([]);
  const [isAllItem, setIsAllItem] = useState(false);

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      getList();
      getLeftList();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const getList = () => {
    let param = { reportUnitId: parent?.id };

    reportUnitInstrBinds(param).then((res) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };

  const getLeftList = () => {
    transferInstrList().then((res: { code: number }) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { ...item, key: item.id };
        });
        setLeftListData(result);
      }
    });
  };
  const onOk = () => {
    const instr = targetKeys.map((item) => {
      return {
        instrId: item,
        isAllItem,
      };
    });
    let params = {
      reportUnitId: parent?.id,
      instr,
    };
    reportUnitInstrAddBind(params).then((res) => {
      if (res.code === 200) {
        message.success('绑定成功');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const filterOption = (inputValue, option) => option.instrName.indexOf(inputValue) > -1;
  const handleChange = (targetKeys) => {
    console.log('targetKeys', targetKeys);
    setTargetKeys(targetKeys);
  };
  const isAllItemChange = (e) => {
    setIsAllItem(e);
  };
  const columns = [
    {
      title: '报告单元名字',
      dataIndex: 'reportUnitName',
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '报告单元代码',
      dataIndex: 'reportUnitCode',
      align: 'center',
      width: 150,
    },
  ];
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Table columns={columns} rowKey="id" dataSource={[parent]} pagination={false} />

      <Transfer
        dataSource={leftListData}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.instrName}
        className={style.transfer}
      />
      <Form style={{ marginLeft: '80px' }}>
        <Form.Item name="isAllItem" label="是否全部上机">
          <Switch onChange={isAllItemChange} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
