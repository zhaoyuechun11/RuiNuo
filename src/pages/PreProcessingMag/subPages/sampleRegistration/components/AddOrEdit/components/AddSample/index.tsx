import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { getDictList } from '../../../../../../models/server';
const { Option } = Select;

const AddSample = ({ refs }) => {
  const [form] = Form.useForm();
  const dialog = useRef();
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [sampleState, setSampleState] = useState([]);
  const dispatch = useDispatch();
  const { sampleList } = useSelector((state: any) => state.preProcessingMag);
  useImperativeHandle(refs, () => ({
    show: () => {
      dialog.current && dialog.current.show();
      form.resetFields();
      dictList({ type: 'BT' });
      dictList({ type: 'XZ' });
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      let flag = false;
      let list = [];
      let result = [];
      let endResult = [];
      list.push(value);

      if (sampleList.length > 0) {
        sampleList.forEach((item) => {
          if (item.sampleTypeId == value.sampleTypeId) {
            flag = true;
          }
        });
      }
      if (flag) {
        message.warning('已添加过该样本不可重复添加!');
        return;
      }

      list.push(...sampleList);
      list.filter((item) =>
        sampleTypeList.some((data) => {
          if (data.id == item.sampleTypeId) {
            result.push({ sampleTypeName: data.dictValue, ...item });
          }
        }),
      );
      result.filter((item) =>
        sampleState.some((data) => {
          if (data.id == item.sampleStateId) {
            endResult.push({ sampleStateName: data.dictValue, ...item });
          }
        }),
      );

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'sampleList',
          dataSource: endResult,
        },
      });

      dialog.current && dialog.current.hide();
    });
  };
  const dictList = (type) => {
    getDictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'BT') {
          setSampleTypeList(res.data);
        }
        if (type.type === 'XZ') {
          setSampleState(res.data);
        }
      }
    });
  };
  return (
    <Dialog
      ref={dialog}
      onCancel={() => {
        dialog.current && dialog.current.hide();
      }}
      onOk={onOk}
      width={640}
    >
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Row gutter={12}>
          <Col span={12}>
            <div id="sampleType">
              <Form.Item
                name="sampleTypeId"
                label="样本类型"
                rules={[{ required: true, message: '请输入样本类型' }]}
              >
                <Select
                  placeholder="请选择样本类型"
                  autoComplete="off"
                  allowClear
                  getPopupContainer={() => document.getElementById('sampleType')}
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
          </Col>
          <Col span={12}>
            <Form.Item name="cnt" label="样本数量">
              <InputNumber placeholder="请输入样本数量" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <div id="sampleStateId">
              <Form.Item
                name="sampleStateId"
                label="样本性状"
                rules={[{ required: true, message: '请输入样本性状' }]}
              >
                <Select
                  placeholder="请选择样本性状"
                  autoComplete="off"
                  allowClear
                  getPopupContainer={() => document.getElementById('sampleStateId')}
                >
                  {sampleState.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.dictValue}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <Form.Item name="specimenType" label="标本大小">
              <Input placeholder="请输入标本大小" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="labPurpose"
              label="检验目的"
              rules={[{ required: true, message: '请输入检验目的' }]}
            >
              <Input placeholder="请输入检验目的" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pathologyNo" label="原病理号">
              <Input placeholder="请输入原病理号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="lkNo" label="原蜡块号">
              <Input placeholder="请输入原蜡块号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pathologySampleSeqNo" label="病理样本序号">
              <Input placeholder="请输入病理样本序号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="sampleDesc" label="样本描述">
              <Input placeholder="请输入样本描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="separateBy" label="分离人">
              <Input placeholder="请输入分离人" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="sampleVolume" label="分离体积">
              <Input placeholder="请输入分离体积" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="separateDate" label="分离时间">
              <DatePicker showTime />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};

export default AddSample;
