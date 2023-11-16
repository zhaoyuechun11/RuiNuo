import React, { useRef, useImperativeHandle, useState } from 'react';
import { message, Form, DatePicker } from 'antd';
import { Dialog } from '@components';
import { itemTgValueStop } from '../../../../../../models/server';
const StopTimeModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      setId(val.id);
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const onOK = () => {
    const stopDt = form.getFieldValue('stopDt').format('YYYY-MM-DD')+ ' ' + '00:00:00';
    itemTgValueStop({ id, stopDt }).then((res) => {
      if (res.code === 200) {
        message.success('停用成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };

  return (
    <Dialog ref={dialogRef} width={564} onOk={onOK}>
      <Form form={form} style={{ padding: '20px' }} layout="vertical" title="停用">
        <Form.Item
          name="stopDt"
          label="停用日期"
          rules={[{ required: true, message: '请选择停用日期' }]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="请选择停用日期" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default StopTimeModal;
