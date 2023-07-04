import React, {
  Component,
  Fragment,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Modal, Row, Col } from 'antd';
import { Dialog } from '@components';
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import style from './index.less';

const CheckboxGroup = Checkbox.Group;

const SetHeaderModal = ({refs,...props}) => {
  const { columnOptions, columnChecked, defaultChecked, handleChangeColumn } = props;
  const [exportVisible, setExportVisible] = useState(false); //是否显示弹窗
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [optionsLength, setOptionsLength] = useState(0); // 所有选项的长度
  const [checkedList, setCheckedList] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const dialog = useRef();
  useImperativeHandle(refs, () => ({
    show: () => {
      dialog.current && dialog.current.show();
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  useEffect(() => {
    let optionsLength = 0;
    for (let key in columnOptions) {
      optionsLength += columnOptions[key].length;
    }
    setOptionsLength(optionsLength);
    setCheckedList(JSON.parse(JSON.stringify(columnChecked)));
    setCheckAll(columnChecked.length === optionsLength);
  }, []);
  useEffect(() => {
    setCheckedList(JSON.parse(JSON.stringify(columnChecked)));
    setCheckAll(columnChecked.length === optionsLength);
  }, [columnChecked]);
  // 显示弹窗
  const onShowExportModal = () => {
    setCheckedList(JSON.parse(JSON.stringify(columnChecked)));
    setExportVisible(true);
    dialog.current && dialog.current.show();
  };
  // 选中字段
  const onCheckboxChange = (list) => {
    setCheckedList(list);
    setCheckAll(list.length === optionsLength);
  };
  // 全选
  const onCheckAllChange = (e) => {
    let arr = [];
    for (let key in columnOptions) {
      columnOptions[key].map((item) => {
        arr.push(item.value);
      });
    }
    setCheckedList(e.target.checked ? arr : []);
    setCheckAll(e.target.checked);
  };
  // 删除一项
  const deleteItem = (index) => {
    let list = checkedList ? JSON.parse(JSON.stringify(checkedList)) : [];
    list.splice(index, 1);
    setCheckedList(list);
  };
  // 拖拽结束
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const checkedListResult = reOrder(checkedList, result.source.index, result.destination.index);

    setCheckedList(checkedListResult);
  };
  // 移动元素在数组中的位置
  const reOrder = (list, startIndex, endIndex) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
    return list;
  };
  // 恢复默认
  const reset = () => {
    setCheckedList(defaultChecked);
  };
  // 导出弹窗点击确认
  const handleExportOk = () => {
    handleChangeColumn(checkedList);
    setExportVisible(false);
    dialog.current && dialog.current.hide();
  };
  // 导出弹窗点击取消
  const handleExportCancel = () => {
    setExportVisible(false);
    dialog.current && dialog.current.hide();
  };

  return (
    <div>
      <Dialog
        ref={dialog}
        width={950}
        confirmLoading={exportLoading}
        bodyStyle={{ padding: '0 0 0 30px' }}
        className={style.exportModal}
        title="自定义表头字段4"
        destroyOnClose={true}
        maskClosable={false}
        visible={exportVisible}
        onOk={handleExportOk}
        onCancel={handleExportCancel}
        afterClose={() => setExportLoading(false)}
      >
        <div className={style.modalContent}>
          <div className={style.modalLeft}>
            33
            {/*<div className={style.checkAll}>*/}
            {/*<Checkbox*/}
            {/*onChange={this.onCheckAllChange}*/}
            {/*checked={this.state.checkAll}*/}
            {/*>*/}
            {/*<span className={style.title}>全选</span>*/}
            {/*</Checkbox>*/}
            {/*</div>*/}
            {/* <CheckboxGroup value={checkedList} onChange={onCheckboxChange}>
              {(() => {
                let arr = [];
                for (let key in columnOptions) {
                  arr.push(
                    <Fragment key={key}>
                      <div className={style.title}>{key}</div>
                      <Row>
                        {columnOptions[key].map((item, index) => {
                          if (item.label !== '评论') {
                            return (
                              <Col span={6} key={item.name}>
                                <Checkbox
                                  disabled={item.is_disabled == 1}
                                  value={
                                    item.key +
                                    ',' +
                                    item.name +
                                    ',' +
                                    item.module_id +
                                    ',' +
                                    item.structure_id
                                  }
                                >
                                  {item.name}
                                </Checkbox>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </Fragment>,
                  );
                }
                return arr;
              })()}
            </CheckboxGroup> */}
          </div>
          {/* <div className={style.modalRight}>
            <div className="flex_between" style={{ padding: '20px 30px 0' }}>
              <span className={style.tip1}>
                至少选择2个，已选择
                {checkedList ? checkedList.length : 0}个
              </span>
              <span className={style.tip2} onClick={reset}>
                恢复默认
              </span>
            </div>
            <div className={style.scrollView}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {checkedList.map((item, index) => {
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
                                          onClick={() => deleteItem(index)}
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
          </div> */}
        </div>
      </Dialog>
    </div>
  );
};
export default SetHeaderModal;
