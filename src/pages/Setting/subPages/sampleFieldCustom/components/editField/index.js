// @ts-nocheck
import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Row, Col, Input, message, Modal, Checkbox, Cascader, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'umi';
import moment from 'moment';
import { Dialog } from '@components';
import style from '../addField/index.less';
import { updateField, getArea } from '../../models/server';

const Index = ({ editFieldRef, refresh, from }) => {
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [provinceList, setProvinceList] = useState([]);
  const info = useRef();
  const dispatch = useDispatch();
  useImperativeHandle(editFieldRef, () => ({
    showModal: (fieldInfo) => {
      dialogRef.current.show();
      info.current = fieldInfo;
      form.setFieldsValue({
        name: fieldInfo.name,
        data_type:
          (fieldInfo.dataType === 1 && '单行文本') ||
          (fieldInfo.dataType === 2 && '多行文本') ||
          (fieldInfo.dataType === 3 && '自定义选择器') ||
          (fieldInfo.dataType === 4 && '时间选择器') ||
          (fieldInfo.dataType === 5 && '民族选择器') ||
          (fieldInfo.dataType === 6 && '区域选择器') ||
          (fieldInfo.dataType === 7 && '系统选择器'),
        is_display: fieldInfo.isDisplay,
        is_required: fieldInfo.isRequired,
        data_json: fieldInfo.dataJson,
        data_json1: [''],
        key: fieldInfo.key,
        defaultValue:
          fieldInfo.dataType === 4
            ? moment(fieldInfo.defaultValue)
            : fieldInfo.dataType === 6
            ? fieldInfo.defaultValue?.split(',').map((item) => Number(item))
            : fieldInfo.defaultValue,
      });
    },
  }));
  const onBeforeShow = () => {
    getAreaList();
  };

  const onFinish = (values) => {
    //return
    //setLoading(true);
    console.log(values);
    let result = values.data_json1;
    let field = values.data_json;
    let concatResult = [];
    if (field && result) {
      concatResult = field.concat(result);
    }
    if (field && !result) {
      concatResult = field;
    }
    if (result && !field) {
      concatResult = result;
    }
    console.log(concatResult);

    let params = {
      name: values.name,
      id: info.current.id,
      dataType: info.current.dataType,
      dataJson: info.current.dataType === 3 ? concatResult : [],
      isDisplay: values.is_display,
      isRequired: values.is_required,
      defaultValue:
        info.current.dataType === 4
          ? values.defaultValue.format('YYYY-MM-DD')
          : info.current.dataType === 6
          ? values.defaultValue?.join(',')
          : values.defaultValue,
    };

    dispatch({
      type: from === '1' ? 'sampleFieldCustom/fetchUpdateField' : '',
      payload: {
        ...params,
        callback: (res) => {
          if (res.code === 200) {
            refresh && refresh();
            dialogRef.current && dialogRef.current.hide();
            message.success('编辑成功!');
          }
        },
      },
    });
  };

  const getAreaList = () => {
    getArea().then((res) => {
      if (res.code === 200) {
        setProvinceList(res.data);
      }
    });
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
          <Row>
            <Col span={24}>
              <Form.Item label="字段类型" name="data_type">
                <Input placeholder="请输入字段类型" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="字段名称" name="name" rules={[{ validator: interval }]}>
                <Input
                  placeholder="请输入字段名称，1-6个字符"
                  style={{ border: '1px solid #e7e9eb' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="默认值" name="defaultValue">
                {info.current?.dataType === 6 ? (
                  <Cascader
                    options={provinceList}
                    changeOnSelect
                    fieldNames={{ label: 'name', value: 'id', children: 'child' }}
                    disabled={info.current?.isAuth ? true : false}
                  />
                ) : info.current?.dataType === 4 ? (
                  <DatePicker disabled={info?.isAuth ? true : false} />
                ) : (
                  <Input
                    placeholder="请输入默认值"
                    style={{ border: '1px solid #e7e9eb' }}
                    disabled={info.current?.isAuth ? true : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          {info.current && info.current.dataType === 3 ? (
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
                              disabled={fieldInfo?.isAuth ? true : false}
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
          <Row>
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

export default Index;
