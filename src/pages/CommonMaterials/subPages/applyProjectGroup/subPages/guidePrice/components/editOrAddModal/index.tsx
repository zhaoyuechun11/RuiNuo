import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Select, message, InputNumber } from 'antd';
import {
  oneLevelTypeModalSel,
  guidPriceAddBind,
  guidPriceUpdateBind,
} from '../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [type, setType] = useState();
  const [priceTypeList, setPriceTypeList] = useState();
  const id = useRef();
  useImperativeHandle(Ref, () => ({
    show: (record, val, Pid) => {
      setType(val);
      List(parent.id);
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
        guidPriceAddBind({ reqItemId: parent.id, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        guidPriceUpdateBind({ id: id.current, reqItemId: parent.id, ...value }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };
  const List = (id: any) => {
    oneLevelTypeModalSel({ reqItemId: id, type: 'JZJLB' }).then(
      (res: { code: number; data: React.SetStateAction<undefined> }) => {
        if (res.code === 200) {
          setPriceTypeList(res.data);
        }
      },
    );
  };

  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={type === 'edit' ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form form={form} {...layout} style={{ marginTop: '20px' }}>
        {/* <Form.Item label="顺序" name="dictCode" rules={[{ required: true, message: '请输入顺序' }]}>
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入顺序" />
        </Form.Item> */}
        <Form.Item
          label="价格"
          name="standardPrice"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber placeholder="请输入价格" />
        </Form.Item>
        <Form.Item name="feeTypeId" label="基准价类别">
          <Select placeholder="请选择基准价类别" autoComplete="off" allowClear>
            {priceTypeList?.map((item) => {
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
