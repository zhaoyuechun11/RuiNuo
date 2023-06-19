import React, { Component } from 'react';
import DataShareSelectDialog from './DataShareSelect.dialog';

class DataShareSelect extends Component {
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
        <DataShareSelectDialog
          parent={this}
          key="DataShareSelectDialog"
          {...others}
        />,
      ],
    );
  }
}

export default DataShareSelect;
