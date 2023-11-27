import React, { useEffect, useState } from 'react';
import { Form, message, Tabs, Table, DatePicker } from 'antd';
import { Button } from '@/components';
import { dictList } from '@/models/server';
import {
  monthStatistics,
  weekStatistics,
  weekStatisticsExport,
  monthStatisticsExport,
} from '../../models/server';
import { downLoad } from '@/utils';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import styles from '../index.less';
import s from './index.less';

const ConsultationFormStatistics = () => {
  const [form] = Form.useForm();
  const [tableHeader, setTableHeader] = useState([]);
  const [monthStatisticsList, setMonthStatisticsList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [monthStatisticsSum, setMonthStatisticsSum] = useState(0);
  const [activeKey, setActiveKey] = useState('1');
  const [fillZerohandleList, setfFllZerohandleList] = useState([]);
  useEffect(() => {
    if (activeKey === '1') {
      getTableHeader(weekList);
      getDictList(weekList);
      return;
    }
    getTableHeader(monthList);
    getDictList(monthList);
  }, [weekList, monthList, activeKey]);
  useEffect(() => {
    let sum = [];
    tableHeader.map((item) => {
      if (item.dataIndex !== 'type') {
        let result = sameKeySummataion(monthStatisticsList, item.dataIndex);
        sum.push({ ...result });
      }
    });
    setMonthStatisticsSum(sum);
  }, [monthStatisticsList]);
  useEffect(() => {
    /**未匹配的月或周填充对应的字段month和值0 */
    for (let y = 0; y < monthStatisticsList.length; y++) {
      for (let i = 0; i < tableHeader.length; i++) {
        if (!Object.keys(monthStatisticsList[y]).includes(tableHeader[i].dataIndex)) {
          monthStatisticsList[y][tableHeader[i].dataIndex] = 0;
        }
      }
    }
   
    setfFllZerohandleList(monthStatisticsList);
  }, [tableHeader, monthStatisticsList]);
  const handleSearch = (changedValues: any) => {
    if (!form.getFieldsValue().finishTimeStart) {
      setfFllZerohandleList([]);
      return;
    }
    const params = {
      finishTimeStart: changedValues.finishTimeStart
        ? changedValues.finishTimeStart[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      finishTimeEnd: changedValues.finishTimeStart
        ? changedValues.finishTimeStart[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    getMonthStatistics(params);
    getWeekStatistics(params);
  };
  const renderForm = () => {
    return (
      <Form layout="inline" form={form} onValuesChange={handleSearch}>
        <Form.Item name="finishTimeStart">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['完成开始时间', '完成结束时间']}
          />
        </Form.Item>
      </Form>
    );
  };
  const getDictList = (headerList) => {
    dictList({ type: 'EVENTTYPE' }).then((res) => {
      if (res.code === 200) {
        getMonthList(res.data, headerList);
      }
    });
  };
  const getMonthList = (typeList, headerList) => {
  
    /**设置每一周或者每一月对应的字段month和type值 */
    let list = [];
    let result = Object.values(headerList);
    typeList.map((typeItem) => {
      result.map((item, index) => {
        Object.keys(item).forEach((key) => {
          if (typeItem.dictValue === key) {
            let num = index + 1;
            list.push({ ['month' + num]: item[key], type: key });
          }
        });
      });
    });

    const groupResult = groupBy(list, 'type'); //对周或月进行分组
    /**对每一组的每一条数据对象进行合并 */
    let combinationData = [];
    Object.keys(groupResult).forEach((key) => {
      let target = {};
      groupResult[key].forEach((item) => {
        Object.assign(target, item);
      });
      combinationData.push({ ...target });
    });
    setMonthStatisticsList(combinationData);
  };
  // 判断是否为数字
  const isNumber = (str) => {
    const reg = /^(-?\d+)(\.\d+)?$/;
    return reg.test(str);
  };
  // 数组相同元素累加
  const sameKeySummataion = (arr, matchKey) => {
    let obj = {};
    arr.forEach((item) => {
      for (let key in item) {
        if (matchKey.indexOf(key) !== -1) {
          let value = item[key];
          if (isNumber(value)) {
            key in obj ? (obj[key] += Number(value)) : (obj[key] = Number(value));
          }
        }
      }
    });
    // 这一步可省略  这里为了保留最终数据都包含两位小数点
    for (var i in obj) {
      obj[i] = obj[i].toFixed(2);
    }
    return obj;
  };
  const groupBy = (objectArray, property) => {
    return objectArray.reduce( (acc, obj)=> {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };
  const getTableHeader = (val) => {
    let result = Object.keys(val);
    if (result.length > 0) {
      result.unshift('事项类型');
    }
    const columns = result.map((item, index) => {
      return {
        title: item,
        align: 'center',
        dataIndex: item !== '事项类型' ? 'month' + index : 'type',
        fixed: item == '事项类型' ? true : false,
      };
    });

    setTableHeader(columns);
  };
  const getMonthStatistics = (params: any) => {
    monthStatistics(params).then((res) => {
      if (res.code === 200) {
        setMonthList(res.data);
      }
    });
  };
  const getWeekStatistics = (params: any) => {
    weekStatistics(params).then((res) => {
      if (res.code === 200) {
        setWeekList(res.data);
      }
    });
  };
  const onChangeTab = (e) => {
    if (!form.getFieldsValue().finishTimeStart) {
      message.warning('请选择完成时间哦!');
      return;
    }
    const params = {
      finishTimeStart: form.getFieldsValue().finishTimeStart
        ? form.getFieldsValue().finishTimeStart[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      finishTimeEnd: form.getFieldsValue().finishTimeStart
        ? form.getFieldsValue().finishTimeStart[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    setActiveKey(e);
    if (e === '1') {
      getWeekStatistics(params);
    } else {
      getMonthStatistics(params);
    }
  };
  const exportData = () => {
    const params = {
      finishTimeStart: form.getFieldsValue().finishTimeStart
        ? form.getFieldsValue().finishTimeStart[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      finishTimeEnd: form.getFieldsValue().finishTimeStart
        ? form.getFieldsValue().finishTimeStart[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    if (activeKey === '1') {
      weekStatisticsExport(params).then((res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const href = URL.createObjectURL(blob);
        downLoad(href, '周统计');
      });
      return;
    }

    monthStatisticsExport(params).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '月统计');
    });
  };
  return (
    <>
      {' '}
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={exportData}>
            导出
          </Button>
        </div>
      </div>
      <Tabs defaultActiveKey="1" onChange={onChangeTab} className={s.tabs_box}>
        <TabPane tab="周统计" key="1">
          <Table
            dataSource={fillZerohandleList}
            columns={tableHeader}
            pagination={false}
            scroll={{ x: 'max-content' }}
            size='small'
            summary={(pageData) => {
              return (
                <>
                  {pageData.length !== 0 && (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>{' '}
                      {monthStatisticsSum.map((item, index) => {
                        let num = index + 1;
                        return (
                          <Table.Summary.Cell index={index}>
                            {item['month' + num]}
                          </Table.Summary.Cell>
                        );
                      })}
                    </Table.Summary.Row>
                  )}
                </>
              );
            }}
          />
        </TabPane>
        <TabPane tab="月统计" key="2">
          <Table
            dataSource={fillZerohandleList}
            columns={tableHeader}
            size="small"
            summary={(pageData) => {
              return (
                <>
                  {pageData.length !== 0 && (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>{' '}
                      {monthStatisticsSum.map((item, index) => {
                        let num = index + 1;
                        return (
                          <Table.Summary.Cell index={index}>
                            {item['month' + num]}
                          </Table.Summary.Cell>
                        );
                      })}
                    </Table.Summary.Row>
                  )}
                </>
              );
            }}
          />
        </TabPane>
      </Tabs>
    </>
  );
};
export default ConsultationFormStatistics;
