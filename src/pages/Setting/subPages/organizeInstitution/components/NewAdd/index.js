import React, { Component } from 'react';
import AddRoleDialog from './newadd.dialog';

class NewAdd extends Component {
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
        <AddRoleDialog parent={this} key="AddRoleDialog" {...others} />,
      ],
    );
  }
}

export default NewAdd;
