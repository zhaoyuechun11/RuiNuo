import React from 'react';
import styles from './index.less';
const SampleApplication = ({ data }) => {
  return (
    <div className={styles.box}>
      <div>送检样本申请单</div>
      <div className={styles.flex_box}>
        <div>送检单位:{data.hospitalName}</div>
        <div>送检样本条码:{data.receiveBarcode}</div>
      </div>
      <div className={styles.flex_box}>
        <div>姓名:{data.patientName}</div>
        <div>病人类型:{data.sourceName}</div>
        <div>门诊/住院号:{data.patientNo}</div>
      </div>
      <div className={styles.flex_box}>
        <div>性别:{data.sexName}</div>
        <div>科室:{data.sendDeptName}</div>
        <div>床号:{data.bedNo}</div>
      </div>
      <div className={styles.flex_box}>
        <div>年龄:{data.age}</div>
        <div>医生电话:</div>
        <div>申请医生:{data.sendDoctorName}</div>
      </div>
      <div className={styles.flex_box}>
        <div>临床诊断:{data.diagnosis}</div>
        <div>登记时间:{data.createDate}</div>
      </div>
      <div className={styles.flex_box}>
        <div>备注:{data.remark}</div>
        <div>采样时间:{data.collectDate}</div>
        <div>付费类型:{data.payModeName}</div>
      </div>
      <div className={styles.flex_box}>
        <div>联系人</div>
        <div>联系电话:{data.telephoneNo}</div>
        <div>物流接收时间:{data.receiveDate}</div>
      </div>
     
      <div className={styles.flex_box}>
        <div>身份证号:{data.idCardNo}</div>
        <div>邮箱:</div>
        <div>联系地址:{data.address}</div>
      </div>
    </div>
  );
};
export default SampleApplication;
