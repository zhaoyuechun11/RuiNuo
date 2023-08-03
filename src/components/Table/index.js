import React, { Component } from 'react';
import { Table } from 'antd';
import { Icon } from '@components';
import style from './index.less';

export default class MyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSizeOptions: ['20', '50', '100'],
      footer: {},
      selectSureLoading: false,
      columns: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.props.onRefs && this.props.onRefs(this);
  }
  rowClassName = (record, index) => {
    if (index % 2 === 0) {
      return 'tr_even';
    }
    return 'tr_odd';
  };
  handleResize =
    (index) =>
    (e, { size }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return { columns: nextColumns };
      });
    };

  hideTableHeader = () => {
    this.setState({ selectedRowKeys: [] });
  };
  _getSelectedRowKeys = () => {
    return this.state.selectedRowKeys;
  };
  _getSelectedRows = () => {
    return this.state.selectedRows;
  };
  _setSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      columnWidth: '60px',
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
        this.props.onSelectCount &&
          this.props.onSelectCount(selectedRowKeys.length, selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.is_mask && record.is_mask === 1,
      }),
    };
    return (
      <div className={`${style.my_table} ${this.props.children ? style.paddingNone : ''}`}>
        <div
          className={style.my_table_handleBtn}
          style={{ display: selectedRowKeys.length === 0 ? 'none' : 'block' }}
        >
          <div className={`${style.btn_group} flex_between`}>
            <>{this.props.children}</>
            <span onClick={this.hideTableHeader} style={{ color: '#007BFF', cursor: 'pointer' }}>
              <Icon name="iconhouxuanren-liebiaoguanbi" />
            </span>
          </div>
        </div>
        <Table
          size={'small'}
          className={this.props.className || ''}
          onRow={this.props.onRow}
          rowSelection={this.props.children ? rowSelection : null}
          columns={this.props.columns}
          dataSource={this.props.dataSource}
          scroll={{ x: !this.props.scroll ? false : this.props.scroll }}
          rowClassName={this.props.rowClassName ? this.props.rowClassName : this.rowClassName}
          rowKey={this.props.rowKey}
          loading={this.props.loading}
          pagination={{
            pageSizeOptions: this.state.pageSizeOptions,
            ...this.props.pagination,
            showTotal: (total, range) => `共 ${total} 条`,
          }}
          onChange={this.props.handleTableChange}
          footer={this.props.footer}
          locale={{
            emptyText: this.props.loading ? (
              <div />
            ) : (
              <div
                className={style.emptyWarp}
                style={this.props.emptyStyle ? this.props.emptyStyle : { padding: '190px 0 320px' }}
              >
                <img
                  // eslint-disable-next-line global-require
                  src={require('@assets/images/empty/table_empty.png')}
                  alt=""
                />
                <div>暂无数据</div>
              </div>
            ),
          }}
        />
      </div>
    );
  }
}
