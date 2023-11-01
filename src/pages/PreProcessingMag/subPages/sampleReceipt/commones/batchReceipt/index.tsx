import React, { useEffect, useState } from 'react';
import { Table, Form, Input, DatePicker, Select, message, Row, Col, Tabs } from 'antd';
import { Button } from '@/components';
import { getHospitalList, getReqItemList, dictList } from '@/models/server';
import { signForPageQuery, batchSign } from '../../../../models/server';
import s from '../index.less';
import LogList from '../logList';
import ApplyForm from '../applyForm';
import DeliveryReceipt from '../deliveryReceipt';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const BatchReceipt = ({ receiptTableHeader }) => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [hospitalList, setHospitalList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [reportUnitReqItemList, setReportUnitReqItemList] = useState([]);
  const [list, setList] = useState([]);
  const [mainId, setMainId] = useState();
  const [clickRow, setClickRow] = useState(0);
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  useEffect(() => {
    hospital();
    getReportUnitReqItem();
    getDictList();
    batchQuery();
  }, []);

  const hospital = () => {
    getHospitalList().then((res: any) => {
      if (res.code === 200) {
        setHospitalList(res.data);
      }
    });
  };
  const getReportUnitReqItem = () => {
    getReqItemList().then((res: any) => {
      if (res.code === 200) {
        setReportUnitReqItemList(res.data);
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'DP' }).then((res: any) => {
      if (res.code === 200) {
        setDepartment(res.data);
      }
    });
  };

  const renderForm = () => {
    return (
      <Form layout="inline" form={form}>
        <Row className={s.row_box}>
          <Col span={10}>
            <Form.Item name="createDateStart">
              <RangePicker
                showTime
                placeholder={['登记开始日期', '登记结束日期']}
                style={{ border: '1px solid #9d9fa0' }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="hospitalId">
              <Select placeholder="请选择送检单位" allowClear>
                {hospitalList?.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.hospitalName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="reqItemIds">
              <Select allowClear placeholder="检验目的" mode="multiple">
                {reportUnitReqItemList?.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.reqItemName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className={s.row_box}>
          <Col span={10}>
            <Form.Item name="transferBoxCode">
              <Input placeholder="请输入运转箱码" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sendDeptId">
              <Select placeholder="请选择送检科室" allowClear>
                {department.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sampleBarcode">
              <Input placeholder="请输入收样条码范围" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };
  const batchQuery = () => {
    let param = {};
    if (/-/.test(form.getFieldValue('sampleBarcode'))) {
      let result = form.getFieldValue('sampleBarcode').split('-');
      param = {
        receiveBarcodeStart: result[0],
        receiveBarcodeEnd: result[1],
      };
    } else {
      param = {
        receiveBarcodeStart: form.getFieldValue('sampleBarcode'),
      };
    }
    const { hospitalId, reqItemIds, sendDeptId } = form.getFieldsValue();
    let othersParams = {
      pageNum,
      pageSize,
      hospitalId,
      reqItemIds,
      sendDeptId,
      createDateStart:
        form.getFieldsValue().createDateStart && form.getFieldsValue().createDateStart[0]
          ? form.getFieldsValue().createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateEnd:
        form.getFieldsValue().createDateStart && form.getFieldsValue().createDateStart[1]
          ? form.getFieldsValue().createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      ...param,
    };
    signForPageQuery(othersParams).then((res: any) => {
      if (res.code === 200) {
        let result = res.data.records.map((item: any) => {
          return {
            key: item?.id,
            ...item,
          };
        });
        let keys = result.map((item: any) => item.id);
        setList(result);
        setMainId(res.data.records[0]?.id);
        setTotal(res.data.total);
        setSelectedRowKeysVal(keys);
      }
    });
  };
  const clear = () => {
    setList([]);
    setTotal(0);
  };

  const onRowClick = (record, index) => {
    setClickRow(index);
    setMainId(record.id);
  };
  const getRowClassName = (record, index) => {
    let className = 'normal';
    if (index === clickRow) {
      className = s.blue;
      return className;
    }
  };
  const sureSign = () => {
    batchSign({ ids: selectedRowKeysVal }).then((res) => {
      if (res.code === 200) {
        message.success('签收成功!');
        batchQuery();
      }
    });
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    setPageSize(pageSize);
  };
  return (
    <>
      <Row>
        <Col span={14} className={s.right_content}>
          <div> {renderForm()}</div>
          <div className={s.btn_box}>
            <Button btnType="primary" onClick={batchQuery}>
              批量查询
            </Button>
            <Button btnType="primary" onClick={sureSign}>
              确认签收
            </Button>
            <Button btnType="primary">打印签收单</Button>
            <Button btnType="primary">打印条码</Button>
            <Button btnType="primary" onClick={clear}>
              清空
            </Button>
            <Button btnType="primary">交接</Button>
          </div>
          <Table
            className={s.batch_table}
            columns={receiptTableHeader}
            dataSource={list}
            scroll={{ x: 'max-content' }}
            size="small"
            rowClassName={getRowClassName}
            rowSelection={rowSelection}
            onRow={(record, index) => {
              return {
                onClick: (event) => {
                  onRowClick(record, index);
                },
              };
            }}
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </Col>
        <Col span={10} className={s.border_line}>
          <Tabs defaultActiveKey="1" className={s.tabs_box}>
            <TabPane tab="原始申请单" key="1">
              <ApplyForm mainId={mainId} />
            </TabPane>
            <TabPane tab="交接单" key="2">
              <DeliveryReceipt mainId={mainId} subId={''} />
            </TabPane>
            <TabPane tab="订单流转日志" key="3">
              <LogList mainId={mainId} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
export default BatchReceipt;
