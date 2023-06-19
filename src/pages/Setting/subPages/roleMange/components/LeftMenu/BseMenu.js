import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, history } from 'umi';
import isFunction from 'lodash/isFunction';

const { SubMenu } = Menu;

const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};
class BaseMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };
  getSubMenuOrItem = item => {
    if (
      item.children &&
      !item.hideChildrenInMenu &&
      item.children.some(child => child.name)
    ) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.dept_id}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={item.dept_id}>{this.getMenuItemPath(item)}</Menu.Item>
    );
  };
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath =
      '/setting/roleMange/index' + this.conversionPath(item.dept_id);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a onClick={() => history.replace(itemPath)} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, onCollapse } = this.props;
    return (
      <a
        // to={itemPath}
        onClick={() => history.replace(itemPath)}
        target={target}
        // replace={itemPath === location.pathname}
      >
        {icon}
        <span>{name}</span>
      </a>
    );
  };
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
  render() {
    let {
      dispatch,
      menuData = [],
      authDepartmentLoading,
      onSelect,
      onOpenChange,
      ...others
    } = this.props;
    return authDepartmentLoading ? null : (
      <Menu
        {...others}
        onSelect={({ item }) => {
          isFunction(onSelect) && onSelect({ item });
        }}
        onOpenChange={openKeys => {
          isFunction(onOpenChange) && onOpenChange({ openKeys });
        }}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}

export default BaseMenu;
