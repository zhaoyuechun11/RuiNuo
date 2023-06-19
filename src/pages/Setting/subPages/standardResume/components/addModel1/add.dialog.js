import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import { Button, message, Form, Input, Select, TreeSelect, Row, Col, Checkbox } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;
//const [form] = Form.useForm();
@connect(({ role, loading }) => ({
  role,
  addLoading: loading.effects['role/addRole'],
}))
class NewaddDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: undefined,
    };
    this.onOk = debounce(this.onOk.bind(this), 200);
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this), 100);
    this.formRef = React.createRef();
    this.dialogRef = React.createRef();
  }
  componentDidMount() {
    let props = this.props;
    // let parent = props.parent;
    // parent.dialog = this.dialogRef.current;
  }
  onBeforeShow = () => {
    let { enterprise_id, operator_id, type = '', name = '', desc = '', pid = '' } = this.props;
    // this.props.dispatch({
    //   type: 'role/fetchRoleAssign',
    //   payload: {
    //     enterprise_id,
    //     operator_id,
    //     callback: () => {
    //       this.setState(
    //         {
    //           loading: false,
    //         },
    //         () => {
    //           if (type === 'edit') {
    //             let form = this.formRef.current;
    //             this.setState({
    //               value: pid,
    //             });
    //             form.setFieldsValue({
    //               name,
    //               desc,
    //               pid,
    //             });
    //           }
    //         },
    //       );
    //     },
    //   },
    // });
  };
  onOk = () => {
    this.formRef.current.submit();
  };
  onClose = () => {
    this.setState({
      loading: true,
    });
  };
  onChange = (value) => {
    let form = this.formRef.current;
    this.setState({
      value,
    });
    form.setFieldsValue({
      pid: value,
    });
  };
  onFinish = (values) => {
    let { enterprise_id, operator_id, onReload, type = '', id } = this.props;
    let formData = {
      ...values,
      enterprise_id,
      operator_id,
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
        callback: () => {
          message.success(`添加成功`, 2.5);
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
        },
      },
    });
  };
  render() {
    let { role = {}, addLoading = false, type = '' } = this.props;
    let { assignList = [] } = role;
    let { loading, value } = this.state;
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
        {/* <Form
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
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (value.length > 50) {
                    return Promise.reject('最多输入50个字');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="请填写角色描述" autoComplete="off" allowClear />
          </FormItem>
          <div id="pid" className={styles.pid}>
            <FormItem
              name="pid"
              label="角色上级"
              rules={[
                {
                  required: true,
                  message: '请选择上级角色',
                },
              ]}
            >
              <TreeSelect
                value={value}
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择上级角色"
                treeData={assignList}
                onChange={this.onChange}
                getPopupContainer={() => document.getElementById('pid')}
              />
            </FormItem>
          </div>
        </Form> */}

        <Form
          labelCol={{ span: 6 }}
          layout="vertical"
          style={{ margin: '40px 30px' }}
          onFinish={this.onFinish}
          ref={this.formRef}
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
    );
  }
}

export default NewaddDialog;
