import React, { useEffect, useState } from 'react';
import { Table, Form, Input, DatePicker, Select, message, Button } from 'antd';
import { reportUnitSelect, getUserList } from '@/models/server';

import { getInstrByReportUnit, reportTrace } from '../../models/server';
import s from '../index.less';
import { useSelector } from 'umi';
const { Option } = Select;
const { RangePicker } = DatePicker;
const ReportModificationLog = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state) => state.loading.global);
  const [form] = Form.useForm();
  const [reportUnitList, setReportUnitList] = useState([]);
  const [reportUnitInstrList, setReportUnitInstrList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  useEffect(() => {
    getReportUnitSelect();
    getUserListData();
  }, []);
  const getReportUnitSelect = () => {
    reportUnitSelect().then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };
  const reportUnitChange = (e) => {
    getInstrByReportUnit({ reportUnitId: e }).then((res) => {
      if (res.code === 200) {
        setReportUnitInstrList(res.data);
      }
    });
  };
  const getUserListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const clear = () => {
    const { labDateStart, operateTimeStart } = form.getFieldsValue();
    let params = {
      ...form.getFieldsValue(),
      labDateStart: labDateStart[0] ? labDateStart[0].format('YYYY-MM-DD') : '',
      labDateEnd: labDateStart[1] ? labDateStart[1].format('YYYY-MM-DD') : '',
      operateTimeStart: operateTimeStart[0] ? operateTimeStart[0].format('YYYY-MM-DD') : '',
      operateTimeEnd: operateTimeStart[1] ? operateTimeStart[1].format('YYYY-MM-DD') : '',
    };
    reportTrace(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form layout="vertical" form={form}>
        <Form.Item name="labDateStart" label="检验日期">
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['检验日期开始时间', '检验日期结束时间']}
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
        <Form.Item name="reportUnitId" label="报告单元">
          <Select placeholder="请选择报告单元" allowClear onChange={reportUnitChange}>
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="instrId" label="检测仪器">
          <Select placeholder="请选择检测仪器" allowClear>
            {reportUnitInstrList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.instrName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sampleNo" label="样本号范围">
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
      title: '报告单元',
      dataIndex: 'reportUnit',
    },
    {
      title: '检验仪器',
      dataIndex: 'instrName',
    },
    {
      title: '检验日期',
      dataIndex: 'labDate',
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
    },
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
    },
    {
      title: '操作对象',
      dataIndex: 'tableName',
    },
    {
      title: '操作类型',
      dataIndex: 'traceType',
    },
    {
      title: '修改前',
      dataIndex: 'beforeChange',
    },
    {
      title: '修改后',
      dataIndex: 'afterChange',
    },
    {
      title: '修改时间',
      dataIndex: 'operateTime',
    },
    {
      title: '操作页面',
      dataIndex: 'winName',
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
export default ReportModificationLog;
