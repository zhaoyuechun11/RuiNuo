import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table } from 'antd';
import { Dialog } from '@components';
const CheckItem = ({ Ref }) => {
  const dialogRef = useRef();
  const [selectedKeys, setSelectedKeys] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 150,
    },
    {
      title: '项目名称',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
  ];
  const data = [
    {
      key: 1,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 2,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 2 Lake Park, London No. 2 Lake Park',
      tags: ['loser'],
    },
  ];
  const onOk = () => {};
  const onChangeSelected = (selectedRowKeys, selectedRows) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
  };
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'检查项目'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Table columns={columns} dataSource={data} rowSelection={rowSelection} />
    </Dialog>
  );
};
export default CheckItem;
