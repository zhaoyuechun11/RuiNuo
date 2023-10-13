import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Input } from 'antd';
import { useParams, history } from 'umi';
import { Button, Icon } from '@/components';
import { detailList } from '../../models/server';
import styles from './index.less';
import ApplyFormModal from './commones/applyFormModal';
import SourceModal from './commones/sourceModal';
const BatchTask = () => {
  const [list, setList] = useState([]);
  const params = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const applyFormRef = useRef();
  const sourceModal = useRef();
  useEffect(() => {
    getList({
      labClassId: params.classId,
      nodeValue: params.nodeId,
      processDefinitionId: params.flowId,
      pageNum,
      pageSize,
    });
  }, [pageNum, pageSize]);
  const columns = [
    {
      title: '登记时间',
      dataIndex: 'createDate',
      key: 'createDate',
      fixed: 'left',
      width: 180,
      align: 'center',
    },
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
      key: 'sampleBarcode',
      width: 190,
      align: 'center',
    },
    {
      title: '样本编号',
      dataIndex: 'sampleNo',
      key: 'sampleNo',
      width: 190,
      align: 'center',
    },
    {
      title: '专业类别',
      dataIndex: 'labClassName',
      key: 'labClassName',
      width: 100,
      align: 'center',
    },
    {
      title: '申请项目',
      dataIndex: 'reqItemName',
      key: 'reqItemName',
      width: 100,
      align: 'center',
    },
    {
      title: '上一操作',
      dataIndex: 'currentNodeName',
      key: 'currentNodeName',
      width: 100,
      align: 'center',
    },
    {
      title: '当前待处理',
      dataIndex: 'nextNodeName',
      key: 'nextNodeName',
      width: 120,
      align: 'center',
    },
    {
      title: '急诊',
      dataIndex: 'isEmer',
      key: 'isEmer',
      width: 100,
      align: 'center',
      sorter: true,
      render: (text: any) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '病人ID',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 100,
      align: 'center',
    },
    {
      title: '病人姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 100,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      key: 'sexName',
      width: 100,
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: 180,
      align: 'center',
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      key: 'collectDate',
      width: 180,
      align: 'center',
    },
    {
      title: '前处理接收时间',
      dataIndex: 'preReceiveDate',
      key: 'preReceiveDate',
      width: 180,
      align: 'center',
    },
    {
      title: '上一节点操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 180,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (record) => {
        return (
          <div className={styles.action_btn}>
            <Button
              onClick={() => {
                applyFormRef.current.show(record);
              }}
            >
              申请单
            </Button>
            <Button
              onClick={() => {
                sourceModal.current.show(record);
              }}
            >
              溯源
            </Button>
          </div>
        );
      },
    },
  ];
  const getList = (params: any) => {
    detailList(params).then((res) => {
      if (res.code === 200) {
        const newData = res.data.records?.map((item) => {
          return {
            ...item,
            key: item.id,
          };
        });
        const ids = newData.map((item) => item.id);
        setSelectedRowKeysVal(ids);
        setList(newData);
        setTotal(res.data.total);
      }
    });
  };
  const pageChange = (page: any, size: any) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      labClassId: params.classId,
      nodeValue: params.nodeId,
      processDefinitionId: params.flowId,
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="sampleBarcode">
          <Input
            placeholder="请输入送检样本条码"
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
          <Button btnType="primary" onClick={() => history.push(`${params.route}`)}>
            任务批处理
          </Button>
          {/* <Button>自定义列</Button> */}
        </div>
        <div>当前待处理任务总数:{total}</div>
      </div>
      <Table
        dataSource={list}
        columns={columns}
        scroll={{ x: 1300 }}
        size="small"
        rowSelection={rowSelection}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />
      <ApplyFormModal Ref={applyFormRef} />
      <SourceModal Ref={sourceModal} />
    </>
  );
};
export default BatchTask;
