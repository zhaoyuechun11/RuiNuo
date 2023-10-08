import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import bpmnHelper from '../../js/helper/BpmnHelper';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useSelector } from 'umi';
const { TextArea } = Input;
const SequenceFlowProps = ({ element }) => {
  const [form] = Form.useForm();
  const { bpmnModeler } = useSelector((state: any) => state.Setting);
  useEffect(() => {
    if (element) {
      const result = element.businessObject.name;
      const condition =
        element.businessObject.conditionExpression !== undefined
          ? element.businessObject.conditionExpression.body
          : '';
      form.setFieldsValue({ maxTime: result, tempCondition: condition, id: element.id || '' });
    }
  }, [element]);
  const valuesChange = (changedValues: any, allValues: any) => {
    const modeling = bpmnModeler.get('modeling');
    if (changedValues.maxTime) {
      modeling.updateProperties(element, {
        name: changedValues.maxTime,
      });
      bpmnHelper.updateDocumentation(bpmnModeler, element, changedValues.maxTime);
    }
    if (changedValues.tempCondition) {
      var conditionExpression = element.businessObject.$model.create('bpmn:FormalExpression', {
        body: changedValues.tempCondition,
      });
      modeling.updateProperties(element, {
        conditionExpression: conditionExpression,
      });
    }
  };
  return (
    <Form layout="vertical" form={form} onValuesChange={valuesChange}>
      <Form.Item name="id" label="编号">
        <Input />
      </Form.Item>
      <Form.Item name="maxTime" label="最大时间">
        <Input type="number" />
      </Form.Item>
      <Form.Item name="tempCondition" label="设置跳转条件">
        <TextArea
          placeholder="请填写JUEL表达式，如： ${1==1}"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
    </Form>
  );
};
export default SequenceFlowProps;
