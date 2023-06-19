import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect } from 'umi';
import {
  Form,
  Radio,
  Tree,
  Checkbox,
  Select,
  TreeSelect,
  message,
  Input,
  Row,
} from 'antd';
import  isFunction from 'lodash/isFunction';
import  debounce from 'lodash/debounce';

const FormItem = Form.Item;
@connect(({ rolemanage, loading }) => ({
  rolemanage,
}))
class DataHandoverSelectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      defaultValue: '', //默认选中的值
      searchList: [], //搜索之后的数据
    };
    this.dialogRef = React.createRef();
    this.onInputChange = debounce(this.onInputChange.bind(this), 500);
  }
  onBeforeShow = () => {
    let {
      operator_id,
      enterprise_id,
      from_operator_id,
      to_operator_id,
    } = this.props;
    this.props.dispatch({
      type: 'rolemanage/fetchOperatorList',
      payload: {
        operator_id,
        enterprise_id,
        from_operator_id,
        callback: () => {
          this.setState({
            loading: false,
            defaultValue: to_operator_id,
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
    let { defaultValue } = this.state;
    let { rolemanage } = this.props;
    let { operatorList = [] } = rolemanage;
    let { callback } = this.props;
    let formData = {
      to_operator_id: defaultValue,
      name: operatorList.find(i => i.id === defaultValue).name,
    };
    this.dialogRef.current.hide();
    isFunction(callback) && callback(formData);
  };
  onClose = () => {
    this.setState({
      loading: true,
      searchList: [],
    });
  };
  onChange = value => {
    this.setState({
      defaultValue: value.target.value,
    });
  };
  onInputChange = val => {
    let { rolemanage } = this.props;
    let { operatorList = [] } = rolemanage;
    let searchList = operatorList.filter(i => i.name.includes(val));
    this.setState({
      searchList,
    });
  };
  render() {
    let { rolemanage } = this.props;
    let { operatorList = [] } = rolemanage;
    let { defaultValue = '', searchList = [] } = this.state;
    return (
      <Dialog
        title="接收负责人"
        ref={this.dialogRef}
        width={400}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={this.state.loading}
        className={styles.dialogContainer}
      >
        <div className={styles.DataShareSelectDialog}>
          <div className={styles.inputSearch}>
            <Input
              placeholder="请输入负责人姓名"
              autoComplete="off"
              allowClear
              onChange={e => {
                this.onInputChange(e.target.value);
              }}
            />
          </div>
          <div className={styles.checkboxGroup}>
            <Radio.Group onChange={this.onChange} defaultValue={defaultValue}>
              {searchList.map(item => (
                <Row
                  key={item.id}
                  className={
                    searchList.length !== 0
                      ? `${styles.checkboxRow} ${styles.Active}`
                      : `${styles.checkboxRow}`
                  }
                >
                  <Radio value={item.id}>{item.name}</Radio>
                </Row>
              ))}
              {operatorList.map(item => (
                <Row
                  key={item.id}
                  className={
                    searchList.length === 0
                      ? `${styles.checkboxRow} ${styles.Active}`
                      : `${styles.checkboxRow}`
                  }
                >
                  <Radio value={item.id}>{item.name}</Radio>
                </Row>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DataHandoverSelectDialog;
