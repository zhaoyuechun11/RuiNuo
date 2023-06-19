import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect } from 'umi';
import { Form, Radio, Tree, Select, TreeSelect, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import isFunction from 'lodash/isFunction';
import DataShareSelect from '../DataShareSelect';

const FormItem = Form.Item;
@connect(({ rolemanage }) => ({
  rolemanage,
}))
class DataShareDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.dialogRef = React.createRef();
  }
  onBeforeShow = () => {
    this.fetchShareData();
  };
  fetchShareData = () => {
    let { operator_id, enterprise_id, shareId } = this.props;
    this.props.dispatch({
      type: 'rolemanage/fetchShareData',
      payload: {
        operator_id,
        enterprise_id,
        share_id: shareId,
        callback: (data) => {
          this.setState({
            loading: false,
          });
        },
      },
    });
  };
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
  }
  onOk = () => {
    this.dialogRef.current.hide();
  };
  onClose = () => {
    this.setState({
      loading: true,
    });
  };
  renderShareList = () => {
    let { rolemanage } = this.props;
    let { shareList = [] } = rolemanage;
    if (shareList.length === 0) {
      return null;
    }
    return shareList.map((item, index) => (
      <div className={`${styles.collItem} ${styles.collLine}`} key={item.id}>
        {(item.share || {}).avatar && (
          <img className={styles.collImg} src={(item.share || {}).avatar || ''} />
        )}
        {!(item.share || {}).avatar && (
          <div className={`${styles.collImg} ${styles.empty}`}>
            {(item.share || {}).name || ''.slice(0, 1)}
          </div>
        )}
        <div className={styles.collText}>
          {item.share && item.share.name.length > 3
            ? item.share.name.substr(0, 3) + '...'
            : item.share.name}
          {/* {(item.share || {}).name || ''} */}
        </div>
        <CloseCircleOutlined
          className={styles.closeBtn}
          onClick={() => {
            let { operator_id, enterprise_id, shareId } = this.props;
            let id = (shareList.find((i, ind) => ind === index) || {}).id;
            let formData = {
              operator_id,
              enterprise_id,
              id,
            };
            //
            // return false;
            this.props.dispatch({
              type: 'rolemanage/fetchShareDel',
              payload: {
                ...formData,
                callback: () => {
                  this.fetchShareData();
                },
              },
            });
          }}
        />
      </div>
    ));
  };
  render() {
    let { operator_id, enterprise_id, shareId } = this.props;
    return (
      <Dialog
        title="数据共享"
        ref={this.dialogRef}
        width={640}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={this.state.loading}
        className={styles.dialogContainer}
      >
        <div className={styles.DataShareDialog}>
          <div className={styles.title}>
            将所有数据和共享人进行共享，共享数据包括现有的和以后新增的。
          </div>
          <div className={styles.collaborator}>
            {this.renderShareList()}
            <DataShareSelect
              shareId={shareId}
              operator_id={operator_id}
              enterprise_id={enterprise_id}
              onReload={this.fetchShareData}
            >
              <div className={styles.collItem}>
                <img
                  className={`${styles.collImg} ${styles.xie}`}
                  src={require('../../img/addxie.png')}
                />
                <div className={`${styles.collText} ${styles.last}`}>添加共享人</div>
              </div>
            </DataShareSelect>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DataShareDialog;
