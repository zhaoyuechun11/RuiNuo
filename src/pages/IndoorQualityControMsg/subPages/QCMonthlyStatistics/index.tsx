import React, { useState, useEffect } from 'react';
import { useSelector } from 'umi';
import { Form, Table, DatePicker, Select, Button } from 'antd';
import { instrList, dictList } from '@/models/server';
import { monthlyStatistics } from '../../models/server';
import { sameKeySummataion } from '@/utils';
import s from '../index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const QCMonthlyStatistics = () => {
  const loading = useSelector((state) => state.loading.global);
  const [QCLevel, setQCLevel] = useState([]);
  const [instr, setInstr] = useState([]);
  const [form] = Form.useForm();
  const [modeVal, setModeVal] = useState(['month', 'month']);
  const [monthVal, setMonthVal] = useState([]);
  const [list, setList] = useState([]);
  const [monthStatisticsSum, setMonthStatisticsSum] = useState(0);
  useEffect(() => {
    getInstrList();
    getDictList();
  }, []);
  useEffect(() => {
    let sum = [];
    let summataionColumns = [
      {
        title: '测定数%',
        dataIndex: 'itemNum',
        align: 'center',
      },
      {
        title: '失控数',
        dataIndex: 'controlStatusNum',
        align: 'center',
      },
      {
        title: '失控率%',
        dataIndex: 'controlStatusRate',
        align: 'center',
      },
      {
        title: '处理率%',
        dataIndex: 'disPoseRate',
        align: 'center',
      },
    ];
    for (let i = 0; i < summataionColumns.length; i++) {
      let result = sameKeySummataion(list, summataionColumns[i].dataIndex);
      sum.push({ ...result });
    }
    setMonthStatisticsSum(sum);
  }, [list]);
  const getDictList = () => {
    dictList({ type: 'QCLEVEL' }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setQCLevel(res.data);
        }
      },
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
  const handlePanelChange = (value, mode) => {
    setMonthVal(value);
    setModeVal([mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]);
    form.setFieldsValue({ qcDateStartMonth: value });
  };

  const handleChange = (value) => {
    setMonthVal(value);
  };

  const renderForm = () => {
    return (
      <Form form={form} layout="vertical" className={s.form_box}>
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
      </Form>
    );
  };
  const search = () => {
    let monthEnd = form.getFieldsValue().qcDateStartMonth[1].format('YYYY-MM').split('-');
    const { qcDateStartMonth, instrId, qcLevel } = form.getFieldsValue();
    const params = {
      instrId,
      qcLevel,
      qcDateStart: qcDateStartMonth[0].format('YYYY-MM') + '-' + '01',
      qcDateEnd: qcDateStartMonth[1].format(
        'YYYY-MM' + '-' + new Date(monthEnd[0], monthEnd[1], 0).getDate(),
      ),
    };
    getMonthlyStatistics(params);
  };
  const getMonthlyStatistics = (params: any) => {
    monthlyStatistics(params).then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const clear = () => {
    form.resetFields();
    setList([]);
  };
  const columns = [
    {
      title: '质控项目',
      dataIndex: 'itemName',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '水平',
      dataIndex: 'qcLevel',
      align: 'center',
    },
    {
      title: '测定数%',
      dataIndex: 'itemNum',
      align: 'center',
    },
    {
      title: '失控数',
      dataIndex: 'controlStatusNum',
      align: 'center',
    },
    {
      title: '失控率%',
      dataIndex: 'controlStatusRate',
      align: 'center',
    },
    {
      title: '处理率%',
      dataIndex: 'disPoseRate',
      align: 'center',
    },
    {
      title: '允许最大CV',
      dataIndex: 'maxCv',
      align: 'center',
    },
    {
      title: '靶值(绘图基准数据)',
      dataIndex: 'tagValue',
      align: 'center',
    },
    {
      title: '基准SD(绘图基准数据)',
      dataIndex: 'sd',
      align: 'center',
    },
    {
      title: 'CV%(绘图基准数据)',
      dataIndex: 'cv',
      align: 'center',
    },
    {
      title: '原始均值(区间原始数据)',
      dataIndex: 'qjAvgNum',
      align: 'center',
    },
    {
      title: 'SD(区间原始数据)',
      dataIndex: 'qjSD',
      align: 'center',
    },
    {
      title: 'CV%(区间原始数据)',
      dataIndex: 'qjCV',
      align: 'center',
    },
    {
      title: '在控均值(区间非失控数据)',
      dataIndex: 'fskAvgNum',
      align: 'center',
    },
    {
      title: 'SD(区间非失控数据)',
      dataIndex: 'fskSD',
      align: 'center',
    },
    {
      title: 'CV%(区间非失控数据)',
      dataIndex: 'fskCV',
      align: 'center',
    },
    {
      title: '累积次数(累积数据包含失控和非失控)',
      dataIndex: 'ljNum',
      align: 'center',
    },
    {
      title: '累积均值(累积数据包含失控和非失控)',
      dataIndex: 'ljAvgNum',
      align: 'center',
    },
    {
      title: 'SD(累积数据包含失控和非失控)',
      dataIndex: 'ljSD',
      align: 'center',
    },
    {
      title: 'CV%(累积数据包含失控和非失控)',
      dataIndex: 'ljCV',
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
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>{' '}
                  <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>{' '}
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>{' '}
                  <Table.Summary.Cell index={2}>{monthStatisticsSum[0].itemNum}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    {monthStatisticsSum[1].controlStatusNum}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    {monthStatisticsSum[2].controlStatusRate}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    {monthStatisticsSum[3].disPoseRate}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            </>
          );
        }}
      />
    </>
  );
};
export default QCMonthlyStatistics;
