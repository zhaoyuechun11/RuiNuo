import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Transfer } from 'antd';
import { Dialog } from '@components';
import { getBinds, getBindsList, addBind } from '../../../../models/server';
const BindModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [list, setList] = useState([]);
  const taskId = useRef();
  const [targetKeys, setTargetKeys] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: (val) => {
      dialogRef.current && dialogRef.current.show();
      taskId.current = val;

      List();
      getBindsData(val);
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const getBindsData = (id) => {
    getBinds({ taskId: id }).then((res) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };
  const List = () => {
    getBindsList().then((res) => {
      if (res.code) {
        setList(res.data);
      }
    });
  };
  const onOk = () => {
    const result = targetKeys.map((item) => {
      return { reqItemId: item };
    });
    let params = { reqItems: result, taskId: taskId.current };
    addBind(params).then((res) => {
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
  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={`绑定`}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Transfer
        dataSource={list}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.reqItemName}
        rowKey={(item) => item.id}
        style={{margin:' 20px 80px'}}
      />
    </Dialog>
  );
};
export default BindModal;
