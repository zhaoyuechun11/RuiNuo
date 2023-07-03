import React, { Fragment, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Form, Checkbox, Table, Row, Col, Input, message, Spin, Tooltip } from 'antd';
import DragTable from './components/DragTable/index.jsx'; // 引入拖拽组件
import { BackButton, Card, Icon, Button, Dialog } from '@/components';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { AddField, EditField, DeleteModel, AddModule, MoveModel } from './components';
import { connect } from 'umi';

import {
  display,
  moveField,
  create,
  updateModule,
  updateField,
  patchStructureMove,
} from './models/server';
import s from './index.less';


const Index = ({ operator_id, enterprise_id }) => {
  const addFieldRef = useRef();
  const editFieldRef = useRef();
  const addModuleRef = useRef();
  const moveModelRef = useRef();
  const addRef = useRef();
  const modelForm = useRef();
  const [isLoading, setIsLoading] = useState(true); // 页面loading
  const [resumeList, setResumeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [type, setType] = useState('add');
  const [record, setRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [modelId, setModelId] = useState();
  const [form] = Form.useForm();
  const [modelItemId, setModelItemId] = useState();
  const [fieldEditId, setFieldEditId] = useState();
  const [fieldInfo, setFieldInfo] = useState(null);
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
      dataIndex: 'data_type',
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
      dataIndex: 'is_display',
      render: (text, record, index) => {
        return text === 1 && record.name === '姓名' ? (
          <Checkbox value={record} checked disabled></Checkbox>
        ) : text === 1 ? (
          <Checkbox value={record} onChange={fieldDisplayOnchange} checked></Checkbox>
        ) : (
          <Checkbox value={record} onChange={fieldDisplayOnchange}></Checkbox>
        );
      },
    },
    {
      title: '必填',
      dataIndex: 'is_required',
      render: (text, record, index) => {
        return text === 1 && record.name === '姓名' ? (
          <Checkbox value={record} checked disabled></Checkbox>
        ) : text === 1 ? (
          <Checkbox value={record} onChange={fieldRequiredOnchange} checked></Checkbox>
        ) : (
          <Checkbox value={record} onChange={fieldRequiredOnchange}></Checkbox>
        );
      },
    },
    {
      title: '创建者',
      dataIndex: 'operator_name',
    },
    {
      title: '操作',
      dataIndex: 'is_auth',
      align: 'center',
      render: (text, record, index) => {
        return text === 1 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DeleteModel
              name="确定要删除该字段吗？"
              prompt="请谨慎删除字段，删除后候选人有关联该字段的数据将不可恢复！"
              id={record.id}
              type="delete_field"
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
          '-'
        );
      },
    },
  ];
  useEffect(() => {
    getResumeList();
  }, []);
  const getResumeList = () => {
    setIsLoading(true);
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      is_unset_display: 2,
    };
    display(params).then((res) => {
      if (res.status_code === 200) {
        setIsLoading(false);
        setResumeList(res.data);
      }
    });
  };
  const fieldRequiredOnchange = (e) => {
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      is_required: e.target.checked ? 1 : 2,
      id: e.target.value.id,
    };
    updateField(params).then((res) => {
      getResumeList();
    });
  };
  const fieldDisplayOnchange = (e) => {
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      is_display: e.target.checked ? 1 : 2,
      id: e.target.value.id,
    };
    updateField(params).then((res) => {
      getResumeList();
    });
  };
  const moveFieldFun = (params) => {
    setIsLoading(true);
    patchStructureMove(params).then((res) => {
      setIsLoading(false);
      getResumeList();
    });
  };

  const showModal = (type, id, name, multistage) => {
    addRef.current.show();
    setModelId(id);
    setType(type);
    let is_multistage = [];
    is_multistage.push(multistage);
    form.setFieldsValue({
      name,
      is_multistage,
    });
  };
  const handleOk = () => {
    form.validateFields().then((value) => {
      form.submit();
    });
  };
  const onFinish = (values) => {
    let params = {
      enterprise_id: enterprise_id,
      operator_id: operator_id,
      name: values.name,
      id: modelId,
    };
    if (type === 'edit') {
      updateModule(params).then((res) => {
        if (res.status_code === 200) {
          addRef.current && addRef.current.hide();
          getResumeList();
        }
      });
      return;
    }
    let formValue = {
      is_multistage: values.is_multistage.toString() !== '' ? values.is_multistage.toString() : 2,
      ...params,
    };
    create(formValue).then((res) => {
      if (res.status_code === 200) {
        addRef.current && addRef.current.hide();
        getResumeList();
        message.success('添加成功');
      }
    });
  };

  // 添加按钮
  const addField = (item) => {
    setModelItemId(item.id);
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

      let params = {
        enterprise_id: enterprise_id,
        operator_id: operator_id,
        resume_structure_json: JSON.stringify(newList),
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
  return (
    <Card>
  
      <Spin spinning={isLoading}>
        <BackButton
          title="自定义"
          isShowTooltip="true"
          tooltipTitle="系统配置的字段不可删除，不可修改字段类型"
        />
        {resumeList &&
          resumeList.map((item, i) => {
            return (
              <div key={i}>
                <div className={s.title}>
                  <div>
                    <span className={s.line}></span>
                    {item.name}
                  </div>
                  {item.module_type === 1 ? (
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
                      <span
                        className={s.icon}
                        onClick={() => {
                          moveModelRef.current && moveModelRef.current.showModal();
                        }}
                      >
                        <Icon name="iconyidongmokuai" style={{ marginRight: 8 }} />
                        移动模块
                      </span>
                    </div>
                  ) : (
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
                      <span
                        className={s.icon}
                        onClick={() => {
                          moveModelRef.current && moveModelRef.current.showModal();
                        }}
                      >
                        <Icon name="iconyidongmokuai" style={{ marginRight: 8 }} />
                        移动模块
                      </span>
                      <span
                        className={s.icon}
                        onClick={() => showModal('edit', item.id, item.name, item.is_multistage)}
                      >
                        <Icon name="iconanniu-bianji" style={{ marginRight: 8 }} />
                        编辑模块信息
                      </span>
                      {item.is_delete != 2 ? (
                        <DeleteModel
                          name="确定要删除模块吗？"
                          prompt="请谨慎删除模块，删除后候选人有关联该模块的数据将不可恢复！"
                          id={item.id}
                          title="删除模块"
                          refresh={() => getResumeList()}
                        >
                          <span className={s.icon}>
                            <Icon name="iconanniu-shanchu" style={{ marginRight: 8 }} />
                            删除模块信息
                          </span>
                        </DeleteModel>
                      ) : (
                        <DeleteModel name="" prompt="无操作权限，只有管理员和创建者可操作！">
                          <span className={s.icon}>
                            <Icon name="iconanniu-shanchu" style={{ marginRight: 8 }} />
                            删除模块信息
                          </span>
                        </DeleteModel>
                      )}
                    </div>
                  )}
                </div>
                <DndProvider backend={HTML5Backend}>
                  <Table
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
              </div>
            );
          })}
        <div style={{ marginRight: 10 }} className={s.add_module} onClick={() => showModal()}>
          <Icon name="iconanniu-jixushangchuan" style={{ marginRight: 8 }} />
          新增模块
        </div>
        <EditField
          editFieldRef={editFieldRef}
          id={fieldEditId}
          fieldInfo={fieldInfo}
          refresh={() => {
            getResumeList();
          }}
        />
        <Dialog
          title={type == 'edit' ? '编辑模块' : '添加模块'}
          maskClosable={false}
          visible={visible}
          ref={addRef}
          onOk={handleOk}
          // onCancel={handleCancel}
          cancelText="取消"
          okText="确定"
          confirmLoading={confirmLoading}
        >
          <Form
            form={form}
            labelCol={{ span: 6 }}
            layout="vertical"
            style={{ margin: '40px 30px' }}
            onFinish={onFinish}
            ref={modelForm}
          >
            <Row span={24}>
              <Col span={24}>
                <Form.Item label="模块名称" name="name" rules={[{ validator: interval }]}>
                  <Input placeholder="请输入模块名称，1-8个字符" />
                </Form.Item>
              </Col>
            </Row>
            {type !== 'edit' ? (
              <Row span={24}>
                <Col span={24}>
                  <Form.Item name="is_multistage">
                    <Checkbox.Group options={[{ label: '支持添加多段', value: 1 }]} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </Form>
        </Dialog>
        <MoveModel
          moveModelRef={moveModelRef}
          resumeList={resumeList}
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
          id={modelItemId}
        />
      </Spin>
    </Card>
  );
};

const mapStateToProps = ({ global: {  } }) => {
  return {
  
  };
};

export default connect(mapStateToProps)(Index);
