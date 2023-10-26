import React, { useEffect, useState } from 'react';
import { Tabs, Table, message } from 'antd';
import { Button } from '@/components';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import {
  proFlowData,
  proOverdueNum,
  proTodayCompleteNum,
  proWaitNum,
  proReportOverdueNum,
} from '../../../../models/server';
const { TabPane } = Tabs;
import { useSelector, history } from 'umi';

const Immunity = () => {
  const [waitNum, setWaitNum] = useState([]);
  const [overdueNum, setOverdueNum] = useState([]);
  const [todayCompleteNum, setTodayCompleteNum] = useState([]);
  const [list, setList] = useState([]);
  const [reportOverdueNum, setReportOverdueNum] = useState(0);
  const { useDetail } = useSelector((state: any) => state.global);
  useEffect(() => {
    getProOverdueNum();
    getProTodayCompleteNum();
    getProReportOverdueNum();
    getProWaitNum();
  }, []);
  useEffect(() => {
    getProFlowData();
  }, [waitNum]);
  const getProFlowData = () => {
    proFlowData().then((res) => {
      if (res.code === 200) {
        let list = [];
        let comb = [];
        for (let key in res.data) {
          for (let i = 0; i < res.data[key].labClassList.length; i++) {
            for (let y = 0; y < res.data[key].elements.length; y++) {
              for (let waitKey in waitNum) {
                for (let j in waitNum[waitKey]) {
                  if (waitKey === key && res.data[key].labClassList[i]?.id === Number(j)) {
                    for (
                      let z = 0;
                      z < waitNum[key][res.data[key].labClassList[i]?.id]?.length;
                      z++
                    ) {
                      if (
                        res.data[key].elements[y].id ===
                        waitNum[key][res.data[key].labClassList[i]?.id][z].nodeValue
                      ) {
                        res.data[key].elements[y].num =
                          waitNum[key][res.data[key].labClassList[i]?.id][z].num;
                      }
                    }
                  }
                }
              }
              for (let overdueKey in overdueNum) {
                for (let j in overdueNum[overdueKey]) {
                  if (overdueKey === key && res.data[key].labClassList[i]?.id === Number(j)) {
                    for (
                      let z = 0;
                      z < overdueNum[key][res.data[key].labClassList[i]?.id]?.length;
                      z++
                    ) {
                      if (
                        res.data[key].elements[y].id ===
                        overdueNum[key][res.data[key].labClassList[i]?.id][z].nodeValue
                      ) {
                        res.data[key].elements[y].overdueNum =
                          overdueNum[key][res.data[key].labClassList[i]?.id][z].num;
                      }
                    }
                  }
                }
              }
              for (let todayComplete in todayCompleteNum) {
                for (let j in todayCompleteNum[todayComplete]) {
                  if (todayComplete === key && res.data[key].labClassList[i]?.id === Number(j)) {
                    for (
                      let z = 0;
                      z < todayCompleteNum[key][res.data[key].labClassList[i]?.id]?.length;
                      z++
                    ) {
                      if (
                        res.data[key].elements[y].id ===
                        todayCompleteNum[key][res.data[key].labClassList[i]?.id][z].nodeValue
                      ) {
                        res.data[key].elements[y].todayCompleteNum =
                          todayCompleteNum[key][res.data[key].labClassList[i]?.id][z].num;
                      }
                    }
                  }
                }
              }
              console.log(reportOverdueNum);
              for (let reportOverdue in reportOverdueNum) {
                for (let r in reportOverdueNum[reportOverdue]) {
                  if (reportOverdue === key && res.data[key].labClassList[i]?.id === Number(r)) {
                    res.data[key].elements[y].reportOverdueNum = reportOverdueNum[key][r][0].num;
                  }
                }
              }

              list.push({
                ...res.data[key].elements[y],
                className: res.data[key].labClassList[i]?.className,
                classId: res.data[key].labClassList[i]?.id,
                flowProDefId: key,
                flowXml: res.data[key].flowXml,
                flowName: res.data[key].flowName,
              });
            }
            console.log(list);
          }
          /**
           * 依流程ID分组
           */
          const result = list.reduce((acc, item) => {
            const key = item.flowProDefId;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {});
          /**
           * 依专业类别分组
           */
          let result1 = {};
          for (let key in result) {
            result1 = result[key].reduce((acc, item) => {
              const key = item.className;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(item);
              return acc;
            }, {});
          }
          comb.push(result1);
          console.log(comb);
          let newVal = [];
          for (let i = 0; i < comb.length; i++) {
            for (let combKey in comb[i]) {
              newVal.push({
                list: comb[i][combKey],
                flowXml: comb[i][combKey][0].flowXml,
                flowName: comb[i][combKey][0].flowName,
                type: combKey,
                overdueNum: comb[i][combKey][0].reportOverdueNum,
              });
            }
          }
          setList(newVal);
        }
      }
    });
  };
  const getProOverdueNum = () => {
    proOverdueNum().then((res) => {
      if (res.code === 200) {
        setOverdueNum(res.data);
      }
    });
  };
  const getProTodayCompleteNum = () => {
    proTodayCompleteNum().then((res) => {
      if (res.code === 200) {
        setTodayCompleteNum(res.data);
      }
    });
  };
  const getProWaitNum = () => {
    proWaitNum().then((res) => {
      if (res.code === 200) {
        setTimeout(() => {
          setWaitNum(res.data);
        }, 500);
      }
    });
  };
  const getProReportOverdueNum = () => {
    proReportOverdueNum().then((res) => {
      if (res.code === 200) {
        setReportOverdueNum(res.data);
      }
    });
  };
  const columns = [
    {
      title: '专业类别',
      dataIndex: 'className',
      key: 'className',
      align: 'center',
    },
    {
      title: '流程节点',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '当前待处理',
      dataIndex: 'num',
      key: 'num',
      align: 'center',
      render: (text) => {
        return <span style={{ fontSize: 25, color: 'red' }}>{text}</span>;
      },
    },
    {
      title: '节点超周期',
      dataIndex: 'overdueNum',
      key: 'overdueNum',
      align: 'center',
    },
    {
      title: '今日已完成',
      dataIndex: 'todayCompleteNum',
      key: 'todayCompleteNum',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      align: 'center',
      render: (record: any) => {
        return getButton(record);
      },
    },
  ];
  const getButton = (record:any) => {
    if (!record.users.includes(useDetail.id)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => performTasks(record)}>执行任务</Button>
        </div>
      );
    }
  };
  const performTasks = (record:any) => {
    history.push(
      `/experTaskNavigation/batchTask/${record.classId}/${record.id}/${record.flowProDefId}/${record.route}`,
    );
  };
  const tabsChange = (e, index) => {
    if (e === '2') {
      const parentElement = document.getElementById(`tabs${index}-panel-2`);
      let ele;
      while ((ele = parentElement?.children.item(0))) {
        ele.remove();
      }
      const newElement = document.createElement('div');
      newElement.id = 'canvas' + index;
      const container = document.getElementById(`canvas+${index}`);
      const titleElement = document.createElement('div');
      titleElement.innerHTML = list[index].flowName;
      parentElement.insertBefore(titleElement, container);
      parentElement?.appendChild(newElement);

      let bpmnViewer = new BpmnViewer({
        container: '#canvas' + index, // 这里为数组的第一个元素
        height: '40vh',
        additionalModules: [
          MoveCanvasModule, // 移动整个画布
          ZoomScrollModule,
        ],
      });
      bpmnViewer.importXML(list[index].flowXml, (error: any) => {
        if (error) {
        } else {
          let canvas = bpmnViewer.get('canvas');
          canvas.zoom('fit-viewport', 'auto');
        }
      });
    }
  };
  //单元格属性[行]
  const onCustomRow = (record: any) => {
    if (record.users.includes(useDetail.id)) {
      return {
        style: {
          background: 'green',
        },
      };
    }
  };

  return list.map((item, index) => {
    return (
      <Tabs
        defaultActiveKey="1"
        onChange={(e) => tabsChange(e, index)}
        id={`tabs${index}`}
        key={index}
      >
        <TabPane tab="节点任务导航" key="1">
          <Table
            rowKey="id"
            dataSource={item.list}
            columns={columns}
            size="small"
            title={() => (
              <div>
                <span>流程名:{item.flowName}</span>
                <span style={{ margin: '0 10px' }}>专业组:{item.type}</span>
                <span>超报告周期任务数:{item.overdueNum ? item.overdueNum : 0}</span>
              </div>
            )}
            onRow={onCustomRow}
          />
        </TabPane>
        <TabPane tab="节点任务流程分部" key="2" forceRender={true}>
          <div id={`canvas${index}`}></div>
        </TabPane>
      </Tabs>
    );
  });
};
export default Immunity;
