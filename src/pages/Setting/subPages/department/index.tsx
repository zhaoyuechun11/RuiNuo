import React, { useEffect, useState, useRef } from 'react';
import { Table, message, Form, Input, Switch } from 'antd';
import { Button, Icon } from '@/components';
import { PlusOutlined } from '@ant-design/icons';
import Edit from './components/Edit';
import { dept, statusChange, deptDelete } from './models/server';
import styles from '../index.less';
const Department = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();

  const [form] = Form.useForm();
  const modalRef = useRef();
  useEffect(() => {
    getList({ pageNum, pageSize, name: '' });
  }, [pageNum, pageSize]);
  const getList = (params: { pageNum: number; pageSize: number; name: string }) => {
    dept(params).then((res: any) => {
      setList(res.data.records);
      setTotal(res.data.total);
    });
  };
  const pageChange = (page: any, pageSize: any) => {
    setPageNum(page);
    setPageSize(pageSize);
  };
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '部门负责人',
      dataIndex: 'deptMasterName',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'tel',
      align: 'center',
    },

    {
      title: '创建人名称',
      dataIndex: 'createByName',
      align: 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      align: 'center',
      render: (text: any, record: any) => {
        return <Switch onChange={(e) => isDisableChange(e, record.id)} checked={text} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'is_auth',
      align: 'center',
      render: (text, record, index) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button
              onClick={() => {
                deptDeleteById(record.id);
              }}
            >
              删除
            </Button>

            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              编辑
            </Button>
          </div>
        );
      },
    },
  ];
  const isDisableChange = (e: any, id: any) => {
    statusChange({ id }).then((res) => {
      if (res.code === 200) {
        message.success('状态改变成功!');
        getList({ pageNum, pageSize, name: form.getFieldsValue() });
      }
    });
  };
  const handleSearch = (changedValues: any) => {
    const values = {
      pageNum,
      pageSize,
      ...changedValues,
    };
    getList(values);
  };
  const deptDeleteById = (id: any) => {
    deptDelete({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({ pageNum, pageSize, name: form.getFieldsValue() });
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="name">
          <Input
            placeholder="请输入部门姓名"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button
            btnType="primary"
            onClick={() => {
              modalRef.current.show();
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        size="small"
        pagination={{
          pageSize,
          current: pageNum,
          total,
          onChange: pageChange,
          showTotal: (total, range) => `共 ${total} 条`,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true,
        }}
      />
      <Edit
        cRef={modalRef}
        refresh={() => getList({ pageNum, pageSize, name: form.getFieldsValue() })}
      />
    </>
  );
};
export default Department;
