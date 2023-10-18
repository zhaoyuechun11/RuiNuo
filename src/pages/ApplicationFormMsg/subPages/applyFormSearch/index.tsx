import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import QueryData from './commones/QueryData';
import OriginApplyForm from './commones/OriginApplyForm';
import ProfessionalApplyForm from './commones/ProfessionalApplyForm';
const { TabPane } = Tabs;
const ApplyFormSearch = () => {
  useEffect(() => {}, []);

  return (
    <>
      <QueryData />
      <Tabs defaultActiveKey="1">
        <TabPane tab="原始申请单" key="1">
          <OriginApplyForm />
        </TabPane>
        <TabPane tab="专业申请单" key="2">
          <ProfessionalApplyForm />
        </TabPane>
      </Tabs>
    </>
  );
};
export default ApplyFormSearch;
