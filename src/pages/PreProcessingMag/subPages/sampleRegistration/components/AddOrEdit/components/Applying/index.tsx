import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';

const Applying = ({ type, applyListData, setApplyList }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(applyListData);
  }, [applyListData]);
  const applyColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '项目编号',
      dataIndex: 'reqItemCode',
      key: 'reqItemCode',
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      key: 'reqItemName',
    },
    {
      title: '样本类型',
      key: 'defaultSampleTypeName',
      dataIndex: 'defaultSampleTypeName',
    },
    {
      title: '专业类别',
      key: 'labClassName',
      dataIndex: 'labClassName',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button
          onClick={() => {
            deleteCurrentItem(record.id);
          }}
        >
          删除
        </Button>
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
  const deleteCurrentItem = (id) => {
    let result = applyListData.filter((item) => item.id != id);
    setList(result);
    setApplyList(result);
  };
  return (
    <Table
      columns={type === 1 ? applyColumns : type === 2 ? inspectionColumns : informationColumns}
      dataSource={list}
    />
  );
};
export default Applying;
