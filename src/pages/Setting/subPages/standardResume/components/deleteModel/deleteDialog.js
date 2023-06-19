import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import Icon from '@ant-design/icons';
import styles from './index.less';
import { message } from 'antd';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';
import { deleteModule, deleteField } from './../../models/server';
const WarnSvg = () => (
  <svg
    t="1599458282858"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7062"
    width="50"
    height="50"
  >
    <path
      d="M597.333333 119.466667c0 4.266667 8.533333 12.8 21.333334 34.133333s25.6 42.666667 42.666666 76.8 38.4 64 59.733334 102.4c21.333333 38.4 46.933333 76.8 68.266666 115.2 21.333333 38.4 46.933333 81.066667 68.266667 119.466667 21.333333 38.4 42.666667 76.8 64 106.666666 17.066667 34.133333 34.133333 59.733333 51.2 85.333334s21.333333 38.4 29.866667 46.933333c8.533333 17.066667 17.066667 34.133333 17.066666 51.2 4.266667 17.066667 0 29.866667-4.266666 46.933333s-12.8 25.6-21.333334 34.133334c-12.8 8.533333-25.6 12.8-42.666666 12.8L89.6 951.466667c-25.6 0-46.933333-4.266667-59.733333-12.8-12.8-8.533333-21.333333-21.333333-25.6-34.133334-4.266667-12.8-4.266667-29.866667 0-42.666666 4.266667-17.066667 8.533333-29.866667 21.333333-46.933334 4.266667-8.533333 12.8-21.333333 25.6-46.933333 12.8-21.333333 29.866667-51.2 51.2-81.066667 21.333333-34.133333 42.666667-68.266667 64-106.666666 21.333333-38.4 46.933333-81.066667 72.533333-119.466667s46.933333-81.066667 68.266667-119.466667c21.333333-38.4 42.666667-72.533333 59.733333-102.4 17.066667-29.866667 34.133333-55.466667 46.933334-76.8l21.333333-34.133333c8.533333-12.8 21.333333-25.6 38.4-34.133333 17.066667-8.533333 29.866667-12.8 46.933333-12.8s29.866667 4.266667 46.933334 8.533333c8.533333 4.266667 21.333333 17.066667 29.866666 29.866667zm-25.6 196.266666c0-8.533333 0-17.066667-4.266666-21.333333-4.266667-8.533333-8.533333-12.8-12.8-17.066667-4.266667-4.266667-12.8-8.533333-21.333334-12.8s-17.066667-8.533333-25.6-8.533333c-17.066667 0-29.866667 4.266667-42.666666 17.066667s-21.333333 25.6-21.333334 42.666666l0 264.533334c0 17.066667 8.533333 29.866667 21.333334 42.666666s25.6 17.066667 42.666666 17.066667 29.866667-4.266667 42.666667-17.066667c12.8-12.8 21.333333-25.6 21.333333-42.666666l0-264.533334zm-64 384c-17.066667 0-34.133333 4.266667-42.666666 17.066667s-17.066667 25.6-17.066667 42.666667 4.266667 34.133333 17.066667 42.666666c12.8 12.8 25.6 17.066667 42.666666 17.066667s34.133333-4.266667 42.666667-17.066667c12.8-12.8 17.066667-25.6 17.066667-42.666666s-4.266667-34.133333-17.066667-42.666667c-8.533333-12.8-25.6-17.066667-42.666667-17.066667z"
      p-id="7063"
      fill="#ff3b30"
    ></path>
  </svg>
);

const WarnIcon = (props) => <Icon component={WarnSvg} {...props} />;
@connect(({ Recruitment, loading }) => ({
  Recruitment,
  delLoading: loading.effects['resumeModule/delete'],
}))
class DeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.onOk = debounce(this.onOk.bind(this), 200);
  }
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.refs.deleteposition;
  }
  onBeforeShow = () => {};
  onOk = () => {
    // return
    let { id, operator_id, enterprise_id, refresh, type, title } = this.props;
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      id: id,
    };
    if (type !== 'delete_field') {
      deleteModule(params).then((res) => {
        if (res.status_code === 200) {
          this.refs.deleteposition.hide();
          isFunction(refresh) && refresh();
          message.success('删除成功!');
        }
      });
      return;
    }
    deleteField(params).then((res) => {
      if (res.status_code === 200) {
        this.refs.deleteposition.hide();
        isFunction(refresh) && refresh();
        message.success('删除成功!');
      }
    });
  };
  render() {
    let { delLoading, name, prompt, title } = this.props;
    return (
      <Dialog
        title={title}
        ref="deleteposition"
        width={640}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        confirmLoading={delLoading}
      >
        <div className={styles.container}>
          {`${name}` != '' ? (
            <img src={require('@assets/images/commom/del_icon.png')} style={{ width: 82 }}></img>
          ) : (
            <img
              src={require('@assets/images/commom/access_icon.png')}
              style={{ width: 156 }}
            ></img>
          )}
          <div className={styles.cancelText}>{`${name}`}</div>
          <div className={styles.confirmText}>{`${prompt}`}</div>
        </div>
      </Dialog>
    );
  }
}

export default DeleteDialog;
