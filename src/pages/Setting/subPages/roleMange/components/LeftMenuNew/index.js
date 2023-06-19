import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect, history } from 'umi';
import SideMenu from './SideMenu';

@connect(({ rolemanage, loading, global }) => ({
  rolemanage,
  global,
  authDepartmentLoading: loading.effects['rolemanage/fetchAuthDepartment'],
}))
class LeftMenu extends Component {
  constructor(props) {
    super(props);
    let { enterprise_id, operator_id } = this.props.global;
    this.state = {
      data: {
        operator_id,
        enterprise_id,
      },
    };
  }
  componentDidMount() {
    this.fetchAuthDepartment();
  }
  fetchAuthDepartment = () => {
    let { data } = this.state;
    this.props.dispatch({
      type: 'rolemanage/fetchAuthDepartment',
      payload: {
        ...data,
        callback: () => {
          let { authDepartment = [] } = this.props.rolemanage;
          let defaultOpenKeys = JSON.parse(
            localStorage.getItem('defaultOpenKeys') || JSON.stringify([]),
          );
          if (defaultOpenKeys.length > 0) {
            JSON.stringify(defaultOpenKeys);
            return false;
          }
          localStorage.setItem(
            'defaultOpenKeys',
            JSON.stringify([(authDepartment[0] || {}).dept_id || '']),
          );
        },
      },
    });
  };
  onSelect = item => {
    let { selectedKeys = [] } = item;
    if (selectedKeys.length === 0) {
      let arr = history.location.pathname.split('/');
      arr[4] = -1;
      history.replace(arr.join('/'));
      return false;
      // history.replace()
    }
    let arr = history.location.pathname.split('/');
    arr[4] = selectedKeys[0];
    history.replace(arr.join('/'));
  };
  onExpandChange = item => {
    let { expandedKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(expandedKeys));
  };
  render() {
    let { authDepartment = [] } = this.props.rolemanage;
    let defaultOpenKeys = JSON.parse(
      localStorage.getItem('defaultOpenKeys') || JSON.stringify([]),
    );
    let defaultSelectedKeys = history.location.pathname.split('/')[4];
    let { authDepartmentLoading = true } = this.props;
    return (
      <SideMenu
        {...this.props}
        menuData={authDepartment}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={[defaultSelectedKeys]}
        authDepartmentLoading={authDepartmentLoading}
        onSelect={this.onSelect}
        onExpand={this.onExpandChange}
      />
    );
  }
}

export default LeftMenu;
