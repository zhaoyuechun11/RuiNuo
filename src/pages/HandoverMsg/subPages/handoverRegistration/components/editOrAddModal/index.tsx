import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import s from '../../../index.less';
//import { getManageGroupAdd, updateManageGroup } from '../../../../models/server';
//import ColorPicker from '@/pages/CommonMaterials/commones/colorPicker';

const { TextArea } = Input;
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [record, setRecord] = useState({});
  const [names, setNames] = useState(['']);
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
        form.setFieldsValue({
          names: [''],
        });
        setTimeout(() => {
          var testTarget = document.getElementsByClassName('ant-select-selection-item')[0]; // 我们想要取到的第一个
          testTarget.innerHTML = '请选择抄送部门';
        }, 500);
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      debugger;
      // if (id) {
      //   updateManageGroup({ id: id, ...value }).then((res) => {
      //     if (res.code === 200) {
      //       message.success('修改成功');
      //       dialogRef.current && dialogRef.current.hide();
      //       refresh();
      //     }
      //   });
      // } else {
      //   getManageGroupAdd({ ...value }).then((res) => {
      //     if (res.code === 200) {
      //       message.success('添加成功');
      //       dialogRef.current && dialogRef.current.hide();
      //       refresh();
      //     }
      //   });
      // }
    });
  };
  // const onFinish = (values) => {
  //   console.log('Received values of form:', values);
  // };
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
      <Form layout="vertical" form={form} className={s.form_box}>
        <Form.Item name="labClassId" label="处理部门">
          <Select placeholder="请选择处理部门" allowClear>
            {/* {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))} */}
          </Select>
        </Form.Item>
        <Form.List name="names">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item label={index === 0 ? '抄送部门' : ''} required={false} key={field.key}>
                  <Form.Item {...field} noStyle className={`formList${index}`}>
                    <Select
                      placeholder="请选择抄送部门"
                      allowClear
                      style={{ width: '90%', marginRight: '8px' }}
                    ></Select>
                  </Form.Item>
                  <PlusOutlined onClick={() => add()} style={{ marginRight: '10px' }} />
                  {index === 0 ? null : (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
        <Form.Item name="labClassId" label="问题类型">
          <Select placeholder="请选择问题类型" allowClear>
            {/* {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))} */}
          </Select>
        </Form.Item>
        <Form.Item
          label="客户条码"
          name="code"
          rules={[{ required: true, message: '请输入code值' }]}
        >
          <Input placeholder="请输入code值" />
        </Form.Item>
        <Form.Item
          label="客户名称"
          name="name"
          rules={[{ required: true, message: '请输入code值' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="交接内容" name="color">
          <TextArea />
        </Form.Item>
        <Input.Group compact>
          <Form.Item name="labClassId" label="是否紧急" className={s.compact_left}>
            <Select placeholder="请选择是否紧急" allowClear>
              {/* {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="操作人" name="name" className={s.compact_rignt}>
            <Input placeholder="请输入名称" disabled />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item label="操作部门" name="name" className={s.compact_left}>
            <Input placeholder="请输入名称" disabled />
          </Form.Item>
          <Form.Item label="操作时间" name="name" className={s.compact_rignt}>
            <DatePicker format="YYYY-MM-DD" disabled />
          </Form.Item>
        </Input.Group>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
