import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import { message, Form, Input, TreeSelect } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { permissList, listForRole } from '../../models/server';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;
const { SHOW_ALL } = TreeSelect;
const { TreeNode } = TreeSelect;


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
      permissListTreeData: [],
    };
    this.onOk = debounce(this.onOk.bind(this), 200);
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this), 100);
    this.formRef = React.createRef();
    this.dialogRef = React.createRef();
  }

  onChange = (newValue, label, extra) => {
    console.log('label', label, extra, newValue);
    console.log('extra', extra);
    console.log('newValue', newValue);
  };
  onSelect = (value, node, extra) => {
    console.log('onSelect', value, node, extra);
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
    debugger;
    let { onReload, type = '', id } = this.props;
    let formData = {
      name: values.name,
      permissionIds: values.pid,
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
            this.props.dispatch({
              type: 'global/fetchUserDetail',
              payload: {
                callback: (res) => {},
              },
            });
          },
        },
      });
      return false;
    }
    this.props.dispatch({
      type: 'role/addRole',
      payload: {
        ...formData,
        callback: () => {
          message.success(`添加成功`, 2.5);
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
          this.props.dispatch({
            type: 'global/fetchUserDetail',
            payload: {
              callback: (res) => {},
            },
          });
        },
      },
    });
  };
  renderUserTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            checkable
            dataRef={item}
            title={item.title}
            key={`${item.key}`}
            value={item.key}
          >
            {this.renderUserTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          checkable
          dataRef={item}
          key={`${item.key}`}
          title={item.title}
          value={item.key}
        />
      );
    });
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
          {/* <div id="pid" className={styles.pid}>
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
                // onChange={this.onChange}
                // onSelect={this.onSelect}
                getPopupContainer={() => document.getElementById('pid')}
              />
            </FormItem>
          </div> */}
          <div id="pid" className={styles.pid}>
            <FormItem name="pid" label="角色权限">
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                multiple
                // treeCheckable
                // treeDefaultExpandAll
                onChange={this.onChange}
              >
                {this.renderUserTreeNodes(this.state.permissListTreeData)}
              </TreeSelect>
            </FormItem>
          </div>
        </Form>
      </Dialog>
    );
  }
}

export default NewaddRoleDialog;
