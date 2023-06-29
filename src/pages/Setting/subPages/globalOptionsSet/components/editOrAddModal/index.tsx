import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select } from 'antd';
import { paramsSetAdd, paramsSetUpdate } from '../../../../models/server';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const EditOrAddModal = ({ Ref, refresh, paramTypeList }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      dialogRef.current && dialogRef.current.show();
      if (record) {
        form.setFieldsValue({ ...record });
        setId(record.id);
      } else {
        setId(null);
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
        paramsSetUpdate({ id: id, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        paramsSetAdd({ ...value }).then((res) => {
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
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item label="参数编码" name="code">
          <Input placeholder="请输入参数编码" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="顺序" name="seq">
          <Input placeholder="请输入顺序" />
        </Form.Item>
        <Form.Item label="参数值1" name="value1">
          <Input placeholder="请输入参数值1" />
        </Form.Item>
        <Form.Item label="参数值2" name="value2">
          <Input placeholder="请输入参数值2" />
        </Form.Item>
        <Form.Item label="参数值3" name="value3">
          <Input placeholder="请输入参数值3" />
        </Form.Item>
        <Form.Item name="paramTypeId" label="参数类别">
          <Select placeholder="请选择类别" allowClear showSearch disabled={id ? true : false}>
            {paramTypeList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
