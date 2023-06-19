import React, { Component } from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../less/dialog.less';

export default class DialogDefaultFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      showCancel = true,
      showConfirm = true,
      submitButton = false,
      form = '',
      submitDisabled = false, //禁止提交按钮
    } = this.props;
    let props = this.props;
    return (
      <div className={styles['ic-dialog-footer']}>
        {showCancel && (
          <Button onClick={props.onCancel}>{props.cancelText}</Button>
        )}
        {showConfirm && (
          <Button
            className={`${submitDisabled ? styles['submitDisabled'] : null}`}
            type="primary"
            disabled={submitDisabled}
            onClick={!submitButton ? props.onOk : () => {}} // 提交表单处理事件，可添加
            loading={props.confirmLoading}
            htmlType={submitButton ? 'submit' : 'button'}
            form={form}
          >
            {props.okText}
          </Button>
        )}
      </div>
    );
  }
}
