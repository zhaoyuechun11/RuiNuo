import React from 'react';
import { Table } from 'antd';
const applyColumns = [
  {
    title: '序号',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '项目编号',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '项目名称',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '样本类型',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '专业类别',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '价格',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>

        <a>Delete</a>
      </span>
    ),
  },
];
const inspectionColumns = [
  {
    title: '序号',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '样本类型',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '样本性状',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '检验目的',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '原病理号',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '原蜡块序号',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '病理样本序号',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '样本描述',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>

        <a>Delete</a>
      </span>
    ),
  },
];
const informationColumns = [
  {
    title: '序号',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '图片名称',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '资料类型',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '图片地址',
    key: 'tags',
    dataIndex: 'tags',
  },

  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>

        <a>Delete</a>
      </span>
    ),
  },
];

const Applying = ({ type }) => {
  return (
    <Table
      columns={type === 1 ? applyColumns : type === 2 ? inspectionColumns : informationColumns}
    />
  );
};
export default Applying;
