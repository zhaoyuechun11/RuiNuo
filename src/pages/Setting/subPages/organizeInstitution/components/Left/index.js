import React, { Component } from 'react';
import styles from './index.less';

const Item = ({ title, bottom, tip, src }) => {
  return (
    <div className={styles.item}>
      <img className={styles.img} src={src} />
      <div className={styles.center}>
        <div className={styles.title}>{title}</div>
        {tip && <div className={styles.text}>{tip}</div>}
      </div>
      <div className={styles.bottom}>
        <div>{bottom[0]}</div>
        <div>{bottom[1]}</div>
      </div>
    </div>
  );
};

class Left extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.Left}>
        <div className={styles.head}>角色说明</div>
        <Item
          title="角色分类"
          src={require('../../img/first.png')}
          bottom={[
            '管理员、HR、面试官3大类',
            '管理员及一级HR可以新增非管理员的角色',
          ]}
        />
        <Item
          title="角色数据权限"
          src={require('../../img/second.png')}
          tip="（管理员可以查看整个企业的数据）"
          bottom={['上级可查看下级的所有数据', '平级之间不可互相查看数据']}
        />
        <Item
          title="给人员分配角色权限"
          src={require('../../img/third.png')}
          bottom={['在“设置-人员管理”给人员分配对应的角', '色权限']}
        />
      </div>
    );
  }
}

export default Left;
