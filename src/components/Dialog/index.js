import React, { Component } from 'react';
import { Modal } from 'antd';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DefaultFooter from './src/js/dialog.default.footer';
import isFunction from 'lodash/isFunction';
import styles from './src/less/dialog.less';

class IcDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: !!this.props.visible,
      afterClose: true,
    };
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClose = this.onClose.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }
  componentDidMount() {}
  onCancel() {
    let props = this.props;
    let onCancel = props.onCancel;
    if (typeof onCancel !== 'function' || onCancel() !== false) {
      this.hide('close');
    }
  }
  onOk() {
    let props = this.props;
    let onOk = props.onOk;
    if (props.loading) {
      return false;
    }
    if (typeof onOk !== 'function' || onOk() !== false) {
      this.hide('ok');
    }
  }

  show() {
    if (this.state.visible) {
      return false;
    }
    let props = this.props;
    let onBeforeShow = props.onBeforeShow;
    let visible = isFunction(onBeforeShow) ? onBeforeShow() !== false : true;
    let afterClose = this.state.afterClose;

    visible &&
      afterClose &&
      this.setState({
        visible,
        afterClose: false,
      });
  }

  hide() {
    if (!this.state.visible) {
      return false;
    }
    let props = this.props;
    let onClose = props.onClose;
    if (isFunction(onClose) && onClose() === false) {
      return false;
    }
    this.setState({
      visible: false,
    });
  }

  onClose() {
    this.hide('close');
  }

  afterClose = () => {
    this.setState({
      afterClose: true,
    });
  };

  render() {
    let props = this.props;
    let {
      children,
      maskClosable,
      loading,
      okText,
      cancelText,
      confirmLoading,
      className,
      ...other
    } = props;
    return (
      <Modal
        {...other}
        centered
        maskClosable={maskClosable}
        visible={this.state.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        onClose={this.onClose}
        afterClose={this.afterClose}
        footer={
          props.footer !== null ? (
            <div>
              {props.footer || (
                <DefaultFooter
                  okText={okText}
                  cancelText={cancelText}
                  onOk={this.onOk}
                  onCancel={this.onCancel}
                  confirmLoading={confirmLoading}
                  {...other}
                />
              )}
            </div>
          ) : null
        }
        closeIcon={<CloseCircleOutlined />}
        className={`${styles['ic-dialog-modal']} ${className}`}
      >
        {loading ? (
          <div className={styles['ic-dialog-loading']}>
            <LoadingOutlined />
          </div>
        ) : (
          <div
            ref={(icbody) => {
              this.icbody = icbody;
            }}
            className={styles['ic-dialog-body']}
          >
            {children}
          </div>
        )}
      </Modal>
    );
  }
}

IcDialog.defaultProps = {
  maskClosable: false,
  okText: '确定',
  cancelText: '取消',
};

export default IcDialog;
