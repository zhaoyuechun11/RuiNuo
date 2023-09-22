import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { useSelector } from 'umi';
import bpmnHelper from '../../js/helper/BpmnHelper';
import elementHelper from '../../js/helper/ElementHelper';
const UserTaskProps = ({ element }) => {
  const [form] = Form.useForm();
  const { bpmnModeler } = useSelector((state: any) => state.Setting);
  useEffect(() => {
    if (!element) {
      return;
    }
    element.type === 'bpmn:UserTask';
    const businessObject = element.businessObject;
    form.setFieldsValue({ nameNode: businessObject.name });
    const bpmnFactory = bpmnModeler.get('bpmnFactory');
    let extensionElements = businessObject.get('extensionElements');

    if (!extensionElements) {
      extensionElements = elementHelper.createElement(
        'bpmn:ExtensionElements',
        null,
        element,
        bpmnFactory,
      );
    }
    const length = extensionElements.get('values').length;
    let customProperties;
    for (let i = 0; i < length; i++) {
      if (
        extensionElements.get('values')[i] &&
        extensionElements.get('values')[i].$type === 'flowable:CustomProperties'
      ) {
        customProperties = extensionElements.get('values')[i];
      }
    }
    if (!customProperties) {
      customProperties = elementHelper.createElement(
        'flowable:CustomProperties',
        null,
        element,
        bpmnFactory,
      );
      extensionElements.get('values').push(customProperties);
    }

    const modeling = bpmnModeler.get('modeling');

    modeling.updateProperties(element, {
      extensionElements: extensionElements,
    });
  }, [element]);
  const valuesChange = (changedValues: any, allValues: any) => {
    for (let key in changedValues) {
      if (key === 'nameNode') {
        const modeling = bpmnModeler.get('modeling');
        modeling.updateProperties(element, {
          name: changedValues[key],
        });
        createOrUpdateCustomProperties(key, changedValues[key]);
      }
    }
  };
  const getPropertieByName = (customProperties: any, name: any) => {
    return customProperties.get(name) || customProperties.$attrs[name];
  };
  const createOrUpdateCustomProperties = (property: any, value: any) => {
    if (property === 'findUserType' && value === '6') {
      //this.getUserTaskList()
    }

    //const bpmnModeler = bpmnModeler();
    const bpmnFactory = bpmnModeler.get('bpmnFactory');

    let extensionElements = bpmnHelper.getPropertie(element, 'extensionElements');
    if (!extensionElements) {
      extensionElements = elementHelper.createElement(
        'bpmn:ExtensionElements',
        null,
        element,
        bpmnFactory,
      );
    }
    const length = extensionElements.get('values').length;
    let customProperties;
    let customPropertiesIndex = -1;
    for (let i = 0; i < length; i++) {
      if (
        extensionElements.get('values')[i] &&
        extensionElements.get('values')[i].$type === 'flowable:CustomProperties'
      ) {
        debugger;
        customProperties = extensionElements.get('values')[i];
        customPropertiesIndex = i;
      }
    }
    if (!customProperties) {
      customProperties = elementHelper.createElement(
        'flowable:CustomProperties',
        null,
        element,
        bpmnFactory,
      );
    }

    const data = {};
    data[property] = value;
    customProperties[property] = value;
    if (customPropertiesIndex > -1) {
      extensionElements.get('values')[customPropertiesIndex] = customProperties;
    } else {
      extensionElements.get('values').push(customProperties);
    }
    const modeling = bpmnModeler.get('modeling');
    modeling.updateProperties(element, {
      extensionElements: extensionElements,
    });
  };
  return (
    <>
      <div>节点设置</div>
      <Form layout="inline" form={form} onValuesChange={valuesChange}>
        <Form.Item name="labClassId" label="编号">
          <Input />
        </Form.Item>
        <Form.Item name="nameNode" label="名称">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};
export default UserTaskProps;
