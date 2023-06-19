import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Checkbox, Table, Row, Col, Input, message, Spin, Tooltip } from 'antd';
// import DragTable from './components/DragTable/index.jsx'; // 引入拖拽组件
import { BackButton, Card, Icon, Button, Dialog } from '@/components';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import AddField from './addField';
import EditField from './editField';
import AddbasicFieldy from './addbasicFieldy';

import { connect } from 'umi';
import s from './index.less';
import { ca } from 'date-fns/locale';
import { patchStructureMove } from '../../subPages/standardResume/models/server';
const ReactSITable = ({
  operator_id,
  enterprise_id,
  resumeList,
  columns,
  columns1,
  addFieldFun,
  cRef,
  cEditFieldRef,
  cAddFieldRef,
  cAddbasicFieldRef,
  updateFieldFun,
  structureMove,
  refreshList,
}) => {
  const addFieldRef = useRef();
  const addFieldRefHide = useRef();
  const editFieldRef = useRef();
  const editFieldRefHide = useRef();
  const addbasicFieldyRef = useRef();
  const addbasicFieldyRefHide = useRef();
  const [type, setType] = useState('add');
  const [record, setRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [modelId, setModelId] = useState();
  const [form] = Form.useForm();
  const [modelItemId, setModelItemId] = useState();
  const [fieldEditId, setFieldEditId] = useState();
  const [fieldInfo, setFieldInfo] = useState(null);
  useEffect(() => {}, []);

  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: (id, item) => {
      setFieldEditId(id);
      setFieldInfo(item);
      editFieldRef.current && editFieldRef.current.showModal();
    },
  }));

  useImperativeHandle(cEditFieldRef, () => ({
    // changeVal 就是暴露给父组件的方法
    editFieldRef: () => {
      editFieldRefHide.current && editFieldRefHide.current.hide();
    },
  }));
  useImperativeHandle(cAddFieldRef, () => ({
    // changeVal 就是暴露给父组件的方法
    addFieldRef: () => {
      addFieldRefHide.current && addFieldRefHide.current.hide();
    },
  }));
  useImperativeHandle(cAddbasicFieldRef, () => ({
    // changeVal 就是暴露给父组件的方法
    addbasicFieldyRef: () => {
      addbasicFieldyRef.current && addbasicFieldHide.current.hide();
    },
  }));

  const moveFieldFun = (params) => {
    structureMove(params);
  };
  // 添加按钮
  const addField = (item) => {
    setModelItemId(item.id);
    addFieldRef.current && addFieldRef.current.showModal();
  };
  // 添加基本信息字段按钮
  const addbasicField = (item) => {
    setModelItemId(item.id);
    addbasicFieldyRef.current && addbasicFieldyRef.current.showModal();
  };
  // /**拖拽表格 */
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
      if (monitor.getItem().index === undefined) {
        return;
      }
      const id = props.id;
      const dragIndex = monitor.getItem().index;
      const dragId = resumeList[id].structure[dragIndex].id;
      const structure = resumeList[id].structure;
      const moduleId = resumeList[id].id;
      const structureItem = resumeList[id].structure[dragIndex];
      const hoverIndex = props.index;
      const hoverId = props.record.id;

      const newList = update(resumeList[id].structure, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, structureItem],
        ],
      });
      //return
      if (resumeList[id].structure[dragIndex].name === '姓名') {
        //return message.warn('当前字段无法移动');
        return;
      }
      if (resumeList[id].structure[hoverIndex].name === '姓名') {
        return;
      }
      if (dragIndex === hoverIndex) {
        return;
      }
      //moverow(dragIndex, hoverIndex,id,dragId,hoverId);
      const baiseList = [];
      newList.map((item, index) => {
        baiseList.push(item.id);
      });

      let params = {
        enterprise_id: enterprise_id,
        operator_id: operator_id,
        position_structure_json:
          resumeList[id].name !== '录用信息' ? JSON.stringify(newList) : JSON.stringify(baiseList),
        module_id: moduleId,
        // move_field_id: dragId,
        // to_field_id: hoverId,
      };

      moveFieldFun(params);
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

  const components = {
    body: { row: DragableBodyRow },
  };
  const addFieldServer = (e) => {
    addFieldFun(e);
  };
  const updateFieldServer = (e) => {
    updateFieldFun(e);
  };
  const refresh = (e) => {
    refreshList(e);
  };
  return (
    <>
      {resumeList &&
        resumeList.map((item, i) => {
          return (
            <div key={i} className={s.tableWrap}>
              <div className={s.title}>
                <div className={s.title_text}>
                  <span className={s.line}></span>
                  {item.name}
                </div>
                {item.key != 'basic_info' ? (
                  <div className={s.operator}>
                    <span
                      className={s.icon}
                      onClick={() => {
                        addField(item);
                      }}
                    >
                      <Icon name="iconanniu-jixushangchuan" style={{ marginRight: 8 }} />
                      新增字段
                    </span>
                  </div>
                ) : (
                  <div className={s.operator}>
                    <span
                      onClick={() => {
                        addbasicField(item);
                      }}
                      className={s.icon}
                    >
                      <Icon name="iconanniu-jixushangchuan" style={{ marginRight: 8 }} />
                      新增字段
                    </span>
                  </div>
                )}
              </div>
              {item.key === 'basic_info' ? (
                <Table
                  className={s.dndTable}
                  dataSource={item.structure}
                  columns={columns1}
                  pagination={false}
                  // onRow={(record, index) => {
                  //   return {
                  //     record: record,
                  //     index: index,
                  //     id: i,
                  //   };
                  // }}
                />
              ) : (
                <DndProvider backend={HTML5Backend}>
                  <Table
                    className={s.dndTable}
                    components={components}
                    dataSource={item.structure}
                    columns={columns}
                    pagination={false}
                    onRow={(record, index) => {
                      return {
                        record: record,
                        index: index,
                        id: i,
                      };
                    }}
                  />
                </DndProvider>
              )}
            </div>
          );
        })}
      <EditField
        editFieldRef={editFieldRef}
        editFieldRefHide={editFieldRefHide}
        id={fieldEditId}
        fieldInfo={fieldInfo}
        updateFieldServer={updateFieldServer}
      />
      <AddField
        addFieldRef={addFieldRef}
        addFieldRefHide={addFieldRefHide}
        resumeList={resumeList}
        type="add"
        id={modelItemId}
        addFieldServer={addFieldServer}
        updateFieldServer={updateFieldServer}
      />
      <AddbasicFieldy
        addbasicFieldyRef={addbasicFieldyRef}
        addbasicFieldyRefHide={addbasicFieldyRefHide}
        refresh={refresh}
      ></AddbasicFieldy>
    </>
  );
};

const mapStateToProps = ({ global: { operator_id, enterprise_id } }) => {
  return {
    operator_id,
    enterprise_id,
  };
};

export default connect(mapStateToProps)(ReactSITable);
