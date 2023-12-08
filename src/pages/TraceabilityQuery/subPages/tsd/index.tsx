import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const ApplyFormSearch = () => {
  return (
    <>

      <Tabs defaultActiveKey="1">
        <TabPane tab="原始申请单" key="1">
       
        </TabPane>
        <TabPane tab="专业申请单" key="2">
     
        </TabPane>
      </Tabs>
    </>
  );
};
export default ApplyFormSearch;

