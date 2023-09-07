import React, { Component } from 'react';
import styles from './style/index.less';
import { Button } from 'antd';
import { history } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import Left from './components/Left';
import RightContent from './components/RightContent';

class OrganizeInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.OrganizeInstitution}>
        <div className={styles.Card}>
          <div className={styles.CardLeft}>
            <Button
              type="primary"
              onClick={() => {
                history.goBack();
              }}
            >
              <LeftOutlined />
              返回
            </Button>
            <div className={styles.title}>角色管理</div>
          </div>
        </div>
        <div className={styles.OrganizeInstitutionContainer}>
          <RightContent />
        </div>
      </div>
    );
  }
}

export default OrganizeInstitution;
