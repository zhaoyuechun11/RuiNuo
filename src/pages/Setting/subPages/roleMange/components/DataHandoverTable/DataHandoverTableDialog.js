import React, { Component } from 'react';
import Dialog from '@components/Dialog';
import styles from './index.less';
import { connect } from 'umi';
import { Form, Select, Input, Row, Col } from 'antd';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
// import Table from '@/pages/Recruitment/components/Table';

const statusList = [
  '待面试',
  '安排面试',
  '安排复试',
  '面试通过',
  '已发Offer',
  '待入职',
  '已入职',
  '人才库',
  '放弃入职',
  '淘汰',
];
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ rolemanage, loading }) => ({
  rolemanage,
  fetchPositionLoading: loading.effects['rolemanage/fetchAvailablePositionList'],
}))
class DataHandoverTableDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: [], // 已选择的table数据
      formValues: {
        position_name: undefined,
        page: 1,
        page_size: 20,
      },
    };
    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
    this.dialogRef = React.createRef();
  }
  onBeforeShow = () => {
    const { formValues = {} } = this.state;
    this.fetchSelectUser(formValues);
  };
  fetchSelectUser = (values) => {
    const { operator_id, enterprise_id, position_ids, id } = this.props;
    this.props.dispatch({
      type: 'rolemanage/fetchAvailablePositionList',
      payload: {
        from_operator_id: id,
        enterprise_id,
        // is_stop_recruitment: 2, //是否停止招聘 1:是,2:否
        // kind: 'own', //own:我创建的 relation:我相关的 is_distribute:未分配
        ...values,
        callback: () => {
          this.setState({
            loading: false,
            selectedRows: position_ids,
          });
        },
      },
    });
  };
  componentDidMount() {
    const { props } = this;
    const { parent } = props;
    parent.dialog = this.dialogRef.current;
  }
  columns = [
    {
      title: '职位信息',
      render: (text, record, index) => {
        const data = Object.values(record.total_count);
        // const departName = record.department_name ? `${record.department_name}` : null;
        const operateName =
          record.operator && record.operator.name ? `${record.operator.name}` : null;
        const { province_name, city_name, area_name } = record;
        const workAddress = [province_name, area_name, city_name].filter((item) => item).join('-');
        const worktypeFunction = {
          0: () => null,
          1: () => '全职',
          2: () => '实习生',
          3: () => '兼职',
          4: () => '劳务派遣',
          5: () => '外包',
          6: () => '钟点工',
          7: () => '退休返聘',
        };

        const summaryList = [
          worktypeFunction[record.work_type * 1 || 0](),
          operateName,
          workAddress,
        ].filter((item) => {
          return item !== null && item;
        });
        return (
          <div className={styles.position_message_left}>
            <div className={styles.pmi_top}>
              <h3 className={styles.pmitLeft}>{record.name || '-'}</h3>
              <div className={styles.pmitRight}>
                {/* <span>{departName}</span> */}
                {summaryList.map((item) => (
                  <span key={item} className={styles.positionSummary}>
                    {item}
                  </span>
                ))}
                {/* <span className={styles.positionSummary}>
                  {worktypeFunction[record.work_type * 1 || 0]()}
                </span>
                <span className={styles.positionSummary}>{operateName}</span>
                <span className={styles.positionSummary}>{workAddress}</span> */}
              </div>
            </div>
            <Row className={styles.pmi_bottom}>
              {data.length > 0 &&
                data.map((i) => (
                  <Col className={styles.pmib_item} key={i.id}>
                    <div className={styles.pmib_item_text}>{i.name}</div>
                    <div className={styles.pmib_item_count}>{i.value}</div>
                  </Col>
                ))}
            </Row>
          </div>
        );
      },
    },
  ];
  onOk = () => {
    const { selectedRows = [] } = this.state;
    const { callback } = this.props;
    const formData = {
      selectedRows,
    };
    isFunction(callback) && callback(formData);
    this.dialogRef.current.hide();
  };
  onClose = () => {
    this.setState({
      loading: true,
    });
  };
  handleSearch = (changedValues, allValues) => {
    const { formValues } = this.state;
    const values = {
      ...formValues,
      page: 1,
      ...allValues,
    };

    this.setState({
      formValues: values,
    });
    this.fetchSelectUser(values);
  };
  tapClear = () => {
    const { formValues } = this.state;
    formValues.position_name = undefined;
    this.setState(
      {
        formValues,
      },
      () => {
        this.fetchSelectUser(this.state.formValues);
      },
    );
  };
  // 监听职位名称的值
  changeInput = (e) => {
    const { formValues } = this.state;
    formValues.position_name = e.target.value || undefined;
    this.setState({
      formValues,
    });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      page: pagination.current,
      page_size: pagination.pageSize,
      ...filters,
    };
    this.setState({
      formValues: params,
      selectedRows: [],
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchSelectUser(params);
  };
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  renderForm = () => {
    return (
      <div className={styles.formStyle}>
        <Form layout="inline">
          <FormItem label="职位名称">
            <Input
              placeholder="请输入职位名称"
              onChange={(e) => this.changeInput(e)}
              value={this.state.formValues.position_name}
            />
          </FormItem>
        </Form>
        <div className={styles.formBtn}>
          <div className={`${styles.reset}  ${styles.button}`} onClick={this.tapClear}>
            清空
          </div>
          <div className={`${styles.primary}  ${styles.button}`} onClick={this.handleSearch}>
            查询
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { rolemanage, fetchPositionLoading = true } = this.props;
    const { availablePositionList = {} } = rolemanage;

    const { selectedRows = [] } = this.state;
    return (
      <Dialog
        title="数据"
        ref={this.dialogRef}
        width={950}
        onBeforeShow={this.onBeforeShow}
        onOk={this.onOk}
        onClose={this.onClose}
        loading={this.state.loading}
        className={styles.dialogContainer}
      >
        <div className={styles.DataHandoverTableDialog}>
          <div className={styles.head}>交接的数据只能是交接人创建的候选人和创建的职位。</div>
          {this.renderForm()}
          {/* <Table
            unit="个"
            className={styles.tablePadding}
            columns={this.columns}
            selectedRows={selectedRows}
            selectedRowKeys={selectedRows.map((i) => i.id)}
            data={availablePositionList}
            loading={fetchPositionLoading}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            isRowSelection={true}
          /> */}
        </div>
      </Dialog>
    );
  }
}

export default DataHandoverTableDialog;
