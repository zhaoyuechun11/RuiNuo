import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { BackButton } from '@/components';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import './index.less';

import { getFlowchart } from '../../models/server';
const CustomProcess = () => {
  const dispatch = useDispatch();
  const { bpmnModeler, classFlowId } = useSelector((state: any) => state.Setting);
  const [successFlag, setSuccessFlag] = useState(false);
  useEffect(() => {
    if (classFlowId && bpmnModeler) {
      getProcess(classFlowId);
    }
  }, [classFlowId, bpmnModeler]);
  useEffect(() => {
    initBpmn();
  }, []);

  const initBpmn = () => {
    let bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      //添加控制板
      propertiesPanel: {
        parent: '.properties-panel',
      },
    });
    dispatch({
      type: 'Setting/save',
      payload: {
        type: 'bpmnModeler',
        dataSource: bpmnModeler,
      },
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
      <BackButton />
      <Row>
        <Col span={24}>
          <div id="canvas" className="container" />
          <div className="properties-panel"></div>
        </Col>
      </Row>
    </>
  );
};
export default CustomProcess;
