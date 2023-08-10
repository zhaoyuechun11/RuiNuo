import React, { useState, useEffect } from 'react';
import { useDispatch } from 'umi';
import Icon from '@components/Icon';
import style from './index.less';

const LeftContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  useEffect(() => {
    getList({ reportUnitName: 'gg' });
  }, []);
  const getList = (params) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportMainDataList',
      payload: {
        ...params,
        callback: (res: { code: number; data: React.SetStateAction<never[]> }) => {
          if (res.code === 200) {
            setList(res.data);
          }
        },
      },
    });
  };
  return list.map((item) => {
    return (
      <div className={style.wrap}>
        <div className={style.title}>{item.name}</div>
        <div>
          血常规
          <Icon
            name="iconanniu-bianji"
            classStyle={style.editIcon}
            // onClick={(e) => {
            //   //target.changePosition && target.changePosition(e, record, 1);
            // }}
          />
        </div>
      </div>
    );
  });
};

export default LeftContent;
