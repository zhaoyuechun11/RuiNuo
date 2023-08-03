import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';


function initTotalList(columns) {
  const totalList = [];
  columns.forEach((column) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

export default class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: this.props.selectedRowKeys || [],
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map((item) => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };
  render() {
 
    const { selectedRowKeys = [], classStyle } = this.props;
    const { data = [], rowKey, isRowSelection, pagination, unit = '', ...rest } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        {/* {selectedRowKeys.length > 0 && (
          <div className={`${styles.selectedHead} ${classStyle}`}>
            <div className={styles.selectedCount}>
              <span>
                已选中 {selectedRowKeys.length} {unit}
              </span>
              {this.props.children}
            </div>
          </div>
        )} */}
        {isRowSelection ? (
          <Table
            size={'small'}
            rowKey={rowKey || 'key'}
            rowSelection={rowSelection}
            dataSource={data}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            locale={{
              emptyText: (
                <div
                  className={styles.emptyWarp}
                  style={
                    this.props.emptyStyle ? this.props.emptyStyle : { padding: '190px 0 320px' }
                  }
                >
                  <img src={require('@assets/images/empty/table_empty.png')} alt="" />
                  <div>暂无数据</div>
                </div>
              ),
            }}
            {...rest}
          />
        ) : (
          <Table
            size={'small'}
            rowKey={rowKey || 'key'}
            dataSource={data}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            {...rest}
            scroll={{ x: true }}
            locale={{
              emptyText: (
                <div
                  className={styles.emptyWarp}
                  style={
                    this.props.emptyStyle ? this.props.emptyStyle : { padding: '190px 0 320px' }
                  }
                >
                  <img src={require('@assets/images/empty/table_empty.png')} alt="" />
                  <div>暂无数据</div>
                </div>
              ),
            }}
          />
        )}
      </div>
    );
  }
}
