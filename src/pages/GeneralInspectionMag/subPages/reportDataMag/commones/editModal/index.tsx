import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Select, message, Form, Input } from 'antd';

import style from './index.less';

const { Option } = Select;

const EditModal = ({ Ref }) => {
  const [record, setRecord] = useState();
  const [fieldName, setFieldName] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dialogRef = useRef();
  useImperativeHandle(Ref, () => ({
    showModal: (record, fieldName) => {
      // record[fieldName] = 'uuu';
      // record;
      dialogRef.current && dialogRef.current.show();
    },
  }));

  const onOk = () => {
    // if (!positionId) {
    //   message.warn('请选择职位！');
    //   return;
    // }
    // setLoading(true);
    // changePosition({
    //   user_id: userInfo.user_id,
    //   recruitment_position_id: positionId,
    // }).then((res) => {
    //   setLoading(false);
    //   if (res.status_code === 200) {
    //     message.success('修改职位成功');
    //     dialogRef.current && dialogRef.current.hide();
    //     refresh();
    //   }
    // });
  };
  return (
    <Dialog ref={dialogRef} confirmLoading={loading} title={'修改'} onOk={onOk}>
      <Form layout="inline" form={form} className={style.form_box}>
        <Form.Item name="sampleBarcode" label="临床诊断">
          <Input placeholder="请输入项目编号名称" type="number" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default EditModal;
