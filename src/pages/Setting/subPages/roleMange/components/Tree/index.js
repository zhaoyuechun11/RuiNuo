import './index.less';
import React, { Component } from 'react';
import { Tree } from 'antd';

export default class IcTree extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    className: '',
  };

  render() {
    let props = this.props;
    let { className, children, ...other } = props;
    className = 'ic-base-tree ' + className;
    return (
      <Tree {...other} className={className}>
        {children}
      </Tree>
    );
  }
}
IcTree.TreeNode = Tree.TreeNode;
