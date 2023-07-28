import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Icon } from '@components';
import { Table, Form, Input, DatePicker, Select, message } from 'antd';
import { reportUnitSelect } from '@/models/server';
import { reportUnitInstr, executorByReportUnit } from '../../models/server';
import styles from './index.less';
const { Option } = Select;
const SingleInstrument = () => {
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  const [reportUnitList, setReportUnitList] = useState([]);
  const [reportUnitInstrList, setReportUnitInstrList] = useState([]);
  const [executorList, setExecutorList] = useState([]);
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  useEffect(() => {
    form.setFieldsValue({ createDateStart: moment(now1, 'YYYY-MM-DD HH:mm:ss') });
    getReportUnitSelect();
  }, []);

  const search = () => {};
  const add = () => {
    console.log(isNaN(scanForm.getFieldsValue().no));
    if (!isNaN(scanForm.getFieldsValue().no)) {
    } else {
      var lastChar = scanForm.getFieldsValue().no.charAt(scanForm.getFieldsValue().no.length - 1);
      console.log(isNaN(lastChar));
    }
  };
  const minus = () => {};
  const getReportUnitSelect = () => {
    reportUnitSelect().then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };
  const getReportUnitInstr = (reportUnitId) => {
    reportUnitInstr({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setReportUnitInstrList(res.data);
      }
    });
  };
  const getExecutorByReportUnit = (reportUnitId) => {
    executorByReportUnit({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setExecutorList(res.data);
      }
    });
  };
  const reportUnitChange = (e) => {
    if (e) {
      getReportUnitInstr(e);
      getExecutorByReportUnit(e);
    }
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={form} className={styles.search_box}>
        <Form.Item name="labClassManageId" label="报告单元">
          <Select
            placeholder="请选择报告单元"
            autoComplete="off"
            allowClear
            onChange={reportUnitChange}
          >
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <div id="hospitalId">
          <Form.Item name="hospitalId" label="检测仪器">
            <Select
              placeholder="请选择检测仪器"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('hospitalId')}
            >
              {reportUnitInstrList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.instrName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="createDateStart">
          <DatePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            style={{ width: 340 }}
          />
        </Form.Item>
        <div id="labClassId">
          <Form.Item name="labClassId" label="执行人">
            <Select
              placeholder="请选择执行人"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('labClassId')}
            >
              {executorList.length > 0 &&
                executorList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    );
  };
  const renderFormScan = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={scanForm} className={styles.scanForm_box}>
        <Form.Item name="hospitalId" label="样本条码">
          <Input placeholder="请输入样本条码" />
        </Form.Item>

        <Form.Item name="no" label="样本编号">
          <Input placeholder="请输入样本编号" />
        </Form.Item>
        <Button btnType="primary" onClick={add} >
          +
        </Button>
        <Button btnType="primary" onClick={minus} className={styles.minus}>
          -
        </Button>
        <Button btnType="primary">分配任务到仪器</Button>
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      {renderFormScan()}
    </>
  );
};
export default SingleInstrument;
