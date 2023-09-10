import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, InputNumber, Row, Col, Checkbox } from 'antd';

import {
  oneLevelTypeModalSel,
  RPreferenceValueAdd,
  RPreferenceValueUpdate,
} from '../../../../../../models/server';
import styles from './index.less';
import { useSelector } from 'umi';

const { Option } = Select;
const prompt = ['↑↑', '↓↓', '↑', '↓', '+', '*'];
const InputGroup = Input.Group;
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [ageUnit, setAgeUnit] = useState([]);
  const [sex, setSex] = useState([]);
  const { instrList, instrId } = useSelector((state: any) => state.commonMaterials);
  const [selecteInstr, setSelecteInstr] = useState();

  useImperativeHandle(Ref, () => ({
    show: (record: any) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      getList({ type: 'BT' });
      getList({ type: 'AU' });
      getList({ type: 'SX' });
      getInstr();

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
  const highValueChange = (e) => {
    if (form.getFieldValue('lowValue') && e) {
      form.setFieldsValue({ displayRef: form.getFieldValue('lowValue') + '-' + e });
    }
    if (form.getFieldValue('lowValue') && !e) {
      form.setFieldsValue({ displayRef: form.getFieldValue('lowValue') });
    }
  };
  const lowValueChange = (e) => {
    if (form.getFieldValue('highValue') && e) {
      form.setFieldsValue({ displayRef: e + '-' + form.getFieldValue('highValue') });
    }
    if (form.getFieldValue('highValue') && !e) {
      form.setFieldsValue({ displayRef: form.getFieldValue('highValue') });
    }
  };
  const getInstr = () => {
    let result = instrList.filter((item: any) => item.id == instrId);
    setSelecteInstr(result[0]?.instrName);
  };
  return (
    <Dialog
      ref={dialogRef}
      width={680}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <div
        style={{
          borderBottom: '1px solid #cecede',
          paddingBottom: '10px',
          margin: '20px 55px 0',
          display: 'flex',
        }}
      >
        <div>检验仪器: {selecteInstr}</div>
        <div style={{ marginLeft: '320px' }}>项目代号:{parent?.shortName}</div>
      </div>

      <Form form={form} layout="vertical" style={{ padding: '20px' }} className={styles.form_box}>
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item
              label="仪器"
              name="instrId"
              rules={[{ required: true, message: '请选择仪器' }]}
            >
              <Select placeholder="请选择仪器" autoComplete="off" allowClear>
                {instrList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.instrName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={14}>
            <InputGroup compact>
              <Form.Item>
                <Checkbox>
                  <div>参考值与样</div>
                  <div>本类型有关</div>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="sampleTypeId"
                label="样本类型"
                rules={[{ required: true, message: '请选择样本类型' }]}
              >
                <Select placeholder="请选择样本类型" allowClear style={{ width: 206 }}>
                  {sampleTypeList.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.dictValue}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
          <Col span={1}></Col>
          <Col span={9}>
            <InputGroup compact>
              <Form.Item>
                <Checkbox>
                  <div>参考值与</div>
                  <div>性别有关</div>
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="sex"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别" allowClear style={{ width: 120 }}>
                  {sex.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.dictValue}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <InputGroup compact>
              <Form.Item>
                <Checkbox>
                  <div>参考值与</div>
                  <div>年龄有关</div>
                </Checkbox>
              </Form.Item>
              <Form.Item
                label="年龄"
                name="ageFrom"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input
                  maxLength={10}
                  placeholder="请输入年龄"
                  style={{ width: 90, marginRight: '10px', marginLeft: '10px' }}
                />
              </Form.Item>

              <Form.Item
                name="ageFromUnitId"
                rules={[{ required: true, message: '请选择年龄单位从' }]}
                label="年龄单位"
              >
                <Select placeholder="年龄单位" allowClear style={{ width: 110 }}>
                  {ageUnit.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.dictValue}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
          <Col span={1} style={{ lineHeight: '86px' }}>
            <span>{`<`}</span>
          </Col>
          <Col span={1} style={{ padding: 0 }}>
            <span
              style={{
                borderBottom: '1px solid #000',
                display: 'block',
                marginTop: '44px',
              }}
            ></span>
          </Col>
          <Col span={1} style={{ lineHeight: '86px' }}>
            {' '}
            <span>{`>`}</span>
          </Col>
          <Col span={9}>
            <InputGroup compact>
              <Form.Item
                label="年龄到"
                name="ageTo"
                rules={[{ required: true, message: '请输入年龄到' }]}
              >
                <Input maxLength={10} placeholder="请输入年龄到" style={{ width: 90 }} />
              </Form.Item>
              <Form.Item
                name="ageToUnitId"
                label="年龄单位"
                rules={[{ required: true, message: '请选择年龄单位到' }]}
              >
                <Select
                  placeholder="年龄单位"
                  allowClear
                  style={{ width: 110, marginLeft: '10px' }}
                >
                  {ageUnit.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.dictValue}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <InputGroup compact style={{ marginLeft: '100px' }}>
              <Form.Item name="highValue" label="上限值">
                <InputNumber
                  max={100}
                  placeholder="请输入上限值"
                  style={{ width: 90 }}
                  onChange={highValueChange}
                />
              </Form.Item>
              <Form.Item
                name="highChar"
                label="上限提示字符"
                rules={[{ required: true, message: '请选择上限提示字符' }]}
              >
                <Select
                  placeholder="请选择上限提示字符"
                  allowClear
                  style={{ width: 110, marginLeft: '10px' }}
                >
                  {prompt.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
          <Col span={1} style={{ lineHeight: '86px', paddingLeft: '10px' }}>
            <span>{`<`}</span>
          </Col>
          <Col span={1} style={{ padding: 0 }}>
            <span
              style={{
                borderBottom: '1px solid #000',
                display: 'block',
                marginTop: '44px',
              }}
            ></span>
          </Col>
          <Col span={1} style={{ lineHeight: '86px', paddingLeft: '10px' }}>
            {' '}
            <span>{`>`}</span>
          </Col>
          <Col span={9}>
            <InputGroup compact>
              <Form.Item name="lowValue" label="下限值">
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="请输入下限值"
                  style={{ width: 90 }}
                  onChange={lowValueChange}
                />
              </Form.Item>
              <Form.Item
                name="lowChar"
                label="下限提示字符"
                rules={[{ required: true, message: '请选择下限提示字符' }]}
              >
                <Select
                  placeholder="请选择下限提示字符"
                  allowClear
                  style={{ width: 110, marginLeft: '10px' }}
                >
                  {prompt.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </InputGroup>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item name="sex" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select placeholder="请选择性别" allowClear>
                {sex.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={20} style={{ marginLeft: 100, width: '82%' }}>
            <Form.Item label="显示参考范围">
              <InputNumber
                min={1}
                max={99}
                placeholder="请输入显示参考范围"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
