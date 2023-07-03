import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Row, Col, Input, Radio, message, Modal, Button, Checkbox } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import moment from 'moment';
import { Dialog, Icon } from '@components';
import style from './index.less';
import { addField } from '../../models/server';
const { confirm } = Modal;
const Index = ({ addFieldRef, refresh, enterprise_id, operator_id, id, resumeList }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisplay, setIsDisplay] = useState(2);
  const [isRequired, setIsRequired] = useState(2);
  const [names, setNames] = useState(['']);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [filedChoose, setFiledChoose] = useState(false);
  const [fileType, setFileType] = useState(1);
  useImperativeHandle(addFieldRef, () => ({
    showModal: showModal,
  }));

  const onBeforeShow = () => {
    setFiledChoose(false);
    form.setFieldsValue({
      name: '',
      is_display: false,
      is_required: false,
      names,
    });
  };
  const showModal = () => {
    dialogRef.current && dialogRef.current.show();
  };

  const onFinish = (values) => {
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      name: values.name,
      module_id: id,
      data_type: fileType,
      data_json: fileType === '3' ? JSON.stringify(values.names) : '',
      is_display: values.is_display ? 1 : 2,
      is_required: values.is_required ? 1 : 2,
    };
    addField(params).then((res) => {
      if (res.status_code === 200) {
        refresh && refresh();
        dialogRef.current && dialogRef.current.hide();
        message.success('添加成功!');
        setFileType(1);
      }
    });
  };

  const typeChoose = (e) => {
    setFileType(e.target.value);
    e.target.value === '3' ? setFiledChoose(true) : setFiledChoose(false);
  };
  const interval = (item, value) => {
    if (value.length > 20) {
      return Promise.reject(new Error('不能大于20个字符哦'));
    }
    let result = '';
    resumeList.forEach((element) => {
      element.structure.forEach((e) => {
        if (value === e.name) {
          result = value;
        }
      });
    });
    if (result !== '') {
      return Promise.reject(new Error('字段名称不允许重复创建'));
    }
    return Promise.resolve();
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  return (
    <Fragment>
      <Dialog
        ref={dialogRef}
        maskClosable={false}
        width={640}
        title="新增字段"
        destroyOnClose={true}
        confirmLoading={loading}
        visible={visible}
        onBeforeShow={onBeforeShow}
        onCancel={() => {
          dialogRef.current && dialogRef.current.hide();
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          layout="vertical"
          style={{ margin: '40px 30px' }}
          onFinish={onFinish}
        >
          <div style={{ fontWeight: '500' }}>字段类型</div>
          <Row span={24}>
            <Col span={24}>
              <Radio.Group
                defaultValue="1"
                buttonStyle="solid"
                style={{ marginTop: 10, marginBottom: 10 }}
                onChange={typeChoose}
              >
                <Radio.Button value="1" style={{ marginRight: '10px', marginBottom: '10px' }}>
                  单行文本
                </Radio.Button>
                <Radio.Button value="2" style={{ marginRight: '10px' }}>
                  多行文本
                </Radio.Button>
                <Radio.Button value="3" style={{ marginRight: '10px' }}>
                  自定义选择器
                </Radio.Button>
                <Radio.Button value="4" style={{ marginRight: '10px' }}>
                  时间选择器
                </Radio.Button>
                <Radio.Button value="5" style={{ marginRight: '10px' }}>
                  民族选择器
                </Radio.Button>
                <Radio.Button value="6" style={{ marginRight: '10px' }}>
                  区域选择器
                </Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row span={24}>
            <Col span={24}>
              <Form.Item label="字段名称" name="name" rules={[{ validator: interval }]}>
                <Input
                  placeholder="请输入字段名称，1-20个字符"
                  style={{ border: '1px solid #e7e9eb' }}
                />
              </Form.Item>
            </Col>
          </Row>
          {filedChoose ? (
            <Row>
              <Col span={24}>
                <Form.List name="names">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                          label={index === 0 ? '字段选项' : ''}
                          required={false}
                          key={field.key}
                        >
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '字段选项必填哦',
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="请输入字段选项"
                              style={{ width: '92%', marginRight: '8px' }}
                            />
                          </Form.Item>
                          <PlusOutlined onClick={() => add()} style={{ marginRight: '10px' }} />
                          {index === 0 ? null : (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                            />
                          )}
                        </Form.Item>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          ) : (
            ''
          )}
          <Row span={24}>
            <Col span={11}>
              <Form.Item
                name="is_display"
                style={{ marginTop: 0, marginBottom: 0 }}
                valuePropName="checked"
              >
                <Checkbox
                  className={style.round}
                  onChange={(val) => {
                    let checked = val.target.checked;
                    setIsDisplay(checked);
                  }}
                >
                  字段显示
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="is_required"
                style={{ marginTop: 0, marginBottom: 0 }}
                valuePropName="checked"
              >
                <Checkbox
                  className={style.round}
                  onChange={(val) => {
                    let checked = val.target.checked;
                    setIsRequired(checked);
                  }}
                >
                  字段必填
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = ({ global: { enterprise_id, operator_id } }) => {
  return {
    enterprise_id,
    operator_id,
  };
};
export default connect(mapStateToProps)(Index);
