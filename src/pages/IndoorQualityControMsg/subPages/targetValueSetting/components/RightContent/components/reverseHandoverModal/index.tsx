import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import { Dialog } from '@components';
import { itemTgValueAdd, itemTgValueUpdate } from '../../../../../../models/server';
import { dictList } from '@/models/server';

import { useSelector } from 'umi';
import moment from 'moment';
const { Option } = Select;
const ReverseHandoverModal = ({ Ref, refresh }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const { leftMenuParams, selectedInstr } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [vendor, setVendor] = useState([]);
  const [testMethod, setTestMethod] = useState([]);
  var now1 = moment().format('YYYY-MM-DD');
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      console.log(leftMenuParams, selectedInstr, id);
      form.resetFields();

      getList({ type: 'FF' });
      getList({ type: 'QCVENDOR' });
      dialogRef.current && dialogRef.current.show();
      setId(val?.id);
      if (val) {
        form.setFieldsValue({
          ...val,
          stopUser: useDetail.name,
          itemId: leftMenuParams?.title.split(' ')[0],
          instrId: selectedInstr.instrCode,
          qcId: leftMenuParams.qcId,
          startDt: moment(val.startDt, 'YYYY-MM-DD'),
          stopDt: moment(val.stopDt, 'YYYY-MM-DD'),
          lastModifyDt: moment(val.lastModifyDt, 'YYYY-MM-DD'),
        });
        return;
      }
      form.setFieldsValue({
        startDt: moment(now1, 'YYYY-MM-DD'),
        stopUser: useDetail.name,
        itemId: leftMenuParams.title?.split(' ')[0],
        instrId: selectedInstr.instrCode,
        qcId: leftMenuParams.qcId,
      });
    },
  }));

  const onFinish = (value: any) => {
    if (id) {
      const {
        calibrateNo,
        cv,
        limitHigh,
        limitLow,
        maxCv,
        modifyReason,
        qcMethod,
        reagenBatchNo,
        reagentManufacturerId,
        reagentVendorId,
        sd,
        tagValue,
      } = value;

      itemTgValueUpdate({
        id,
        calibrateNo,
        cv,
        limitHigh,
        limitLow,
        maxCv,
        modifyReason,
        qcMethod,
        reagenBatchNo,
        reagentManufacturerId,
        reagentVendorId,
        sd,
        tagValue,
        stopUser: useDetail.id,
        startDt: value.startDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
        stopDt: value.stopDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      return;
    }
    let params = {
      ...value,
      startDt: value.startDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      stopDt: value.stopDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      stopUser: useDetail.id,
      instrId: selectedInstr.id,
      itemId: Number(leftMenuParams.itemId),
    };

    itemTgValueAdd({ ...params }).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };

  const getList = (type: { type: string }) => {
    dictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'FF') {
          setTestMethod(res.data);
        } else {
          setVendor(res.data);
        }
      }
    });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={id ? '编辑' : '添加'}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} style={{ padding: '20px' }} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col span={11}>
            <Form.Item name="instrId" label="仪器代号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="itemId" label="项目代号">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="startDt"
              label="启用日期"
              rules={[{ required: true, message: '请选择启用日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择启用日期" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              label="请输入靶值"
              name="tagValue"
              rules={[{ required: true, message: '请输入靶值' }]}
            >
              <Input placeholder="请输入靶值" type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="SD" name="sd" rules={[{ required: true, message: '请输入SD值' }]}>
              <Input placeholder="请输入SD值" type="number" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="cv" label="cv值" rules={[{ required: true, message: '请输入cv值' }]}>
              <Input placeholder="请输入cv值" type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="limitHigh" label="失控上限">
              <Input placeholder="请输入失控上限" type="number" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="limitLow" label="失控下限">
              <Input placeholder="请输入失控下限" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <Form.Item name="reagentManufacturerId" label="试剂厂商">
              <Select placeholder="请选择试剂厂商" allowClear>
                {vendor.length > 0 &&
                  vendor.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="reagentVendorId" label="试剂供应商">
              <Select placeholder="请选择试剂供应商" allowClear>
                {vendor.length > 0 &&
                  vendor.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="reagenBatchNo" label="试剂批号">
              <Input placeholder="请输入试剂批号" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="calibrateNo" label="校准品批号">
              <Input placeholder="请输入校准品批号" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="qcMethod" label="方法学">
              <Select placeholder="请选择方法学" allowClear>
                {testMethod.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="modifyReason" label="更换靶值原因">
              <Input placeholder="请输入更换靶值原因" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="qcId" label="质控品id">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="stopDt" label="停用日期">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择停用日期" />
            </Form.Item>
          </Col>
        </Row>
        {id && (
          <Row>
            <Col span={11}>
              <Form.Item label="最后修改人" name="lastModifyUserName">
                <Input disabled defaultValue={useDetail.name} />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item label="最后修改时间" name="lastModifyDt">
                <DatePicker format="YYYY-MM-DD" disabled />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={11}>
            <Form.Item name="stopUser" label="停用操作者">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="maxCv" label="允许最大CV %">
              <Input placeholder="请输入允许最大CV %" type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default ReverseHandoverModal;
