import styles from './index.less';

import React, { useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import { useDispatch, useSelector } from 'umi';
const TabButton = ({ dataSource, className, width, callback }) => {
  const { tabButtonData = [] } = useSelector((state: any) => state.HandoverMsg);
  const dispatch = useDispatch();
  useEffect(() => {
    let data = dataSource.map((i, index) => ({
      name: i,
      active: index === 0 ? true : false,
    }));

    dispatch({
      type: 'HandoverMsg/initTabButton',
      payload: {
        data,
      },
    });
  }, [dataSource]);

  return (
    <div className={`${styles.tabbutton} ${className}`}>
      {tabButtonData?.map((i, index) => (
        <div
          style={{ width: `${width}px` }}
          className={
            i.active ? `${styles.tabbutton_item} ${styles.active}` : `${styles.tabbutton_item}`
          }
          key={index}
          onClick={() => {
            dispatch({
              type: 'HandoverMsg/changeTabButton',
              payload: {
                index,
                tabButtonData,
                callback: (data) => {
                  isFunction(callback) && callback(data);
                },
              },
            });
          }}
        >
          {i.name}
        </div>
      ))}
    </div>
  );
};

export default TabButton;
