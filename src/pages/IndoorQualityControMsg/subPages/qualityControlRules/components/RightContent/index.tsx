import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';

import { Tabs } from 'antd';

import RulesBindInstr from './components/rulesBindInstr';
import RulesBindItem from './components/rulesBindItem';
import { getRuleSetingList } from '../../../../models/server';
const { TabPane } = Tabs;
const RightContent = () => {
  const { leftMenuParamsRules } = useSelector((state: any) => state.IndoorQualityControMsg);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'leftMenuParamsRules',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  // useEffect(() => {
  //   if (leftMenuParamsRules?.instrId) {
  //     getList({
  //       pageNum,
  //       pageSize,
  //       instrId: leftMenuParamsRules.instrId,
  //       // ...form.getFieldsValue(),
  //       // startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
  //     });
  //   }
  // }, [pageNum, pageSize, leftMenuParamsRules?.instrId]);
  const getList = (params: any) => {
    getRuleSetingList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="质控规则到仪器" key="1">
        <RulesBindInstr ruleList={list} />
      </TabPane>
      <TabPane tab="质控规则到项目" key="2">
        <RulesBindItem ruleList={list} />
      </TabPane>
    </Tabs>
  );
};

export default RightContent;
