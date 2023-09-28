import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Table, Form, Input } from 'antd';
import { useParams } from 'umi';
import { BackButton } from '@/components';
import { xmls } from '@utils';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import { query as domQuery } from 'min-dom';
import './index.less';
const { TabPane } = Tabs;
const value = {
  highLine: ['SequenceFlow_Id', 'Flow_00wn7rp', 'Flow_124i5zd'],
  highPoint: ['StartEvent_1', 'UserTask_Id', 'Activity_1b5u0kk'],
  ido: [],
  waitingToDo: ['Activity_19nurrm'],
};
const SampleTraceability = () => {
  const params = useParams();
  const [bpmnViewer, setBpmnViewer] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    if (bpmnViewer) {
      addMarker();
      setNodeColor();
      bindEvents();
      const marker = svgCreate('marker');
      const markerActivities = svgCreate('marker');

      svgAttr(marker, {
        id: 'sequenceflow-arrow-normal',
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto',
      });

      svgAttr(markerActivities, {
        id: 'sequenceflow-arrow-activities',
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto',
      });

      const path = svgCreate('path');
      const pathActivities = svgCreate('path');

      svgAttr(path, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style:
          ' stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: #cccccc;fill:#ccc;',
      });
      svgAttr(pathActivities, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style:
          ' stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: #fdb039;fill:#fdb039;',
      });

      const defs = domQuery('defs');
      svgAppend(marker, path);
      svgAppend(defs, marker);
      svgAppend(markerActivities, pathActivities);
      svgAppend(defs, markerActivities);
    }
  }, [bpmnViewer]);
  useEffect(() => {
    initBpmn();
  }, []);
  const columns = [
    {
      title: '节点代码',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '节点名称',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: '执行人',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '执行时间',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
    },
    {
      title: '是否延迟',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '延迟时间',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
    },
    {
      title: '操作内容',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
    },
  ];
  const columns1 = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '节点前',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: '节点后',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '实际流转用时',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
    },
    {
      title: '计划流转用时',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New ',
      tags: ['nice'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney ',
      tags: ['cool'],
    },
  ];
  const initBpmn = () => {
    let bpmnViewer = new BpmnViewer({
      container: '#canvas', // 这里为数组的第一个元素
      height: '30vh',
      additionalModules: [
        MoveCanvasModule, // 移动整个画布
        ZoomScrollModule,
      ],
    });

    bpmnViewer.importXML(xmls, (error: any) => {
      if (error) {
      } else {
        let canvas = bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        setBpmnViewer(bpmnViewer);
      }
    });
  };
  const setNodeColor = () => {
    const elementRegistry = bpmnViewer.get('elementRegistry').getAll();
    let canvas = bpmnViewer.get('canvas');
    canvas.addMarker(elementRegistry[3].id, 'highlight_defalut');
  };
  const addMarker = () => {
    let canvas = bpmnViewer.get('canvas');
    // 需要高亮的节点id
    // const value = {
    //   highLine: ['SequenceFlow_Id', 'Flow_00wn7rp','Flow_124i5zd'],
    //   highPoint: ['StartEvent_1', 'UserTask_Id','Activity_1b5u0kk'],
    //   ido: [],
    //   waitingToDo: ['Activity_19nurrm'],
    // };
    // 高亮线
    value.highLine.forEach((e) => {
      if (e) {
        canvas.addMarker(e, 'highlightFlow');
      }
    });
    // 高亮任务
    value.highPoint.forEach((e) => {
      if (e) {
        canvas.addMarker(e, 'highlight');
      }
    });
    // 高亮我执行过的任务
    value.ido.forEach((e) => {
      if (e) {
        canvas.addMarker(e, 'highlightIDO');
      }
    });
    // 高亮下一个任务
    value.waitingToDo.forEach((e) => {
      if (e) {
        canvas.addMarker(e, 'highlightTODO');
      }
    });
  };
  const genNodeDetailBox = (e, overlays) => {
    let tempDiv = document.createElement('div');
    //this.detailInfo = detail;
    let popoverEl = document.querySelector('.flowMsgPopover');
    tempDiv.innerHTML = popoverEl.innerHTML;
    tempDiv.className = 'tipBox';
    overlays.add(e.element.id, {
      position: { top: e.element.height, left: 0 },
      html: tempDiv,
    });
  };
  // 以下代码为：为节点注册鼠标悬浮事件
  const bindEvents = () => {
    let eventBus = bpmnViewer.get('eventBus');
    let overlays = bpmnViewer.get('overlays');
    eventBus.on('element.hover', (e) => {
      if (e.element.type === 'bpmn:UserTask') {
        // this.detailInfo = this.nodeDetail[e.element.id];
        //悬浮框不能直接调用,因为这样调用的话popoverEl.innerHTML一直获取的是上一条数据，因为每次在调用这个方法的时候其实popover标签的变量还没有渲染
        //this.genNodeDetailBox(this.nodeDetail[e.element.id], e, overlays);
        //任何修改data的语句后,页面渲染用setTimeout(function(){console.log(233)},0)就可以了
        setTimeout(() => {
          console.log('节点类型:' + e.element.type);
          if (e.element.type === 'bpmn:UserTask') {
            genNodeDetailBox(e, overlays);
          }
        }, 10);

        // }else {
        // getOneActivityVoByProcessInstanceIdAndActivityId({procInstId:"1b6cc49f0bb211ecaf8f0862662f0797", elementId: e.element.id}).then(res=>{
        //   //this.nodeDetail[e.element.id] = res.data;
        //     res.data.approver="1;2";
        //     this.detailInfo = res.data;
        //     // this.genNodeDetailBox(e, overlays);
        //     setTimeout(() => {
        //         console.log("节点类型:"+e.element.type);
        //         if(e.element.type === "bpmn:UserTask" ){
        //             this.genNodeDetailBox(e, overlays);
        //         }
        //     },10)
        // });
      }
    });
    eventBus.on('element.click', (e) => {
      console.log(e.element.id);
    });
    eventBus.on('element.out', (e) => {
      overlays.clear();
    });
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {};
  const renderForm = () => {
    return (
      <Form onValuesChange={searchHandle} layout="inline" form={form}>
        <Form.Item name="sampleBarcode">
          <Input placeholder="请输入样本条码" />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      {params?.id && <BackButton />}
      <div className="form_tim">
        {renderForm()}
        <div className="tip">
          <div className="item">
            <div className="susitem" />
            <span>已执行</span>
          </div>
          <div className="item">
            <div className="proitem" />
            <span>在执行</span>
          </div>
          <div className="item">
            <div className="unitem" />
            <span>未执行</span>
          </div>
        </div>
      </div>

      <div id="canvas" className="container" />
      <div className="flowMsgPopover" style={{ display: 'none' }}>
        <Row>
          <Col span={24} className="header">
            样本流转日志信息
          </Col>
        </Row>
        <div className="log_content">
          <div className="flex_content">
            <div>节点代码</div>
            <div>0011</div>
            <div>审批</div>
            <div>啊的</div>
          </div>
          <div className="flex_content">
            <div>执行人</div>
            <div>王武</div>
            <div>执行时间</div>
            <div>20</div>
          </div>
          <div className="flex_content">
            <div>是否延迟</div>
            <div>是</div>
            <div>延迟时间</div>
            <div>5</div>
          </div>
          <div className="action_content">
            <div>操作内容</div>
            <div>rrrrrr</div>
          </div>
        </div>
        <Row>
          <Col span={24} className="header">
            样本流转TAT分析
          </Col>
        </Row>
        <div className="log_content">
          <div className="flex_content">
            <div>样本总流转用时</div>
            <div>23</div>
            <div>样本计划流转用时</div>
            <div>4</div>
          </div>
          <div className="flex_content">
            <div>流转效率</div>
            <div>2</div>
            <div>序号</div>
            <div>20</div>
          </div>
          <div className="flex_content">
            <div>前节点</div>
            <div>是</div>
            <div>后节点</div>
            <div>5</div>
          </div>
          <div className="flex_content">
            <div>实际流转用时</div>
            <div>5</div>
            <div>计划流程用时</div>
            <div>5</div>
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="1" style={{ marginTop: '10vh' }}>
        <TabPane tab="样本流转日志信息" key="1">
          <Table columns={columns} dataSource={data} size="small" />
        </TabPane>
        <TabPane tab="样本流转TAT分析" key="2">
          <Table columns={columns1} dataSource={[]} size="small" />
        </TabPane>
      </Tabs>
    </>
  );
};
export default SampleTraceability;
