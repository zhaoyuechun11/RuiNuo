import React, { useEffect, useState } from 'react';
import { Table, Form, Input, DatePicker, Select, message, Button } from 'antd';
import { getUserList } from '@/models/server';

import { reqTrace } from '../../models/server';
import s from '../index.less';
import { useSelector } from 'umi';
const { Option } = Select;
const { RangePicker } = DatePicker;
const ApplicationFormMLog = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state) => state.loading.global);
  const [form] = Form.useForm();

  const [userList, setUserList] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  useEffect(() => {
    getUserListData();
  }, []);

  const getUserListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const clear = () => {
    const { createDateStart, operateTimeStart } = form.getFieldsValue();
    let params = {
      ...form.getFieldsValue(),
      labDateStart: createDateStart ? createDateStart[0].format('YYYY-MM-DD') : '',
      labDateEnd: createDateStart ? createDateStart[1].format('YYYY-MM-DD') : '',
      operateTimeStart: operateTimeStart ? operateTimeStart[0].format('YYYY-MM-DD') : '',
      operateTimeEnd: operateTimeStart ? operateTimeStart[1].format('YYYY-MM-DD') : '',
    };
    reqTrace(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form layout="vertical" form={form}>
        <Form.Item name="labDateStart" label="登记日期">
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['登记日期开始时间', '登记日期结束时间']}
            style={{ width: '220px' }}
          />
        </Form.Item>
        <Form.Item name="operateTimeStart" label="修改日期">
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['修改日期开始时间', '修改日期结束时间']}
            style={{ width: '220px' }}
          />
        </Form.Item>

        <Form.Item name="sampleBarcode" label="送检条码">
          <Input />
        </Form.Item>
        <Form.Item name="operator" label="修改人">
          <Select
            placeholder="请选择修改人"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {userList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const Columns = [
    {
      title: '送检条码',
      dataIndex: 'sampleBarcode',
      align: 'center',
    },
    {
      title: '送检单位名称',
      dataIndex: 'hospitalName',
      align: 'center',
    },
    {
      title: '样本名',
      dataIndex: 'patientName',
      align: 'center',
    },
    {
      title: '操作对象',
      dataIndex: 'tableName',
      align: 'center',
    },
    {
      title: '操作类型',
      dataIndex: 'traceType',
      align: 'center',
    },
    {
      title: '修改前',
      dataIndex: 'beforeChange',
      align: 'center',
    },
    {
      title: '修改后',
      dataIndex: 'afterChange',
      align: 'center',
    },

    {
      title: '修改时间',
      dataIndex: 'operateTime',
      align: 'center',
    },
    {
      title: '操作原因',
      dataIndex: 'reason',
      align: 'center',
    },
    {
      title: '操作页面',
      dataIndex: 'winName',
      align: 'center',
    },
  ];
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  return (
    <>
      <div className={s.search}>
        {renderForm()}
        <Button type="primary" onClick={clear}>
          查询
        </Button>
        <Button type="primary">清空</Button>
      </div>
      <Table
        size={'small'}
        columns={Columns}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      />
    </>
  );
};
export default ApplicationFormMLog;
