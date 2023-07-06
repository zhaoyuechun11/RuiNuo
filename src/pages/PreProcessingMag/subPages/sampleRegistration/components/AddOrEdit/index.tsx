import React, { useRef, useEffect, useState } from 'react';
import { history, useDispatch, useParams } from 'umi';
import AddMaterial from '../AddMaterial';
import { moduleList } from '../../../../models/server';
const AddOrEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const materialRef = useRef();
  const [enterType, setEnterType] = useState([]);
  useEffect(() => {
    getModuleList();
  }, []);
  const getFormField = (id) => {
    dispatch({
      type: 'preProcessingMag/getMainEnterEnterList',
      payload: {
        moduleId:id,
        callback: (res) => {
          // getCustomHeader();
        },
      },
    });
  };
  const getModuleList = () => {
    moduleList().then((res) => {
      if (res.code === 200) {
        setEnterType(res.data);
        getFormField(res.data[0].id);
      }
    });
  };
  return (
    <div>
      <div
        onClick={() => {
          materialRef.current.show();
        }}
      >
        添加
      </div>
      <AddMaterial refs={materialRef} />
    </div>
  );
};
export default AddOrEdit;
