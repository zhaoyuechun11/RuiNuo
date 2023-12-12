import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, Select } from 'antd';
import { Dialog } from '@components';
import { useSelector } from 'umi';

import {
  dataGatherSetAdd,
  dataGatherSetUpdate,
  getQcListForLabClass,
} from '../../../../../../models/server';
const { Option } = Select;

const AddOrEditModal = ({ Ref, refresh }) => {
  const { collectionControl } = useSelector((state: any) => state.IndoorQualityControMsg);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [qcList, setQcList] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      getQcListForLabClassId({ labClassId: collectionControl.labClassId });
      form.resetFields();
      dialogRef.current && dialogRef.current.show();
      setId(val?.id);
      if (val) {
        form.setFieldsValue({
          ...val,
        });
      }
    },
  }));

  const onFinish = (value: any) => {
    let params = {
      ...value,
    };
    if (id) {
      dataGatherSetUpdate({ id, ...params }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      return;
    }

    dataGatherSetAdd({ ...params, instrId: collectionControl.instrId }).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const getQcListForLabClassId = (params: any) => {
    getQcListForLabClass(params).then((res) => {
      if (res.code === 200) {
        setQcList(res.data);
      }
    });
  };

  return (
    <Dialog
      ref={dialogRef}
      width={700}
      title={id ? '编辑' : '添加'}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} style={{ padding: '20px' }} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="sampleNo"
              label="样本号/质控位号"
              rules={[{ required: true, message: '请输入样本号/质控位号' }]}
            >
              <Input placeholder="请输入样本号/质控位号" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="qcId"
              label="质控品ID"
              rules={[{ required: true, message: '请选择质控品ID+质控水平+质控批号' }]}
            >
              <Select placeholder="请选择质控品ID+质控水平+质控批号" allowClear>
                {qcList.length > 0 &&
                  qcList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.id} {item.batchNo} {item.qcLevelName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default AddOrEditModal;
