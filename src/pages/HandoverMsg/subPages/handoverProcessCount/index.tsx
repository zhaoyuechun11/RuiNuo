import React, { useEffect, useState } from 'react';
import MixColLine from './components/MixColLine';
import TabButton from './components/TabButton';
import { Form, Select, Table, DatePicker, Card } from 'antd';
import { chartsConfig } from './constant';
import {
  deliveryReceiptMonth,
  deliveryReceiptWeek,
  deliveryReceiptList,
  deliveryReceiptType,
} from '../../models/server';
import s from './index.less';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const processState = [
  {
    name: '未处理',
    id: 0,
  },
  {
    name: '处理中',
    id: 1,
  },
  {
    name: '处理完成',
    id: 2,
  },
  {
    name: '确认完成',
    id: 3,
  },
];
const HandoverProcessCount = () => {
  const [monthChartData, setMonthChartData] = useState([]);
  const [weekChartData, setWeekChartData] = useState([]);
  const [handleWeekChartData, setHandleWeekChartData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [weekActive, setWeekActive] = useState(true);
  const [list, setList] = useState([]);
  const [eventType, setEventType] = useState([]);
  const [form] = Form.useForm();
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      startTime: [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')],
    });
    const statiasValues = {
      startTime: form.getFieldsValue().startTime[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: form.getFieldsValue().startTime[1].format('YYYY-MM-DD HH:mm:ss'),
    };
    getList({ pageNum, pageSize, ...statiasValues });
  }, [pageNum, pageSize]);
  useEffect(() => {
    let result = weekActive
      ? groupBy(weekChartData, 'x_field')
      : groupBy(monthChartData, 'x_field');
    let newData = [];
    let lineDataChart = [];
    Object.keys(result).forEach((key) => {
      lineDataChart.push({
        rateName: '反馈率',
        count: 0,
        name: key,
        person: key,
      });
      let target = {};
      let arry = result[key].map((item) => item.type);
      for (let i = 0; i < eventType.length; i++) {
        if (!arry.includes(eventType[i].typeName)) {
          target = { type: eventType[i].typeName, value: 0, x_field: Number(key) };
          newData.push(target);
        } else {
          result[key].map((item) => {
            if (item.type === eventType[i].typeName) {
              newData.push(item);
            }
          });
        }
      }
      debugger
      setLineData(lineDataChart);
      setHandleWeekChartData(newData);
    });
  }, [weekChartData, eventType, monthChartData,weekActive]);
  const groupBy = (objectArray, property) => {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const statiasValues = {
      startTime: allValues?.startTime ? allValues.startTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: allValues?.startTime ? allValues.startTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
    };
    getDeliveryReceiptMonth(statiasValues);
    getDeliveryReceiptWeek(statiasValues);
    getDeliveryReceiptType(statiasValues);

    const params = {
      pageNum,
      pageSize,
      ...allValues,
      ...statiasValues,
    };
    getList(params);
  };
  const getDeliveryReceiptType = (params: any) => {
    deliveryReceiptType(params).then((res) => {
      if (res.code === 200) {
        setEventType(res.data);
      }
    });
  };
  const getDeliveryReceiptMonth = (params: any) => {
    deliveryReceiptMonth(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return {
            name: item.x_field,
            ...item,
          };
        });
        setMonthChartData(result);
      }
    });
  };
  const getDeliveryReceiptWeek = (params: any) => {
    deliveryReceiptWeek(params).then((res) => {
      const result = res.data.map((item) => {
        return {
          name: item.x_field,
          ...item,
        };
      });
      if (res.code === 200) {
        setWeekChartData(result);
      }
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    },
    {
      title: '提交人',
      dataIndex: 'submitByName',
      key: 'submitByName',
      align: 'center',
    },
    {
      title: '提交部门',
      dataIndex: 'submitDeptName',
      key: 'submitDeptName',
      align: 'center',
    },
    {
      title: '处理类型',
      dataIndex: 'problemTypeName',
      key: 'problemTypeName',
      align: 'center',
    },
    {
      title: '处理部门',
      dataIndex: 'solveDeptName',
      key: 'solveDeptName',
      align: 'center',
    },
    {
      title: '条码',
      dataIndex: 'receiveBarcode',
      key: 'receiveBarcode',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '交接内容',
      dataIndex: 'submitContent',
      key: 'submitContent',
      align: 'center',
    },
    {
      title: '反馈内容',
      dataIndex: 'solveContent',
      key: 'solveContent',
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      align: 'center',
    },
  ];

  const renderForm = () => {
    return (
      <Form
        onValuesChange={handleSearch}
        layout="inline"
        style={{ marginBottom: '10px' }}
        form={form}
      >
        <Form.Item name="startTime">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['完成开始时间', '完成结束时间']}
          />
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="请选择处理状态" allowClear>
            {processState.length > 0 &&
              processState.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const getList = (params: any) => {
    deliveryReceiptList(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.records.map((item, index) => {
          return {
            index: index,
            ...item,
          };
        });
        setList(result);
        setTotal(res.data.total);
      }
    });
  };
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    setPageSize(pageSize);
  };
  const onClickTabButton = (data: any) => {
    if (data.data.name === '按月') {
      setWeekActive(false);
      return;
    }
    setWeekActive(true);
  };
  return (
    <>
      {renderForm()}
      <Table
        dataSource={list}
        columns={columns}
        scroll={{ x: 'max-content' }}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />

      <Card
        title="处理统计"
        extra={
          <TabButton
            className={s.tabbutton}
            dataSource={['按周', '按月']}
            width={89}
            callback={(data) => {
              onClickTabButton({ data });
            }}
          />
        }
      >
        <MixColLine
          lineData={lineData}
          columnData={weekActive ? handleWeekChartData : monthChartData}
          // xField={'x_field'}
          yField={chartsConfig['resume'].yField}
        />
      </Card>
    </>
  );
};
export default HandoverProcessCount;
