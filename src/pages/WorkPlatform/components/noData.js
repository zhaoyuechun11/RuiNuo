import React, { Component } from 'react';
import { connect } from 'umi';
import style from './style/noData.less';

class noData extends Component {
  render() {
    const { pic, content, ...restProps } = this.props;
    return (
      <div className={style.wrap}>
        <img {...restProps} src={require(`@assets/images/empty/${pic}`)} />
        <div className={style.content}>{content}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(noData);
