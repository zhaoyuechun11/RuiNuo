import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Select, Popconfirm, message, DatePicker } from 'antd';
import { Button } from '@/components';
import { getRuleSetingList, ruleSettingDelete } from '../../../../../../models/server';
import styles from '../../index.less';
import { useSelector } from 'umi';
import AddOrEditModal from '../addOrEditModal';
const { Option } = Select;
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
const RulesBindInstr = ({ ruleList = [] }) => {
  const { leftMenuParamsRules } = useSelector((state: any) => state.IndoorQualityControMsg);
  const modalRef = useRef();
  const [list, setList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();

    useEffect(() => {
      if (leftMenuParamsRules?.instrId) {
     
        getList({
          pageNum,
          pageSize,
          instrId: leftMenuParamsRules.instrId,
          ...form.getFieldsValue(),
          startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
        });
      }
    }, [pageNum, pageSize, leftMenuParamsRules?.instrId]);

  const getList = (params: any) => {
    getRuleSetingList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };

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
  const handleSearch = (changedValues: any, allValues: undefined) => {
    getList({
      pageNum,
      pageSize,
      instrId: leftMenuParamsRules.instrId,
      ...allValues,
      startDt: form.getFieldsValue().startDt?.format('YYYY-MM-DD'),
    });
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
      </Form>
    );
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    modalRef.current.show();
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            添加
          </Button>
        </div>
      </div>
      <Table
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
      <AddOrEditModal
        Ref={modalRef}
        from="rulesInstr"
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
export default RulesBindInstr;
