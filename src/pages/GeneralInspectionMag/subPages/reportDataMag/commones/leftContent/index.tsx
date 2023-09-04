import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import Icon from '@components/Icon';
import style from './index.less';
import { reportMain } from '../../../../models/server';
import EditModal from './commones/editModal';

const LeftContent = () => {
  const dispatch = useDispatch();
  const editModalRef = useRef();
  const { instrAndRecordId, reportLeftData } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const reportUnit = sessionStorage.getItem('reportUnit');
  useEffect(() => {
    if (reportUnit) {
      const newReportUnit = JSON.parse(reportUnit);
      getList({ reportUnitName: newReportUnit.children });
    } else {
      getList({ reportUnitName: '' });
    }
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
            dispatch({
              type: 'generalInspectionMag/save',
              payload: {
                type: 'reportLeftData',
                dataSource: res.data,
              },
            });
          }
        },
      },
    });
  };
  const getReportMain = (params: any) => {
    reportMain(params).then((res: any) => {
      if (res.code === 200) {
        reportLeftData.map((el) => {
          Object.keys(res.data).forEach(function (key) {
            if (el.key === key) {
              el.fieldVal = res.data[key];
            }
          });
        });
        debugger;
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportLeftVal',
            dataSource: res.data,
          },
        });

        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportLeftData',
            dataSource: reportLeftData,
          },
        });
      }
    });
  };
  return reportLeftData.map((item) => {
    return (
      <>
        <div className={style.wrap}>
          <div className={style.title}>{item.name}</div>
          <div>
            {item?.fieldVal}
            {item.key === 'diagnosis' && (
              <Icon
                name="iconanniu-bianji"
                classStyle={style.editIcon}
                onClick={(e) => {
                  editModalRef.current.showModal(1, item?.fieldVal);
                }}
              />
            )}
            {item.key === 'remark' && (
              <Icon
                name="iconanniu-bianji"
                classStyle={style.editIcon}
                onClick={(e) => {
                  editModalRef.current.showModal(2, item?.fieldVal);
                }}
              />
            )}
          </div>
        </div>
        <EditModal Ref={editModalRef} />
      </>
    );
  });
};

export default LeftContent;
