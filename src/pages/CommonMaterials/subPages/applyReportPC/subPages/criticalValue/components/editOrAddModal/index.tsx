import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, InputNumber, Row, Col, Checkbox } from 'antd';
import s from './index.less';
import styles from '../../../criticalReference.less';
import {
  oneLevelTypeModalSel,
  RPCriticalValueAdd,
  RPCriticalValueUpdate,
} from '../../../../../../models/server';
import { useSelector } from 'umi';

const { Option } = Select;
const InputGroup = Input.Group;
const prompt = ['↑↑', '↓↓', '↑', '↓', '+', '*'];
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
        RPCriticalValueUpdate({
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
        RPCriticalValueAdd({ ...value, labItemId: parent.id }).then((res: { code: number }) => {
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
          borderBottom: '1px solid #1890ff',
          paddingBottom: '10px',
          margin: '20px 40px 0px 20px',
          display: 'flex',
        }}
      >
        <div>检验仪器: {selecteInstr}</div>
        <div style={{ marginLeft: '220px' }}>项目代号:{parent?.shortName}</div>
      </div>
      <Form form={form} layout="vertical" style={{ padding: '20px' }} className={styles.form_box}>
        <Row gutter={24}>
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
                <Select placeholder="请选择样本类型" allowClear className={styles.sampleType}>
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
                <Select placeholder="请选择性别" allowClear className={styles.sex}>
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
                <Input maxLength={10} placeholder="请输入年龄" className={styles.age} />
              </Form.Item>

              <Form.Item
                name="ageFromUnitId"
                rules={[{ required: true, message: '请选择年龄单位从' }]}
                label="年龄单位"
              >
                <Select placeholder="年龄单位" allowClear className={styles.ageUnit}>
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
          <Col span={1} className={styles.arrow}>
            <span>{`<`}</span>
          </Col>
          <Col span={1} className={styles.line}>
            <span></span>
          </Col>
          <Col span={1} className={styles.arrow}>
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
                <Input maxLength={10} placeholder="请输入年龄到" className={styles.ageTo} />
              </Form.Item>
              <Form.Item
                name="ageToUnitId"
                label="年龄单位"
                rules={[{ required: true, message: '请选择年龄单位到' }]}
              >
                <Select placeholder="年龄单位" allowClear className={styles.ageToUnit}>
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
            <InputGroup compact className={styles.highGroup}>
              <Form.Item name="highValue" label="危急上限值">
                <InputNumber max={100} placeholder="请输入上限值" className={styles.highVal} />
              </Form.Item>
              <Form.Item
                name="highChar"
                label="上限提示字符"
                rules={[{ required: true, message: '请选择上限提示字符' }]}
              >
                <Select placeholder="请选择上限提示字符" allowClear className={styles.highChar}>
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
          <Col span={1} className={`${styles.arrow} ${styles.hight_low}`}>
            <span>{`<`}</span>
          </Col>
          <Col span={1} className={styles.line}>
            <span></span>
          </Col>
          <Col span={1} className={`${styles.arrow} ${styles.hight_low}`}>
            {' '}
            <span>{`>`}</span>
          </Col>
          <Col span={9}>
            <InputGroup compact>
              <Form.Item name="lowValue" label="危急下限值">
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="请输入下限值"
                  className={styles.lowValue}
                />
              </Form.Item>
              <Form.Item
                name="lowChar"
                label="下限提示字符"
                rules={[{ required: true, message: '请选择下限提示字符' }]}
              >
                <Select placeholder="请选择下限提示字符" allowClear className={styles.lowChar}>
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
          <Col span={8} className={s.daysApart}>
            <Form.Item label="最近两次结果相隔天数">
              <InputNumber
                min={1}
                max={99}
                placeholder="请输入最近两次结果相隔天数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={1} className={s.padding_right}></Col>
          <Col span={1} className={styles.line}>
            <span></span>
          </Col>
          <Col span={1} className={`${styles.arrow} ${s.right_arrow}`}>
            {' '}
            <span>{`>`}</span>
          </Col>
          <Col span={9} className={s.difference}>
            <Form.Item label="最近两次结果不可能的差值">
              <InputNumber
                min={1}
                max={99}
                placeholder="最近两次结果不可能的差值"
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
