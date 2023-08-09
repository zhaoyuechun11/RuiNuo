import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { message } from 'antd';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';


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

  onOk = () => {
    let { id, refresh, from, dispatch } = this.props;
    let params = {
      ids: [id],
    };
    dispatch({
      type: from === '1' ? 'sampleFieldCustom/fetchFieldDelete' : '',
      payload: {
        ...params,
        callback: (res) => {
          if (res.code === 200) {
            this.refs.deleteposition.hide();
            isFunction(refresh) && refresh();
            message.success('删除成功!');
          }
        },
      },
    });
  };
  render() {
    let { delLoading, name, prompt, title } = this.props;
    return (
      <Dialog
        title={title}
        ref="deleteposition"
        width={640}
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
