import React, { Fragment, Component } from 'react';
import classNames from 'classnames';
import style from './index.less';

class Icon extends Component {
  render() {
    const { name, nameStyle, classStyle, ...restProps } = this.props;
    return (
      <span
        className={`${'iconfont'} ${style[name]} ${classStyle}`}
        style={{ ...nameStyle }}
        {...restProps}
      ></span>
    );
  }
}
Icon.defaultProps = {
  name: String, // 图标的class
  nameStyle: Object, // 自定义样式
};

export default Icon;
