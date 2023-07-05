import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Checkbox, Table, Row, Col, Input, message, Spin, Tooltip } from 'antd';
import DragTable from './components/DragTable/index.jsx'; // 引入拖拽组件
import { BackButton, Card, Icon, Button, Dialog } from '@/components';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { AddField, EditField, DeleteModel } from './components';
import { connect, useParams } from 'umi';

import {
  mainEnterOperateList,
  updateField,
  patchStructureMove,
  moveField,
  updateFieldDisplay,
  displayOrRequired,
} from './models/server';
import s from './index.less';

const Index = () => {
  const addFieldRef = useRef();
  const editFieldRef = useRef();
  const [isLoading, setIsLoading] = useState(false); // 页面loading
  const [resumeList, setResumeList] = useState([]);
  const [fieldEditId, setFieldEditId] = useState();
  const [fieldInfo, setFieldInfo] = useState(null);
  const params = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState();
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'name',
      width: '200px',
      ellipsis: true,
      render: (text, record, index) => {
        return record.is_can_sort === 2 ? (
          <span style={{ marginLeft: '26px' }}> {text}</span>
        ) : (
          <Tooltip title={text} style={{ marginLeft: '26px' }}>
            {' '}
            <span>
              <Icon name="iconmianshilunci-changantuodong" style={{ paddingRight: '8px' }} />
              {text}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '字段类型',
      dataIndex: 'dataType',
      render: (text, record, index) => {
        return (
          (text === 1 && '单行文本') ||
          (text === 2 && '多行文本') ||
          (text === 3 && '自定义选择器') ||
          (text === 4 && '时间选择器') ||
          (text === 5 && '民族选择器') ||
          (text === 6 && '区域选择器') ||
          (text === 7 && '自定义选择器')
        );
      },
    },
    {
      title: '显示',
      dataIndex: 'isDisplay',
      render: (text, record, index) => {
        return text === 1 && record.name === '姓名' ? (
          <Checkbox value={record} checked disabled></Checkbox>
        ) : text ? (
          <Checkbox value={record} onChange={fieldDisplayOnchange} checked></Checkbox>
        ) : (
          <Checkbox value={record} onChange={fieldDisplayOnchange}></Checkbox>
        );
      },
    },
    {
      title: '必填',
      dataIndex: 'isRequired',
      render: (text, record, index) => {
        return text && record.name === '姓名' ? (
          <Checkbox value={record} checked disabled></Checkbox>
        ) : text ? (
          <Checkbox value={record} onChange={fieldRequiredOnchange} checked></Checkbox>
        ) : (
          <Checkbox value={record} onChange={fieldRequiredOnchange}></Checkbox>
        );
      },
    },
    {
      title: '创建者',
      dataIndex: 'operatorName',
    },
    {
      title: '操作',
      dataIndex: 'isAuth',
      align: 'center',
      render: (text, record, index) => {
        return !text ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DeleteModel
              name="确定要删除该字段吗？"
              prompt="请谨慎删除字段，删除后候选人有关联该字段的数据将不可恢复！"
              id={record.id}
              title="删除字段"
              refresh={() => getResumeList()}
            >
              <Button className={s.delete}>删除</Button>
            </DeleteModel>{' '}
            <Button
              onClick={() => {
                editField(record);
              }}
              className={s.edit}
            >
              编辑
            </Button>
          </div>
        ) : (
          // '-'
          <Button
            onClick={() => {
              editField(record);
            }}
            className={s.edit}
          >
            编辑
          </Button>
        );
      },
    },
  ];
  useEffect(() => {
    getResumeList();
  }, [pageNum, pageSize]);

  const getResumeList = () => {
    setIsLoading(true);
    mainEnterOperateList({ moduleId: params.id }).then((res) => {
      if (res.code === 200) {
        setIsLoading(false);
        setResumeList(res.data);
      }
    });
  };
  const fieldRequiredOnchange = (e) => {
    let params = {
      isRequired: e.target.checked,
      id: e.target.value.id,
    };
    displayOrRequired(params).then((res) => {
      getResumeList();
    });
  };
  const fieldDisplayOnchange = (e) => {
    let params = {
      isDisplay: e.target.checked,
      id: e.target.value.id,
    };
    displayOrRequired(params).then((res) => {
      getResumeList();
    });
  };
  const moveFieldFun = (params) => {
    setIsLoading(true);
    moveField(params).then((res) => {
      setIsLoading(false);
      getResumeList();
    });
  };
  // 添加按钮
  const addField = () => {
    addFieldRef.current && addFieldRef.current.showModal();
  };
  // 编辑按钮
  const editField = (item) => {
    setFieldEditId(item.id);
    setFieldInfo(item);
    editFieldRef.current && editFieldRef.current.showModal();
  };

  const interval = (item, value) => {
    if (value === undefined) {
      return Promise.reject(new Error('不能为空哦'));
    }
    if (value.length > 8) {
      return Promise.reject(new Error('不能大于8个字符哦'));
    }
    return Promise.resolve();
  };

  /**拖拽表格 */
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
      console.log(props, monitor.getItem().index);
      const dragIndex = monitor.getItem().index;
      const dragId = resumeList[dragIndex].id;

      const hoverIndex = props.index;
      const hoverId = props.record.id;
      const structureItem = resumeList[dragIndex];

      const newList = update(resumeList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, structureItem],
        ],
      });

      if (dragIndex === hoverIndex) {
        return;
      }
      console.log(newList);
      let dragIds = newList.map((item) => {
        return item.id;
      });

      let params = {
        ids: dragIds,
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
  const pageChange = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
  };
  return (
    <Card>
      <Spin spinning={isLoading}>
        <BackButton
          title="自定义"
          isShowTooltip="true"
          tooltipTitle="系统配置的字段不可删除，不可修改字段类型"
        />
        <div className={s.operator}>
          <span
            className={s.icon}
            onClick={() => {
              addField();
            }}
          >
            <Icon name="iconanniu-jixushangchuan" style={{ marginRight: 8 }} />
            新增字段
          </span>
        </div>
        <DndProvider backend={HTML5Backend}>
          <Table
            components={components}
            dataSource={resumeList}
            columns={columns}
            pagination={{
              pageSize,
              current: pageNum,
              total,
              onChange: pageChange,
              showTotal: (total, range) => `共 ${total} 条`,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '30', '40'],
              showSizeChanger: true,
            }}
            onRow={(record, index) => {
              return {
                record: record,
                index: index,
              };
            }}
          />
        </DndProvider>
        <EditField
          editFieldRef={editFieldRef}
          id={fieldEditId}
          fieldInfo={fieldInfo}
          refresh={() => {
            getResumeList();
          }}
        />

        <AddField
          addFieldRef={addFieldRef}
          resumeList={resumeList}
          type="add"
          refresh={() => {
            getResumeList();
          }}
          id={Number(params.id)}
        />
      </Spin>
    </Card>
  );
};

const mapStateToProps = ({ global: {} }) => {
  return {};
};

export default connect(mapStateToProps)(Index);
