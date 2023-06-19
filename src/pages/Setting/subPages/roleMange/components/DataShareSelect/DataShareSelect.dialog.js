import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect } from 'umi';
import { Form, Radio, Tree, Checkbox, Select, TreeSelect, message, Input, Row } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
@connect(({ rolemanage, loading }) => ({
  rolemanage,
  fetchSaveShareIdLoading: loading.effects['rolemanage/fetchSaveShareId'],
}))
class DataShareSelectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      defaultValue: [], //默认选中的值
      searchList: [], //搜索之后的数据
    };
    this.dialogRef = React.createRef();
    this.onInputChange = debounce(this.onInputChange.bind(this), 500);
  }
  onBeforeShow = () => {
    let { operator_id, enterprise_id, shareId } = this.props;
    this.props.dispatch({
      type: 'rolemanage/fetchSelectShare',
      payload: {
        operator_id,
        enterprise_id,
        share_id: shareId,
        page: 1,
        page_size: 99999,
        callback: () => {
          let defaultValue = this.props.rolemanage.selectShareList
            .filter((i) => i.is_selected * 1 === 1)
            .map((j) => j.id);
          this.setState({
            loading: false,
            defaultValue,
          });
          //
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
    let { defaultValue } = this.state;
    let { operator_id, enterprise_id, shareId, onReload } = this.props;
    let formData = {
      operator_id,
      enterprise_id,
      share_id: shareId,
      shared_id: defaultValue.join(','),
    };
    //
    // return false;
    this.props.dispatch({
      type: 'rolemanage/fetchSaveShareId',
      payload: {
        ...formData,
        callback: () => {
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
        },
      },
    });
  };
  onClose = () => {
    this.setState({
      loading: true,
      searchList: [],
    });
  };
  onChange = (value) => {
    this.setState({
      defaultValue: value,
    });
  };
  onInputChange = (val) => {
    let { rolemanage } = this.props;
    let { selectShareList = [] } = rolemanage;
    let searchList = selectShareList.filter((i) => i.name.includes(val));
    this.setState({
      searchList,
    });
  };
  render() {
    let { rolemanage, fetchSaveShareIdLoading = false } = this.props;
    let { selectShareList = [] } = rolemanage;
    let { defaultValue = [], searchList = [] } = this.state;
    return (
      <Dialog
        title="数据共享人"
        ref={this.dialogRef}
        width={400}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={this.state.loading}
        className={styles.dialogContainer}
        confirmLoading={fetchSaveShareIdLoading}
      >
        <div className={styles.DataShareSelectDialog}>
          <div className={styles.inputSearch}>
            <Input
              placeholder="请输入共享者姓名"
              autoComplete="off"
              allowClear
              onChange={(e) => {
                this.onInputChange(e.target.value);
              }}
            />
          </div>
          <div className={styles.checkboxGroup}>
            <Checkbox.Group onChange={this.onChange} defaultValue={defaultValue}>
              {searchList.map((item) => (
                <Row
                  key={item.id}
                  className={
                    searchList.length !== 0
                      ? `${styles.checkboxRow} ${styles.Active}`
                      : `${styles.checkboxRow}`
                  }
                >
                  <Checkbox value={item.id}>{item.name}</Checkbox>
                </Row>
              ))}
              {selectShareList.map((item) => (
                <Row
                  key={item.id}
                  className={
                    searchList.length === 0
                      ? `${styles.checkboxRow} ${styles.Active}`
                      : `${styles.checkboxRow}`
                  }
                >
                  <Checkbox value={item.id}>{item.name}</Checkbox>
                </Row>
              ))}
            </Checkbox.Group>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DataShareSelectDialog;
