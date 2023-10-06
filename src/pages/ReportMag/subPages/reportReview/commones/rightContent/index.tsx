import React from 'react';
import { Tabs } from 'antd';
import ReportPreview from '../reportPreview ';
const { TabPane } = Tabs;
const RightContent = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="报告单预览" key="1">
        <ReportPreview />
      </TabPane>
      <TabPane tab="关联报告单" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="原始单申请" key="3">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="交接信息" key="3">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  );
};
export default RightContent;
