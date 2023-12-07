import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, Input, message } from 'antd';
import { Dialog } from '@components';
import { audit, verifyPassword, releaseAudit } from '../../../../../../models/server';
import { useSelector } from 'umi';
const UserModal = ({ Ref, ids, refresh }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const [type, setType] = useState();
  useImperativeHandle(Ref, () => ({
    show: (val) => {
      setType(val);
      form.resetFields();
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const onOk = () => {
    const { account, password } = form.getFieldsValue();
    if (type === 1) {
      audit({ account, ids, password: window.btoa(password) }).then((res) => {
        if (res.code === 200) {
          message.success('审核成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
    } else {
      verifyPassword({ id: useDetail.id, password: window.btoa(password) }).then((res) => {
        if (res.code === 200) {
          if (!res.data) {
            message.warning('密码输入错误!');
          } else {
            releaseAudit({ids}).then((res) => {
              if (res.code === 200) {
                message.success('解审成功!');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            });
          }
        }
      });
    }
  };

  return (
    <Dialog ref={dialogRef} width={640} title={'用户账号'} onOk={onOk}>
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        {type === 1 && (
          <Form.Item
            label="用户账号"
            name="account"
            rules={[{ required: true, message: '请输入用户账号' }]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="用户密码"
          name="password"
          rules={[{ required: true, message: '请输入用户密码' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default UserModal;
