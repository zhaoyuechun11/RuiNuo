import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { message, Form, Input } from 'antd';
import { reportMainUpdate, addMainUpdate } from '../../../../../../models/server';
import style from './index.less';
import { useSelector, useDispatch } from 'umi';

const EditModal = ({ Ref }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState();
  const field = useRef();
  const [form] = Form.useForm();
  const dialogRef = useRef();

  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  useImperativeHandle(Ref, () => ({
    showModal: (val, fieldVal) => {
      setType(val);
      field.current = fieldVal;
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'reportLefUpdate',
          dataSource: false,
        },
      });
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const featchAddMainUpdate = () => {
    let fieldName = type === 1 ? 'diagnosis' : 'remark';
    let params = {
      beforeChange: { [fieldName]: field.current + '|' + form.getFieldValue(`${fieldName}`) },
      objectId: instrAndRecordId.id,
      winName: '普检报告数据管理',
    };
    addMainUpdate(params).then((res) => {
      if (res.code === 200) {
        message.success('日志添加成功');
      }
    });
  };
  const onOk = () => {
    reportMainUpdate({ ...form.getFieldsValue(), id: instrAndRecordId.id }).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        dialogRef.current && dialogRef.current.hide();
        featchAddMainUpdate();
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportLefUpdate',
            dataSource: true,
          },
        });
      }
    });
  };
  return (
    <Dialog ref={dialogRef} title={'修改'} onOk={onOk}>
      <Form layout="inline" form={form} className={style.form_box}>
        <Form.Item
          name={`${type === 1 ? 'diagnosis' : 'remark'}`}
          label={type === 1 ? '临床诊断' : '备注'}
        >
          <Input placeholder={`请输入${type === 1 ? '临床诊断' : '备注'}`} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default EditModal;
