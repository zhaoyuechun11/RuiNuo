import React from 'react';
import { Row, Col, Image } from 'antd';
import styles from './index.less';
const SampleApplication = ({ data }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.title}>送检样本申请单</div>
        <div className={`${styles.flex_box} ${styles.line}`}>
          <div className={styles.hospitalName}>送检单位:{data.hospitalName}</div>
          <div>送检样本条码:{data.receiveBarcode}</div>
        </div>
        <Row gutter={16} className={styles.row_box}>
          <Col className="gutter-row" span={8}>
            <div className={styles.col_box}>
              <div>
                <span>姓名:</span>
                {data.patientName}
              </div>
              <div>
                <span>性别:</span>
                {data.sexName}
              </div>
              <div>
                <span>年龄:</span>
                {data.age}
              </div>
              <div>
                <span>临床诊断:</span>
                {data.diagnosis}
              </div>
              <div>
                <span>备注:</span>
                {data.remark}
              </div>
              <div>
                <span>联系人:</span>
              </div>
              <div>
                <span>身份证号:</span>
                {data.idCardNo}
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div className={styles.col_box}>
              <div>
                <span>病人类型:</span>
                {data.sourceName}
              </div>
              <div>
                <span>科室:</span>
                {data.sendDeptName}
              </div>
              <div>
                <span>医生电话:</span>
              </div>
              <div>
                <span>采样时间:</span>
                {data.collectDate}
              </div>
              <div>
                <span>联系电话:</span>
                {data.telephoneNo}
              </div>
              <div>
                <span>邮箱:</span>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div className={styles.col_box}>
              <div>
                <span>门诊/住院号:</span>
                {data.patientNo}
              </div>
              <div>
                <span>床号:</span>
                {data.bedNo}
              </div>
              <div>
                <span>申请医生:</span>
                {data.sendDoctorName}
              </div>
              <div>
                <span>登记时间:</span>
                {data.createDate}
              </div>
              <div>
                <span>付费类型:</span>
                {data.payModeName}
              </div>
              <div>
                <span>物流接收时间:</span>
                {data.receiveDate}
              </div>
              <div>
                <span>联系地址:</span>
                {data.address}
              </div>
            </div>
          </Col>
        </Row>
        <div>申请项目:</div>
        <Row gutter={16} className={styles.line_border}>
          <Col className="gutter-row" span={3}>
            专业类别
          </Col>
          <Col className="gutter-row" span={5}>
            申请项目
          </Col>
          <Col className="gutter-row" span={4}>
            样本类型
          </Col>
          <Col className="gutter-row" span={4}>
            检测状态
          </Col>
          <Col className="gutter-row" span={4}>
            检测编号
          </Col>
          <Col className="gutter-row" span={4}>
            专业分单号
          </Col>
        </Row>
        {data.reqItemPrices?.map((item) => {
          return (
            <Row gutter={16} className={styles.dashed_line} key={item.id}>
              <Col className="gutter-row" span={3}>
                {item.labClassName}
              </Col>
              <Col className="gutter-row" span={5}>
                {item.itemName}
              </Col>
              <Col className="gutter-row" span={4}></Col>
              <Col className="gutter-row" span={4}></Col>
            </Row>
          );
        })}
        <div>送检样本:</div>
        <Row gutter={16} className={styles.line_border}>
          <Col className="gutter-row" span={3}>
            登记号
          </Col>
          <Col className="gutter-row" span={5}>
            样本类型
          </Col>
          <Col className="gutter-row" span={4}>
            数量
          </Col>
          <Col className="gutter-row" span={4}>
            病理编号(原)
          </Col>
          <Col className="gutter-row" span={4}>
            蜡块号(原)
          </Col>
          <Col className="gutter-row" span={4}>
            性状
          </Col>
        </Row>
        {data.sendSamples?.map((item) => {
          return (
            <Row gutter={16} className={styles.dashed_line}>
              <Col className="gutter-row" span={3}></Col>
              <Col className="gutter-row" span={5}>
                {item.sampleTypeName}
              </Col>
              <Col className="gutter-row" span={4}>
                {' '}
                {item.cnt}
              </Col>
              <Col className="gutter-row" span={4}>
                {item.pathologyNo}
              </Col>
              <Col className="gutter-row" span={4}>
                {item.lkNo}
              </Col>
              <Col className="gutter-row" span={4}>
                {item.sampleStateName}
              </Col>
            </Row>
          );
        })}
      </div>
      <div className={styles.picture}>
        <Row gutter={16}>
          {data.materials?.map((item) => {
            return (
              <Col className="gutter-row" span={8}>
                <Image src={item.filePath} style={{ width: 20, height: 20 }} />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};
export default SampleApplication;
