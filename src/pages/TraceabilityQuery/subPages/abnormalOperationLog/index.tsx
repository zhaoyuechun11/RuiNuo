import React, { useEffect, useState } from 'react';
import { Table, Form, Input, DatePicker, Select, message, Button } from 'antd';
import { getHospitalList, getUserList } from '@/models/server';

import { abnormalTrace } from '../../models/server';
import s from '../index.less';
import { useSelector } from 'umi';
const { Option } = Select;
const { RangePicker } = DatePicker;
const traceType = [
  {
    id: 1,
    name: '反审核',
  },
  {
    id: 2,
    name: '样本复查',
  },
  {
    id: 3,
    name: '拒检',
  },
  {
    id: 4,
    name: '延迟',
  },
  {
    id: 5,
    name: '撤销拒检',
  },
];
const AbnormalOperationLog = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state) => state.loading.global);
  const [form] = Form.useForm();
  const [hospitalList, setHospitalList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  useEffect(() => {
    getUserListData();
    hospital();
  }, []);

  const getUserListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const clear = () => {
    const { operateTimeStart } = form.getFieldsValue();
    let params = {
      ...form.getFieldsValue(),
      operateTimeStart: operateTimeStart ? operateTimeStart[0].format('YYYY-MM-DD') : '',
      operateTimeEnd: operateTimeStart ? operateTimeStart[1].format('YYYY-MM-DD') : '',
    };
    abnormalTrace(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const hospital = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form layout="vertical" form={form}>
        <Form.Item name="operateTimeStart" label="异常操作日期">
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['异常操作开始时间', '异常操作结束时间']}
            style={{ width: '220px' }}
          />
        </Form.Item>
        <Form.Item name="traceType" label="异常操作类型">
          <Select
            placeholder="请选择异常操作类型"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {traceType.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="hospitalId" label="送检单位">
          <Select placeholder="请选择送检单位" allowClear>
            {hospitalList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.hospitalName}
              </Option>
            ))}
          </Select>
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
      title: '异常操作类型',
      dataIndex: 'traceType',
      align: 'center',
      render: (text: any) => {
        return text === 1
          ? '反审核'
          : text === 2
          ? '样本复查'
          : text === 3
          ? '拒检'
          : text === 4
          ? '延迟'
          : '撤销拒检';
      },
    },
    {
      title: '异常操作原因',
      dataIndex: 'reason',
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      align: 'center',
    },
    {
      title: '操作页面',
      dataIndex: 'winName',
      align: 'center',
    },
    {
      title: '送检条码',
      dataIndex: 'sampleBarcode',
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      align: 'center',
    },

    {
      title: '样本名',
      dataIndex: 'patientName',
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
export default AbnormalOperationLog;
