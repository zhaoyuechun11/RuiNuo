import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Checkbox,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
  Tooltip,
  Tabs,
} from 'antd';
import { useDispatch } from 'umi';
import { Icon, Button } from '@/components';
import { getHospitalList, getReqItemList, dictList } from '@/models/server';
import s from '../index.less';
import SetHeaderModal from '../SetHeaderModal';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const BatchReceipt = () => {
  const [form] = Form.useForm();
  const [hospitalList, setHospitalList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [reportUnitReqItemList, setReportUnitReqItemList] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const setRef = useRef();
  const applyFormRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    hospital();
    getReportUnitReqItem();
    getDictList();
  }, []);
  const handleSearch = (changedValues: any, allValues: undefined) => {};
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
    dictList({ type: 'DP' }).then((res) => {
      if (res.code === 200) {
        setDepartment(res.data);
      }
    });
  };
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          //getBeforeOrderList();
        },
      },
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
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
            <Form.Item name="sampleBarcode">
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
  return (
    <>
      <Row>
        <Col span={14} className={s.right_content}>
          <div> {renderForm()}</div>
          <div className={s.btn_box}>
            <Button btnType="primary">批量查询</Button>
            <Button btnType="primary">确认签收</Button>
            <Button btnType="primary">打印签收单</Button>
            <Button btnType="primary">打印条码</Button>
            <Button btnType="primary">清空</Button>
            <Button btnType="primary">交接</Button>
            <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
              <span
                className={s.settings}
                onClick={() => {
                  setRef.current && setRef.current?.show();
                }}
              >
                <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20 }} />
              </span>
            </Tooltip>
          </div>
        </Col>

        <Col span={10} className={s.border_line}>
          <Tabs defaultActiveKey="1" className={s.tabs_box}>
            <TabPane tab="原始申请单" key="1">
              <ApplyFormModal Ref={applyFormRef} />
            </TabPane>
            <TabPane tab="交接单" key="2"></TabPane>
            <TabPane tab="订单流转日志" key="3"></TabPane>
          </Tabs>
        </Col>
      </Row>
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
    </>
  );
};
export default BatchReceipt;
