import React, { Component } from 'react';
import DataShareDialog from './DataShare.dialog';

class DataShare extends Component {
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
        <DataShareDialog parent={this} key="DataShareDialog" {...others} />,
      ],
    );
  }
}

export default DataShare;
