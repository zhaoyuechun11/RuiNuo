import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select } from 'antd';
import { useSelector } from 'umi';
import { reportUnitAdd, reportUnitUpdate } from '../../../../models/server';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const EditOrAddModal = ({ Ref, refresh }) => {
  const { labClass } = useSelector((state: any) => state.commonMaterials);
  debugger;
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
        reportUnitUpdate({ id: id, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        reportUnitAdd({ ...value }).then((res) => {
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
      <Form form={form} {...layout}>
        <Form.Item
          label="报告单元代码"
          name="reportUnitCode"
          rules={[{ required: true, message: '请输入报告单元代码' }]}
        >
          <Input placeholder="请输入报告单元代码" />
        </Form.Item>
        <Form.Item
          label="报告单元名称"
          name="reportUnitName"
          rules={[{ required: true, message: '请输入报告单元名称' }]}
        >
          <Input placeholder="请输入报告单元名称" />
        </Form.Item>
        <Form.Item label="序列号" name="sn" rules={[{ required: true, message: '请输入序列号' }]}>
          <Input placeholder="请输入序列号" />
        </Form.Item>
    
          <Form.Item
            name="labClassId"
            label="专业类别"
            rules={[{ required: true, message: '请输入选择专业类别' }]}
          >
            <Select
              placeholder="请选择专业类别"
              allowClear
            >
              {labClass.length > 0 &&
                labClass.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                ))}
            </Select>
          </Form.Item>
       
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
