import React, { useEffect, useState, useRef } from 'react';
import { Table, Button,message } from 'antd';
import AliasEdit from './components/Edit/index';
import { permission, deletePermission } from './models/server';
import { Confirm } from '@/components';

const permissionMange = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [permissionListData, setPermissionListData] = useState([]);
  const [currentRowPermis, setCurrentRowPermis] = useState({});
  const childRef = useRef();
  const modalRef = useRef();
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '别名',
      dataIndex: 'cname',
      key: 'age',
      width: '12%',
    },
    {
      title: '操作',
      dataIndex: 'is_auth',
      align: 'center',
      render: (text, record, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => {
                modalRef.current.show();
                setCurrentRowPermis(record);
              }}
            >
              删除
            </Button>

            <Button
              onClick={() => {
                editAlias(record);
              }}
              // className={s.edit}
            >
              编辑
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    permissionList();
  }, []);
  const permissionList = () => {
    const params = { page, pageSize };
    permission(params).then((res) => {
      setPermissionListData(res.data.records);
    });
  };
  const editAlias = (record) => {
    childRef.current.show(record);
  };

  const confirmDelete = () => {
    deletePermission({ ids: [currentRowPermis.id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        modalRef.current.hide();
        permissionList();
      }
    });
  };
  return (
    <>
      <Table columns={columns} dataSource={permissionListData} />{' '}
      <AliasEdit refresh={permissionList} cRef={childRef}></AliasEdit>
      <Confirm
        confirmRef={modalRef}
        title="删除权限"
        content="确认要删除该权限吗?"
        onOk={confirmDelete}
      />
    </>
  );
};
export default permissionMange;
