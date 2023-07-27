import React, { useEffect } from 'react';
import moment from 'moment';
import { Button, Icon } from '@components';
import { Table, Form, Input, DatePicker, Select, message } from 'antd';
import styles from './index.less';
const SingleInstrument = () => {
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  useEffect(() => {
    form.setFieldsValue({ createDateStart: moment(now1, 'YYYY-MM-DD HH:mm:ss') });
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
  const renderForm = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={form} className={styles.search_box}>
        <Form.Item name="labClassManageId" label="报告单元">
          <Select placeholder="请选择管理分类" autoComplete="off" allowClear>
            {/* {manageClass.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>

        <div id="hospitalId">
          <Form.Item name="hospitalId" label="检测仪器">
            <Select
              placeholder="请选择送检单位"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('hospitalId')}
            >
              {/* {hospital?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.hospitalName}
                </Option>
              ))} */}
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
              {/* {majorGroupData.length > 0 &&
                majorGroupData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                ))} */}
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
        <Button btnType="primary" onClick={add}>
          +
        </Button>
        <Button btnType="primary" onClick={minus}>
          -
        </Button>
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
