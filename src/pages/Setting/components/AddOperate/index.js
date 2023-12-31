import React, { Component } from 'react';
import AddOperateDialog from './addopetate.dialog';

class AddOperate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let props = this.props;
    let { children, ...others } = props;
    let childrenProps = children.props;
    return React.cloneElement(
      children,
      {
        onClick: e => {
          this.dialog.show();
        },
      },
      [
        childrenProps.children,
        <AddOperateDialog parent={this} key="AddOperateDialog" {...others} />,
      ],
    );
  }
}

export default AddOperate;
