import React from 'react';
import { Tabs } from 'antd';
import AllData from './components/allData';
import QCEvaluation from './components/QCEvaluation';
import QCGraphics from './components/QCGraphics';
const { TabPane } = Tabs;
const RightContent = () => {


  const tabChange = (e: any) => {
 
  };
  return (
    <Tabs defaultActiveKey="1" style={{ width: '70%' }} onChange={tabChange}>
      <TabPane tab="质控图形" key="1">
        <QCGraphics />
      </TabPane>
      <TabPane tab="所有数据" key="2">
        <AllData />
      </TabPane>
      <TabPane tab="质控评价" key="3">
        <QCEvaluation />
      </TabPane>
    </Tabs>
  );
};
export default RightContent;
