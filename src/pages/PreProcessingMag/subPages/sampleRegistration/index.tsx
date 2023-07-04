import React, { useRef } from 'react';
import { useDispatch, useSelector, history, useLocation } from 'umi';
import { Icon, Button } from '@/components';
import { Tooltip, message, Spin } from 'antd';
import SetHeaderModal from './components/SetHeaderModal';
import QueryData from './components/QueryData';
const SampleRegistration = () => {
  const setRef = useRef();
  const changeColumn = () => {};
  return (
    <div
      onClick={() => {
        history.push('/preProcessingMag/sampleRegistration/addOrEdit');
      }}
    >
      <QueryData />
      <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
        <span
          //   className={styles.settings}
          onClick={() => {
           // setRef.current && setRef.current?.show();
          }}
        >
          <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20 }} />
        </span>
      </Tooltip>
      <SetHeaderModal
        refs={setRef}
        // columnOptions={columnOptionsList}
        // columnChecked={checkedList}
        // defaultChecked={defaultList}
        columnOptions={[{ id: 3 }]}
        columnChecked={[{ id: 3 }]}
        defaultChecked={[{ id: 3 }]}
        handleChangeColumn={changeColumn}
      />
    </div>
  );
};
export default SampleRegistration;
