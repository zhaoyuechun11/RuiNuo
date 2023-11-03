import React, { Suspense } from 'react';
import { Layout } from 'antd';
import PageLoading from '@components/Pageloading';
import styles from './index.less';

const BaseMenu = React.lazy(() => import('./BseMenu'));
const { Sider } = Layout;

const SideMenu = (props) => {
  debugger;
  return (
    <Sider className={styles.LeftMenu}>
      <div className={styles.LeftMenuHead}>公司组织架构1</div>
      <Suspense fallback={<PageLoading />}>
        <BaseMenu {...props} mode="inline" />
      </Suspense>
    </Sider>
  );
};

export default SideMenu;
