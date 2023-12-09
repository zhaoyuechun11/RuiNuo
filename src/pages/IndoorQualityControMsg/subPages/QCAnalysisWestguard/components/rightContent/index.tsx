import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import AllData from './components/allData';
import QCEvaluation from './components/QCEvaluation';
import QCGraphics from './components/QCGraphics';

const { TabPane } = Tabs;
const RightContent = () => {
  return (
    <Tabs
      defaultActiveKey="1"
      style={{
        width: '60%',
        marginLeft: '20px',
        paddingLeft: '20px',
        borderLeft: ' 1px solid #cecece',
      }}
    >
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
