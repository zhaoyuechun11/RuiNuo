import React, { useEffect } from 'react';
import { Button, Row, Col, message } from 'antd';
import { useDispatch, useSelector, history } from 'umi';
import { xmlstr } from '@utils';
import { BackButton } from '@/components';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import './index.less';
import customTranslate from './components/i18n-bpmn/customTranslate';
import RightAttribute from './components/rightAttribute';
import moddleDescriptor from './uitl/flowable.json';
import { flowchartAdd, getFlowchart, flowchartUpdate } from '../../models/server';
const CustomProcess = () => {
  const dispatch = useDispatch();
  const { processXml, bpmnModeler, processFormData, processRecordId } = useSelector(
    (state: any) => state.Setting,
  );

  useEffect(() => {
    if (processRecordId && bpmnModeler) {
      getProcess(processRecordId);
    } else {
      bpmnModeler && bpmnModeler.importXML(xmlstr);
    }
  }, [processRecordId, bpmnModeler]);
  useEffect(() => {
    initBpmn();
  }, []);
  useEffect(() => {
    if (bpmnModeler) {
      addBpmnListener();
    }
  }, [bpmnModeler]);
  const initBpmn = () => {
    const customTranslateModule = {
      translate: ['value', customTranslate],
    };
    let bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      //添加控制板
      propertiesPanel: {
        parent: '.properties-panel',
      },
      additionalModules: [
        // 左边工具栏以及节点
        // propertiesPanelModule,
        customTranslateModule,
        //propertiesProviderModule,
      ],
      moddleExtensions: {
        flowable: moddleDescriptor,

        // qa: moddleDescriptor
        // activiti: activitiModdleDescriptor
      },
    });
    dispatch({
      type: 'Setting/save',
      payload: {
        type: 'bpmnModeler',
        dataSource: bpmnModeler,
      },
    });
    // try {
    //   let xml = xmlstr;
    //   if (processRecordId) {
    //     xml = processData;
    //   }
    //   const result = bpmnModeler.importXML(xml, (err: any) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       setSuccessFlag(true);
    //     }
    //   });
    //   console.log(result);
    //   // console.log('属性面板数据: ', bpmnModeler.get('propertiesPanel'));
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const addBpmnListener = () => {
    // 给图绑定事件，当图有发生改变就会触发这个事件

    bpmnModeler?.on('commandStack.changed', function () {
      saveDiagram(function (err, xml) {
        console.log(xml);
        dispatch({
          type: 'Setting/save',
          payload: {
            type: 'processXml',
            dataSource: xml,
          },
        });
        //that.setEncoded(downloadLink, "diagram.bpmn", err ? null : xml);
      });
    });
  };
  const saveDiagram = (done) => {
    // 把传入的done再传给bpmn原型的saveXML函数调用
    bpmnModeler.saveXML({ format: true }, function (err, xml) {
      //console.log('xml', xml);
      done(err, xml);
    });
  };
  const saveBpmn = () => {
    if (processRecordId) {
      flowchartUpdate({
        flowXml: processXml,
        ...processFormData,
        id: processRecordId,
        isDisable: true,
      }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          history.push('/setting/processMange');
          dispatch({
            type: 'Setting/save',
            payload: {
              type: 'processRecordId',
              dataSource: '',
            },
          });
        }
      });
      return;
    }
    flowchartAdd({ flowXml: processXml, ...processFormData }).then((res) => {
      if (res.code === 200) {
        message.success('创建成功');
        history.push('/setting/processMange');
      }
    });
  };
  const getProcess = (id: any) => {
    getFlowchart({ id }).then((res: any) => {
      if (res.code === 200) {
        bpmnModeler.importXML(res.data);
      }
    });
  };

  return (
    <>
      <div className="header">
        <BackButton />
        <Button type="primary" onClick={saveBpmn} style={{ marginBottom: '10px' }}>
          保存
        </Button>
      </div>
      <Row>
        <Col span={18}>
          <div id="canvas" className="container" />
          <div className="properties-panel"></div>
        </Col>
        <Col span={6}>
          <RightAttribute />{' '}
        </Col>
      </Row>
    </>
  );
};
export default CustomProcess;
