import React, { Component } from 'react';
import DataHandoverDialog from './DataHandoverDialog';

class DataHandover extends Component {
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
        <DataHandoverDialog
          parent={this}
          key="DataHandoverDialog"
          {...others}
        />,
      ],
    );
  }
}

export default DataHandover;
