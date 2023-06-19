import React, { Component } from 'react';
import styles from './index.less';
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Select, Tooltip, Button, message } from 'antd';
import { connect } from 'umi';
import { Icon } from '@/components';
import Table from '../../../../components/Table/index';
import DelRole from '../DelRole';
import NewAdd from '../NewAdd';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ role, loading, global }) => ({
  role,
  global,
  roleindexLoading: loading.effects['role/fetchRoleIndex'],
}))
class RightContent extends Component {
  constructor(props) {
    super(props);
    let { enterprise_id, operator_id } = this.props.global;
    this.state = {
      formValues: {
        operator_id,
        enterprise_id,
      },
    };
    this.formRef = React.createRef();
  }
  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 280,
      render: (text, record, index) => {
        return (
          <Tooltip placement="bottomLeft" title={text}>
            {text && text.length > 5 ? text.substr(0, 5) + '...' : text}
          </Tooltip>
        );
      },
    },
    {
      title: '角色描述',
      dataIndex: 'desc',
      width: 260,
      render: (text, record, index) => {
        let { type } = record;
        let desc = '';
        if (type == 1) {
          desc = text || '所有权限，可查看所有数据以及管理HR';
        } else if (type == 2) {
          desc = text || '添加职位和候选人、管理招聘流程、添加面试官权限';
        } else {
          desc = text || '查看候选人/填写面试反馈';
        }
        return (
          <Tooltip placement="bottomLeft" title={desc}>
            {desc.length > 10 ? desc.substr(0, 10) + '...' : desc}
          </Tooltip>
        );
      },
    },
    {
      title: '已分配的员工',
      dataIndex: 'users',
      width: 260,
      render: (record) => {
        let desc = '';
        let title = record.map((i) => i.name).join(',');
        if (record.length > 3) {
          desc =
            record
              .slice(0, 3)
              .map((i) => i.name)
              .join(',') + '...';
        } else {
          desc = record.map((i) => i.name).join(',');
        }

        return (
          <Tooltip placement="bottomLeft" title={title}>
            {desc}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 206,
      render: (text, record, index) => {
        let { key, ...others } = record;

        if (record.pid * 1 === 0) {
          return null;
        }
        return (
          <div className={styles.operate} key={record.id}>
            <NewAdd
              {...others}
              type="edit"
              onReload={() => {
                this.fetchRoleIndex();
              }}
            >
              <Button className={styles.newadd}>
                <Icon classStyle={styles.editIcon} name="iconanniu-bianji" />
                编辑
              </Button>
            </NewAdd>
            <DelRole
              {...others}
              onReload={() => {
                this.fetchRoleIndex();
              }}
            >
              <Button className={styles.delete}>
                <DeleteOutlined />
                删除
              </Button>
            </DelRole>
          </div>
        );
      },
    },
  ];
  componentDidMount() {
    this.fetchRoleIndex();
  }
  fetchRoleIndex = () => {
    this.props.dispatch({
      type: 'role/fetchRoleIndex',
      payload: {},
    });
  };
  handleSearch = () => {};
  handleStandardTableChange = () => {};
  // renderForm = () => {
  //   return (
  //     <Form
  //       layout="inline"
  //       onValuesChange={this.handleSearch}
  //       layout="inline"
  //       className={styles.rightContentForm}
  //       ref={this.formRef}
  //     >
  //       <FormItem name="">
  //         <Select placeholder="请选择"></Select>
  //       </FormItem>
  //     </Form>
  //   );
  // };
  render() {
    let { role, roleindexLoading = true } = this.props;
    let { rolelistData = {} } = role;

    return (
      <div className={styles.RightContent}>
        <div className={styles.Head}>
          {/* {this.renderForm()} */}
          <NewAdd
            onReload={() => {
              this.fetchRoleIndex();
            }}
          >
            <div className={styles.addRole}>
              <UserAddOutlined />
              <span>新增角色</span>
            </div>
          </NewAdd>
        </div>
        <Table
          className={styles.tablePadding}
          rowClassName={styles.rowStyle}
          columns={this.columns}
          data={rolelistData}
          // pagination={false}
          loading={roleindexLoading}
          isRowSelection={false}
        />
      </div>
    );
  }
}

export default RightContent;
