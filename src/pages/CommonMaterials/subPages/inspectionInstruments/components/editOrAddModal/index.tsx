import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select } from 'antd';
import {
  addInstr,
  updateInstr,
  manageListSelect,
  oneLevelTypeModalSel,
} from '../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const {Option} = Select;
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [instrTypeList, setInstrTypeList] = useState([]);
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (record: { id: React.SetStateAction<undefined>; }) => {
      getManageList();
      getInstrTypeList();
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
    debugger
    form.validateFields().then((value) => {
      if (id) {
        updateInstr({ id: id, ...value }).then((res: { code: number; }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        addInstr({ ...value }).then((res: { code: number; }) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const getManageList = () => {
    manageListSelect().then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const getInstrTypeList = () => {
    oneLevelTypeModalSel({ type: 'YQYMLX' }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setInstrTypeList(res.data);
        }
      },
    );
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
      <Form form={form} {...layout} style={{paddingTop:'20px'}}>
        <Form.Item label="资产编号" name="assetsNo">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入资产编号"
          />
        </Form.Item>
        <Form.Item
          label="仪器型号"
          name="instType"
          rules={[{ required: true, message: '请输入仪器型号' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入仪器型号"
          />
        </Form.Item>
        <Form.Item
          label="仪器代号"
          name="instrCode"
          rules={[{ required: true, message: '请输入仪器代号' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入仪器代号"
          />
        </Form.Item>
        <Form.Item
          label="仪器名称"
          name="instrName"
          rules={[{ required: true, message: '请输入仪器名称' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入仪器名称"
          />
        </Form.Item>
        <Form.Item label="注册码" name="regCode">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入注册码" />
        </Form.Item>
        <Form.Item
          name="labClassManageId"
          label="管理分类"
          rules={[{ required: true, message: '请选择管理分类' }]}
        >
          <Select placeholder="请选择管理分类" autoComplete="off" allowClear>
            {list.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="pageTypeId"
          label="仪器类型"
          rules={[{ required: true, message: '请选择仪器类型' }]}
        >
          <Select placeholder="请选择仪器类型" autoComplete="off" allowClear>
            {instrTypeList.map((item) => {
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
