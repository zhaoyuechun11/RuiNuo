import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useParams } from 'umi';
import { BackButton } from '@/components';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import './index.less';

import { getFlowchart } from '../../models/server';
const CustomProcess = () => {
  const params = useParams();
  const [bpmnViewer, setBpmnViewer] = useState(null);

  useEffect(() => {
    if (bpmnViewer) {
      getProcess(Number(params.id));
    }
  }, [bpmnViewer]);
  useEffect(() => {
    initBpmn();
  }, []);

  const initBpmn = () => {
    let bpmnModeler = new BpmnViewer({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      additionalModules: [
        MoveCanvasModule, // 移动整个画布
        ZoomScrollModule,
      ],
    });
    setBpmnViewer(bpmnModeler);
  };

  const getProcess = (id: any) => {
    getFlowchart({ id }).then((res: any) => {
      if (res.code === 200) {
        console.log(res.data);
        bpmnViewer.importXML(res.data, (error: any) => {
          if (error) {
          } else {
            let canvas = bpmnViewer.get('canvas');
            canvas.zoom('fit-viewport', 'auto');
          }
        });
      }
    });
  };
  return (
    <>
      <BackButton />
      <Row>
        <Col span={24}>
          <div id="canvas"  />
        </Col>
      </Row>
    </>
  );
};
export default CustomProcess;
