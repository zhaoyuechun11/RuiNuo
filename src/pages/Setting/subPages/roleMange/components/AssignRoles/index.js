import React, { Component } from 'react';
import AssignRolesDialog from './AssignRoles.dialog';

class AssignRoles extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        <AssignRolesDialog parent={this} key="AssignRolesDialog" {...others} />,
      ],
    );
  }
}

export default AssignRoles;
