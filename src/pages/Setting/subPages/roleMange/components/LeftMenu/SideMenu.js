import React, { Component, Suspense } from 'react';
import { Layout } from 'antd';
import PageLoading from '@components/Pageloading';
import styles from './index.less';

const BaseMenu = React.lazy(() => import('./BseMenu'));
const { Sider } = Layout;

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Sider className={styles.LeftMenu}>
        <div className={styles.LeftMenuHead}>公司组织架构</div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu {...this.props} mode="inline" />
        </Suspense>
      </Sider>
    );
  }
}

export default SideMenu;
