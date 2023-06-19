import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, InputNumber } from 'antd';
import { commonResultsAdd, commonResultsUpdate } from '../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const defaultValData = [
  { id: 'P', name: '阳性' },
  { id: 'NP', name: '弱阳性' },
  { id: 'N', name: '阴性' },
  { id: 'H', name: '偏高' },
  { id: 'L', name: '偏低' },
  { id: 'NOR', name: '正常' },
];
const EditOrAddModal = ({ Ref, refresh, instrList, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();

      if (record) {
        form.setFieldsValue({
          ...record,
        });
        setId(record.id);
      } else {
        setId(null);
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        commonResultsUpdate({
          id: id,
          labItemId: parent.id,
          ...value,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        commonResultsAdd({ ...value, labItemId: parent.id }).then((res: { code: number }) => {
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
      width={864}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item label="仪器" name="instrId" rules={[{ required: true, message: '请选择仪器' }]}>
          <Select
            placeholder="请选择仪器"
            autoComplete="off"
            allowClear
            // onChange={projectCategoryChange}
          >
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="resultFlag" label="结果标志" rules={[{ required: true, message: '请选择结果标志' }]}>
          <Select
            placeholder="请选择结果标志"
            autoComplete="off"
            allowClear
            // onChange={handleChangeSelect}
          >
            {defaultValData.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="快速录入码"
          name="shortCode"
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入快速录入码"
          />
        </Form.Item>
        <Form.Item label="顺序" name="seq">
          <InputNumber />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
