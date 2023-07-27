import React, { useImperativeHandle, useRef } from 'react';
import { Dialog, Button } from '@/components';
import { Form, Input } from 'antd';
import styles from '../../index.less';
const Password = ({ passwordRef }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();

  useImperativeHandle(passwordRef, () => ({
    show: () => {
      dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current.show();
    },
  }));
  const onFinish = (value: any) => {
    debugger;
  };

  return (
    <Dialog ref={dialogRef} onOk={() => form.submit()}>
      <Form layout="inline" form={form} onFinish={onFinish} className={styles.pawd_form}>
        <Form.Item name="receiver" label="密码">
          <Input placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default Password;
