import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import Icon from '@components/Icon';
import style from './index.less';
import EditModal from '../editModal';
import { reportMain } from '../../../../models/server';

const LeftContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [reportMainData, setReportMainData] = useState({});
  const editModalRef = useRef();
  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  useEffect(() => {
    getList({ reportUnitName: 'gg' });
  }, []);
  useEffect(() => {
    if (instrAndRecordId.id || instrAndRecordId.instrId) {
      getReportMain(instrAndRecordId);
    }
  }, [instrAndRecordId]);
  const getList = (params: any) => {
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
  const getReportMain = (params: any) => {
    reportMain(params).then((res: any) => {
      if (res.code === 200) {
        setReportMainData(res.data);
      }
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
