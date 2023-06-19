import React, { Component } from 'react';
import LeftMenu from './components/LeftMenuNew';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './style/index.less';


class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentWillUnmount() {
    localStorage.setItem('defaultOpenKeys', JSON.stringify([]));
  }
  render() {
    return (
      <div className={styles.RoleManage}>
        <div className={styles.Card}>
          <div className={styles.CardLeft}>
            <Button
              type="primary"
              onClick={() => {
                history.goBack();
                localStorage.setItem('defaultOpenKeys', JSON.stringify([]));
              }}
            >
              <LeftOutlined />
              返回
            </Button>
            <div className={styles.title}>人员管理</div>
          </div>
        </div>
        <div className={styles.rolemanageContainer}>
          {/* <LeftMenu /> */}
          <div className={styles.content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default RoleManage;
