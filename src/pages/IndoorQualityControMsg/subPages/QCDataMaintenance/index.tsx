import React from 'react';
import LeftMenu from './components/LeftMenuNew';
import RightContent from './components/RightContent';
import s from '../index.less';
const QCDataMaintenance = () => {
    return (
        <div className={s.container}>
          <LeftMenu />{' '}
          <div className={s.content}>
            <RightContent />
          </div>
        </div>
      );
};
export default QCDataMaintenance