import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, InputNumber } from 'antd';
import {
  //   reportProjectUpdate,
  //   oneLevelTypeModalSel,
  //   reportProjectAdd,
  oneLevelTypeModalSel,
  RPreferenceValueAdd,
  RPreferenceValueUpdate,
} from '../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const prompt = ['↑↑', '↓↓', '↑', '↓', '+', '*'];
const EditOrAddModal = ({ Ref, refresh, instrList, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [ageUnit, setAgeUnit] = useState([]);
  const [sex, setSex] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      getList({ type: 'BT' });
      getList({ type: 'AU' });
      getList({ type: 'SX' });
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
        RPreferenceValueUpdate({
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
        RPreferenceValueAdd({ ...value, labItemId: parent.id }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const projectCategoryChange = (val: any) => {};
  const getList = (type) => {
    oneLevelTypeModalSel(type).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          if (type.type === 'BT') {
            setSampleTypeList(res.data);
          }
          if (type.type === 'AU') {
            setAgeUnit(res.data);
          }
          if (type.type === 'SX') {
            setSex(res.data);
          }
        }
      },
    );
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
        <div id="sampleTypeId">
          <Form.Item
            name="sampleTypeId"
            label="样本类型"
            rules={[{ required: true, message: '请选择样本类型' }]}
          >
            <Select
              placeholder="请选择样本类型"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('sampleTypeId')}
            >
              {sampleTypeList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.dictValue}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="年龄" name="ageFrom" rules={[{ required: true, message: '请输入年龄' }]}>
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入年龄" />
        </Form.Item>
        <Form.Item
          name="ageFromUnitId"
          label="年龄单位从"
          rules={[{ required: true, message: '请选择年龄单位从' }]}
        >
          <Select placeholder="请选择年龄单位从" autoComplete="off" allowClear>
            {ageUnit.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="年龄到"
          name="ageTo"
          rules={[{ required: true, message: '请输入年龄到' }]}
        >
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入年龄到" />
        </Form.Item>
        <Form.Item
          name="ageToUnitId"
          label="年龄单位到"
          rules={[{ required: true, message: '请选择年龄单位到' }]}
        >
          <Select placeholder="请选择年龄单位到" autoComplete="off" allowClear>
            {ageUnit.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="sex" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
          <Select placeholder="请选择性别" autoComplete="off" allowClear>
            {sex.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="displayRef" label="显示参考范围">
          <InputNumber min={1} max={99} placeholder="请输入显示参考范围" />
        </Form.Item>
        <Form.Item
          name="highChar"
          label="上限提示字符"
          rules={[{ required: true, message: '请选择上限提示字符' }]}
        >
          <Select placeholder="请选择上限提示字符" autoComplete="off" allowClear>
            {prompt.map((item) => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="lowChar"
          label="下限提示字符"
          rules={[{ required: true, message: '请选择下限提示字符' }]}
        >
          <Select placeholder="请选择下限提示字符" autoComplete="off" allowClear>
            {prompt.map((item) => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="highValue" label="上限值">
          <InputNumber max={100} placeholder="请输入上限值" />
        </Form.Item>
        <Form.Item name="lowValue" label="下限值">
          <InputNumber min={0} max={100} placeholder="请输入下限值" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
