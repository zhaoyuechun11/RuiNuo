import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table } from 'antd';
import { Dialog, Button } from '@/components';

import { getListByInstr } from '../../../../models/server';

const ApplyProjectByInstr = ({ Ref }) => {
  const dialogRef = useRef();
  const [list, setList] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: (val) => {
      dialogRef.current && dialogRef.current.show();
      applyProjectList(val);
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const applyProjectList = (instrId) => {
    getListByInstr({ instrId }).then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };

  const onOk = () => {};

  const columns = [
    {
      title: '仪器名称',
      dataIndex: 'instrName',
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '项目编码',
      dataIndex: 'reqItemCode',
      align: 'center',
      width: 150,
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
    },
  ];
  const footer = (
    <div>
      <Button type="primary" onClick={() => dialogRef.current.hide()} style={{ margin: 'auto' }}>
        我知道了
      </Button>
    </div>
  );
  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={'申请项目'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      footer={footer}
    >
      <Table columns={columns} rowKey="id" dataSource={list} pagination={false} />
    </Dialog>
  );
};
export default ApplyProjectByInstr;
