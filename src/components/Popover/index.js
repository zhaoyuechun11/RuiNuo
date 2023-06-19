import React, { Fragment, Component } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import style from './index.less';

class PopoverIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { content, placement, trigger, children, isArrow, ...rest } = this.props;
    return (
      <Popover
        content={content}
        placement={placement}
        trigger={trigger}
        overlayClassName={classNames(
          style.popoverClass,
          isArrow ? '' : `${style.hideArrow}`,
        )}
        {...rest}
      >
        {children}
      </Popover>
    );
  }
}

PopoverIndex.defaultProps = {
  content: '', //展示的内容
  placement: 'top', // 气泡位置
  trigger: 'hover', // 出发行为
  isArrow: true, // 是否显示 侧面的三角箭头
};
export default PopoverIndex;
