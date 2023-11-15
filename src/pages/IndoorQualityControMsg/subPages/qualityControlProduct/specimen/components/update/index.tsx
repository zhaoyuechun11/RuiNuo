import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { message, Form, Select, Input } from 'antd';
import { controlsItemUpdate } from '../../../../../models/server';
import { dictList } from '@/models/server';
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
const reportFlag = [
  {
    id: 1,
    name: '是',
  },
  {
    id: 0,
    name: '否',
  },
];
const Update = ({ Ref, refresh }) => {
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const [id, setId] = useState();
  const [testMethod, setTestMethod] = useState([]);
  const [vendor, setVendor] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      getList({ type: 'FF' });
      getList({ type: 'QCVENDOR' });
      form.resetFields();
      setId(val.id);
      form.setFieldsValue({ ...val, checkReportFlag: val.checkReportFlag ? 1 : 0, });
      dialogRef.current && dialogRef.current.show();
    },
  }));

  const onOk = () => {
    form.validateFields().then((value) => {
      controlsItemUpdate({ id, ...value }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
    });
  };
  const getList = (type: { type: string }) => {
    dictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'FF') {
          setTestMethod(res.data);
        } else {
          setVendor(res.data);
        }
      }
    });
  };
  return (
    <Dialog ref={dialogRef} width={640} title={'修改'} onOk={onOk}>
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Form.Item name="checkReportFlag" label="是否存在报告依据">
          <Select placeholder="请选择是否存在报告依据" allowClear>
            {reportFlag.length > 0 &&
              reportFlag.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="序号" name="seq">
          <Input placeholder="请输入序号" type="number" />
        </Form.Item>

        <Form.Item label="允许最大CV %" name="maxCv">
          <Input placeholder="请输入允许最大CV %" />
        </Form.Item>
        <Form.Item name="reagentManufacturerId" label="试剂厂商">
          <Select placeholder="请选择试剂厂商" allowClear>
            {vendor.length > 0 &&
              vendor.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="reagentVendorId" label="试剂供应商">
          <Select placeholder="请选择试剂供应商" allowClear>
            {vendor.length > 0 &&
              vendor.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="method" label="检测方法">
          <Select
            placeholder="请选择检测方法"
            // showSearch
            allowClear
            // showArrow={false}
          >
            {testMethod.map((item) => {
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
export default Update;
