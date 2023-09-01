import React from 'react';
import { Tabs } from 'antd';
import GraphicData from './commones/graphicData';
import ExplainAdvise from './commones/explainAdvise';
import ResultUpdateRecord from './commones/resultUpdateRecord';
import ReviewRecords from './commones/reviewRecords';
import DeapprovalRecord from './commones/deapprovalRecord';
const { TabPane } = Tabs;
const MiddleBottom = () => {
  return (
    <Tabs defaultActiveKey="1" size="small">
      <TabPane tab="图形数据" key="1">
        {' '}
        <GraphicData />
      </TabPane>
      <TabPane tab="建议与解释" key="2">
        <ExplainAdvise />
      </TabPane>
      <TabPane tab="结果修改" key="3">
        <ResultUpdateRecord />
      </TabPane>
      <TabPane tab="项目复查记录" key="4">
        <ReviewRecords />
      </TabPane>
      <TabPane tab="反审核记录" key="5">
        <DeapprovalRecord />
      </TabPane>
    </Tabs>
  );
};
export default MiddleBottom;
