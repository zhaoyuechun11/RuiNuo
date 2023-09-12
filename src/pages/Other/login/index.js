import React, { Fragment } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import { login } from './models/server';
import style from './index.less';
import { history } from 'umi';
const InputGroup = Input.Group;
const Index = ({}) => {
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
      <div className={style.header}>
        <div>
          <img src={require(`@assets/images/logo.png`)} alt="" width={30} height={30} />
        </div>
        <div>
          <img src={require(`@assets/images/logo_font.png`)} alt="" />
        </div>
      </div>
      <Row>
        <Col span={16}></Col>
        <Col span={5} className={style.login_box}>
          <div className={style.title}>
            <div>扫码登录</div>
            <div></div>
            <div>密码登录</div>
          </div>
          <Form
            className="login-form"
            labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            style={{ maxWidth: 400, margin: '40px 20px 90px 20px' }}
            onFinish={onFinish}
          >
            <div className={style.title}>帐号登录</div>
            <Form.Item name="account">
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="帐号名"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <InputGroup compact>
              <Form.Item >
                <Input placeholder="验证码" />
              </Form.Item>
              <div
                style={{
                  background: '#bdd0f6',
                  height: '32px',
                  width: '150px',
                  marginLeft: '34px',
                }}
              ></div>
            </InputGroup>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login_btn">
                登录
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={1}></Col>
      </Row>
    </Fragment>
  );
};
export default Index;
