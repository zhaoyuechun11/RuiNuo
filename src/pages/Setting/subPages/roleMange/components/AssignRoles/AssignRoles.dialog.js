import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect, history } from 'umi';
import { Form, Radio, Tree, Select, TreeSelect, message } from 'antd';
import isFunction from 'lodash/isFunction';
import { DownOutlined } from '@ant-design/icons';

import NoAdminModal from './../NoAdminModal';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;
@connect(({ rolemanage, loading }) => ({
  rolemanage,
  singleLoading: loading.effects['rolemanage/fetchAssignStore'],
  batchLoading: loading.effects['rolemanage/fetchAssignBatch'],
}))
class AssignRolesDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: [],
      isRole: 'role',
      description: '',
      positionList: [],
    };
    this.dialogRef = React.createRef();
    this.formRef = React.createRef();
  }
  onBeforeShow = () => {
    let { operator_id, enterprise_id, type, data } = this.props;
    let { rolesId = [], roleList = [], is_admin = 0 } = data[0];
    this.setState({
      positionList: [],
    });
    this.props.dispatch({
      type: 'rolemanage/fetchRoleAssign',
      payload: {
        operator_id,
        enterprise_id,
        is_admin,
        callback: () => {
          let { roleassign = [] } = this.props.rolemanage;
          this.setState(
            {
              loading: false,
            },
            () => {
              let form = this.formRef.current;
              if (type === 'single') {
                form.setFieldsValue({
                  role_ids: rolesId,
                });
                this.setState({
                  value: rolesId,
                  positionList: roleList,
                });
              }
              if (type === 'multi') {
                form.setFieldsValue({
                  type: 1,
                });
              }
            },
          );
        },
      },
    });
  };
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
  }

  onOk = () => {
    this.formRef.current.submit();
  };
  onClose = () => {
    let form = this.formRef.current;
    this.setState({
      loading: true,
      value: [],
    });
  };
  onFinish = (values) => {
    let { operator_id, enterprise_id, data = [], type } = this.props;
    let formData = {
      operator_id,
      enterprise_id,
      assignee_ids: data.map((item) => item.id).join(','), //员工id,英文逗号分隔 eg:819,820
      assignee_id: data.map((item) => item.id).join(','), //员工id,英文逗号分隔 eg:819,820
      ...values,
      role_ids: values.role_ids.join(','),
    };
    //
    // return false;
    if (type === 'single') {
      //单个操作
      let { assignee_ids, ...others } = formData;
      this.props.dispatch({
        type: 'rolemanage/fetchAssignStore',
        payload: {
          ...others,
          callback: (res) => {
            let { status_code = '' } = res;
            if (status_code == 401) {
              this.setState({
                isRole: 'role',
                description: res.message || '',
              });
              this.refs.dialogRefRoleModal.dialog.show();
              return;
            } else if (status_code == 402) {
              this.setState({
                isRole: 'noAdmin',
                description: res.message || '',
              });
              this.refs.noAdminModal.handleOk();
              return;
            } else if (status_code == 200) {
              let { onReload } = this.props;
              this.dialogRef.current.hide();
              message.success(`操作成功`, 2.5, () => {
                if (operator_id * 1 === data[0].id * 1) {
                  history.push('/');
                  location.reload();
                }
              });
              isFunction(onReload) && onReload();
            }
          },
        },
      });
    }
    if (type === 'multi') {
      //批量操作
      let { assignee_id, ...others } = formData;
      this.props.dispatch({
        type: 'rolemanage/fetchAssignBatch',
        payload: {
          ...others,
          callback: (res) => {
            let { status_code = '' } = res;
            if (status_code == 401) {
              this.setState({
                isRole: 'role',
                description: res.message || '',
              });
              this.refs.dialogRefRoleModal.dialog.show();
              return;
            } else if (status_code == 402) {
              this.setState({
                isRole: 'noAdmin',
                description: res.message || '',
              });
              this.refs.noAdminModal.handleOk();
              return;
            } else if (status_code == 200) {
              let { onReload } = this.props;
              this.dialogRef.current.hide();
              message.success(`操作成功`, 2.5, () => {
                if (data.map((i) => i.id).includes(operator_id * 1)) {
                  history.push('/');
                  location.reload();
                }
              });
              isFunction(onReload) && onReload();
            }
          },
        },
      });
    }
  };
  onSelect = (value, node, extra) => {
    let { positionList } = this.state;

    positionList.push({ name: node.name, id: node.id, type: node.type });
    let positionData = this.unique(positionList, 'id');

    positionData = positionData.map((item, index) => {
      return item.type == node.type
        ? { ...{ name: node.name, id: node.id, type: node.type } }
        : item;
    });
    positionData = this.unique(positionData, 'id');
    this.setState(
      {
        positionList: positionData,
      },
      () => {},
    );
    let ids = positionData.map((item) => item.id);

    let form = this.formRef.current;
    if (ids.length > 0) {
      form.setFieldsValue({
        role_ids: ids,
      });
      this.setState({
        value: ids,
      });
      return false;
    }
    form.setFieldsValue({ role_ids: undefined });
    form.validateFields(['role_ids']);
    this.setState({
      value: [],
    });
  };
  onChange = (value, label, extra) => {
    let { positionList = [] } = this.state;
    let newArr = [];
    newArr = positionList.filter((item) => value.includes(item.id));
    this.setState({
      positionList: newArr,
    });
    // let form = this.formRef.current;
    // if (value.length > 0) {
    //   form.setFieldsValue({
    //     role_ids: value,
    //   });
    //   this.setState({
    //     value,
    //   });
    //   return false;
    // }
    // form.setFieldsValue({ role_ids: undefined });
    // form.validateFields(['role_ids']);
    // this.setState({
    //   value: [],
    // });
  };
  unique = (arr, key) => {
    let map = new Map();
    //let arr1 = new Array();      // 数组用于返回结果
    let arr1 = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      if (map.has(arr[i][key])) {
        // 判断是否存在该key值
        map.set(arr[i][key], true);
      } else {
        map.set(arr[i][key], false);
        arr1.push({ name: arr[i].name, id: arr[i][key], type: arr[i].type });
      }
    }
    return arr1;
  };

  render() {
    let { type, data, rolemanage, singleLoading = false, batchLoading = false } = this.props;
    let { roleassign = [] } = rolemanage;
    let title = type === 'single' ? '' : '批量';
    let treeData = roleassign;
    let { isRole, description } = this.state;
    let notAdmin = (roleassign.find((i) => i.name === '管理员') || {}).notAdmin || false;
    return (
      <Dialog
        title={`${title}分配角色`}
        ref={this.dialogRef}
        width={640}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={this.state.loading}
        confirmLoading={type === 'single' ? singleLoading : batchLoading}
      >
        <div className={styles.AssignRolesDialog}>
          {type === 'multi' && (
            <div className={styles.head}>
              <div className={styles.headItem}>
                <div className={styles.hiLeft}>1</div>
                <div className={styles.hiRight}>1个员工最多可分配3个角色，最少分配一个角色</div>
              </div>
              <div className={styles.headItem}>
                <div className={styles.hiLeft}>2</div>
                <div className={styles.hiRight}>
                  批量增加角色：已有该角色的账户会自动过滤，不会重复增加
                </div>
              </div>
              <div className={styles.headItem}>
                <div className={styles.hiLeft}>3</div>
                <div className={styles.hiRight}>
                  批量删除角色：拥有该角色的账户会删除该角色，没有则不影响
                </div>
              </div>
            </div>
          )}
          <Form
            {...layout}
            colon={false}
            className={styles.AssignRolesDialogForm}
            ref={this.formRef}
            name="AssignRolesDialog"
            onFinish={this.onFinish}
          >
            {type === 'multi' && (
              <FormItem name="type" label="分配方式" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value={1}>批量增加角色</Radio>
                  <Radio value={2}>批量减少角色</Radio>
                </Radio.Group>
              </FormItem>
            )}
            {type === 'single' && (
              <FormItem label="姓名">
                <div>{data[0].name}</div>
              </FormItem>
            )}
            <div id="role_ids">
              <FormItem
                name="role_ids"
                label="选择角色"
                rules={[
                  {
                    required: true,
                    validator: (_, val) => {
                      if (!val || val.length === 0) {
                        return Promise.reject('角色不能为空');
                      }
                      if (val.length > 3) {
                        return Promise.reject('只能添加3个角色');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TreeSelect
                  value={this.state.value}
                  multiple
                  allowClear={!notAdmin}
                  className={styles.selectRole}
                  suffixIcon={<DownOutlined />}
                  showArrow={true}
                  style={{ width: '100%' }}
                  placeholder="请选择角色"
                  treeData={treeData}
                  treeDefaultExpandedKeys={this.state.value}
                  onChange={this.onChange}
                  onSelect={this.onSelect}
                  getPopupContainer={() => document.getElementById('role_ids')}
                />
              </FormItem>
            </div>
          </Form>
          <NoAdminModal ref="noAdminModal" description={description}></NoAdminModal>
          {/* <RoleModal ref="dialogRefRoleModal" description={description} type={isRole}>
            <span></span>
          </RoleModal> */}
        </div>
      </Dialog>
    );
  }
}

export default AssignRolesDialog;
