import React from 'react';
import { Tree } from 'antd';
import isFunction from 'lodash/isFunction';
import styles from './index.less';

const BaseMenu = ({
  menuData,
  authDepartmentLoading = false,
  onSelect,
  onExpand,
  defaultOpenKeys,
  defaultSelectedKeys,
}) => {
  return authDepartmentLoading ? null : (
    <Tree
      className={styles.Tree}
      treeData={menuData}
      defaultExpandedKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onExpand={(expandedKeys) => {
        isFunction(onExpand) && onExpand({ expandedKeys });
      }}
      onSelect={(selectedKeys, option) => {
        isFunction(onSelect, option) && onSelect({ selectedKeys, option });
      }}
      // expandedKeys={306}
      // autoExpandParent={true}
    />
  );
};

export default BaseMenu;
