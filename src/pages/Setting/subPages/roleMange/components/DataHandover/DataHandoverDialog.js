import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect } from 'umi';
import { Form, Radio, Tree, Select, TreeSelect, message } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import { DownOutlined } from '@ant-design/icons';
import DataHandoverSelect from '../DataHandoverSelect';
import DataHandoverTable from '../DataHandoverTable';

const FormItem = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@connect(({ rolemanage, loading }) => ({
  rolemanage,
  transferLoading: loading.effects['rolemanage/transferSave'],
}))
class DataHandoverDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to_operator_id_name: '',
      to_operator_id: '',
      position_ids: [],
    };
    this.dialogRef = React.createRef();
    this.formRef = React.createRef();
    this.onBeforeShow = debounce(this.onBeforeShow.bind(this));
  }
  onBeforeShow = () => {
    let form = this.formRef.current;
    let { from_operator_id } = this.props;
    form.setFieldsValue({
      from_operator_id,
    });
  };
  componentDidMount() {
    let props = this.props;
    let parent = props.parent;
    parent.dialog = this.dialogRef.current;
  }
  onOk = () => {
    this.formRef.current.submit();
  };
  onClose = () => {};
  onFinish = (values) => {
    let { operator_id, enterprise_id, from_operator_id } = this.props;
    let formData = {
      operator_id,
      enterprise_id,
      from_operator_id,
      ...values,
    };
    //
    this.props.dispatch({
      type: 'rolemanage/transferSave',
      payload: {
        ...formData,
        callback: () => {
          let { onReload } = this.props;
          message.success('交接完成', 2.5);
          this.dialogRef.current.hide();
          isFunction(onReload) && onReload();
        },
      },
    });
  };
  render() {
    let {
      name = '',
      operator_id,
      enterprise_id,
      from_operator_id,
      id,
      transferLoading = false,
    } = this.props;
    let { to_operator_id_name, to_operator_id, position_ids } = this.state;
    return (
      <Dialog
        title="数据交接"
        ref={this.dialogRef}
        width={640}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={false}
        confirmLoading={transferLoading}
      >
        <div className={styles.DataHandoverDialog}>
          <Form ref={this.formRef} name="DataHandoverDialog" onFinish={this.onFinish} {...layout}>
            <div className={styles.head}>
              将所有数据交接给接收人，交接完成后，交接的数据所有权转移给接收人，原持有人不可查看该数据。
            </div>
            <FormItem label="当前负责人" className={styles.labelStyle} name="from_operator_id">
              <div className={styles.name}>{name}</div>
            </FormItem>
            <FormItem
              label="接收负责人"
              name="to_operator_id"
              className={styles.labelStyle}
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
            >
              <DataHandoverSelect
                operator_id={operator_id}
                enterprise_id={enterprise_id}
                from_operator_id={from_operator_id}
                to_operator_id={to_operator_id}
                callback={(data) => {
                  let { to_operator_id, name } = data;
                  let form = this.formRef.current;
                  this.setState({
                    to_operator_id_name: name,
                    to_operator_id,
                  });
                  form.setFieldsValue({
                    to_operator_id,
                  });
                }}
              >
                <div className={styles.to_operator_id}>
                  {!to_operator_id_name && <div className={styles.placeholder}>请选择负责人</div>}
                  {to_operator_id_name.length > 0 && (
                    <div className={styles.title}>{to_operator_id_name}</div>
                  )}
                  <DownOutlined className={styles.down} />
                </div>
              </DataHandoverSelect>
            </FormItem>
            <FormItem
              label="交接信息"
              className={styles.labelStyle}
              name="position_ids"
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
            >
              <DataHandoverTable
                operator_id={operator_id}
                id={id}
                enterprise_id={enterprise_id}
                position_ids={position_ids}
                callback={(data) => {
                  let { selectedRows } = data;
                  let form = this.formRef.current;
                  this.setState({
                    position_ids: selectedRows,
                  });
                  form.setFieldsValue({
                    position_ids: selectedRows.map((i) => i.id).join(','),
                  });
                }}
              >
                <div className={styles.user_ids}>
                  {position_ids.length === 0 && (
                    <div className={styles.placeholder}>请选择要交接的数据</div>
                  )}
                  {position_ids.length > 0 && (
                    <div className={styles.title}>已选择{position_ids.length}条数据</div>
                  )}
                  <DownOutlined className={styles.down} />
                </div>
              </DataHandoverTable>
            </FormItem>
          </Form>
        </div>
      </Dialog>
    );
  }
}

export default DataHandoverDialog;
