import React, { useRef, useImperativeHandle, useState } from 'react';
import { history, useDispatch } from 'umi';
import { Dialog, Button } from '@components';
import { Form, Input, Row, Col } from 'antd';

const AddOrEdit = ({ cRef }) => {
  const [form] = Form.useForm();
  const modalRef = useRef();
  const dispatch = useDispatch();
  const [record, setRecord] = useState('');

  useImperativeHandle(cRef, () => ({
    show: (val: any) => {
      form.resetFields();
      debugger;
      if (val) {
        setRecord(val);
        form.setFieldsValue({ ...val });
      } else {
        setRecord('');
      }
      modalRef.current.show();
    },
  }));

  const onFinish = (values) => {
    if (record) {
      dispatch({
        type: 'Setting/save',
        payload: {
          type: 'processRecordId',
          dataSource: record.id,
        },
      });
    }
    dispatch({
      type: 'Setting/save',
      payload: {
        type: 'processFormData',
        dataSource: values,
      },
    });

    history.push('/setting/customProcess');
  };
  const next = () => {
    form.submit();
  };
  const onCancel = () => {
    modalRef.current.hide();
  };
  return (
    <Dialog
      title={record ? '编辑' : '添加'}
      width={340}
      ref={modalRef}
      footer={
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <Button btnType="clear" onClick={onCancel} style={{ marginRight: '10px' }}>
            取消
          </Button>
          <Button btnType="primary" onClick={next}>
            下一步
          </Button>
        </div>
      }
    >
      <div style={{ padding: '10px' }}>
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="流程代码"
            name="flowCode"
            rules={[{ required: true, message: '请输入流程代码' }]}
          >
            <Input placeholder="请输入流程代码" maxLength={4} />
          </Form.Item>
          <Row>
            <Col span={11}>
              <Form.Item
                label="流程名称"
                name="flowName"
                rules={[{ required: true, message: '请输入流程名称' }]}
              >
                <Input placeholder="请输入流程名称" />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item label="流程用途" name="flowPurpose">
                <Input placeholder="请输入流程用途" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Dialog>
  );
};

export default AddOrEdit;
