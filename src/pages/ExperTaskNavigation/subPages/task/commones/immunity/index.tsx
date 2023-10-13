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
} from '../../../../models/server';
const { TabPane } = Tabs;
import s from '../../index.less';
import { useSelector } from 'umi';

const Immunity = () => {
  const [waitNum, setWaitNum] = useState([]);
  const [overdueNum, setOverdueNum] = useState([]);
  const [todayCompleteNum, setTodayCompleteNum] = useState([]);
  const [list, setList] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  useEffect(() => {
    getProOverdueNum();
    getProTodayCompleteNum();
    getProWaitNum();
  }, []);
  useEffect(() => {
    getProFlowData();
  }, [waitNum]);
  const getProFlowData = () => {
    proFlowData().then((res) => {
      if (res.code === 200) {
        let newArray = [];
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

              list.push({
                ...res.data[key].elements[y],
                className: res.data[key].labClassList[i].className,
                classId: res.data[key].labClassList[i].id,
                flowProDefId: key,
                flowXml: res.data[key].flowXml,
              });
            }
            console.log(list);
            // const result = list.reduce((acc, item) => {
            //   const key = item.flowProDefId;
            //   if (!acc[key]) {
            //     acc[key] = [];
            //   }
            //   acc[key].push(item);
            //   return acc;
            // }, {});
            // console.log(result);
            // let result1 = {};
            // for (let key in result) {
            //   result1 = result[key].reduce((acc, item) => {
            //     const key = item.className;
            //     if (!acc[key]) {
            //       acc[key] = [];
            //     }
            //     acc[key].push(item);
            //     return acc;
            //   }, {});
            // }
            // comb.push(result1);
            // console.log(result1);
            // for (let keyVal in result1) {
            //   newArray.push({
            //     name: '普通检验流程' + '(' + res.data[key].labClassList[i].className + ')',
            //     list: [...result1[keyVal]],
            //   });
            // }

            //return;
            //debugger

            // newArray.push({
            //   name: '普通检验流程' + '(' + res.data[key].labClassList[i].className + ')',
            //   //list: [...result[res.data[key].labClassList[i].className]],
            //   list: [...result[key]],
            // });
          }
          const result = list.reduce((acc, item) => {
            const key = item.flowProDefId;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {});
          //console.log(result);
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
                name: '普通检验流程' + combKey,
                list: comb[i][combKey],
                flowXml: comb[i][combKey][0].flowXml,
              });
            }
          }
          console.log('newVal', newVal);
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
  const columns = [
    {
      title: '专业类别',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '流程节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前待处理',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '节点超周期',
      dataIndex: 'overdueNum',
      key: 'overdueNum',
    },
    {
      title: '今日已完成',
      dataIndex: 'todayCompleteNum',
      key: 'todayCompleteNum',
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (record: any) => {
        getButton(record);
      },
    },
  ];
  const getButton = (record) => {
    if (record.users.includes(useDetail.id)) {
      return <Button onClick={performTasks}>执行任务</Button>;
    }
  };
  const performTasks = (record) => {
    if (!record.users?.includes(useDetail.id)) {
      message.warning('没有该权限哦！请先分配权限!');
    }
  };
  const tabsChange = (e, xml, index) => {
    console.log(list);
    // 获取父元素

    if (e === '2') {
      const parentElement = document.getElementById(`tabs${index}-panel-2`);
      // console.log(parentElement);
      let ele;
      while ((ele = parentElement?.children.item(0))) {
        ele.remove();
      }
      const newElement = document.createElement('div');
      newElement.id = 'canvas' + index;
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
      // const parentElement = document.getElementById('rc-tabs-0-panel-2');
      // console.log(parentElement);
      // let ele;
      // while ((ele = parentElement?.children.item(0))) {
      //   ele.remove();
      // }

      // proFlowData().then((res) => {
      //   if (res.code === 200) {
      //     // for (let i = 0; i < text.length; i++) {

      //     //   const newElement = document.createElement('div');
      //     //   newElement.id = 'canvas' + i;
      //     //   parentElement?.appendChild(newElement);
      //     //   let bpmnViewer = new BpmnViewer({
      //     //     container: '#canvas' + i, // 这里为数组的第一个元素
      //     //     height: '40vh',
      //     //     additionalModules: [
      //     //       MoveCanvasModule, // 移动整个画布
      //     //       ZoomScrollModule,
      //     //     ],
      //     //   });
      //     //   for (let key in text[i]) {
      //     //     bpmnViewer.importXML(text[i][key].flowXml, (error: any) => {
      //     //       var box = document.querySelector('#canvas' + i);
      //     //       const titleElement = document.createElement('div');
      //     //       titleElement.innerHTML = text[i][key].flowName;
      //     //       box.parentNode.insertBefore(titleElement, box);
      //     //       if (error) {
      //     //       } else {
      //     //         let canvas = bpmnViewer.get('canvas');
      //     //         canvas.zoom('fit-viewport', 'auto');
      //     //       }
      //     //     });
      //     //   }
      //     // }

      //     let i = 0;
      //     for (let key in res.data) {
      //       i++;
      //       // for (let i = 0; i < res.data[key].labClassList.length; i++) {
      //       const newElement = document.createElement('div');
      //       newElement.id = 'canvas' + i;
      //       parentElement?.appendChild(newElement);
      //       var box = document.querySelector('#canvas' + i);
      //       const titleElement = document.createElement('div');
      //       titleElement.innerHTML = res.data[key].flowName;
      //       box?.parentNode.insertBefore(titleElement, box);
      //       let bpmnViewer = new BpmnViewer({
      //         container: '#canvas' + i, // 这里为数组的第一个元素
      //         height: '40vh',
      //         additionalModules: [
      //           MoveCanvasModule, // 移动整个画布
      //           ZoomScrollModule,
      //         ],
      //       });
      //       bpmnViewer.importXML(res.data[key].flowXml, (error: any) => {
      //         if (error) {
      //         } else {
      //           let canvas = bpmnViewer.get('canvas');
      //           canvas.zoom('fit-viewport', 'auto');
      //         }
      //       });

      //     }

      //   }
      // });
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
        onChange={(e) => tabsChange(e, item.flowXml, index)}
        id={`tabs${index}`}
      >
        <TabPane tab="节点任务导航" key="1" className={s.tab_pane}>
          <Table
            dataSource={item.list}
            columns={columns}
            size="small"
            title={() => item.name}
            onRow={onCustomRow}
          />
        </TabPane>
        <TabPane tab="节点任务流程分部" key="2" className={s.tab_pane} forceRender={true}>
          <div id={`canvas${index}`}></div>
        </TabPane>
      </Tabs>
    );
  });
};
export default Immunity;
