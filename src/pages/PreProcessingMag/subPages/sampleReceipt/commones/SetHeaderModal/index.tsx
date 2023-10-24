import React, {
  Component,
  Fragment,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Checkbox, Modal, Row, Col } from 'antd';
import { Dialog } from '@components';
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import style from './index.less';

const CheckboxGroup = Checkbox.Group;

const SetHeaderModal = ({ refs, ...props }) => {
  const { columnOptions, columnChecked, defaultChecked, handleChangeColumn } = props;
  const [exportVisible, setExportVisible] = useState(false); //是否显示弹窗
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [checkedList, setCheckedList] = useState([]);
  const [rightCheckedList, setRightCheckedList] = useState([]);
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
    setCheckedList(columnChecked);
  }, []);

  useEffect(() => {
    let ids = columnChecked.map((item) => {
      return item.id;
    });

    setCheckedList(ids);
    let listSeqs = columnChecked.map((item) => {
      return item.listSeq;
    });

    let sortResult = listSeqs.sort(function (a, b) {
      return a - b;
    });
    let rightResult = [];
    sortResult.map((item) => {
      columnChecked.map((checkItem) => {
        if (checkItem.listSeq === item) {
          rightResult.push(checkItem);
        }
      });
    });
    setRightCheckedList(rightResult);
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
    let filterResult = [];
    columnOptions.map((item) => {
      list.map((element) => {
        if (item.id === element) {
          filterResult.push(item);
        }
      });
    });

    setRightCheckedList(filterResult);
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
  const deleteItem = (index, id) => {
    let list = checkedList.filter((item) => item != id);
    // let list = checkedList ? checkedList : [];
    // list.splice(index, 1);
    console.log('list', list);
    setCheckedList(list);
    let filterResult = [];
    columnOptions.map((item) => {
      list.map((element) => {
        if (item.id === element) {
          filterResult.push(item);
        }
      });
    });
    setRightCheckedList(filterResult);
  };
  // 拖拽结束
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const checkedListResult = reOrder(checkedList, result.source.index, result.destination.index);
    setCheckedList(checkedListResult);
    let filterResult = [];
    checkedListResult.map((item) => {
      columnOptions.map((element) => {
        if (element.id === item) {
          filterResult.push(element);
        }
      });
    });
    setRightCheckedList(filterResult);
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
    let ids = rightCheckedList.map((item) => {
      return item.id;
    });
    handleChangeColumn(ids);
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
        title="自定义表头字段"
        destroyOnClose={true}
        maskClosable={false}
        visible={exportVisible}
        onOk={handleExportOk}
        onCancel={handleExportCancel}
        afterClose={() => setExportLoading(false)}
      >
        <div className={style.modalContent}>
          <div className={style.modalLeft}>
            {/*<div className={style.checkAll}>*/}
            {/*<Checkbox*/}
            {/*onChange={this.onCheckAllChange}*/}
            {/*checked={this.state.checkAll}*/}
            {/*>*/}
            {/*<span className={style.title}>全选</span>*/}
            {/*</Checkbox>*/}
            {/*</div>*/}
            <CheckboxGroup value={checkedList} onChange={onCheckboxChange}>
              <Fragment>
                <Row>
                  {columnOptions.map((item, index) => {
                    return (
                      <Col span={6} key={item.name}>
                        <Checkbox
                          value={item.id}
                          disabled={
                            item.key === 'id' ||
                            item.key === 'receiveBarcode' ||
                            item.key === 'hospitalName' ||
                            item.key === 'sendDoctorName' ||
                            item.key === 'patientName' ||
                            item.key === 'sexName' ||
                            item.key === 'age' ||
                            item.key === 'ageUnitName' ||
                            item.key === 'sampleType' ||
                            item.key === 'reqItemName' ||
                            item.key === 'collectDate' ||
                            item.key === 'receiveDate'
                          }
                        >
                          {item.name}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Fragment>
              ,
            </CheckboxGroup>
          </div>
          <div className={style.modalRight}>
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
                      {rightCheckedList.map((item, index) => {
                        if (index === 0 || index === 1 || index === 2) {
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
                                  <div className={style.text}>{item.name}</div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <Draggable key={item.key} draggableId={item.key} index={index}>
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
                                        <div className={style.text}>{item.name}</div>
                                      </div>
                                      <CloseCircleOutlined
                                        className={style.icon}
                                        onClick={() => deleteItem(index, item.id)}
                                      />
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
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
    </div>
  );
};
export default SetHeaderModal;
