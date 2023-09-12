import React, { useState, useEffect } from 'react';
import { Input, Table, Form, Row, Col, Button } from 'antd';
import { selectUpdateList } from '../../../../../../models/server';
import { useSelector, useDispatch } from 'umi';
const ResultUpdateRecord = () => {
  const dispatch = useDispatch();
  const { instrAndRecordId, resultUpdateRecord } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getList();
  }, []);
  const getList = () => {
    selectUpdateList({ reportId: instrAndRecordId.id }).then((res) => {
      if (res.code === 200) {
        setList(res.data);
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'resultUpdateRecord',
            dataSource: res.data,
          },
        });
      }
    });
  };
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'itemCode',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '修改前',
      dataIndex: 'resultBeFore',
      align: 'center',
    },
    {
      title: '修改后',
      dataIndex: 'resultAfter',
      align: 'center',
    },
    {
      title: '修改人',
      dataIndex: 'operator',
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'operateTime',
      align: 'center',
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
    let searchResult = [];
    if (itemCode) {
      list.map((item) => {
        Object.values(item).forEach((val) => {
          if (val === itemCode) {
            searchResult.push(item);
          }
        });
      });
    } else {
      if (itemCode === '' || itemCode == undefined) {
        searchResult = list;
      }
    }

    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'resultUpdateRecord',
        dataSource: searchResult,
      },
    });
  };
  const reset = () => {
    form.resetFields();
  };
  return (
    <>
      <Row style={{ alignItems: 'center', marginBottom: '10px' }}>
        <Col> {renderForm()} </Col>
        <Col style={{ marginRight: '10px' }}>
          <Button type="primary" size="small" onClick={seach}>
            查询
          </Button>
        </Col>

        <Col>
          <Button type="primary" size="small" onClick={reset}>
            重置
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={resultUpdateRecord}
        bordered
        size="small"
        pagination={false}
      />
    </>
  );
};
export default ResultUpdateRecord;
