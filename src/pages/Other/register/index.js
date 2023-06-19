import React, { Fragment } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const Index = ({}) => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    history.back();
  };
  return (
    <Fragment>
      <Form
        className="login-form"
        labelCol={{ span: 8 }}
        style={{ maxWidth: 400, margin: '90px auto' }}
        onFinish={onFinish}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>注册</div>

        <Form.Item name="user">
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item name="password">
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login_btn">
            注册
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};
export default Index;
