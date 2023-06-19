import React, { Fragment } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { login } from './models/server';
import style from './index.less';
import { history } from 'umi';
const Index = ({}) => {
  console.log(window.btoa('123456'));
  const onFinish = (values) => {
    let params = {
      ...values,
      password: window.btoa(values.password),
    };
    login(params).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('access_token', res.data.accessToken);
        history.replace('/');
      }
    });
  };
  return (
    <Fragment>
      <Form
        className="login-form"
        labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 400, margin: '90px auto' }}
        onFinish={onFinish}
      >
        <div className={style.title}>Login</div>
        <Form.Item name="account">
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
            登录
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};
export default Index;
