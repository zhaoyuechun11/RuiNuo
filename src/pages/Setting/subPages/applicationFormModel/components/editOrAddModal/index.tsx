import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'umi';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const EditOrAddModal = ({ Ref, refresh, type }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const dispatch = useDispatch();
  useImperativeHandle(Ref, () => ({
    show: (record: { id: React.SetStateAction<undefined> }) => {
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
        dispatch({
          type: 'Setting/mainEnterPageUpdate',
          payload: {
            ...value,
            id,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('修改成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
        });
      } else {
        dispatch({
          type:
            type === 1
              ? 'Setting/mainEnterPageAdd'
              : type === 2
              ? 'Setting/addReportMainData'
              : type === 3
              ? 'Setting/addReportMainDataDetail'
              : type === 5
              ? 'Setting/fetchReportComQueryAdd'
              : 'Setting/reportListModalAdd',
          payload: {
            ...value,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('添加成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
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
      <Form form={form} {...layout} style={{ paddingTop: '20px' }}>
        <Form.Item label="模块名" name="name">
          <Input placeholder="请输入模块名" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
