import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Input, message, Popconfirm } from 'antd';
import { Icon, Button } from '@/components';
import { BranchesOutlined } from '@ant-design/icons';
import styles from '../index.less';
import AddOrEdit from './components/addOrEdit';
import { flowchartList, flowchartDelete, flowchartEnable } from '../../models/server';
const ProcessMange = () => {
  const addOrEdit = useRef();
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    getFlowchartList({ pageNum, pageSize });
  }, [pageNum, pageSize]);

  const columns = [
    {
      title: '流程ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '流程编码',
      dataIndex: 'flowCode',
      key: 'flowCode',
      align: 'center',
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
      key: 'flowName',
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.flowName.length - b.flowName.length,
    },
    {
      title: '流程用途',
      dataIndex: 'flowPurpose',
      key: 'flowPurpose',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
    },
    {
      title: '启用标志',
      dataIndex: 'isDisable',
      key: 'isDisable',
      align: 'center',
      render: (text: any) => {
        return text ? '启用' : '未启用';
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Popconfirm
              title="修改后需重新启动流程哦!"
              onConfirm={(e) => confirm(e, record)}
              okText="确定"
              cancelText="取消"
            >
              <Button>
                <BranchesOutlined></BranchesOutlined>
              </Button>
            </Popconfirm>
            <Button onClick={() => deleteItem(record.id)}>删除</Button>
            <Button onClick={() => enableProcess(record.id)}>启用</Button>
          </div>
        );
      },
    },
  ];
  const handleSearch = (changedValues: any, allValues: any) => {
    const params = {
      ...allValues,
      pageNum,
      pageSize,
    };
    getFlowchartList(params);
  };
  const deleteItem = (ids: any) => {
    flowchartDelete({ ids: [ids] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getFlowchartList({ pageNum, pageSize, ...form.getFieldsValue() });
      }
    });
  };
  const enableProcess = (id: any) => {
    flowchartEnable({ id }).then((res) => {
      if (res.code === 200) {
        message.success('启用成功!');
      }
    });
  };
  const getFlowchartList = (val: any) => {
    flowchartList({ ...val }).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="name">
          <Input
            placeholder="请输入流程名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const confirm = (e: any, val: any) => {
    addOrEdit.current.show(val);
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
            绘制流程图
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      />
      <AddOrEdit cRef={addOrEdit} />
    </>
  );
};
export default ProcessMange;
