import React, { useEffect, useState } from 'react';
import { Form, Table, DatePicker, Select, Button } from 'antd';
import {
  getQcListDataForInstr,
  monthStatisticsDetail,
  getQcListForInstr,
  monthStatistics,
} from '../../models/server';
import { instrList } from '@/models/server';
import styles from './index.less';
import moment from 'moment';
const { Option } = Select;
const { MonthPicker } = DatePicker;

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
    name: '不累计',
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
    name: '在控',
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

const QCMonthSumStatistics = () => {
  var now1 = moment().format('YYYY-MM');
  const [form] = Form.useForm();
  const [instr, setInstr] = useState([]);
  const [qcList, setQcList] = useState([]);
  const [qcHeader, setQcHeader] = useState([]);
  const [list, setList] = useState([]);
  const [batchNo, setBatchNo] = useState();
  const [upperhalfData, setUpperhalfData] = useState([]);
  const [lowerPart, setLowerPart] = useState([]);
  useEffect(() => {
    if (upperhalfData.length > 0 || lowerPart.length > 0) {
      const mergedArray = [upperhalfData, lowerPart].reduce((acc, val) => acc.concat(val), []);
      setList(mergedArray);
    }
  }, [upperhalfData, lowerPart]);
  useEffect(() => {
    form.setFieldsValue({
      qcDate: moment(now1, 'YYYY-MM'),
      inuseFlag: accumulateFlag[0].id,
      drawFlag: drawDesignsFlag[0].id,
      checkFlag: auditFlag[0].id,
      controlStatus: controlStatus[0].id,
    });
    getInstrList();
  }, []);
  useEffect(() => {
    if (instr.length > 0 && qcList.length > 0) {
      getMonthStatisticsDetail({
        ...form.getFieldsValue(),
        qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
      });
      getMonthStatistics({
        ...form.getFieldsValue(),
        qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
      });
      getQcListForInstrData({ instrId: form.getFieldsValue().instrId });
    }
  }, [instr, qcList]);
  const handleUpperhalfData = (val) => {
    let data = [];
    Object.entries(val).forEach(([key, value]) => {
      console.log(`${key} ${value}`);
      Object.entries(value).forEach(([key1, value1]) => {
        if (key1 !== 'itemId') {
          data.push({
            type:
              key1 === 'x'
                ? 'X'
                : key1 === 'sd'
                ? 'SD'
                : key1 === 'cv'
                ? 'CV%'
                : key1 === 'monthX'
                ? '本月X'
                : key1 === 'monthSd'
                ? '本月SD'
                : '本月CV%',

            [key]: value1,
          });
        } else {
          data.push({ type: '批号', [key]: batchNo });
        }
      });
    });

    var mergedArray = data.reduce(function (result, obj) {
      var target = result.find(function (item) {
        return item.type === obj.type;
      });

      if (target) {
        Object.assign(target, obj);
      } else {
        result.push(obj);
      }
      return result;
    }, []);

    setUpperhalfData(mergedArray);
  };

  const getInstrList = () => {
    instrList().then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ instrId: res.data[0].id });
        getQcList({ instrId: res.data[0].id });
        setInstr(res.data);
      }
    });
  };
  const getQcList = (params: any) => {
    getQcListDataForInstr(params).then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ qcId: res.data[0]?.id });
        setBatchNo(res.data[0]?.batchNo);
        setQcList(res.data);
      }
    });
  };
  const instrChange = (e) => {
    getQcList({ instrId: e });
  };
  const getMonthStatisticsDetail = (params: any) => {
    monthStatisticsDetail(params).then((res) => {
      if (res.code === 200) {
        handleLowerPart(res.data);
      }
    });
  };
  const getMonthStatistics = (params: any) => {
    monthStatistics(params).then((res) => {
      if (res.code === 200) {
        handleUpperhalfData(res.data);
      }
    });
  };

  const getQcListForInstrData = (params: any) => {
    getQcListForInstr(params).then((res) => {
      if (res.code === 200) {
        if (res.data.length > 0) {
          res.data.unshift({ id: 0, itemCode: '' });
        }
        const columns = res.data.map((item, index) => {
          return {
            title: item.itemCode,
            align: 'center',
            dataIndex: item.id === 0 ? 'type' : item.id,
            fixed: index == 0 ? true : false,
          };
        });
        setQcHeader(columns);
      }
    });
  };

  const handleLowerPart = (val) => {
    /**设置每一周或者每一月对应的字段month和type值 */
    // 使用数组方法
    let list = [];
    Object.entries(val).forEach(([key, value]) => {
      Object.entries(value).forEach(([key1, value1]) => {
        value1.forEach((val, index2) => {
          let index = index2 + 1;
          list.push({
            [key]: val,
            type: key1 + '(' + index + ')',
            groupKey: key,
            serialNum: index2,
          });
        });
      });
    });

    var mergedArray = list.reduce((result, obj) => {
      var target = result.find((item) => {
        return item.serialNum === obj.serialNum && item.type == obj.type;
      });
      if (target) {
    
        Object.assign(target, obj);
      } else {
        result.push(obj);
      }
      return result;
    }, []);
    setLowerPart(mergedArray);
  };
  const qcListChange = (e, option) => {
    setBatchNo(option.batchNo);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} form={form} layout="vertical" className={styles.form_box}>
        <Form.Item name="qcDate" label="质控月份">
          <MonthPicker format="YYYY-MM" />
        </Form.Item>
        <Form.Item label="仪器" name="instrId">
          <Select placeholder="请选择仪器" allowClear onChange={instrChange}>
            {instr.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="qcId" label="质控品ID+质控水平+质控品批号+启用日期">
          <Select
            placeholder="请选择质控ID+质控水平+质控品批号+启用日期"
            allowClear
            onChange={qcListChange}
          >
            {qcList.length > 0 &&
              qcList.map((item) => (
                <Option value={item.id} key={item.id} batchNo={item.batchNo}>
                  {item.id} {item.batchNo} {item.qcLevelName} {item.startDt}
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
  const handleSearch = (changedValues: any, allValues: undefined) => {
    // getMonthStatisticsDetail({
    //   ...allValues,
    //   qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
    // });
    // getMonthStatistics({
    //   ...allValues,
    //   qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
    // });
  };
  const search = () => {
    getMonthStatisticsDetail({
      ...form.getFieldsValue(),
      qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
    });
    getMonthStatistics({
      ...form.getFieldsValue(),
      qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
    });
  };
  // const clear = () => {
  //   form.resetFields();
  // };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <Button type="primary" onClick={search}>
          查询
        </Button>
        {/* <Button type="primary" onClick={clear}>
          清空
        </Button> */}
      </div>
      <Table
        size={'small'}
        columns={qcHeader}
        // onChange={onTableChange}
        // loading={loading}
        // pagination={{
        //   current: pageNum,
        //   pageSize: pageSize,
        //   total,
        //   onChange: pageChange,
        //   showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        // }}
        dataSource={list}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};
export default QCMonthSumStatistics;
