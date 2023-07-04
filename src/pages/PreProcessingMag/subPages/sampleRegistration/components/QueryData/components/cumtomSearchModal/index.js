import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Row, Col } from 'antd';
import { Dialog } from '@components';
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import style from './index.less';
// import { EXPORT_OPTIONS_FOR_SEARCH, CHECKED_LIST_FOR_SEARCH } from '@utils/constant';
// import { setColumnsListOld } from '../../../../models/server';
const CheckboxGroup = Checkbox.Group;

class CustomSearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportLoading: false, // 是否显示loading
      exportVisible: false, // 是否显示弹窗
      checkAll: true, // 是否全选
      optionsLength: 0, // 所有选项的长度
      // columnOptions: EXPORT_OPTIONS_FOR_SEARCH,
      // defaultChecked: CHECKED_LIST_FOR_SEARCH,
      columnOptions: [],
      defaultChecked: [],
      checkedList: [],
    };
    this.dialog = React.createRef();
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}
  // 显示弹窗
  onShowExportModal = () => {
    this.setState(
      {
        exportVisible: true,
        checkedList: this.props.checkedList,
        defaultChecked: this.props.checkedList,
      },
      () => {
        this.dialog.current && this.dialog.current.show();
      },
    );
  };
  // 选中字段
  onCheckboxChange = (list) => {
    this.setState({
      checkedList: list,
      checkAll: list.length === this.state.optionsLength,
    });
  };
  // 全选
  onCheckAllChange = (e) => {
    let arr = [];
    for (let key in this.state.columnOptions) {
      this.state.columnOptions[key].map((item) => {
        arr.push(item.value);
      });
    }
    this.setState({
      checkedList: e.target.checked ? arr : [],
      checkAll: e.target.checked,
    });
  };
  // 删除一项
  deleteItem(index) {
    let list = this.state.checkedList ? JSON.parse(JSON.stringify(this.state.checkedList)) : [];
    list.splice(index, 1);
    this.setState({
      checkedList: list,
    });
  }
  // 拖拽结束
  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const _this = this;
    const checkedList = this.reOrder(
      _this.state.checkedList,
      result.source.index,
      result.destination.index,
    );
    this.setState({
      checkedList,
    });
  };
  // 移动元素在数组中的位置
  reOrder = (list, startIndex, endIndex) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
    return list;
  };
  // 恢复默认
  reset = () => {
    this.setState({
      checkedList: CHECKED_LIST_FOR_SEARCH,
    });
  };
  // 导出弹窗点击确认
  handleExportOk = () => {
    setColumnsListOld({
      type: 1,
      candidate_type: 9,
      json: JSON.stringify(this.state.checkedList),
    }).then((res) => {
      if (res.status_code == 200) {
        this.props.refresh();
        this.setState(
          {
            exportVisible: false,
          },
          () => {
            this.dialog.current && this.dialog.current.hide();
          },
        );
      }
    });
  };
  // 导出弹窗点击取消
  handleExportCancel = () => {
    this.setState(
      {
        exportVisible: false,
      },
      () => {
        this.dialog.current && this.dialog.current.hide();
      },
    );
  };

  render() {
    return (
      <Dialog
        ref={this.dialog}
        width={950}
        zIndex={100000}
        confirmLoading={this.state.exportLoading}
        bodyStyle={{ padding: '0 0 0 30px' }}
        className={style.exportModal}
        title="自定义筛选条件"
        destroyOnClose={true}
        maskClosable={false}
        visible={this.state.exportVisible}
        onOk={this.handleExportOk}
        onCancel={this.handleExportCancel}
        afterClose={() => {
          this.setState({ exportLoading: false });
        }}
      >
        <div className={style.modalContent}>
          <div className={style.modalLeft}>
            <CheckboxGroup value={this.state.checkedList} onChange={this.onCheckboxChange}>
              {(() => {
                let arr = [];
                for (let key in this.state.columnOptions) {
                  arr.push(
                    <Fragment key={key}>
                      <div className={style.title}>{key}</div>
                      <Row>
                        {this.state.columnOptions[key].map((item, index) => {
                          return (
                            <Col span={8} key={index}>
                              <Checkbox
                                disabled={item.disabled}
                                value={item.value + ',' + item.label + ',' + item.weight}
                              >
                                {item.label}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </Fragment>,
                  );
                }
                return arr;
              })()}
            </CheckboxGroup>
          </div>
          <div className={style.modalRight}>
            <div className="flex_between" style={{ padding: '20px 30px 0' }}>
              <span className={style.tip1}>
                至少选择2个，已选择
                {this.state.checkedList ? this.state.checkedList.length : 0}个
              </span>
              <span className={style.tip2} onClick={this.reset}>
                恢复默认
              </span>
            </div>
            <div className={style.scrollView}>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} key={provided}>
                      {this.state.checkedList.map((item, index) => {
                        if (item.indexOf(',') > -1) {
                          if (index === 0 || index === 1) {
                            return (
                              <div key={index}>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${style.dragItem} ${style.disabled}`}
                                  key={item.id}
                                >
                                  <div className="flex_start">
                                    <MenuOutlined className={style.icon} />
                                    <div className={style.text}>{item.split(',')[1]}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <Draggable
                                key={item.split(',')[0]}
                                draggableId={item.split(',')[0]}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={style.dragItem}
                                        key={item.id}
                                      >
                                        <div className="flex_start">
                                          <MenuOutlined className={style.icon} />
                                          <div className={style.text}>{item.split(',')[1]}</div>
                                        </div>
                                        <CloseCircleOutlined
                                          className={style.icon}
                                          onClick={() => this.deleteItem(index)}
                                        />
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          }
                        }
                      })}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

CustomSearchModal.propTypes = {
  columnOptions: PropTypes.object, // 可导出表格的所有的字段列表
  columnChecked: PropTypes.array, // 可导出表格的选中字段列表
  defaultChecked: PropTypes.array, // 可导出表格的默认选中字段列表
  handleChangeColumn: PropTypes.func, // 改变表头的回调
};

CustomSearchModal.defaultProps = {
  columnOptions: {},
  columnChecked: [],
  defaultChecked: [],
  handleChangeColumn: () => {},
};

export default CustomSearchModal;
