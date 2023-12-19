import React from 'react';
import { Row, Col, Table } from 'antd';
import s from './index.less';
const ReportPreviewDetail = () => {
  const columns = [
    {
      title: '检查项目',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '检查结果',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Ct值',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '正常参考值',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <div>
      <div className={s.title}>标题</div>
      <Row className={s.row}>
        <Col span={6}>物流收样条码:0000001</Col>
        <Col span={3}></Col>
        <Col span={9}></Col>
        <Col span={6}>分子病理号:pV00000u</Col>
      </Row>
      <Row className={s.row}>
        <Col span={6}>患者姓名:了解阿</Col>
        <Col span={3}>性别:男</Col>
        <Col span={9}>年龄:60</Col>
        <Col span={6}>原单位编号:</Col>
      </Row>
      <Row className={s.row}>
        <Col span={6}>送检单位:建立开放</Col>
        <Col span={3}></Col>
        <Col span={9}>住院号/门诊号/体检号:00005</Col>
        <Col span={6}>送检日期:是的方式度过</Col>
      </Row>
      <Table dataSource={[]} columns={columns} size="small" className={s.table_box} />
    </div>
  );
};
export default ReportPreviewDetail;
