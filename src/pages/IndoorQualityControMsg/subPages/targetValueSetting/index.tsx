import React, { useEffect } from 'react';
import { useDispatch, useLocation } from 'umi';
import LeftMenu from './components/LeftMenuNew';
import RightContent from './components/RightContent';
import s from '../index.less';
const TargetValueSetting = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'leftMenuParams',
        dataSource: {
          labClassId: '',
          qcId: '',
          itemId: '',
        },
      },
    });

    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'selectedInstr',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  return (
    <div className={s.container}>
      <LeftMenu />{' '}
      <div className={s.content}>
        <RightContent />
      </div>
    </div>
  );
};
export default TargetValueSetting;
