import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { useSelector } from 'umi';
import styles from '../index.less';
const CommonProps = ({ element }) => {
  const [form] = Form.useForm();
  const { processFormData } = useSelector((state: any) => state.Setting);
  useEffect(() => {
    if (processFormData) {
      form.setFieldsValue({ flowName: processFormData.flowName });
    }
  }, [processFormData]);
  return (
    <>
      <div className={styles.header}>基本属性</div>
      <Form layout="vertical" form={form} className={styles.form_box}>
        <Form.Item name="flowName" label="流程名称">
          <Input disabled />
        </Form.Item>
      </Form>
    </>
  );
};
export default CommonProps;
