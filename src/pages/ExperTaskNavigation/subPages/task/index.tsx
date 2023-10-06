import React from 'react';
import { Tabs } from 'antd';

import Pretreatment from './commones/pretreatment';
import Chemistry from './commones/chemistry';
import s from './index.less';
import Immunity from './commones/immunity';
const { TabPane } = Tabs;
const Task = () => {
  return (
    <div className={s.card_container}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="前处理任务汇总" key="1">
          <Pretreatment />
        </TabPane>
        <TabPane tab="普通检验流程(化学发光)" key="2">
          <Chemistry />
        </TabPane>
        <TabPane tab="普通检验流程(免疫)" key="3">
          <Immunity />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default Task;
