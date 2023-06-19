// 表格拖拽排序组件
// antd-table + react-dnd
import React, { useRef } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Table } from 'antd';
import { useEffect } from 'react';

let dragingIndex = -1; // 用于设置拖拽Row时样式
let moverow = null; //定义move事件，解决warn

const BodyRow = (props) => {
  const { isOver, connectDragSource, connectDropTarget, move, ...restProps } = props;
  moverow = move;
  const ref = useRef(null);
  const style = { ...restProps.style, cursor: 'move' };
  let { className } = restProps;
  if (isOver) {
    if (restProps.index > dragingIndex) {
      className += ' drop-over-downward';
    }
    if (restProps.index < dragingIndex) {
      className += ' drop-over-upward';
    }
  }
  connectDragSource(connectDropTarget(ref));
  return <tr {...restProps} ref={ref} className={className} style={style}></tr>;
};

// DragSource 拖拽事件的方法对象
const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

// DropTarget 拖拽事件的方法对象
const rowTarget = {
  drop(props, monitor) {
    const id = props.id;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const hoverId = props.record.id;
    // if(dragIndex ===0){
    //     return
    // }
    if (dragIndex === hoverIndex) {
      return;
    }
    moverow(dragIndex, hoverIndex, hoverId, id);
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, (connect) => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

/**
 * 拖拽表格
 * @param {表格数据} dataSource
 * @param {表格columns} columns
 * @param {设置数据} setList 设置数据方法
 */
function DragTable({ dataSource, columns, setList, resumeList, ...tableProps }) {
  const components = {
    body: { row: DragableBodyRow },
  };
  const moveRow = (dragIndex, hoverIndex, hoverId, id) => {
    const dragId = resumeList[id].structure[dragIndex].id;

    return;
    const dragItem = dataSource[dragIndex];
    const newList = update(dataSource, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragItem],
      ],
    });
    setList(newList);
  };

  useEffect(() => {
    //setList(dataSource);
  }, [dataSource]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        bordered={false}
        {...tableProps}
        components={components}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        onRow={(record, index) => {
          return { record: record, index: index, move: moveRow };
        }}
      />
    </DndProvider>
  );
}
export default DragTable;
