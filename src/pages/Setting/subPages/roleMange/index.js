import React, { Component } from 'react';

class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentWillUnmount() {}
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default RoleManage;
