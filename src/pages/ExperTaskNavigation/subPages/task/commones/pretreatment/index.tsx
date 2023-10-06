import React from 'react';
import { Table } from 'antd';
const Pretreatment = () => {
  const columns = [
    {
      title: '流程节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前处理',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '处理任务',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '进入已完成',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '超报告周期任务',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return <Table dataSource={[]} columns={columns} size='small' />;
};
export default Pretreatment;
