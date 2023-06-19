import React, { Component } from 'React';
import { Drawer } from 'antd';
import style from './index.less';
import classNames from 'classnames';
import { CloseCircleOutlined } from '@ant-design/icons';

class DrawerIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  componentWillMount() {
    this.props.onRef(this);
  }
  // 控制弹窗的显示隐藏
  onShow = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };
  onHide = () => {
    this.setState({
      isOpen: false,
    });
  }
  render() {
    const { isOpen } = this.state;
    const { title, children, zIndex, closable = false, restProps } = this.props;
    return (
      <Drawer
        title={title}
        placement="right"
        closable={closable}
        onClose={() => {
          this.onShow();
        }}
        {...restProps}
        zIndex={zIndex ? zIndex : 1062}
        visible={isOpen}
        width={600}
        closeIcon={<CloseCircleOutlined />}
      >
        {children}
      </Drawer>
    );
  }
}

DrawerIndex.defaultProps = {};
export default DrawerIndex;
