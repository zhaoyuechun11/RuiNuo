import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Select, Form, Input } from 'antd';

import style from './index.less';
import { useSelector, useDispatch } from 'umi';
import { getListForInput } from '../../../../../../../../models/server';
const { Option } = Select;

const FlagModal = ({ Ref }) => {
  const [record, setRecord] = useState();
  const [fieldName, setFieldName] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const { instrAndRecordId, reviewReultsList } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const [type, setType] = useState();
  const dispatch = useDispatch();
  const [resultList, setResultList] = useState([]);
  useImperativeHandle(Ref, () => ({
    showModal: (recordVal, fieldName, typeVal) => {
      form.resetFields();
      setRecord(recordVal);
      setFieldName(fieldName);
      setType(typeVal);
      if (typeVal === 2) {
        getResultList(recordVal?.itemId);
      }
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const getResultList = (id: any) => {
    const { instrId } = instrAndRecordId;
    getListForInput({ instrId, labItemId: id }).then((res) => {
      if (res.code === 200) {
        setResultList(res.data);
      }
    });
  };

  const onOk = () => {
    if (type === 2) {
      let resultVal = '';
      resultList.map((item) => {
        if (item.resultFlag === form.getFieldsValue().result) {
          resultVal = item.result;
        }
      });
      record[fieldName] = resultVal;
    } else {
      record[fieldName] = form.getFieldsValue().result;
    }
    const result = reviewReultsList.map((item) => {
      if (item.id === record.id) {
        return (item = record);
      } else {
        return item;
      }
    });
  
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'reviewReultsList',
        dataSource: result,
      },
    });
    dialogRef.current && dialogRef.current.hide();
  };
  return (
    <Dialog ref={dialogRef} confirmLoading={loading} title={'修改'} onOk={onOk}>
      <Form layout="inline" form={form} className={style.form_box}>
        <Form.Item name="result" label="结果">
          {type === 1 ? (
            <Input
              placeholder="请输入项目编号名称"
              type={`${record?.dataType === 1 ? 'number' : ''}`}
            />
          ) : (
            <Select allowClear placeholder="请选择">
              {resultList.map((item) => {
                return (
                  <Option value={item.resultFlag} key={item.id}>
                    {item.result}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default FlagModal;
