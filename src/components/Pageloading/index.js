import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default (props) => {
  if (process.env.NODE_ENV === 'development' && props.error) {
    return <div>{props.error.stack}</div>;
  }
  return (
    <div className={styles.pageloading}>
      <Spin />
    </div>
  );
};
