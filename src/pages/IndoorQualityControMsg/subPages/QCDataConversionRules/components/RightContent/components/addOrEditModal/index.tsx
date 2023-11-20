import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, Select } from 'antd';
import { Dialog } from '@components';
import { useSelector } from 'umi';

import {
  convertRuleAdd,
  convertRuleUpdate,
  getQcListForInstr,
} from '../../../../../../models/server';
const { Option } = Select;
const conKindList = [
  {
    name: '结果等于=',
  },
  {
    name: '结果>',
  },
  {
    name: '结果>=',
  },
  {
    name: '结果<',
  },
  {
    name: '结果<=',
  },
  {
    name: '结果包含',
  },
  {
    name: '结果开头等于',
  },
  {
    name: '结果结尾=',
  },
  {
    name: '代码(编程人员专用）',
  },
];
const transKindList = [{ name: '则结果直接=' }, { name: '则包含字符替换为代码(编程人员专用)' }];
const AddOrEditModal = ({ Ref, refresh }) => {
  const { leftMenuParamsDCRules } = useSelector((state: any) => state.IndoorQualityControMsg);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [qcList, setQcList] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      getQcListForInstrData({ instrId: leftMenuParamsDCRules.instrId });
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
      convertRuleUpdate({ id, ...params }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      return;
    }

    convertRuleAdd({ ...params, instrId: leftMenuParamsDCRules.instrId }).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const getQcListForInstrData = (params: any) => {
    getQcListForInstr(params).then((res) => {
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
              name="itemId"
              label="规则应用对象"
              rules={[{ required: true, message: '请选择规则应用对象' }]}
            >
              <Select placeholder="请选择规则应用对象" allowClear disabled={id ? true : false}>
                {qcList.length > 0 &&
                  qcList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.itemName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="seq"
              label="优先级"
              rules={[{ required: true, message: '请输入优先级' }]}
            >
              <Input placeholder="请输入优先级" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <Form.Item
              name="conKind"
              label="转换条件"
              rules={[{ required: true, message: '请选择转换条件' }]}
            >
              <Select placeholder="请选择转换条件" allowClear>
                {conKindList.map((item, index) => (
                  <Option value={item.name} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="conParam1"
              label="条件取值1"
              rules={[{ required: true, message: '请输入条件取值1' }]}
            >
              <Input placeholder="请输入条件取值1" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="transKind"
              label="处理方式"
              rules={[{ required: true, message: '请选择处理方式' }]}
            >
              <Select placeholder="请选择处理方式" allowClear>
                {transKindList.map((item, index) => (
                  <Option value={item.name} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="transParam1" label="处理方式1">
              <Input placeholder="请输入处理方式取值1" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default AddOrEditModal;
