import React, { Component } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';
import { Switch, Form, Input, Select, Dropdown, Menu, message, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { Icon, Confirm } from '@/components';
import Table from '../../../../components/Table/index';
import AssignRoles from '../AssignRoles'; // 分配角色
import { userDelete, resetPwd, getMemberList } from '../../models/server';
import NewAdd from '../NewAdd';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = (obj) =>
  Object.keys(obj)
    .map((key) => obj[key])
    .join(',');
@connect(({ rolemanage, loading, global }) => ({
  rolemanage,
  global,
  fetchMemberListLoading: loading.effects['rolemanage/fetchMemberList'],
}))
class RightContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        role_id: undefined,
      },
      description: '',
      isRole: 'auth',
      userId: 0,
      memberlistData: { list: [] },
      total: 0,
    };
    this.formRef = React.createRef();
    this.modalRef = React.createRef();
    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
  }
  componentDidMount() {
    this.fetchRoleList();

    this.fetchMemberList({ pageNum: 1, pageSize: 10 });
  }

  fetchMemberList = (data) => {
    this.props.dispatch({
      type: 'rolemanage/fetchMemberList',
      payload: {
        ...data,
        callback: (data) => {
          this.setState({
            selectedRows: [],
            memberlistData: {
              list: data.records,
              pagination: {
                pageSize: this.state.formValues.page_size,
                current: this.state.formValues.page,
                total: data.total,
                onChange: this.pageChange,
                pageSizeOptions: ['10', '20', '30', '40'],
              },
            },
           
          });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              ...data,
            });
        },
      },
    });
  };

  fetchRoleList = () => {
    this.props.dispatch({
      type: 'rolemanage/fetchRoleList',
      payload: {},
    });
  };
  componentWillReceiveProps(nextProps) {
    //this.fetchMemberList({ page: 1, page_size: 20 });
  }
  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 140,
    },
    // {
    //   title: '部门',
    //   dataIndex: 'department',
    //   width: 200,
    //   render: (text, record, index) => {
    //     return <div>{text || '--'}</div>;
    //   },
    // },
    // {
    //   title: '职位',
    //   dataIndex: 'position',
    //   width: 80,
    //   render: (text, record, index) => {
    //     return <div>{text || '--'}</div>;
    //   },
    // },
    {
      title: '角色',
      dataIndex: 'roleName',
      width: 200,
    },
    {
      title: '帐号状态',
      dataIndex: 'is_auth',
      width: 67,
      render: (text, record, index) => {
        return (
          <Switch
            checked={record.zt}
            onChange={(checked) => {
              this.props.dispatch({
                type: 'rolemanage/fetchChangeAuth',
                payload: {
                  id: record.id,
                  callback: (res) => {
                    const { code = '' } = res;
                    if (code === 200) {
                      this.fetchMemberList({ pageNum: this.state.page, pageSize: this.state.page_size  });
                    }
                  },
                },
              });
            }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        const menu = (
          <Menu className={styles.operatorMenu}>
            <Menu.Item>
              <span
                onClick={() => {
                  this.modalRef.current.show();
                  this.setState({ userId: record.id });
                }}
              >
                删除
              </span>
            </Menu.Item>
            <Menu.Item>
              <span
                onClick={() => {
                  resetPwd({ id: record.id }).then((res) => {
                    if (res.code === 200) {
                      message.success('重置成功');
                      history.push('/login');
                    }
                  });
                }}
              >
                重置密码
              </span>
            </Menu.Item>
            <Menu.Item>
              <NewAdd
                {...record}
                type="edit"
                onReload={() => {
                  const { formValues } = this.state;
                  this.fetchMemberList(formValues);
                }}
              >
                <span>编辑</span>
              </NewAdd>
            </Menu.Item>
          </Menu>
        );
        return (
          <div id="dropdown" className={styles.dropdown}>
            <Dropdown overlay={menu}>
              <div style={{ cursor: 'pointer' }}>
                <Icon classStyle={styles.iconStyle} name="iconmianshirili-gengduo1" />
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  handleStandardTableChange = (pagination, filtersArg, sorter) => {


    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    this.setState({
      formValues: params,
      selectedRows: [],
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.setState({
      selectedRows: [],
    });

    this.fetchMemberList(params);
  };
  renderForm = () => {
    const { roleList = [] } = this.props.rolemanage;
    return (
      <Form
        onValuesChange={this.handleSearch}
        layout="inline"
        className={styles.rightContentForm}
        ref={this.formRef}
        initialValues={this.state.formValues}
      >
        <FormItem name="name" className={styles.name}>
          <Input
            placeholder="请输入员工名称"
            autoComplete="off"
            suffix={<Icon classStyle={styles.iconSouSuo} name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <FormItem name="account" className={styles.name}>
          <Input
            placeholder="请输入员工账号"
            autoComplete="off"
            suffix={<Icon classStyle={styles.iconSouSuo} name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <div id="role_id" className={styles.role_id}>
          <FormItem name="roleId" className={styles.role_id}>
            <Select
              placeholder="请选择角色"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('role_id')}
            >
              {roleList.length > 0 &&
                roleList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </FormItem>
        </div>
        <div id="sex" className={styles.role_id}>
          <FormItem name="sex" className={styles.role_id}>
            <Select
              placeholder="请选择性别"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('sex')}
            >
              <Option value={`male`} key={`1`}>
                男
              </Option>
              <Option value={`female`} key={`2`}>
                女
              </Option>
            </Select>
          </FormItem>
        </div>
        {/* <div id="is_auth" className={styles.is_auth}>
          <FormItem name="is_auth" className={styles.role_id}>
            <Select
              placeholder="请选择是否授权"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('is_auth')}
            >
              <Option value="">全部</Option>
              <Option value="1">已授权</Option>
              <Option value="2">未授权</Option>
            </Select>
          </FormItem>
        </div> */}
      </Form>
    );
  };
  handleSearch = (changedValues, allValues) => {
    const { formValues } = this.state;
    const values = {
      ...formValues,
      pageNum:1,
      ...allValues,
    };
    this.setState({
      selectedRows: [],
      formValues: values,
    });
    this.fetchMemberList(values);
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleCancelAuth = () => {
    const ids = this.state.selectedRows.map((item) => item.id).join(',');
    this.props.dispatch({
      type: 'rolemanage/bulkCancelAuth',
      payload: {
        from_operator_id: ids,
        callback: () => this.fetchMemberList(this.state.formValues),
      },
    });
  };
  confirmDelete = () => {
    userDelete({ ids: [this.state.userId] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        this.modalRef.current.hide();
        this.fetchMemberList({ pageNum: 1, pageSize: 10 });
      }
    });
  };
  pageChange = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize,
    });
  };
  render() {
    const { fetchMemberListLoading } = this.props;
    const { selectedRows, } = this.state;

    return (
      <div className={styles.RightContent}>
        <div className={styles.rcTitle}>
          <p className={styles.title}>公司人员列表</p>
          <NewAdd
            onReload={() => {
              const { formValues } = this.state;
              this.fetchMemberList(formValues);
            }}
          >
            <div className={styles.addRole}>
              <UserAddOutlined />
              <span>新增人员</span>
            </div>
          </NewAdd>
        </div>
        {this.renderForm()}
        <div className={styles.TableContainer}>
          <Table
            unit="个"
            className={styles.tablePadding}
            rowClassName={styles.rowStyle}
            columns={this.columns}
            selectedRowKeys={selectedRows.map((i) => i.id)}
            loading={fetchMemberListLoading}
            data={this.state.memberlistData}
            onChange={this.handleStandardTableChange}
            onSelectRow={this.handleSelectRows}
            isRowSelection={true}
            locale={{
              emptyText: (
                <div
                  style={
                    this.props.emptyStyle ? this.props.emptyStyle : { padding: '190px 0 320px' }
                  }
                >
                  <img
                    width="115px"
                    height="99px"
                    src={require('@assets/images/empty/table_empty.png')}
                    alt=""
                  />
                  <div>暂无数据</div>
                </div>
              ),
            }}
          >
            {selectedRows.length > 0 && (
              <div className={styles.selected}>
                <AssignRoles
                  type="multi"
                  data={selectedRows}
                  {...this.state.formValues}
                  onReload={() => {
                    const { formValues } = this.state;
                    this.fetchMemberList(formValues);
                  }}
                >
                  <button className={styles.selectedButton}>
                    <span className={styles.iconName}>
                      <Icon name="iconanniu-fenpeijiaose" />
                    </span>
                    分配角色
                  </button>
                </AssignRoles>
                <button className={styles.selectedButton} onClick={this.handleCancelAuth}>
                  批量取消授权
                </button>
              </div>
            )}
          </Table>
        </div>

        <Confirm
          confirmRef={this.modalRef}
          // title="删除应聘登记表"
          // content="确认要删除应聘登记表吗?"
          onOk={this.confirmDelete}
        />
      </div>
    );
  }
}

export default RightContent;
