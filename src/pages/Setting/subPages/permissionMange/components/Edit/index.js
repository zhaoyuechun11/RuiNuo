import React, { useRef, useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { Dialog } from '@components';
import { Form, Input, message } from 'antd';
import { updateAlias } from '../../models/server';

const AliasEdit = ({ cRef, refresh }) => {
  const [form] = Form.useForm();
  const modalRef = useRef();
  const permisCurrentRow = useRef();

  useImperativeHandle(cRef, () => ({
    show: (val) => {
      form.setFieldsValue({ cname: val.cname });
      permisCurrentRow.current = val;
      modalRef.current.show();
    },
  }));

  const onFinish = (values) => {
    const { id, parentId } = permisCurrentRow.current;
    const params = {
      ...values,
      id,
      parentId,
    };
    updateAlias(params).then((res) => {
      if (res.code == 200) {
        message.success('保存成功');
        modalRef.current.hide();
        refresh();
      }
    });
    return;
  };
  const onFinishFailed = (error) => {};
  return (
    <Dialog
      title={`${'编辑别名'}`}
      width={640}
      ref={modalRef}
      onCancel={() => modalRef.current.hide()}
      onOk={() => {
        form.submit();
      }}
    >
      <div style={{ width: '100%' }}>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          //   className={s.addRegistrationFrom}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="名称" name="cname" rules={[{ required: true, message: '请输入别名' }]}>
            <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入名称" />
          </Form.Item>
        </Form>
      </div>
    </Dialog>
  );
};
const maptoProps = ({ dispatch }) => {
  return { dispatch };
};
export default connect(maptoProps)(AliasEdit);
