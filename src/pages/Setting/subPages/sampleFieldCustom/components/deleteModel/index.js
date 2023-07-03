import React, { Component } from 'react';
import DeleteDialog from './deleteDialog';

class DeletePosition extends Component {
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
        <DeleteDialog parent={this} key="DeleteDialog" {...others} />,
      ],
    );
  }
}

export default DeletePosition;
