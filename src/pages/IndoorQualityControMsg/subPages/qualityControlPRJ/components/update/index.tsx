import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { message, Form, Select, Input } from 'antd';
import { instrReqItemUpdate } from '../../../../models/server';
const { Option } = Select;
const qcFlag = [
  {
    name: '是',
    id: 1,
  },
  {
    name: '否',
    id: 0,
  },
];
const qcInuse = [
  {
    name: '是',
    id: 1,
  },
  {
    name: '否',
    id: 0,
  },
];
const Update = ({ Ref, refresh }) => {
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      form.resetFields();
      setId(val.id);
      form.setFieldsValue({ ...val, qcFlag: val.qcFlag ? 1 : 0, qcInuse: val.qcInuse ? 1 : 0 });
      dialogRef.current && dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));

  const onOk = () => {
    form.validateFields().then((value) => {
      instrReqItemUpdate({ id, ...value }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      debugger;
    });
    // instrReqItemAdd({ instrId, itemIds: selectedRowKeysVal }).then((res) => {
    //   if (res.code === 200) {
    //     message.success('绑定成功!');
    //     dialogRef.current && dialogRef.current.hide();
    //     refresh();
    //   }
    // });
  };

  return (
    <Dialog ref={dialogRef} width={640} title={'修改'} onOk={onOk}>
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Form.Item label="是否质控项" name="qcFlag">
          <Select placeholder="请选择是否质控项" allowClear>
            {qcFlag.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="质控项是否在用" name="qcInuse">
          <Select placeholder="请选择质控项是否在用" allowClear>
            {qcFlag.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="打印顺序"
          name="seq"
          rules={[{ required: true, message: '请输入打印顺序' }]}
        >
          <Input placeholder="请输入打印顺序" type="number" />
        </Form.Item>
        <Form.Item label="质控数据上报代码" name="uploadCode">
          <Input placeholder="请输入质控数据上报代码" />
        </Form.Item>
        <Form.Item label="允许最大CV %" name="maxCv">
          <Input placeholder="请输入允许最大CV %" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default Update;
