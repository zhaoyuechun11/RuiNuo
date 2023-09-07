import React, { useEffect, useState } from 'react';
import s from '../../../index.less';
import styles from './index.less';
import { UserAddOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
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
      align: 'center',
      render: (text, record, index) => {
        return (
          <Tooltip placement="bottomLeft" title={text}>
            {text && text.length > 5 ? text.substr(0, 5) + '...' : text}
          </Tooltip>
        );
      },
    },
    {
      title: '已分配的员工',
      dataIndex: 'users',

      align: 'center',
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
      render: (text, record, index) => {
        let { ...others } = record;
        return (
          <div className={s.tabale_operate_box} key={record.id}>
            <NewAdd
              {...others}
              type="edit"
              onReload={() => {
                fetchRoleIndex();
              }}
            >
              <Button className={styles.newadd}>编辑</Button>
            </NewAdd>
            <DelRole
              {...others}
              onReload={() => {
                fetchRoleIndex();
              }}
            >
              <Button className={styles.delete}>删除</Button>
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
