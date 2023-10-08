import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { useSelector } from 'umi';
import bpmnHelper from '../../js/helper/BpmnHelper';
import elementHelper from '../../js/helper/ElementHelper';
import { getUserList } from '@/models/server';
import styles from '../index.less';
const { Option } = Select;

const UserTaskProps = ({ element }) => {
  const [form] = Form.useForm();
  const { bpmnModeler } = useSelector((state: any) => state.Setting);
  const [findUserType, setFindUserType] = useState();
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    if (!element) {
      return;
    }
    console.log(element);
    element.type === 'bpmn:UserTask';
    const businessObject = element.businessObject;
    form.setFieldsValue({ nameNode: businessObject?.name, id: element.id || '' });
    const bpmnFactory = bpmnModeler.get('bpmnFactory');
    let extensionElements = businessObject?.get('extensionElements');

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
    if (businessObject) {
      modeling.updateProperties(element, {
        extensionElements: extensionElements,
      });

      if (getPropertieByName(customProperties, 'findUserType')) {
        let result = getPropertieByName(customProperties, 'findUserType');
        setFindUserType(result);
      } else {
        createOrUpdateCustomProperties('findUserType', findUserType);
      }
    }
  }, [element]);
  const valuesChange = (changedValues: any, allValues: any) => {
    const modeling = bpmnModeler.get('modeling');
    if (changedValues.nameNode) {
      modeling.updateProperties(element, {
        name: changedValues.nameNode,
      });
      createOrUpdateCustomProperties('nameNode', changedValues.nameNode);
    }
    if (changedValues.id) {
      modeling.updateProperties(element, {
        id: changedValues.id,
      });
      createOrUpdateCustomProperties('id', changedValues.id);
    }
    if (changedValues.users) {
      modeling.updateProperties(element, { 'flowable:candidateUsers': changedValues.users });
    }
  };
  const getPropertieByName = (customProperties: any, name: any) => {
    return customProperties.get(name) || customProperties.$attrs[name];
  };
  const createOrUpdateCustomProperties = (property: any, value: any) => {
    if (property === 'findUserType' && value === '6') {
      //this.getUserTaskList()
    }
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
  const handleChange = (e) => {
    createOrUpdateCustomProperties('findUserType', e);
  };
  const getList = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const changeField = (e: any) => {
    const value = e.target.value;
    element['color'] = value;
    let properties = {};
    properties['color'] = value;
    onChangeColor(value);
    const modeling = bpmnModeler.get('modeling');
    modeling.updateProperties(element, properties);
  };
  const onChangeColor = (color: any) => {
    const modeling = bpmnModeler.get('modeling');
    modeling.setColor(element, {
      fill: null,
      stroke: color,
    });
  };
  return (
    <>
      <div className={styles.header}>节点设置</div>
      <Form form={form} onValuesChange={valuesChange} layout="vertical" className={styles.form_box}>
        <Form.Item name="id" label="编号">
          <Input />
        </Form.Item>
        <Form.Item name="nameNode" label="名称">
          <Input />
        </Form.Item>
        {/* <Form.Item label="分配个人" name="findUserType">
          <Select defaultValue="lucy" onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </Form.Item> */}
        <Form.Item label="分配人" name="users">
          <Select onChange={handleChange} mode="multiple">
            {userList?.map((item) => {
              return <Option value={item.id}>{item.name}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item label="节点颜色">
          <Input type="color" onChange={changeField} />
        </Form.Item>
      </Form>
    </>
  );
};
export default UserTaskProps;
