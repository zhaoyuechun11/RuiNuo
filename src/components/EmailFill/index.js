import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import { EMAIL_FILL } from '@utils/constant';

const { Option } = AutoComplete;

class Index extends Component {
  state = {
    result: [],
  };
  handleChange = value => {
    this.props.onChange(value);
  };
  handleSearch = value => {
    let result;
    if (!value || value.indexOf('@') >= 0) {
      result = [];
    } else {
      result = EMAIL_FILL.map(domain => `${value}@${domain}`);
    }

    this.setState({ result });
  };
  render() {
    const { result } = this.state;
    const children = result.map(email => <Option key={email}>{email}</Option>);
    return (
      <AutoComplete
        value={this.props.value}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        onBlur={this.props.onBlur}
        placeholder={this.props.placeholder}
        allowClear={true}
      >
        {children}
      </AutoComplete>
    );
  }
}

export default Index;
