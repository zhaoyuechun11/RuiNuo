import React, { useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Form, Input, message } from 'antd';
import { history } from 'umi';
import { updatePassword } from '../../server';

const UpdatePassword = ({ cRef }) => {
  const [form] = Form.useForm();
  const modalRef = useRef();

  useImperativeHandle(cRef, () => ({
    show: () => {
      modalRef.current.show();
    },
  }));

  const onFinish = (values) => {
    const params = {
      password: window.btoa(values.password),
      oldPassword: window.btoa(values.oldPassword),
    };

    updatePassword(params).then((res) => {
      if (res.code == 200) {
        message.success('修改成功');
        modalRef.current.hide();
        history.push('/login');
      }
    });
    return;
  };
  const onFinishFailed = (error) => {};
  return (
    <Dialog
      title={`${'修改密码'}`}
      width={640}
      ref={modalRef}
      onCancel={() => modalRef.current.hide()}
      onOk={() => {
        form.submit();
      }}
    >
      <div style={{ width: '100%' }}>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="旧密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input
              style={{ backgroundColor: '#ffffff' }}
              maxLength={10}
              placeholder="请输入旧密码"
            />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input
              style={{ backgroundColor: '#ffffff' }}
              maxLength={10}
              placeholder="请输入新密码"
            />
          </Form.Item>
        </Form>
      </div>
    </Dialog>
  );
};

export default UpdatePassword;
