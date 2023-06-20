import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import {  message, Form, Input, Select } from 'antd';
import UploadImgWithCrop from '@components/UploadImg/UploadImgWithCrop';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { userAdd, userUpdate, getList } from '../../models/server';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;

@connect(({ role, loading }) => ({
  role,
  addLoading: loading.effects['role/addRole'],
}))
class NewaddRoleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: undefined,
      uploadedImage: {},
      roleList: [],
    };
    this.onOk = debounce(this.onOk.bind(this), 200);
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this), 100);
    this.formRef = React.createRef();
    this.dialogRef = React.createRef();
  }
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
  }
  list = () => {
    getList().then((res) => {
      if (res.code === 200) {
        this.setState({ roleList: res.data });
      }
    });
  };
  onBeforeShow = () => {
    let { type = '' } = this.props;
    this.setState({
      loading: false,
    });
    this.list();
    if (type === 'edit') {
      let form = this.formRef.current;
      form.setFieldsValue({
        ...this.props,
      });
    }
  };
  onOk = () => {
    this.formRef.current.submit();
  };
  onClose = () => {
    this.setState({
      loading: true,
    });
  };

  onFinish = (values) => {
    let { onReload, type = '', id } = this.props;
    let formData = {
      ...values,
    };

    if (type === 'edit') {
      userUpdate({ ...formData, id }).then((res) => {
        if (res.code === 200) {
          message.success(`编辑成功`, 2.5);
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
        }
      });
      return false;
    }

    userAdd({ ...formData }).then((res) => {
      if (res.code === 200) {
        message.success(`添加成功`, 2.5);
        this.dialogRef.current.hide();
        isFunction(onReload) && onReload();
      }
    });
  };
  // 检测身份证
  idCardCheck(rule, value, callback) {
    let str = new RegExp(
      '^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$',
    );
    if (value) {
      if (value.length === 18 && str.test(value)) {
        callback();
      } else {
        callback([new Error('请输入正确的身份证号')]);
      }
    } else {
      callback([new Error('请输入正确的身份证号')]);
    }
  }
  // 校验手机号
  isValidPhone = (rule, value, callback) => {
    if (value) {
      const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      const result = reg.test(value);
      if (result) {
        callback();
      } else {
        // setVisibleText('');
        callback([new Error('请输入正确手机号')]);
      }
    } else {
      callback([new Error('请输入手机号')]);
    }
  };
  render() {
    let { addLoading = false, type = '' } = this.props;

    let { loading } = this.state;
    // const { getFieldProps } = this.formRef.current;
    // const idCardProps = getFieldProps('idCard', {
    //   validate: [
    //     {
    //       rules: [{ required: true, message: '请输入身份证号' }, { validator: this.idCardCheck }],
    //       trigger: ['onBlur', 'onChange'],
    //     },
    //   ],
    // });
    return (
      <Dialog
        title={`${type === 'edit' ? '编辑' : '添加'}人员`}
        ref={this.dialogRef}
        width={640}
        centered
        onBeforeShow={this.onBeforeShow}
        confirmLoading={addLoading}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={loading}
      >
        <Form
          {...layout}
          name="NewaddRoleDialog"
          className={styles.NewaddRoleDialog}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <FormItem
            name="account"
            label="帐号"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('请填写帐号');
                  }
                  if (value.length > 20) {
                    return Promise.reject('最多输入20个字');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="请填写帐号" autoComplete="off" allowClear />
          </FormItem>
          <FormItem name="enName" label="英文名称">
            <Input placeholder="请填写英文名称" autoComplete="off" allowClear />
          </FormItem>
          <FormItem name="roleId" className={styles.role_id} label="选择角色" id="role_id">
            <Select
              placeholder="请选择角色"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('role_id')}
            >
              {this.state.roleList.length > 0 &&
                this.state.roleList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </FormItem>
          <FormItem name="name" label="名称">
            <Input placeholder="名称" autoComplete="off" allowClear />
          </FormItem>
          <Form.Item name="headPortrait" label="头像">
            <UploadImgWithCrop />
          </Form.Item>
          <FormItem name="sex" label="性别">
            <Select placeholder="请选择性别" autoComplete="off" allowClear>
              <Option value={'female'} key={1}>
                女
              </Option>
              <Option value={'male'} key={2}>
                男
              </Option>
            </Select>
          </FormItem>
          <FormItem name="sfzh" label="身份证号码" rules={[{ validator: this.idCardCheck }]}>
            <Input placeholder="请输入身份证号码" />
          </FormItem>
          <Form.Item name="telno" label="手机号" rules={[{ validator: this.isValidPhone }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Dialog>
    );
  }
}

export default NewaddRoleDialog;
