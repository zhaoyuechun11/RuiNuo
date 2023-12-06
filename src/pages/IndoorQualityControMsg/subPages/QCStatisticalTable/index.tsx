import React, { useState, useEffect } from 'react';
import { useSelector } from 'umi';
import { Form, Table, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { instrList, dictList } from '@/models/server';
import { cvStatistics } from '../../models/server';
import s from '../index.less';
const { Option } = Select;
const accumulateFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '累计',
  },
  {
    id: 0,
    name: '累计',
  },
];
const drawDesignsFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '画图',
  },
  {
    id: 0,
    name: '不画图',
  },
];
const auditFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '已审核',
  },
  {
    id: 0,
    name: '未审核',
  },
];
const controlStatus = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '在空',
  },
  {
    id: 0,
    name: '失控',
  },
  {
    id: 2,
    name: '未判定',
  },
];
const { RangePicker } = DatePicker;
const QCStatisticalTable = () => {
  const loading = useSelector((state) => state.loading.global);
  const [instr, setInstr] = useState([]);
  const [form] = Form.useForm();
  const [QCLevel, setQCLevel] = useState([]);
  const [showSelectedDate, setShowSelectedDate] = useState(1);
  const [isopen, setIsOpen] = useState(false);
  const [time, setTime] = useState(null);
  const [isopenEndDate, setIsOpenEndDate] = useState(false);
  const [timeEndDate, setTimeEndDate] = useState(null);
  const [modeVal, setModeVal] = useState(['month', 'month']);
  const [monthVal, setMonthVal] = useState([]);
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getInstrList();
    getDictList();
    form.setFieldsValue({
      qcDateStart: [
        moment(
          moment().startOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'),
          'YYYY-MM-DD',
        ),
        moment(moment().endOf('quarter').subtract(3, 'quarter').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
      ],
      inuseFlag: accumulateFlag[0].id,
      drawFlag: drawDesignsFlag[0].id,
      checkFlag: auditFlag[0].id,
      controlStatus: controlStatus[0].id,
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
        <Form.Item label="年/季度/月份">
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
            <Form.Item name="qcDateStart" label="质控日期">
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

        <Form.Item label="仪器" name="instrId">
          <Select placeholder="请选择仪器" allowClear>
            {instr.map((item) => {
              return (
                <Option value={item.id} key={item.id} labClassId={item.labClassId}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="qcLevel" label="质控水平">
          <Select placeholder="请选择质控水平" allowClear>
            {QCLevel.length > 0 &&
              QCLevel.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="inuseFlag" label="累积标志">
          <Select placeholder="请选择累积标志" allowClear>
            {accumulateFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="drawFlag" label="画图标志">
          <Select placeholder="请选择画图标志" allowClear>
            {drawDesignsFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="checkFlag" label="审核标志">
          <Select placeholder="请选择审核标志" allowClear>
            {auditFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="controlStatus" label="失控标志">
          <Select placeholder="请选择失控标志" allowClear>
            {controlStatus.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const getInstrList = () => {
    instrList().then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ instrId: res.data[0].id });
        setInstr(res.data);
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'QCLEVEL' }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setQCLevel(res.data);
        }
      },
    );
  };
  const search = () => {
    const { inuseFlag, drawFlag, checkFlag, controlStatus, instrId } = form.getFieldsValue();
    let allParams = {};
    let params = { instrId, inuseFlag, drawFlag, checkFlag, controlStatus };
    if (showSelectedDate === 1) {
      const { qcDateStartYear, qcDateEndYear } = form.getFieldsValue();
      allParams = {
        ...params,
        qcDateStart: qcDateStartYear.format('YYYY') + '-' + '01' + '-' + '01',
        qcDateEnd: qcDateEndYear.format('YYYY') + '-' + '12' + '-' + '31',
      };
    }
    if (showSelectedDate === 2) {
      const { qcDateStart } = form.getFieldsValue();
      allParams = {
        ...params,
        qcDateStart: qcDateStart[0].format('YYYY-MM-DD'),
        qcDateEnd: qcDateStart[1].format('YYYY-MM-DD'),
      };
    }
    if (showSelectedDate === 3) {
      const { qcDateStartMonth } = form.getFieldsValue();
      let monthEnd = qcDateStartMonth[1].format('YYYY-MM').split('-');
      allParams = {
        ...params,
        qcDateStart: qcDateStartMonth[0].format('YYYY-MM') + '-' + '01',
        qcDateEnd: qcDateStartMonth[1].format(
          'YYYY-MM' + '-' + new Date(monthEnd[0], monthEnd[1], 0).getDate(),
        ),
      };
    }

    getCvStatistics(allParams);
  };
  const getCvStatistics = (params: any) => {
    cvStatistics(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const columns = [
    {
      title: '项目代号',
      dataIndex: 'itemCode',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '水平',
      dataIndex: 'qcLevel',
      align: 'center',
    },
    {
      title: '实测CV%',
      dataIndex: 'cv',
      align: 'center',
    },
    {
      title: '允许CV',
      dataIndex: 'maxCv',
      align: 'center',
    },
    {
      title: '1/2TEA',
      dataIndex: 'teaHalf',
      align: 'center',
    },
    {
      title: '1/3TEA',
      dataIndex: 'teaThird',
      align: 'center',
    },
    {
      title: '1/4TEA',
      dataIndex: 'teaQtr',
      align: 'center',
    },
    {
      title: 'TEA',
      dataIndex: 'tea',
      align: 'center',
    },
  ];
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const clear = () => {
    form.resetFields();
    setList([]);
  };
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
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};
export default QCStatisticalTable;
