import React, { Component, useEffect, useState } from 'react';
import styles from './index.less';
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Select, Tooltip, Button, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Table, Icon } from '@/components';
import DelRole from '../DelRole';
import NewAdd from '../NewAdd';

const RightContent = () => {
  const loading = useSelector((state) => state.loading.global);
  const { rolelistData } = useSelector((state) => state.role);
  console.log(rolelistData);
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 280,
      render: (text, record, index) => {
        return (
          <Tooltip placement="bottomLeft" title={text}>
            {text && text.length > 5 ? text.substr(0, 5) + '...' : text}
          </Tooltip>
        );
      },
    },
    {
      title: '角色描述',
      dataIndex: 'desc',
      width: 260,
      render: (text, record, index) => {
        let { type } = record;
        let desc = '';
        if (type == 1) {
          desc = text || '所有权限，可查看所有数据以及管理HR';
        } else if (type == 2) {
          desc = text || '添加职位和候选人、管理招聘流程、添加面试官权限';
        } else {
          desc = text || '查看候选人/填写面试反馈';
        }
        return (
          <Tooltip placement="bottomLeft" title={desc}>
            {desc.length > 10 ? desc.substr(0, 10) + '...' : desc}
          </Tooltip>
        );
      },
    },
    {
      title: '已分配的员工',
      dataIndex: 'users',
      width: 260,
      render: (record) => {
        let desc = '';
        let title = record.map((i) => i.name).join(',');
        if (record.length > 3) {
          desc =
            record
              .slice(0, 3)
              .map((i) => i.name)
              .join(',') + '...';
        } else {
          desc = record.map((i) => i.name).join(',');
        }

        return (
          <Tooltip placement="bottomLeft" title={title}>
            {desc}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 206,
      render: (text, record, index) => {
        let { key, ...others } = record;

        if (record.pid * 1 === 0) {
          return null;
        }
        return (
          <div className={styles.operate} key={record.id}>
            <NewAdd
              {...others}
              type="edit"
              onReload={() => {
                fetchRoleIndex();
              }}
            >
              <Button className={styles.newadd}>
                <Icon classStyle={styles.editIcon} name="iconanniu-bianji" />
                编辑
              </Button>
            </NewAdd>
            <DelRole
              {...others}
              onReload={() => {
                fetchRoleIndex();
              }}
            >
              <Button className={styles.delete}>
                <DeleteOutlined />
                删除
              </Button>
            </DelRole>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    fetchRoleIndex();
  }, [pageNum, pageSize]);

  const fetchRoleIndex = () => {
    dispatch({
      type: 'role/fetchRoleIndex',
      payload: { pageNum, pageSize },
    });
  };

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };

  return (
    <div className={styles.RightContent}>
      <div className={styles.Head}>
        <NewAdd
          onReload={() => {
            fetchRoleIndex();
          }}
        >
          <div className={styles.addRole}>
            <UserAddOutlined />
            <span>新增角色</span>
          </div>
        </NewAdd>
      </div>
      {/* <Table
          className={styles.tablePadding}
          rowClassName={styles.rowStyle}
          columns={this.columns}
          data={rolelistData}
          // pagination={false}
          loading={roleindexLoading}
          isRowSelection={false}
        /> */}
      <Table
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: rolelistData.total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={rolelistData.list}
      />
    </div>
  );
};

export default RightContent;
