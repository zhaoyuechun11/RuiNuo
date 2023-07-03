import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog } from '@components';
import s from './index.less';

import { moveModule, patchMove } from '../../models/server';
const { confirm } = Modal;

const Index = ({ moveModelRef, resumeList, refresh, operator_id, enterprise_id }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [modelData, setModelData] = useState();
  const [dragId, setDragId] = useState();
  const [hoverId, setHoverId] = useState();
  useImperativeHandle(moveModelRef, () => ({
    showModal: showModal,
  }));
  const showModal = () => {
    dialogRef.current && dialogRef.current.show();
  };
  useEffect(() => {
    setModelData(resumeList);
  }, [resumeList]);
  // 重新记录数组顺序
  const reorder = (list, startIndex, endIndex) => {
    setDragId(list[startIndex].id);
    setHoverId(list[endIndex].id);
    const result = Array.from(list);
    //删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    //将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
  };

  const grid = 20;

  // 设置样式
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    ...draggableStyle,
  });

  const getListStyle = () => ({
    display: 'flex',
    padding: `0 ${grid}px`,
    flexWrap: 'wrap',
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === 0) {
      return;
    }
    if (result.source.index === 0) {
      message.warn('第一项不能拖拽哦');
      return;
    }
    const items = reorder(modelData, result.source.index, result.destination.index);
    setModelData(items);
  };

  const onFinish = () => {
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      resume_module_json: JSON.stringify(modelData),
    };
    patchMove(params).then((res) => {
      if (res.status_code == 200) {
        refresh && refresh();
        dialogRef.current && dialogRef.current.hide();
        message.success('移动成功');
      }
    });
  };
  const cancelClick = () => {
    dialogRef.current && dialogRef.current.hide();
    setModelData(resumeList);
  };
  return (
    <Fragment>
      <Dialog
        ref={dialogRef}
        maskClosable={false}
        width={850}
        title="移动模块"
        destroyOnClose={true}
        confirmLoading={loading}
        visible={visible}
        // onCancel={() => {
        //   dialogRef.current && dialogRef.current.hide();
        // }}
        onCancel={cancelClick}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          layout="vertical"
          // style={{ margin: '40px 30px' }}
          onFinish={onFinish}
        >
          <div className={s.desc}>拖动移动模块的顺序</div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {modelData.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <div
                            style={{ width: '80px' }}
                            className={`${s.classifyItems} ${item.is_sort === 2 ? s.no_sort : ''}`}
                          >
                            {item.name}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Form>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = ({ global: { operator_id, enterprise_id } }) => {
  return {
    operator_id,
    enterprise_id,
  };
};
export default connect(mapStateToProps)(Index);
