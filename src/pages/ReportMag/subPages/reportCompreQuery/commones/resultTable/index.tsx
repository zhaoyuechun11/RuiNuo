import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Select, message, Form } from 'antd';

const { Option } = Select;

const ResultTable = ({ Ref }) => {
  const [form] = Form.useForm();
  const dialogRef = useRef();
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
    },
  }));

  const onOk = () => {};
  return (
    <Dialog ref={dialogRef} title={'表格式模版'} onOk={onOk}>
      <Form layout="inline" form={form} style={{ padding: '10px' }}>
        <Form.Item name="sampleBarcode" label="结果表格式模版">
          <Select style={{ width: 200 }}>
            <Option>555</Option>
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default ResultTable;
