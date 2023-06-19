import React, { Component } from 'react';
import { Table } from 'antd';
import { Icon } from '@components';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import style from './index.less';
import './index.less';

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

export default class SortableTable extends Component {
  constructor(props){
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
    if (index % 2 == 0) {
      return 'tr_even';
    } else {
      return 'tr_odd';
    }
  };
  handleResize = index => (e, { size }) => {
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.props;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      this.props.onSortEnd(newData);
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const id = dataSource.findIndex(x => x.id === restProps['data-row-key']);
    return <SortableItem index={id} {...restProps} />;
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { dataSource, columns, loading, pagination, onRow, children, scroll, 
            rowClassName, rowKey, handleTableChange, footer, emptyStyle} = this.props;
    const rowSelection = {
      columnWidth: '60px',
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
        this.props.onSelectCount &&
          this.props.onSelectCount(
            selectedRowKeys.length,
            selectedRowKeys,
            selectedRows,
          );
      },
      getCheckboxProps: record => ({
        disabled:record.is_mask && record.is_mask===1
      })
    };
    return (
      <div
        className={`${style.my_table} ${
          this.props.children ? style.paddingNone : ''
        }`}
      >
        <div
          className={style.my_table_handleBtn}
          style={{ display: selectedRowKeys.length == 0 ? 'none' : 'block' }}
        >
          <div className={`${style.btn_group} flex_between`}>
            <>{this.props.children}</>
            <span
              onClick={this.hideTableHeader}
              style={{ color: '#007BFF', cursor: 'pointer' }}
            >
              <Icon name="iconhouxuanren-liebiaoguanbi" />
            </span>
          </div>
        </div>
        <Table
          onRow={onRow}
          rowSelection={children ? rowSelection : null}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: !scroll ? false : scroll }}
          rowClassName={
            rowClassName
              ? rowClassName
              : this.rowClassName
          }
          rowKey={rowKey}
          loading={loading}
          pagination={{
            pageSizeOptions: this.state.pageSizeOptions,
            ...pagination,
            showTotal: (total, range) => `共 ${total} 条`,
          }}
          components={{ 
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
          onChange={handleTableChange}
          footer={footer}
          locale={{
            emptyText: loading?(<div/>):(
              <div
                className={style.emptyWarp}
                style={
                  emptyStyle
                    ? emptyStyle
                    : { padding: '190px 0 320px' }
                }
              >
                <img
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