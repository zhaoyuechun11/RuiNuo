import React, { useState, useEffect, useRef } from 'react';
import { Input, Table, Form, Select, Row, Col, Button } from 'antd';
import { reexamineResult } from '../../../../../../models/server';
import { useSelector, useDispatch } from 'umi';
import ReviewInputModel from '../reviewInputModel';
const ReviewRecords = () => {
  const dispatch = useDispatch();
  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const modalInput = useRef();
  useEffect(() => {
    getList({ reportId: instrAndRecordId.id, pageNum, pageSize });
  }, [pageNum, pageSize]);

  const getList = (params: any) => {
    dispatch({
      type: 'generalInspectionMag/fetchReexamineResult',
      payload: {
        ...params,
        callback: (res: ResponseData<{ list: RewardItem[]; count: number }>) => {
          if (res.code === 200) {
            setList(res.data.records);
            setTotal(res.data.total);
          }
        },
      },
    });
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'itemCode',
      ellipsis: true,
      align: 'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '复查前结果',
      dataIndex: 'reBeforeResult',
      align: 'center',
      width: 100,
    },
    {
      title: '复查后',
      dataIndex: 'reResult1',
      align: 'center',
      width: 100,
    },
    {
      title: '复查样本号',
      dataIndex: 'reSampleNo',
      align: 'center',
      width: 100,
    },
    {
      title: '复查原因',
      dataIndex: 'reexamineReason',
      align: 'center',
      width: 100,
    },
    {
      title: '复查人',
      dataIndex: 'reOperator',
      align: 'center',
      width: 100,
    },
    {
      title: '复查时间',
      dataIndex: 'reexamineDate',
      align: 'center',
      fixed: 'right',
      width: 150,
    },
  ];
  const renderForm = () => {
    return (
      <Form layout="inline" form={form}>
        <Form.Item name="itemCode">
          <Input placeholder="请输入项目编号名称" style={{ width: 130 }} allowClear />
        </Form.Item>
      </Form>
    );
  };
  const seach = () => {
    const { itemCode } = form.getFieldsValue();
    getList({ reportId: instrAndRecordId.id, pageNum: 1, pageSize: 10, key: itemCode });
  };
  const reset = () => {
    form.resetFields();
  };
  const enter = () => {
    modalInput.current.showModal();
  };
  return (
    <>
      <Row style={{ alignItems: 'center', marginBottom: '10px' }}>
        <Col> {renderForm()} </Col>
        <Col>
          <Button type="primary" size="small" onClick={seach}>
            查询
          </Button>
        </Col>

        <Col style={{ margin: ' 0 10px' }}>
          <Button type="primary" size="small" onClick={reset}>
            重置
          </Button>
        </Col>

        <Col>
          <Button type="primary" size="small" onClick={enter}>
            复查录入
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={list}
        bordered
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        scroll={{ x: 300 }}
      />
      <ReviewInputModel
        Ref={modalInput}
        refresh={() => getList({ reportId: instrAndRecordId.id, pageNum, pageSize })}
      />
    </>
  );
};
export default ReviewRecords;
