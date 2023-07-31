import React, { useImperativeHandle, useRef } from 'react';
import { Dialog, Button } from '@/components';
import { Form, Input, message } from 'antd';
import { verifyPassword } from '../../../../models/server';
import styles from '../../index.less';
const Password = ({ passwordRef }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const id = useRef();

  useImperativeHandle(passwordRef, () => ({
    show: (e) => {
      id.current = e;
      dialogRef.current.show();
      form.resetFields();
    },
    hide: () => {
      dialogRef.current.hide();
    },
  }));
  const onFinish = (value: any) => {
    const params = {
      password: window.btoa(value.password),
      id: id.current,
    };
    verifyPassword(params).then((res) => {
      if (res.data) {
        message.success('验证成功');
        dialogRef.current.hide();
      } else {
        message.warning('验证失败请从新输入!');
      }
    });
  };

  return (
    <Dialog ref={dialogRef} onOk={() => form.submit()}>
      <Form layout="inline" form={form} onFinish={onFinish} className={styles.pawd_form}>
        <Form.Item name="password" label="密码">
          <Input placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default Password;
