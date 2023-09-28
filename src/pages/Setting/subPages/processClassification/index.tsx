import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Input, message } from 'antd';

import { PlusOutlined, BranchesOutlined } from '@ant-design/icons';
import { history, useDispatch } from 'umi';
import { Button, Icon } from '@/components';
import styles from '../index.less';
import AddOrEdit from './components/addOrEdit';
import { getSuitFlowCond, suitFlowCondDelete } from '../../models/server';
const ProcessClassification = () => {
  const [list, setList] = useState([]);
  const addOrEdit = useRef();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    getSuitFlowCondList({ pageNum, pageSize });
  }, [pageNum, pageSize]);

  const columns = [
    {
      title: '检测类别',
      dataIndex: 'labClassName',
      key: 'labClassName',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.labClassName.length - b.labClassName.length,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleTypeName',
      key: 'sampleTypeName',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.sampleTypeName.length - b.sampleTypeName.length,
    },
    {
      title: '病人类型',
      dataIndex: 'sourceName',
      key: 'sourceName',
      align: 'center',
    },
    {
      title: '流程ID',
      dataIndex: 'flowId',
      key: 'flowId',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.flowId - b.flowId,
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
      key: 'flowName',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.flowName.length - b.flowName.length,
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button onClick={() => processPreview(record.flowId)}>
              <BranchesOutlined></BranchesOutlined>
            </Button>
            <Button
              onClick={() => {
                addOrEdit.current.show(record);
              }}
            >
              修改
            </Button>
            <Button onClick={() => deleteItem(record.id)}>删除</Button>
          </div>
        );
      },
    },
  ];
  const deleteItem = (id: any) => {
    suitFlowCondDelete({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getSuitFlowCondList({ pageNum, pageSize, ...form.getFieldsValue() });
      }
    });
  };
  const handleSearch = (changedValues: any, allValues: any) => {
    const params = {
      ...allValues,
      pageNum,
      pageSize,
    };
    getSuitFlowCondList(params);
  };
  const processPreview = (id: any) => {
    history.push(`/setting/updateCustomProcess/${id}`);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="remark">
          <Input
            placeholder="请输入流程名称"
            autoComplete="off"
            suffix={<Icon type="search" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const getSuitFlowCondList = (val: any) => {
    getSuitFlowCond({ ...val }).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.total);
      }
    });
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button
            btnType="primary"
            onClick={() => {
              addOrEdit.current.show();
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
      </div>
      <Table
        dataSource={list}
        columns={columns}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />
      <AddOrEdit cRef={addOrEdit} refresh={() => getSuitFlowCondList({ pageNum, pageSize })} />
    </>
  );
};
export default ProcessClassification;
