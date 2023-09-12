import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, InputNumber } from 'antd';
import { commonResultsAdd, commonResultsUpdate } from '../../../../../../models/server';
const { Option } = Select;
const defaultValData = [
  { id: 'P', name: '阳性' },
  { id: 'NP', name: '弱阳性' },
  { id: 'N', name: '阴性' },
  { id: 'H', name: '偏高' },
  { id: 'L', name: '偏低' },
  { id: 'NOR', name: '正常' },
];
const InputGroup = Input.Group;
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      form.setFieldsValue({ projectCode: parent.shortName });
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
      width={320}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <div
        style={{
          borderBottom: '1px solid #1890ff',
          paddingBottom: '10px',
          margin: '20px 20px 0px 30px',
          display: 'flex',
        }}
      >
        项目代号:{parent?.shortName}
      </div>
      <Form form={form} style={{ padding: '20px' }}>
        <Form.Item
          name="result"
          label="常用结果"
          rules={[{ required: true, message: '请选择常用结果' }]}
        >
          <Input placeholder="请输入结果" />
        </Form.Item>
        <Form.Item
          name="resultFlag"
          label="结果标志"
          rules={[{ required: true, message: '请选择结果标志' }]}
        >
          <Select placeholder="请选择结果标志" allowClear>
            {defaultValData.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <InputGroup compact>
          <Form.Item label="快速录入码" name="shortCode" style={{ width: '59.7%' }}>
            <Input placeholder="请输入快速录入码" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="顺序" name="seq" style={{ width: '37%', marginLeft: '10px' }}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </InputGroup>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
