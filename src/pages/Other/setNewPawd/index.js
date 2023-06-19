import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Form, Icon, Input, Button } from 'antd';
const Index = ({}) => {
  const timerCount = 60; // 默认60秒
  const [count, setCount] = useState(timerCount);
  const timerRef = useRef(null); // 记录时间的定时器
  const cutCount = () => {
    setCount((prevState) => prevState - 1); // 为什么这里要用函数- 如果用count 发现count闭包了 不会发生变化了
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    history.back();
  };
  const sendCode = () => {
    // 要发送验证码
    //cutCount();
    timerRef.current = setInterval(cutCount, 1000);
  };
  useEffect(() => {
    if (count === 0) {
      clearInterval(timerRef.current); // 清空定时器
      setCount(timerCount); // 重新将技术器设置为60秒
    }
  }, [count]);

  return (
    <Fragment>
      <Form
        className="login-form"
        labelCol={{ span: 8 }}
        style={{ maxWidth: 400, margin: '90px auto' }}
        onFinish={onFinish}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>设置新密码</div>

        <Form.Item name="user">
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="新密码"
          />
        </Form.Item>
        <Form.Item name="password">
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="再次输入新密码"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login_btn">
            注册
          </Button>
          <Button
            type="primary"
            disabled={count < timerCount}
            onClick={count === timerCount ? sendCode : null}
          >
            {count === timerCount ? '发送验证码' : `还剩${count}秒`}
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};
export default Index;
