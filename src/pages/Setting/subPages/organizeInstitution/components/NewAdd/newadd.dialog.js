import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import { message, Form, Input, TreeSelect } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { permissList, listForRole} from '../../models/server';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;
const { SHOW_ALL } = TreeSelect;
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
      valuePermis: [],
      permissListTreeData: [],
    };
    this.onOk = debounce(this.onOk.bind(this), 200);
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this), 100);
    this.formRef = React.createRef();
    this.dialogRef = React.createRef();
  }

  onChange = (newValue) => {
    this.setState({ valuePermis: newValue });
  };

  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
  }
  getPermisList = () => {
    permissList().then((res) => {
      if (res.code === 200) {
        this.setState({ permissListTreeData: res.data });
      }
    });
  };
  getListForRole = (id) => {
    this.getPermisList();
    listForRole({ roleId: id }).then((res) => {
      if (res.code === 200) {
        let form = this.formRef.current;
        form.setFieldsValue({
          pid: res.data,
        });
      }
    });
  };
  onBeforeShow = () => {
    let { type = '', name = '', id } = this.props;
    this.setState({
      loading: false,
    });
    this.getPermisList();
    if (type === 'edit') {
      let form = this.formRef.current;
      form.setFieldsValue({
        name,
      });
      this.getListForRole(id);
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
    const permissId = values.pid?.map((item) => {
      if (item.value) {
        return item.value;
      } else {
        return item;
      }
    });
    let { onReload, type = '', id } = this.props;
    let formData = {
      ...values,
      permissionIds: permissId,
    };
    if (type === 'edit') {
      this.props.dispatch({
        type: 'role/editRole',
        payload: {
          ...formData,
          id,
          callback: () => {
            message.success(`编辑成功`, 2.5);
            this.dialogRef.current.hide();
            isFunction(onReload) && onReload();
          },
        },
      });
      return false;
    }
    this.props.dispatch({
      type: 'role/addRole',
      payload: {
        ...formData,
        permissionIds: permissId,
        callback: () => {
          message.success(`添加成功`, 2.5);
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
        },
      },
    });
  };
  render() {
    let { addLoading = false, type = '' } = this.props;
    let { loading } = this.state;
    return (
      <Dialog
        title={`${type === 'edit' ? '编辑' : '添加'}角色`}
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
            name="name"
            label="角色名称"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('请填写角色名称');
                  }
                  if (value.length > 20) {
                    return Promise.reject('最多输入20个字');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="请填写角色名称" autoComplete="off" allowClear />
          </FormItem>
          <FormItem
            name="desc"
            label="角色描述"
            // rules={[
            //   {
            //     validator: (_, value) => {
            //       if (!value) {
            //         return Promise.resolve();
            //       }
            //       if (value.length > 50) {
            //         return Promise.reject('最多输入50个字');
            //       }
            //       return Promise.resolve();
            //     },
            //   },
            // ]}
          >
            <Input placeholder="请填写角色描述" autoComplete="off" allowClear />
          </FormItem>
          <div id="pid" className={styles.pid}>
            <FormItem
              name="pid"
              label="角色权限"
              // rules={[
              //   {
              //     required: true,
              //     message: '请选择上级角色',
              //   },
              // ]}
            >
              <TreeSelect
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择上级角色"
                treeData={this.state.permissListTreeData}
                treeCheckable
                showCheckedStrategy={SHOW_ALL}
                treeCheckStrictly
                onChange={this.onChange}
                getPopupContainer={() => document.getElementById('pid')}
              />
            </FormItem>
          </div>
        </Form>
      </Dialog>
    );
  }
}

export default NewaddRoleDialog;
