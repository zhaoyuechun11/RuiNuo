import React from 'react';
import { Form, Input } from 'antd';

const CommonProps = ({element}) => {
  const [form] = Form.useForm();
  return (
    <>
      <div>基本属性</div>
      <Form layout="inline" form={form}>
        <Form.Item name="labClassId" label="编号">
          <Input disabled />
        </Form.Item>
        <Form.Item name="nodeName" label="流程名称">
          <Input disabled />
        </Form.Item>
      </Form>
    </>
  );
};
export default CommonProps;
