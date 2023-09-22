import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import CommonProps from './props/CommonProps';
import UserTaskProps from './props/UserTaskProps';
import { useSelector } from 'umi';
import bpmnHelper from '../js/helper/BpmnHelper';
const { TabPane } = Tabs;
const RightAttribute = () => {
  const [element, setElement] = useState({});
  const [propsComponent, setPropsComponent] = useState('');
  const { bpmnModeler } = useSelector((state: any) => state.Setting);
  useEffect(() => {
    handleModeler();
  }, [bpmnModeler]);
  const handleModeler = () => {
    // 监听节点选择变化,不会监听流程图的变化
    // 监听 element
    let result = bpmnModeler?.get('canvas').getRootElement();
    setElement(result);
    const eventBus = bpmnModeler?.get('eventBus');
    const eventTypes = ['element.click', 'element.changed', 'selection.changed'];

    eventTypes.forEach(function (eventType) {
      eventBus?.on(eventType, function (e) {
        // that.bpmnModeler.get('comments').collapseAll()
        // that.bpmnModeler.get('comments').toggleCollapse(that.element)

        console.log(':handleModeler eventType:' + eventType);
        if (eventType === 'element.changed') {
          elementChanged(e);
        } else if (eventType === 'selection.changed') {
          const element = e.newSelection[0];
          if (!element || element === undefined) return;
          setElement(element);
        } else if (eventType === 'element.click') {
          console.log('点击了element: ' + e.element.type);
          if (!e || e.element.type === 'bpmn:Process') {
            // if (!e) {
            setPropsComponent('CommonProps');
            setElement(e.element);
          } else {
            // 展示新增图形的属性
            let result = bpmnHelper.getComponentByEleType(e.element.type);
            setPropsComponent(result);
            setElement(e.element);
          }
        }
      });
    });
  };
  const elementChanged = (e) => {
    const id = e.element.id.replace('_label', '');
    var shape = getShape(id);
    if (!shape) {
      // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
      console.log('无效的shape');
      // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
      console.log('删除了shape和connect');
      return;
    }
    const { element } = e;
    if (!element || element === undefined) return;

    console.log('element.changed:' + JSON.stringify(element));
    element.businessObject.name;
    if (element.type === 'bpmn:SequenceFlow') {
      // that.elementName = element.name;
    } else {
      // that.elementName = element.businessObject.name;
    }
    // if (!that.isInvalid(shape.type)) {
    //   that.element = e.element;

    //   if (that.isSequenceFlow(shape.type)) {
    //     console.log('改变了线');
    //   } else {
    //     that.setDefaultProperties();
    //   }
    // }
  };
  const getShape = (id) => {
    var elementRegistry = bpmnModeler?.get('elementRegistry');
    return elementRegistry.get(id);
  };
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="基本信息" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="基础设置" key="2">
        {propsComponent === 'CommonProps' ? (
          <CommonProps element={element}></CommonProps>
        ) : (
          <UserTaskProps element={element}></UserTaskProps>
        )}
      </TabPane>
    </Tabs>
  );
};
export default RightAttribute;
