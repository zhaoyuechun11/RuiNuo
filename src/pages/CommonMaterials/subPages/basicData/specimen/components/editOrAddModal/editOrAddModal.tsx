import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, Select, message } from 'antd';
import { add, update } from '../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [type, setType] = useState();
  const [pid, setPid] = useState();
  const id = useRef();
  useImperativeHandle(Ref, () => ({
    show: (record, val, Pid) => {
      setType(val);
      setPid(Pid);
      dialogRef.current && dialogRef.current.show();
      if (val !== 'edit') {
        form && form.resetFields();
      } else {
        form.setFieldsValue({ ...record });
        id.current = record.id;
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (type !== 'edit') {
        add({ parentId: pid, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        update({ id: id.current, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
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
      width={864}
      title={type === 'edit' ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="字典编码"
          name="dictCode"
          rules={[{ required: true, message: '请输入字典编码' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入字典编码"
          />
        </Form.Item>
        <Form.Item
          label="字典值"
          name="dictValue"
          rules={[{ required: true, message: '请输入字典值' }]}
        >
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入字典值" />
        </Form.Item>
        <Form.Item label="英文" name="engValue">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入英文" />
        </Form.Item>
        <Form.Item label="对接编码" name="interfaceCode">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入对接编码"
          />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="顺序" name="seq">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入顺序" />
        </Form.Item>
        <Form.Item name="isDisable" label="是否禁用">
          <Select placeholder="请选择是否禁用" autoComplete="off" allowClear>
            <Option value={true} key={1}>
              是
            </Option>
            <Option value={false} key={2}>
              否
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="iseditable" label="是否可以编辑">
          <Select placeholder="请选择是否可以编辑" autoComplete="off" allowClear>
            <Option value={true} key={1}>
              是
            </Option>
            <Option value={false} key={2}>
              否
            </Option>
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
