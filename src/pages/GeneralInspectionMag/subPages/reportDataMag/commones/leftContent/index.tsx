import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'umi';
import Icon from '@components/Icon';
import style from './index.less';
import EditModal from '../editModal';

const LeftContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const editModalRef = useRef();
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
      <>
        <div className={style.wrap}>
          <div className={style.title}>{item.name}</div>
          <div>
            血常规
            <Icon
              name="iconanniu-bianji"
              classStyle={style.editIcon}
              onClick={(e) => {
                editModalRef.current.showModal();
              }}
            />
          </div>
        </div>
        <EditModal Ref={editModalRef} />
      </>
    );
  });
};

export default LeftContent;
