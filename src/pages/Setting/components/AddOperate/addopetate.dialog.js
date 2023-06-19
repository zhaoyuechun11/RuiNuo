import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import { connect, history } from 'umi';
import { Form, Checkbox, Row, Col, Input, message } from 'antd';
import styles from './index.less';
import has from 'lodash/has';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { getConfigPinyin } from '@/utils';

const FormItem = Form.Item;
const Group = Checkbox.Group;

@connect(({ addposition, loading }) => ({
  addposition,
  addLoading: loading.effects['addposition/fetchAddCol'],
}))
class AddOperateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      checkboxValue: [],
      searchList: [],
      sessionList: [],
      checkedList: [],
      isSearch: false,
      operatorId: localStorage.getItem('operator_id'),
    };
    this.formRef = React.createRef();
    this.onInputChange = debounce(this.onInputChange.bind(this), 500);
  }
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.refs.AddOperateDialog;
  }
  onBeforeShow = () => {
    this.props.dispatch({
      type: 'addposition/fetchOperatorList',
      payload: {
        enterprise_id: this.props.enterprise_id,
        operator_id: this.props.operator_id,
        self: 1,
        // page: 1,
        // page_size: 1000,
        // type: this.props.isFilter ? 'child_same' : '',
        callback: () => {
          this.setState({
            loading: false,
          });
          let { addposition, addLoading = false } = this.props;
          let { operateList = [] } = addposition;
          let ids = this.props.selectedOperateList.map((item) => item.id);
          //
          operateList.forEach((item) => {
            item.is_checked = ids.includes(item.id) ? true : false;
          });
          this.setState(
            {
              searchList: operateList,
              checkedList: JSON.parse(JSON.stringify(operateList)),
            },
            () => {},
          );
          // this.formRef.current.setFieldsValue({
          //   xzz: this.props.selectedOperateList.map(item => item.id),
          // });
        },
      },
    });
  };
  onOk = () => {
    // let form = this.formRef.current;
    // form.submit();
    let { checkedList } = this.state;
    let sessionList = [];
    let { isList } = this.props;
    checkedList.forEach((item) => {
      if (item.is_checked) {
        sessionList.push(item.id);
      }
    });

    // 判断是否是批量添加 如果是直接返回
    let { isBatch = false, callback } = this.props;
    if (isBatch) {
      if (sessionList.length > 5) {
        message.warning('一次最多只能选择5个协作者');
        return;
      }
      isFunction(callback) && callback(sessionList);
      this.refs.AddOperateDialog.hide();
      return;
    }
    let { id = '' } = history.location.query || {};
    if (id) {
      if (sessionList.length == 0) {
        message.warn('请选择协作者');
        return;
      }
      this.props.dispatch({
        type: 'addposition/fetchAddCol',
        payload: {
          collaborator_id: sessionList.join(','),
          position_id: id,
          enterprise_id: this.props.enterprise_id,
          operator_id: this.props.operator_id,
          callback: () => {
            isFunction(callback) && callback(sessionList);
            this.refs.AddOperateDialog.hide();
          },
        },
      });
      return false;
    }
    if (isList) {
      if (sessionList.length == 0) {
        message.warn('请选择接收人');
        return;
      }
      isFunction(callback) && callback(sessionList);
      this.refs.AddOperateDialog.hide();
      return;
    }
    isFunction(callback) && callback(sessionList);
    this.refs.AddOperateDialog.hide();
  };
  onFinish = (values) => {};
  onInputChange = (val) => {
    let { addposition } = this.props;
    let { operateList = [] } = addposition;
    let searchList = [];
    this.setState({
      isSearch: searchList.length ? false : true,
    });
    searchList = operateList.filter(
      (i) => getConfigPinyin(i.name).indexOf(getConfigPinyin(val)) >= 0,
    );
    this.setState({
      searchList,
    });
  };
  onClose = () => {
    this.setState({
      loading: true,
      searchList: [],
      isSearch: false,
    });
  };
  choiceActoer = (e, d) => {
    let vals = e.target.checked;
    let { searchList, checkedList } = this.state;
    let newActorList = searchList.map((c) => {
      if (c.id == d.id) {
        c.is_checked = vals;
        return c;
      } else {
        return c;
      }
    });
    let newCheckedList = checkedList.map((c) => {
      if (c.id == d.id) {
        c.is_checked = vals;
        return c;
      } else {
        return c;
      }
    });
    this.setState({
      checkedList: newCheckedList,
      searchList: newActorList,
    });
  };
  render() {
    let { addposition, addLoading = false } = this.props;
    let { operateList = [] } = addposition;
    let { searchList = [], isSearch, operatorId } = this.state;
    return (
      <Dialog
        title="添加协作人"
        ref="AddOperateDialog"
        loading={this.state.loading}
        width={640}
        onOk={this.onOk}
        onClose={this.onClose}
        onBeforeShow={this.onBeforeShow}
        confirmLoading={addLoading}
      >
        <div className={styles.inputSearch}>
          {operateList.length > 0 ? (
            <Input
              placeholder="请输入协作人姓名"
              autoComplete="off"
              allowClear
              onChange={(e) => {
                this.onInputChange(e.target.value);
              }}
            />
          ) : null}
        </div>
        <div className={styles.addoperateForm}>
          <Form
            ref={this.formRef}
            // onFinish={this.onFinish}
          >
            <FormItem>
              {operateList.length > 0 ? (
                // <Group>
                <Row>
                  {
                    // searchList.length > 0 || isSearch ?
                    searchList.map((item, index) => (
                      <Col span={8} key={item.id} style={{ marginBottom: 20 }}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={item.is_checked}
                          disabled={item.id == operatorId}
                          onChange={(e) => this.choiceActoer(e, item)}
                        >
                          <span>{item.name}</span>
                        </Checkbox>
                      </Col>
                    ))
                    // : operateList.map((item, index) => (
                    //   <Col span={8} key={item.id}>
                    //     <Checkbox  checked={d.is_checked}  onChange={e => this.choiceActoer(e, d)}>
                    //       <span>{item.name}</span>
                    //     </Checkbox>
                    //   </Col>
                    // ))
                  }
                </Row>
              ) : (
                // </Group>
                <div className={styles.noData}>
                  <img
                    src={require('@assets/images/empty/table_empty.png')}
                    alt=""
                    width="115px"
                    height="99px"
                  />
                  <div style={{ marginTop: '20px' }}>暂无接收人</div>
                </div>
              )}
            </FormItem>
          </Form>
        </div>
      </Dialog>
    );
  }
}

export default AddOperateDialog;
