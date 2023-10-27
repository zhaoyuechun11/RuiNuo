import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import SingleReceipt from './commones/singleReceipt';
import BatchReceipt from './commones/batchReceipt';
import { useLocation } from 'umi';
const { TabPane } = Tabs;
const SampleReceipt = () => {
  const { pathname } = useLocation();
  const [activeKey, setActiveKey] = useState('1');
  const onChange = (e: any) => {
    setActiveKey(e);
  };
  useEffect(() => {
    // console.log('activeKey', activeKey);
    // setActiveKey('2');
    // debugger;
  }, [pathname]);
  return (
    <Tabs activeKey={activeKey} onChange={onChange}>
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
