import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Row, Col, Input, message, Modal, Button, Checkbox, Card } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import moment from 'moment';
import { Dialog, Icon } from '@components';
import style from '../addField/index.less';
import { updateField } from '../../models/server';
const { confirm } = Modal;

const Index = ({ editFieldRef, fieldInfo, refresh, enterprise_id, operator_id }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleText, setVisibleText] = useState('');
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [filedChoose, setFiledChoose] = useState(false);
  useImperativeHandle(editFieldRef, () => ({
    showModal: showModal,
  }));
  useEffect(() => {
    if (fieldInfo != null) {
      form.setFieldsValue({
        name: fieldInfo.name,
        data_type:
          (fieldInfo.data_type === 1 && '单行文本') ||
          (fieldInfo.data_type === 2 && '多行文本') ||
          (fieldInfo.data_type === 3 && '自定义选择器') ||
          (fieldInfo.data_type === 4 && '时间选择器') ||
          (fieldInfo.data_type === 5 && '民族选择器') ||
          (fieldInfo.data_type === 6 && '区域选择器') ||
          (fieldInfo.data_type === 7 && '系统选择器'),
        is_display: fieldInfo.is_display === 1 ? true : false,
        is_required: fieldInfo.is_required === 1 ? true : false,
        data_json: fieldInfo.json,
        data_json1: [''],
      });
    }
  }, [fieldInfo]);
  const onBeforeShow = () => {};
  const showModal = () => {
    dialogRef.current && dialogRef.current.show();
  };

  const onFinish = (values) => {
    //return
    //setLoading(true);
    let result = values.data_json1;
    let field = values.data_json;
    let concatResult = [];
    if (field) {
      concatResult = field.concat(result);
    }
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      name: values.name,
      id: fieldInfo.id,
      data_type: fieldInfo.data_type,
      data_json: fieldInfo.data_type === 3 ? JSON.stringify(concatResult) : '',
      is_display: values.is_display ? 1 : 2,
      is_required: values.is_required ? 1 : 2,
    };
    updateField(params).then((res) => {
      if (res.status_code === 200) {
        refresh && refresh();
        dialogRef.current && dialogRef.current.hide();
        message.success('编辑成功!');
      }
    });
  };

  const typeChoose = (e) => {
    e.target.value === '3' ? setFiledChoose(true) : setFiledChoose(false);
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
  const interval = (item, value) => {
    if (value.length > 20) {
      return Promise.reject(new Error('不能大于20个字符哦'));
    }
    return Promise.resolve();
  };
  return (
    <Fragment>
      <Dialog
        ref={dialogRef}
        maskClosable={false}
        width={640}
        title="编辑字段"
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
          <Row span={24}>
            <Col span={24}>
              <Form.Item label="字段类型" name="data_type">
                <Input placeholder="请输入字段类型" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row span={24}>
            <Col span={24}>
              <Form.Item label="字段名称" name="name" rules={[{ validator: interval }]}>
                <Input
                  placeholder="请输入字段名称，1-6个字符"
                  style={{ border: '1px solid #e7e9eb' }}
                />
              </Form.Item>
            </Col>
          </Row>
          {fieldInfo && fieldInfo.data_type === 3 ? (
            <Row>
              <Col span={24}>
                <Form.List name="data_json">
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
                              style={{ width: '100%' }}
                              disabled
                            />
                          </Form.Item>
                        </Form.Item>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
              <Col span={24}>
                <Form.List name="data_json1">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                          required={false}
                          key={field.key}
                        >
                          <Form.Item
                            {...field}
                            // validateTrigger={['onChange', 'onBlur']}
                            // rules={[
                            //   {
                            //     required: true,
                            //     whitespace: true,
                            //     message:
                            //       "Please input passenger's name or delete this field.",
                            //   },
                            // ]}
                            noStyle
                          >
                            <Input
                              placeholder="请输入字段选项"
                              style={{ width: '91%', marginRight: '10px' }}
                            />
                          </Form.Item>
                          <PlusOutlined
                            onClick={() => add()}
                            style={{ marginRight: index === 0 ? '' : '10px' }}
                          />
                          {/* {fields.length != 1 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                            />
                          ) : null} */}
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
                <Checkbox className={style.round}>字段显示</Checkbox>
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="is_required"
                style={{ marginTop: 0, marginBottom: 0 }}
                valuePropName="checked"
              >
                <Checkbox className={style.round}>字段必填</Checkbox>
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
