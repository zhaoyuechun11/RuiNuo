import React, { Component } from 'react';
import DataHandoverSelectDialog from './DataHandoverSelectDialog';

class DataHandoverSelect extends Component {
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
        <DataHandoverSelectDialog
          parent={this}
          key="DataHandoverSelectDialog"
          {...others}
        />,
      ],
    );
  }
}

export default DataHandoverSelect;
