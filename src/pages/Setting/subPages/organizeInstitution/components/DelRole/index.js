import React, { Component } from 'react';
import DelRoleDialog from './delrole.dialog';

class DelRole extends Component {
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
        <DelRoleDialog parent={this} key="DelRoleDialog" {...others} />,
      ],
    );
  }
}

export default DelRole;
