import React, { Suspense } from 'react';
import { Layout } from 'antd';
import PageLoading from '@components/Pageloading';
import styles from './index.less';

const BaseMenu = React.lazy(() => import('./BseMenu'));
const { Sider } = Layout;

const SideMenu = (props) => {
  return (
    <Sider className={styles.LeftMenu}>
      <div className={styles.LeftMenuHead}>质控品规则</div>
      <Suspense fallback={<PageLoading />}>
        <BaseMenu {...props} mode="inline" />
      </Suspense>
    </Sider>
  );
};

export default SideMenu;
