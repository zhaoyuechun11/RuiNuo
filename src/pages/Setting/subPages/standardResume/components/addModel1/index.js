import React, { Component } from 'react';
import AddDialog from './add.dialog';

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
        <AddDialog parent={this} key="AddDialog" {...others} />,
      ],
    );
  }
}

export default NewAdd;
