import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table, Form, Select } from 'antd';
const { Option } = Select;
const BatchAdd = ({ Ref }) => {
  const dialogRef = useRef();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [form] = Form.useForm();
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 150,
    },
    {
      title: '结果',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '模版',
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
  const onChangeSelected = (selectedRowKeys) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {};
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'批量录入'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form onValuesChange={searchHandle} layout="inline" form={form}>
        <Select
          placeholder="请选择录入模版"
          autoComplete="off"
          allowClear
          getPopupContainer={() => document.getElementById('hospitalId')}
          //   onChange={hospitalChange}
        >
          {/* {hospitalList?.map((item, index) => (
            <Option value={item.id} key={index}>
              {item.hospitalName}
            </Option>
          ))} */}
        </Select>
      </Form>
      <Table columns={columns} dataSource={data} rowSelection={rowSelection} />
    </Dialog>
  );
};
export default BatchAdd;
