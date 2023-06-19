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
   // this.fetchAuthDepartment();
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
  onSelect = ({ item }) => {
    let { props } = item;
    let { openKeys = [] } = props;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(openKeys));
  };
  onOpenChange = item => {
    let { openKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(openKeys));

    // history.replace('/setting/roleMange/index' + this.conversionPath(item.dept_id))
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
        onOpenChange={this.onOpenChange}
      />
    );
  }
}

export default LeftMenu;
