import React from 'react';
import { Row, Col, Tabs } from 'antd';
import LeftContent from './commones/leftContent';
const { TabPane } = Tabs;
const ReportDataMag = () => {
  return (
    <Row>
      <Col span={12}>
        <Tabs defaultActiveKey="10" size="small">
          <TabPane tab="原始申请单" key="1">
            原始申请单
          </TabPane>
          <TabPane tab="样本溯源" key="2">
            样本溯源
          </TabPane>
          <TabPane tab="试剂耗材" key="4">
            试剂耗材
          </TabPane>
          <TabPane tab="交接及提示" key="5">
            交接及提示
          </TabPane>
          <TabPane tab="其他报告" key="6">
            其他报告
          </TabPane>
          <TabPane tab="历史报告" key="7">
            历史报告
          </TabPane>
          <TabPane tab="关联报告" key="8">
            关联报告
          </TabPane>
          <TabPane tab="当前报告预览" key="9">
            当前报告预览
          </TabPane>
          <TabPane tab="当前报告数据" key="10">
            <Row>
              <Col span={12}>
                <LeftContent />
              </Col>
              <Col span={12}>456</Col>
            </Row>
          </TabPane>
        </Tabs>
      </Col>
      <Col span={12}>col-8</Col>
    </Row>
  );
};
export default ReportDataMag;
