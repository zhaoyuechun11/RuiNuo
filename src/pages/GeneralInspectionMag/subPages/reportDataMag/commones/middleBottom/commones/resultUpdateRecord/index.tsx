import React from 'react';
import { Input, Table } from 'antd';

const ResultUpdateRecord = () => {
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '项目名称',
      className: 'column-money',
      dataIndex: 'money',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '修改前',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: '修改后',
      className: 'column-money',
      dataIndex: 'money',
      align: 'center',
    },
    {
      title: '修改人',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: '修改时间',
      className: 'column-money',
      dataIndex: 'money',
      align: 'center',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      money: '￥300,000.00',
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      money: '￥1,256,000.00',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      money: '￥120,000.00',
      address: 'Sidney No. 1 Lake Park',
    },
  ];
  return <Table columns={columns} dataSource={data} bordered size="small" />;
};
export default ResultUpdateRecord;
