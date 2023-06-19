import React, { Component } from 'react';
import DataHandoverTableDialog from './DataHandoverTableDialog';

class DataHandoverTable extends Component {
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
        <DataHandoverTableDialog
          parent={this}
          key="DataHandoverTableDialog"
          {...others}
        />,
      ],
    );
  }
}

export default DataHandoverTable;
