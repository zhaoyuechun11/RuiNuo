import React from 'react';
import { Tree } from 'antd';
import isFunction from 'lodash/isFunction';

import styles from './index.less';

const { TreeNode } = Tree;
const BaseMenu = ({ menuData, onSelect, onExpand, defaultOpenKeys, defaultSelectedKeys }) => {
  const renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.className} key={item.key}>
            {item.children.map((child) => {
              return (
                <TreeNode
                  title={`${child.venDonName} ${child.batchNo} ${
                    child.qcLevelName
                  } ${child.startDt.slice(0, 11)}`}
                  key={child.key}
                  labClassId={item.labClassId}
                  qcId={child.qcId}
                  itemId=""
                >
                  {child.children.map((third) => {
                    return (
                      <TreeNode
                        title={`${third.itemCode} ${third.itemName}`}
                        key={third.key}
                        labClassId={item.labClassId}
                        qcId={child.qcId}
                        itemId={third.itemId}
                      ></TreeNode>
                    );
                  })}
                </TreeNode>
              );
            })}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.className} />;
    });

  return (
    menuData.length > 0 && (
      <Tree
        className={styles.Tree}
        defaultExpandedKeys={defaultOpenKeys}
        defaultSelectedKeys={[defaultSelectedKeys]}
        onExpand={(expandedKeys) => {
          isFunction(onExpand) && onExpand({ expandedKeys });
        }}
        onSelect={(selectedKeys, option) => {
          isFunction(onSelect, option) && onSelect({ selectedKeys, option });
        }}
        autoExpandParent={true}
      >
        {renderTreeNodes(menuData)}
      </Tree>
    )
  );
};

export default BaseMenu;
