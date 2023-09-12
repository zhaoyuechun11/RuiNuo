import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message } from 'antd';
import { getManageGroupAdd, updateManageGroup } from '../../../../models/server';
import ColorPicker from '@/pages/CommonMaterials/commones/colorPicker';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [record, setRecord] = useState({});
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      dialogRef.current && dialogRef.current.show();
      if (record) {
        form.setFieldsValue({ ...record });
        setId(record.id);
        setRecord(record);
      } else {
        setId(null);
        setRecord({});
        form && form.resetFields();
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        updateManageGroup({ id: id, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        getManageGroupAdd({ ...value }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form form={form} {...layout} style={{paddingTop:'20px'}}>
        <Form.Item label="code值" name="code" rules={[{ required: true, message: '请输入code值' }]}>
          <Input placeholder="请输入code值" />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入code值' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="颜色" name="color">
          <ColorPicker backgroundColor={record} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
