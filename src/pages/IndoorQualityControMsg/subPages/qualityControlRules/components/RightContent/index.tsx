import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Select, Popconfirm, message, DatePicker, Input } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button } from '@/components';
import { Tabs } from 'antd';
import { getRuleSetingList, ruleSettingDelete, getItemByInstr } from '../../../../models/server';
const qcRuleType = [
  {
    id: 1,
    name: 'Westgard',
  },
  {
    id: 2,
    name: '绝对值',
  },
  {
    id: 3,
    name: '百分比',
  },
];
import styles from './index.less';
import AddOrEditModal from './components/addOrEditModal';
const { TabPane } = Tabs;
const { Option } = Select;
const RightContent = () => {
  const { leftMenuParamsRules } = useSelector((state: any) => state.IndoorQualityControMsg);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [columnsItem, setColumnsItem] = useState([]);
  const [activeTab, setActiveTab] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  // useEffect(() => {
  //   dispatch({
  //     type: 'IndoorQualityControMsg/save',
  //     payload: {
  //       type: 'leftMenuParamsRules',
  //       dataSource: {},
  //     },
  //   });
  // }, [location.pathname]);
  useEffect(() => {
    if (leftMenuParamsRules?.instrId) {
      getList({
        pageNum,
        pageSize,
        instrId: leftMenuParamsRules.instrId,
        ...form.getFieldsValue(),
        startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
        [sort]: order,
      });
    }
  }, [pageNum, pageSize, leftMenuParamsRules?.instrId, sort, order]);
  const columns = [
    {
      title: '规则ID',
      dataIndex: 'qcRuleId',
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'instrCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '规则大类',
      dataIndex: 'qcRuleName',
      align: 'center',
    },
    {
      title: 'westguard质控规则',
      dataIndex: 'qcRule',
      align: 'center',
    },
    {
      title: '启用日期',
      dataIndex: 'startDt',
      align: 'center',
    },
    {
      title: '结束日期',
      dataIndex: 'stopDt',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: any) => {
        return (
          <div className={styles.table_operate_box}>
            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认要删除该条数据么?"
              onConfirm={() => confirm(record.qcRuleId)}
              okText="确定"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const confirm = (id: any) => {
    ruleSettingDelete({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: leftMenuParamsRules.instrId,
          ...form.getFieldsValue(),
          startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
        });
      }
    });
  };
  const getList = (params: any) => {
    getRuleSetingList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
       
      }
    });
  };
  const getItemList = (param: any) => {
    getItemByInstr(param).then((res) => {
      if (res.code === 200) {
        setItemList(res.data);
      }
    });
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    getList({
      pageNum,
      pageSize,
      instrId: leftMenuParamsRules.instrId,
      ...allValues,
      startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
    });
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    modalRef.current.show();
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="qcRuleType">
          <Select placeholder="请选择规则大类" allowClear>
            {qcRuleType.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="startDt">
          <DatePicker format="YYYY-MM-DD" placeholder="请选择启用日期" />
        </Form.Item>
        {activeTab === '2' && (
          <>
            <Form.Item name="itemId">
              <Select placeholder="请选择项目" allowClear>
                {itemList.map((item) => {
                  return (
                    <Option value={item.itemId} key={item.itemId}>
                      {item.itemName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="name">
              <Input placeholder="请输入项目名称" allowClear style={{ width: 80 }}></Input>
            </Form.Item>
          </>
        )}
      </Form>
    );
  };
  const changeTab = (e) => {
    setActiveTab(e);
    if (e === '2') {
      columns.splice(2, 0, {
        title: '项目代号',
        dataIndex: 'itemCode',
        align: 'center',
        sorter: true,
        render: (text: any) => {
          return text ? text : '-';
        },
      });
      setColumnsItem(columns);
      getItemList({ instrId: leftMenuParamsRules?.instrId });
    }
  };
  const tabBar = (
    <div className={styles.toolbar}>
      {renderForm()}
      <Button btnType="primary" onClick={add}>
        新增
      </Button>
    </div>
  );
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    setSort(sorter.field + 'Desc');
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  return (
    <>
      <Tabs defaultActiveKey="1" onChange={changeTab} tabBarExtraContent={tabBar}>
        <TabPane tab="质控规则到仪器" key="1">
          <Table
            onChange={onTableChange}
            dataSource={list}
            columns={columns}
            size="small"
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </TabPane>
        <TabPane tab="质控规则到项目" key="2">
          {/* <RulesBindItem ruleList={list} /> */}
          <Table
            onChange={onTableChange}
            dataSource={list}
            columns={columnsItem}
            size="small"
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </TabPane>
      </Tabs>
      <AddOrEditModal
        Ref={modalRef}
        itemList={activeTab === '2' ? itemList : []}
        from={activeTab !== '2' ? 'rulesInstr' : 'rulesItem'}
        refresh={() => {
          getList({
            pageNum,
            pageSize,
            instrId: leftMenuParamsRules.instrId,
            ...form.getFieldsValue(),
            startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
          });
        }}
      />
    </>
  );
};

export default RightContent;
