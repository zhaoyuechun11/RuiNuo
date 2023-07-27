import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import { message, Form, Input, Tree, Icon, Tabs, Transfer, Checkbox, Row, Col } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { getArrDifference, searchTreeNodes, searchTreeNodesAllId, getParentIdList } from '@/utils';
import {
  permissList,
  listForRole,
  sysAuthorization,
  sysAuthorizationAdd,
  sysAuthorBinds,
  reportUnitLists,
  reportUnitBinds,
} from '../../models/server';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;

const { TreeNode } = Tree;
const { TabPane } = Tabs;
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
      checkedKeys: [],
      beforeCheckedAuthKeys: [],
      checkedAuthKeys: [],
      sysAuthorizationList: [],
      sysAuthorIds: [],
      sysAuthorBindsIds: [],
      reportUnitList: [],
      reportUnitBinds: [],
    };
    this.onOk = debounce(this.onOk.bind(this), 200);
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this), 100);
    this.formRef = React.createRef();
    this.dialogRef = React.createRef();
  }

  handleChange = (targetKeys) => {
    debugger;
    this.setState({ reportUnitBinds: targetKeys });
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  filterOption = (inputValue, option) => option.reportUnitName.indexOf(inputValue) > -1;
  // onSelect = (value, node, extra) => {
  //   console.log('onSelect', value, node, extra);
  // };

  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
    this.getSysAuthorization();
    this.getReportUnitList();
  }
  getReportUnitList = () => {
    reportUnitLists().then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { key: item.id, ...item };
        });
        this.setState({ reportUnitList: result });
      }
    });
  };
  getPermisList = () => {
    permissList().then((res) => {
      if (res.code === 200) {
        this.setState({ permissListTreeData: res.data });
        sessionStorage.setItem('permissListTreeData', res.data);
      }
    });
  };
  getListForRole = (id) => {
    this.getPermisList();
    listForRole({ roleId: id }).then((res) => {
      if (res.code === 200) {
        // let form = this.formRef.current;
        // form.setFieldsValue({
        //   pid: res.data,
        // });
        this.setState({ checkedKeys: res.data, beforeCheckedAuthKeys: res.data });
      }
    });
  };
  getSysAuthorBinds = (id) => {
    sysAuthorBinds({ roleId: id }).then((res) => {
      if (res.code === 200) {
        this.setState({ sysAuthorBindsIds: res.data });
      }
    });
  };
  getReportUnitBinds = (id) => {
    reportUnitBinds({ roleId: id }).then((res) => {
      if (res.code === 200) {
        this.setState({ reportUnitBinds: res.data });
      }
    });
  };
  getSysAuthorization = () => {
    sysAuthorization().then((res) => {
      if (res.code === 200) {
        this.setState({ sysAuthorizationList: res.data });
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
      this.getSysAuthorBinds(id);
      this.getReportUnitBinds(id);
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
      permissionIds: this.state.checkedKeys,
      funcIds: this.state.sysAuthorBindsIds,
      reportUnitIds: this.state.reportUnitBinds,
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
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onCheck = (checkedKeys, e) => {
    const beforeCheckedAuthKeys = this.state.beforeCheckedAuthKeys; //上一次选中的ids 如果没有就是初始进入选中的集合
    // console.log('上一次选中ids', beforeCheckedAuthKeys)
    // console.log('选中ids', checkedKeys.checked)
    const changeNodes = getArrDifference(checkedKeys.checked, beforeCheckedAuthKeys); //比对这次选中与上次选中的差异
    // console.log('改变的节点', changeNodes);
    let checkedList = [];
    for (let i = 0; i < changeNodes.length; i++) {
      let itemNode = searchTreeNodes(this.state.permissListTreeData, changeNodes[i]); //查找该节点数据 authTreeList为树型数据
      let childrenNodesIds = searchTreeNodesAllId(itemNode?.children); //向下查找所有子节点的ids
      checkedList = [...new Set([...checkedList, ...childrenNodesIds])]; //合并去重
    }
    // console.log('该节点下所有ids', checkedList)
    //获取选中的节点的所有父节点
    let parentNodes = changeNodes;
    parentNodes.forEach(
      (item) =>
        (parentNodes = parentNodes.concat(getParentIdList(item, this.state.permissListTreeData))),
    );
    // console.log('选中的所有父节点', parentNodes)
    if (e.checked) {
      debugger;
      // 勾选
      this.state.checkedAuthKeys = [
        ...new Set([...checkedKeys.checked, ...checkedList, ...parentNodes]),
      ];
      //this.setState({checkedAuthKeys: [...new Set([...checkedKeys.checked, ...checkedList, ...parentNodes])]})
    } else {
      // 取消勾选
      if (checkedList && checkedList.length) {
        //如果取消勾选需要移除该节点下所有子节点ids
        this.state.checkedAuthKeys = checkedKeys.checked.filter(
          (item) => checkedList.indexOf(item) == -1,
        );
        //this.setState({checkedAuthKeys: checkedKeys.checked.filter((item) => checkedList.indexOf(item) == -1)})
      } else {
        this.state.checkedAuthKeys = checkedKeys.checked;
        //this.setState({checkedAuthKeys:this.state.checkedAuthKeys?.checked})
      }
    }

    //this.beforeCheckedAuthKeys = this.checkedAuthKeys; //本次选择处理结束 赋值当前选择供下次使用
    this.setState({
      beforeCheckedAuthKeys: this.state.checkedAuthKeys,
      checkedKeys: this.state.checkedAuthKeys,
    });
    //sessionStorage.setItem('beforeCheckedAuthKeys', checkedAuthKeys);
    // this.setState({ checkedKeys: checkedAuthKeys });
    console.log('选中', this.state.checkedAuthKeys);
  };

  onChangeSysAuthor = (e) => {
    this.setState({ sysAuthorBindsIds: e });
  };

  render() {
    let { addLoading = false, type = '' } = this.props;
    let { loading, sysAuthorBindsIds, reportUnitList, reportUnitBinds } = this.state;
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
          </div> */}
          {/* <FormItem name="pid" label="角色权限"></FormItem> */}
        </Form>
        <div className={styles.title}>角色权限:</div>
        <Tabs defaultActiveKey="1" className={styles.tabs_box}>
          <TabPane tab="菜单及按钮授权" key="1">
            <Tree
              checkable
              onSelect={this.onSelect}
              onCheck={this.onCheck}
              treeData={this.state.permissListTreeData}
              checkStrictly
              checkedKeys={this.state.checkedKeys}
            ></Tree>
          </TabPane>
          <TabPane tab="报告单元授权" key="2">
            <Transfer
              dataSource={reportUnitList}
              titles={['未授权报告单元', '已授权报告单元']}
              showSearch
              filterOption={this.filterOption}
              targetKeys={reportUnitBinds}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              render={(item) => item.reportUnitName}
              listStyle={{
                width: 450,
              }}
            />
          </TabPane>
          <TabPane tab="系统功能授权" key="3">
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={this.onChangeSysAuthor}
              value={sysAuthorBindsIds}
            >
              {this.state.sysAuthorizationList.map((item) => {
                return (
                  <Row key={item.id}>
                    <Col>
                      <Checkbox value={item.id}>{item.funcName}</Checkbox>
                    </Col>
                  </Row>
                );
              })}
            </Checkbox.Group>
          </TabPane>
        </Tabs>
      </Dialog>
    );
  }
}

export default NewaddRoleDialog;
