import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Button } from '@/components';
import {
  getNodeList,
  preOverdueNum,
  preTodayCompleteNum,
  preWaitNum,
} from '../../../../models/server';
import { useSelector, history } from 'umi';
const nodeNameList = [
  {
    name: '信息核对',
    id: 0,
  },
  {
    name: '样本签收',
    id: 2,
  },
  {
    name: '样本分拣',
    id: 3,
  },
  {
    name: '样本移交',
    id: 4,
  },
];
const Pretreatment = () => {
  const { useDetail } = useSelector((state: any) => state.global);
  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
    getPreOverdueNum();
    getPreTodayCompleteNum();
    getPreWaitNum();
  }, []);

  const getList = () => {
    getNodeList().then((res: any) => {
      if (res.code === 200) {
        for (let y = 0; y < nodeNameList.length; y++) {
          for (let i = 0; i < res.data.length; i++) {
            if (nodeNameList[y].id === Number(res.data[i].nodeValue)) {
              nodeNameList[y].route = res.data[i].route;
            }
          }
        }
      }
    });
  };
  const getPreOverdueNum = () => {
    preOverdueNum({ nodeList: [0, 2, 3, 4] }).then((res) => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          for (let y = 0; y < nodeNameList.length; y++) {
            if (Number(res.data[i].nodeValue) === nodeNameList[y]?.id) {
              nodeNameList[y].overdueNum = res.data[i]?.num;
            }
          }
        }
      }
    });
  };
  const getPreTodayCompleteNum = () => {
    preTodayCompleteNum({
      nodeList: [0, 2, 3, 4],
    }).then((res) => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          for (let y = 0; y < nodeNameList.length; y++) {
            if (Number(res.data[i].nodeValue) === nodeNameList[y]?.id) {
              nodeNameList[y].todayCompleteNum = res.data[i]?.num;
            }
          }
        }
      }
    });
  };
  const getPreWaitNum = () => {
    preWaitNum({ nodeList: [0, 2, 3, 4] }).then((res) => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          for (let y = 0; y < nodeNameList.length; y++) {
            if (Number(res.data[i].nodeValue) === nodeNameList[y]?.id) {
              nodeNameList[y].waitNum = res.data[i]?.num;
            }
          }
        }
        let result = useDetail.permissions.filter((item) => item.type !== 'button');
        let nodeResult = [0];
        for (let i = 0; i < result.length; i++) {
          if (result[i].mark === '0-10') {
            nodeResult.push(3);
          }
          if (result[i].mark === '0-11') {
            nodeResult.push(4);
          }
          if (result[i].mark === '0-17') {
            nodeResult.push(2);
          }
        }
        let map = new Map();
        for (let item of nodeNameList) {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        }
      
        let value = [...map.values()].filter((item) => nodeResult.includes(item.id));
        setTimeout(() => {
          setList(value);
        }, 500);
      }
    });
  };
  const columns = [
    {
      title: '流程节点',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      with: 100,
    },
    {
      title: '当前待处理',
      dataIndex: 'waitNum',
      key: 'waitNum',
      align: 'center',
      with: 100,
    },
    {
      title: '今日已完成',
      dataIndex: 'todayCompleteNum',
      key: 'todayCompleteNum',
      align: 'center',
      with: 100,
    },
    {
      title: '节点超周期',
      dataIndex: 'overdueNum',
      key: 'overdueNum',
      align: 'center',
      with: 100,
    },
    {
      title: '操作',
      align: 'center',
      with: 100,
      render: (record: any) => {
       
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => goTask(record)}>执行任务</Button>
          </div>
        );
      },
    },
  ];
  const goTask = (val) => {
    switch (val.id) {
      case 0:
        history.push('/preProcessingMag/applicationForm');
        break;
      case 2:
        console.log('样本签收');
        break;
      case 3:
        history.push('/preProcessingMag/sampleSortingt');
        break;
      case 4:
        history.push('/preProcessingMag/sampleHandover');
      default:
        console.log('I like all foods');
        break;
    }
  };
  return <Table dataSource={list} columns={columns} size="small" title={() => '前处理任务汇总'} />;
};
export default Pretreatment;
