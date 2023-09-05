import React, { Component } from 'react';

import style from './index.less';

class Icon extends Component {
  render() {
    const { name, nameStyle, classStyle, ...restProps } = this.props;
    return (
      <div
        className={`${'iconfont'} ${style[name]} ${classStyle}`}
        style={{ ...nameStyle }}
        {...restProps}
      ></div>
    );
  }
}
Icon.defaultProps = {
  name: String, // 图标的class
  nameStyle: Object, // 自定义样式
};

export default Icon;
