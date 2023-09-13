import React, { useEffect } from 'react';
import { xmlstr } from '@utils';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
const CustomProcess = () => {
  useEffect(() => {
    initBpmn();
  }, []);
  const initBpmn = () => {
    let bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      //添加控制板
      propertiesPanel: {
        // parent: '.properties-panel',
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesPanelModule,
        propertiesProviderModule,
      ],
      moddleExtensions: {
        //camunda: camundaModdleDescriptor,
      },
    });

    try {
      const result = bpmnModeler.importXML(xmlstr);
      console.log(result);
      // console.log('属性面板数据: ', bpmnModeler.get('propertiesPanel'));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div id="canvas" className="container" />
      <div className="properties-panel"></div>
    </>
  );
};
export default CustomProcess;
