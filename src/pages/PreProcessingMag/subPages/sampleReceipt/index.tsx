import React from 'react';
import { Tabs } from 'antd';
import SingleReceipt from './commones/singleReceipt';
import BatchReceipt from './commones/batchReceipt';
const { TabPane } = Tabs;
const SampleReceipt = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="样本单个签收(未)" key="1">
        <SingleReceipt />
      </TabPane>
      <TabPane tab="样本批量签收(未)" key="2">
        <BatchReceipt />
      </TabPane>
    </Tabs>
  );
};
export default SampleReceipt;
