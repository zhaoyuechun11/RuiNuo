import React, { useState, useEffect } from 'react';
import { useSelector } from 'umi';
import { Form, Table, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { developmentRate } from '../../models/server';
import { sameKeySummataion } from '@/utils';
import s from '../index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const QCDevelopmentRate = () => {
  const loading = useSelector((state) => state.loading.global);
  const [showSelectedDate, setShowSelectedDate] = useState(1);
  const [isopen, setIsOpen] = useState(false);
  const [time, setTime] = useState(null);
  const [isopenEndDate, setIsOpenEndDate] = useState(false);
  const [timeEndDate, setTimeEndDate] = useState(null);
  const [modeVal, setModeVal] = useState(['month', 'month']);
  const [monthVal, setMonthVal] = useState([]);
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [statisticsSum, setStatisticsSum] = useState([]);
  useEffect(() => {
    form.setFieldsValue({
      qcDateStart: [
        moment(
          moment().startOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'),
          'YYYY-MM-DD',
        ),
        moment(moment().endOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
      ],
    });
  }, []);
  const handlePanelChange = (value, mode) => {
    setMonthVal(value);
    setModeVal([mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]);
    form.setFieldsValue({ qcDateStartMonth: value });
  };

  const handleChange = (value) => {
    setMonthVal(value);
  };
  const onChange = (e: any) => {
    setShowSelectedDate(e);
  };
  const onChangeQuarter = (e) => {
    if (e === 1) {
      form.setFieldsValue({
        qcDateStart: [
          moment(
            moment().startOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
          moment(
            moment().endOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
        ],
      });
    }
    if (e === 2) {
      form.setFieldsValue({
        qcDateStart: [
          moment(
            moment().startOf('quarter').subtract(2, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
          moment(
            moment().endOf('quarter').subtract(2, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
        ],
      });
    }
    if (e === 3) {
      form.setFieldsValue({
        qcDateStart: [
          moment(
            moment().startOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
          moment(
            moment().endOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DD'),
            'YYYY-MM-DD',
          ),
        ],
      });
    }
    if (e === 4) {
      form.setFieldsValue({
        qcDateStart: [
          moment(moment().startOf('quarter').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
          moment(moment().endOf('quarter').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
        ],
      });
    }
  };
  const renderForm = () => {
    return (
      <Form form={form} layout="vertical" className={s.form_box}>
        <Form.Item label="年/季度/月份/日期范围">
          <Select
            placeholder="请选择年/季度/月份"
            allowClear
            onChange={onChange}
            defaultValue={1}
            style={{ width: 100 }}
          >
            <Option value={1}>年</Option>
            <Option value={2}>季度</Option>
            <Option value={3}>月份</Option>
            <Option value={4}>日期范围</Option>
          </Select>
        </Form.Item>
        {showSelectedDate === 2 ? (
          <>
            <Form.Item label="季度">
              <Select
                placeholder="请选择季度"
                allowClear
                onChange={onChangeQuarter}
                defaultValue={1}
              >
                <Option value={1}>第一季度</Option>
                <Option value={2}>第二季度</Option>
                <Option value={3}>第三季度</Option>
                <Option value={4}>第四季度</Option>
              </Select>
            </Form.Item>
            <Form.Item name="qcDateStart" label="季度日期">
              <RangePicker
                showTime={{ format: 'YYYY-MM-DD' }}
                format="YYYY-MM-DD"
                placeholder={['质控开始时间', '质控结束时间']}
                disabled
              />
            </Form.Item>
          </>
        ) : showSelectedDate === 1 ? (
          <>
            <Form.Item label="质控开始年份" name="qcDateStartYear">
              <DatePicker
                value={time}
                open={isopen}
                mode="year"
                placeholder="请选择年份"
                format="YYYY"
                onOpenChange={(status) => {
                  if (status) {
                    setIsOpen(true);
                  } else {
                    setIsOpen(false);
                  }
                }}
                onPanelChange={(v) => {
                  setIsOpen(false);
                  setTime(v);
                  form.setFieldsValue({ qcDateStartYear: v });
                }}
                onChange={() => {
                  setTime(null);
                }}
              />
            </Form.Item>
            <Form.Item label="质控结束年份" name="qcDateEndYear">
              <DatePicker
                value={timeEndDate}
                open={isopenEndDate}
                mode="year"
                placeholder="请选择年份"
                format="YYYY"
                onOpenChange={(status) => {
                  if (status) {
                    setIsOpenEndDate(true);
                  } else {
                    setIsOpenEndDate(false);
                  }
                }}
                onPanelChange={(v) => {
                  setIsOpenEndDate(false);
                  setTimeEndDate(v);
                  form.setFieldsValue({ qcDateEndYear: v });
                }}
                onChange={() => {
                  setTimeEndDate(null);
                }}
              />
            </Form.Item>
          </>
        ) : showSelectedDate === 4 ? (
          <Form.Item name="qcDateStartDay" label="质控日期">
            <RangePicker
              showTime={{ format: 'YYYY-MM-DD' }}
              format="YYYY-MM-DD"
              placeholder={['质控开始时间', '质控结束时间']}
            />
          </Form.Item>
        ) : (
          <Form.Item label="质控月份" name="qcDateStartMonth">
            <RangePicker
              placeholder={['质控开始月份', '质控结束月份']}
              format="YYYY-MM"
              mode={['month', 'month']}
              value={monthVal}
              mode={modeVal}
              onChange={handleChange}
              onPanelChange={handlePanelChange}
            />
          </Form.Item>
        )}
      </Form>
    );
  };
  const search = () => {
    let params = {};
    if (showSelectedDate === 1) {
      const { qcDateStartYear, qcDateEndYear } = form.getFieldsValue();
      params = {
        qcDateStart: qcDateStartYear.format('YYYY') + '-' + '01' + '-' + '01',
        qcDateEnd: qcDateEndYear.format('YYYY') + '-' + '12' + '-' + '31',
      };
    }
    if (showSelectedDate === 2) {
      const { qcDateStart } = form.getFieldsValue();
      params = {
        qcDateStart: qcDateStart[0].format('YYYY-MM-DD'),
        qcDateEnd: qcDateStart[1].format('YYYY-MM-DD'),
      };
    }
    if (showSelectedDate === 4) {
      const { qcDateStartDay } = form.getFieldsValue();
      params = {
        qcDateStart: qcDateStartDay[0].format('YYYY-MM-DD'),
        qcDateEnd: qcDateStartDay[1].format('YYYY-MM-DD'),
      };
    }
    if (showSelectedDate === 3) {
      const { qcDateStartMonth } = form.getFieldsValue();
      let monthEnd = qcDateStartMonth[1].format('YYYY-MM').split('-');
      params = {
        qcDateStart: qcDateStartMonth[0].format('YYYY-MM') + '-' + '01',
        qcDateEnd: qcDateStartMonth[1].format(
          'YYYY-MM' + '-' + new Date(monthEnd[0], monthEnd[1], 0).getDate(),
        ),
      };
    }
    getDevelopmentRate(params);
  };
  const clear = () => {
    form.resetFields();
    setList([]);
  };
  const getDevelopmentRate = (params: any) => {
    developmentRate(params).then((res) => {
      if (res.code === 200) {
        setList(res.data);
        let sum = [];
        let summataionColumns = [
          {
            dataIndex: 'testItemNum',
          },
          {
            dataIndex: 'outItemNum',
          },
        ];
        for (let i = 0; i < summataionColumns.length; i++) {
          let result = sameKeySummataion(res.data, summataionColumns[i].dataIndex);
          sum.push({ ...result });
        }
        setStatisticsSum(sum);
      }
    });
  };
  const columns = [
    {
      title: '仪器代号',
      dataIndex: 'instrCode',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '检测项目数',
      dataIndex: 'testItemNum',
      align: 'center',
    },
    {
      title: '开展项目数',
      dataIndex: 'outItemNum',
      align: 'center',
    },
    {
      title: '开展率',
      dataIndex: 'outItemRate',
      align: 'center',
    },
  ];

  return (
    <>
      <div className={s.search_box}>
        {renderForm()}
        <Button type="primary" onClick={search}>
          查询
        </Button>
        <Button type="primary" onClick={clear}>
          清空
        </Button>
      </div>
      <Table
        size={'small'}
        columns={columns}
        loading={loading}
        pagination={false}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        summary={(pageData) => {
          return (
            <>
              {pageData.length !== 0 && (
                <Table.Summary.Row className={s.summary_row}>
                  <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>{' '}
                  <Table.Summary.Cell index={2}>{statisticsSum[0]?.testItemNum}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>{statisticsSum[1]?.outItemNum}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}></Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            </>
          );
        }}
      />
    </>
  );
};
export default QCDevelopmentRate;
