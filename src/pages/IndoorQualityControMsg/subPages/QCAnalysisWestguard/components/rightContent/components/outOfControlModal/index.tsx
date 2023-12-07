import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import { useSelector } from 'umi';
import { outControlHandle } from '../../../../../../models/server';
const { TextArea } = Input;
const OutOfControlModal = ({ Ref, refresh }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      form.setFieldsValue({
        ...val,
        qcDate: moment(val.qcDate, 'YYYY-MM-DD'),
        resultDt: moment(val.resultDt, 'YYYY-MM-DD HH:mm:ss'),
        controlStatus: val.controlStatus ? '在控' : '失控',
      });
      setId(val.id);
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const onOk = () => {
    const {
      clinicEffect,
      outControlOperation,
      outControlReason,
      outControlResult,
      outTranSokResult,
      preMunition,
    } = form.getFieldsValue();
    outControlHandle({
      clinicEffect,
      outControlOperation,
      outControlReason,
      outControlResult,
      outTranSokResult,
      preMunition,
      id,
    }).then((res) => {
      if (res.code === 200) {
        message.success('失控处理成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  return (
    <Dialog ref={dialogRef} width={640} title={'失控处理'} onOk={onOk}>
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="qcDate"
              label="质控日期"
              rules={[{ required: true, message: '请选择质控日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择质控日期" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="resultDt" label="结果时间">
              <DatePicker format="YYYY-MM-DD HH:ss:mm" placeholder="请选择结果时间" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="calculateValue" label="计算结果">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="sd" label="SD值">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="tagValue" label="靶值">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="cv" label="CV">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="limitHigh" label="失控上限">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="limitLow" label="失控下限">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="controlStatus" label="在控标志">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="outControlTips" label="失控提示">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="outControlReason" label="失控原因">
              <TextArea />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="outControlOperation" label="失控处理">
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="outControlResult" label="处理结果">
              <TextArea />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="outControlResult" label="修正后结果">
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="处理人">
              <Input defaultValue={useDetail.name} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item label="处理时间">
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={moment(moment(), 'YYYY-MM-DD HH:mm:ss')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="clinicEffect" label="临床影响">
              <TextArea />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="preMunition" label="预防措施">
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default OutOfControlModal;
