import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, message, Table, Transfer, Switch } from 'antd';
import {
  getBindsList,
  reportItemBindsRight,
  reportItemBindAdd,
} from '../../../../../../models/server';
import style from '../../../../index.less';
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [targetKeys, setTargetKeys] = useState([]);
  const [leftListData, setLeftListData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

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

    reportItemBindsRight(param).then((res) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };

  const getLeftList = () => {
    getBindsList().then((res: { code: number }) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { ...item, key: item.id };
        });
        setLeftListData(result);
      }
    });
  };
  const onOk = () => {
    const reqItems = targetKeys.map((item) => {
      return {
        reqItemId: item,
        isEnabled,
      };
    });
    let params = {
      reportUnitId: parent?.id,
      reqItems,
    };
    reportItemBindAdd(params).then((res) => {
      if (res.code === 200) {
        message.success('绑定成功');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const filterOption = (inputValue, option) => option.reqItemName.indexOf(inputValue) > -1;
  const handleChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  };
  const isEnabledChange = (e) => {
    setIsEnabled(e);
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
        render={(item) => item.reqItemName}
        className={style.transfer}
      />
      <Form style={{ marginLeft: '80px' }}>
        <Form.Item name="isEnabled" label="是否启用修改">
          <Switch onChange={isEnabledChange} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
