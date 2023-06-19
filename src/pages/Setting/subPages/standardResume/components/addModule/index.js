import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Row, Col, Input, Radio, message, Modal, Button, Checkbox, Card } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
// import { collegeListApi, getMajorListApi, editInterview, getPhoneCodeAPI, checkMergeUser } from './server';
import moment from 'moment';
import HopeSalary from '@components/HopeSalary';
import { PhoneCode, Dialog, Icon } from '@components';
import debounce from 'lodash/debounce';
import style from './index.less';
// import { PositionSelect } from '@common';
import { create } from './../../models/server';
//import axios from 'axios';

const { confirm } = Modal;

const Index = ({
  children,
  addModuleRef,
  userInfo,
  refresh,
  positionList,
  departmentList,
  educationList,
  channelsList,
  operator_id,
  enterprise_id,
  dispatch,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  useImperativeHandle(addModuleRef, () => ({
    showModal: showModal,
  }));
  useEffect(() => {
    //createModel()
  }, []);
  const onBeforeShow = () => {
    // form.setFieldsValue({
    //   ...userInfo,
    //   education: userInfo.education || undefined,
    //   age: userInfo.age ? moment(userInfo.age) : undefined,
    //   work_year: userInfo.work_year ? moment(userInfo.work_year) : undefined,
    //   recruitment_department_id:
    //     userInfo.recruitment_department_id == 0
    //       ? undefined
    //       : userInfo.recruitment_department_id,
    //   major: userInfo.major || undefined,
    //   graduate: userInfo.graduate || undefined,
    // });
    // getPhoneCode();
    // getDepartmentList(userInfo);
    //
    // setPhoneSign(userInfo.phone_code ? userInfo.phone_code : '86');
  };

  const showModal = () => {
    dialogRef.current && dialogRef.current.show();
  };

  const onFinish = (values) => {
    let params = { enterprise_id: enterprise_id, operator_id: operator_id };
    let formValue = {
      is_multistage: values.is_multistage.toString(),
      name: values.name,
      ...params,
    };
    create(formValue).then((res) => {
      refresh && refresh();
      dialogRef.current && dialogRef.current.hide();
      message.success('添加成功');
    });
  };

  const editConfirmFn = (values, to_back = false) => {
    let {
      recruitment_position_id,
      user_name,
      phone,
      recruitment_channels_id,
      sex,
      recruitment_department_id,
      age,
      work_year,
      education,
      graduate,
      major,
      work_place,
      expect_salary,
      email,
    } = values;
    editInterview({
      id: userInfo.user_id,
      name: user_name,
      phone,
      email,
      recruitment_channels_id,
      recruitment_position_id,
      sex,
      graduate,
      education,
      work_place,
      recruitment_department_id,
      expect_salary,
      major,
      age: age ? age.format('YYYY-MM-DD') : '',
      work_year: work_year ? work_year.format('YYYY-MM') : '',
      phone_code: phoneSign,
    }).then((res) => {
      setLoading(false);
      if (res.status_code === 200) {
        refresh && refresh();
        dialogRef.current && dialogRef.current.hide();
        message.success('编辑成功!');
        if (to_back) {
          // 返回前，需要把候选人信息清空，不然再次进入时，会拿不存在的user_id请求接口，一定会报错
          dispatch({
            type: 'CandidateDetail/save',
            payload: {
              type: 'userInfo',
              dataSource: null,
            },
          });
          history.push('/candidate/index');
        } else {
          refresh && refresh();
        }
      }
    });
  };

  return (
    <Card>
      <Fragment>
        <Dialog
          ref={dialogRef}
          maskClosable={false}
          width={850}
          title="新增模块"
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
                <Form.Item label="字段名称" name="name">
                  <Input placeholder="请输入模块名称，1-6个字符" />
                </Form.Item>
              </Col>
            </Row>
            <Row span={24}>
              <Col span={24}>
                <Form.Item name="is_multistage">
                  <Checkbox.Group options={[{ label: '支持添加多段', value: 1 }]} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Dialog>
      </Fragment>
    </Card>
  );
};

const mapStateToProps = ({ global: { operator_id, enterprise_id } }) => {
  return {
    operator_id,
    enterprise_id,
  };
};
export default connect(mapStateToProps)(Index);
