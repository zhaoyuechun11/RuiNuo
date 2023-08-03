import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Icon } from '@components';
import { Table, Form, Input, DatePicker, Select, message } from 'antd';
import { reportUnitSelect } from '@/models/server';
import {
  reportUnitInstr,
  executorByReportUnit,
  getSampleNo,
  manyInstrAllocationScan,
} from '../../models/server';
import { createStr, containsNumbers, minusCreateStr } from '@/utils';
import styles from './index.less';
import { useSelector, useDispatch } from 'umi';
const { Option } = Select;
const MultiInstrument = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  const [reportUnitList, setReportUnitList] = useState([]);
  const [reportUnitInstrList, setReportUnitInstrList] = useState([]);
  const [executorList, setExecutorList] = useState([]);
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  const { multiInstrument, sampleNo } = useSelector((state: any) => state.generalInspectionMag);
  const [multiInstrumentList, setMultiInstrumentList] = useState([]);
  const [reportUnitCodeVal, setReportUnitCodeVal] = useState();
  const [execByName, setExecByName] = useState();
  const [instrNum, setInstrNum] = useState();
  var now1 = moment().format('YYYY-MM-DD');
  useEffect(() => {
    form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
    getReportUnitSelect();
  }, []);
  useEffect(() => {
    if (instrNum?.length > 0) {
      test(instrNum);
    }
  }, [instrNum]);
  useEffect(() => {
    if (multiInstrumentList.length > 0) {
      const newData = multiInstrumentList.map((item) => {
        let fieldName = 'no' + item.instrId;
        const executorFieldName = 'executor' + item.instrId;
        const no = form.getFieldValue(fieldName);
        const executorId = form.getFieldValue(executorFieldName);
        const executorName = executorList.filter((item) => item.id == executorId);
        console.log(executorName);

        return {
          ...item,
          key: item.id,
          reportUnitCode: reportUnitCodeVal,
          sampleNo: no,
          createBy: useDetail.name,
          taskTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          execBy: executorName.length > 0 ? executorName[0]?.name : useDetail.name,
        };
      });

      const mergedArray = [newData, multiInstrument].reduce((acc, val) => acc.concat(val), []);
      const ids = mergedArray.map((item) => item.id);
      setSelectedRowKeysVal(ids);

      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'multiInstrument',
          dataSource: mergedArray,
        },
      });
    }
  }, [multiInstrumentList]);
  const search = () => {};
  const add = (index) => {
    let fieldName = 'no' + index;

    console.log(form.getFieldValue(fieldName));
    debugger;
    if (!isNaN(form.getFieldValue(fieldName))) {
      const strData = form.getFieldValue(fieldName);
      let specifyValue = strData.match(/\d+(\.\d+)?/g).pop(); //获取字符串中最后出现的数值
      console.log('最后的结果 :>> ', createStr(strData, specifyValue)); //abc1235ee1235d00020hhh
      form.setFieldsValue({ [fieldName]: createStr(strData, specifyValue) });
    } else {
      var lastChar = form.getFieldValue(fieldName).charAt(form.getFieldValue(fieldName).length - 1);
      if (!isNaN(lastChar)) {
        const strData = form.getFieldValue(fieldName);
        if (containsNumbers(strData)) {
          let specifyValue = strData.match(/\d+(\.\d+)?/g).pop(); //获取字符串中最后出现的数值
          //let specifyValue2 = strData2.match(/\d+(\.\d+)?/g).pop()  //获取字符串中最后出现的数值
          console.log('最后的结果 :>> ', createStr(strData, specifyValue)); //abc1235ee1235d00020hhh
          //console.log('最后的结果 :>> ', createStr(strData2, specifyValue));  //value-0100
          form.setFieldsValue({ [fieldName]: createStr(strData, specifyValue) });
        }
      } else {
        message.warning('末位非数字，无法增加！');
      }
    }
  };
  const minus = (index) => {
    let fieldName = 'no' + index;
    const no = form.getFieldValue(fieldName);
    if (!no && no !== 0) {
      message.warning('请先输入样本号!');
      return;
    }

    if (!isNaN(Number(no))) {
      form.setFieldsValue({ [fieldName]: Number(no) - 1 });
      return;
    }
    let specifyValue = no.match(/\d+(\.\d+)?/g).pop(); //获取字符串中最后出现的数值
    console.log('最后的结果 :>> ', minusCreateStr(no, specifyValue)); //abc1235ee1235d00020hhh
    if (parseInt(specifyValue) === 0) {
      message.warning('不可再减了哦!');
    }
    if (minusCreateStr(no, specifyValue)) {
      form.setFieldsValue({ [fieldName]: minusCreateStr(no, specifyValue) });
    }
    // const num = no.replace(/^.*?(\d*)$/, (str, match, index) => match || '');
    // const nonzeroStart = num.match(/[^0][1-9]\d*/g); //匹配以非0数字开头
    // //const nonzeroStart = num.match(/^[1-9]\d*$/);
    // debugger;

    // if (!num) {
    //   message.warning('末位非数字,无法递减!');
    //   return;
    // } else {
    //   const indexVal = num.match(/[^0][1-9]\d*/g)[0].length; //匹配以非0数字开头

    //   if (indexVal > 0) {
    //     spelicVal = num.slice(0, -indexVal);
    //   }
    //   const str = no.replace(/^(.*?)\d*$/, (str, match, index) => match || '0');
    //   console.log(str + spelicVal + (Number(nonzeroStart) - 1));
    //   const result = str + spelicVal + (Number(nonzeroStart) - 1);
    //   scanForm.setFieldsValue({ no: result });
    // }
  };
  const getReportUnitSelect = () => {
    reportUnitSelect({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };
  const getReportUnitInstr = (reportUnitId) => {
    reportUnitInstr({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setReportUnitInstrList(res.data);
        setInstrNum(res.data.map((item) => item.id));
      }
    });
  };
  const getSampleNoData = (params) => {
    getSampleNo(params).then((res) => {
      if (res.code === 200) {
        res.data = '1234567';
        if (res.data !== '') {
          sampleNo.push(res.data);
          dispatch({
            type: 'generalInspectionMag/save',
            payload: {
              type: 'sampleNo',
              dataSource: sampleNo,
            },
          });
          for (let i in sampleNo) {
            let fieldName = 'no' + params.instrId;
            form.setFieldsValue({ [fieldName]: sampleNo[i] });
          }
        }
      }
    });
  };
  const test = async (arr) => {
    for (let i in arr) {
      await getSampleNoData({
        instrId: arr[i],
        labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
      });
    }
  };

  const getExecutorByReportUnit = (reportUnitId) => {
    executorByReportUnit({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setExecutorList(res.data);
        form.setFieldsValue({ executor: useDetail.id });
        setExecByName(useDetail.name);
      }
    });
  };
  const reportUnitChange = (e) => {
    if (e) {
      const result = reportUnitList.filter((item) => item.id == e);
      setReportUnitCodeVal(result[0].reportUnitCode);
      getReportUnitInstr(e);
      getExecutorByReportUnit(e);
    }
  };
  const executorChange = (e) => {
    if (e) {
      const result = executorList.filter((item) => item.id == e);
      setExecByName(result[0].name);
    }
  };

  const labDateChange = (e) => {
    if (e) {
      getSampleNoData({
        instrId: form.getFieldValue('instrId'),
        labDate: e?.format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
      width: 100,
      fixed: 'left',
      ellipsis: true,
    },

    {
      title: '报告单元',
      dataIndex: 'reportUnitCode',
      width: 100,
    },
    {
      title: '专业',
      dataIndex: 'labClassName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '仪器',
      dataIndex: 'instrName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
      width: 100,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      ellipsis: true,
    },
    {
      title: '申请项目代号',
      dataIndex: 'reqItemCode',
      width: 100,
      ellipsis: true,
    },
    {
      title: '申请项目',
      dataIndex: 'reqItemName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '分配人',
      dataIndex: 'createBy',
      width: 100,
      ellipsis: true,
    },
    {
      title: '执行人',
      dataIndex: 'execBy',
      width: 100,
      ellipsis: true,
    },
    {
      title: '分配时间',
      dataIndex: 'taskTime',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 180,
      render: (text: string, record: Record<string, any>) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              // history.push(
              //   '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
              // );
            }}
          >
            打印条码
          </Button>
          <Button
            onClick={() => {
              deleteCurrentItem(record.id);
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  const deleteCurrentItem = (id) => {
    const result = multiInstrument.filter((item) => item.id !== id);
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'multiInstrument',
        dataSource: result,
      },
    });
  };
  const getManyInstrAllocationScan = (params) => {
    manyInstrAllocationScan(params).then((res) => {
      if (res.code === 200) {
        setMultiInstrumentList(res.data);
      }
    });
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {
    if (!allValues?.sampleBarcode) {
      return;
    }
    const params = {
      sampleBarcode: allValues?.sampleBarcode,
      instrIds: instrNum,
      reportUnitId: form.getFieldValue('reportUnitId'),
    };
    getManyInstrAllocationScan(params);
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={form} className={styles.search_box}>
        <Form.Item name="reportUnitId" label="报告单元">
          <Select
            placeholder="请选择报告单元"
            autoComplete="off"
            allowClear
            onChange={reportUnitChange}
          >
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {instrNum?.map((item, index) => {
          return (
            <div id="instrId">
              <Form.Item name={`${`instrId` + index}`} label={`${`检测仪器`}`}>
                <Select
                  placeholder="请选择检测仪器"
                  autoComplete="off"
                  allowClear
                  getPopupContainer={() => document.getElementById('instrId')}
                  defaultValue={item}
                  disabled
                >
                  {reportUnitInstrList?.map((item, index) => (
                    <Option value={item.id} key={index}>
                      {item.instrName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          );
        })}
        {instrNum?.map((item, index) => {
          return (
            <>
              <Form.Item name={`${`no` + item}`} label="样本编号">
                <Input placeholder="请输入样本编号" />
              </Form.Item>
              <Button btnType="primary" onClick={() => add(item)}>
                +
              </Button>
              <Button
                btnType="primary"
                onClick={() => minus(item)}
                className={styles.minus}
                style={{ margin: '0 15px' }}
              >
                -
              </Button>
            </>
          );
        })}
        <Form.Item name="labDate" rules={[{ required: true, message: '请选择检验日期' }]}>
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="请选择检验日期"
            style={{ width: 340 }}
            onChange={labDateChange}
          />
        </Form.Item>
        {instrNum?.map((item, index) => {
          return (
            <div id="executor">
              <Form.Item name={`${`executor` + item}`} label="执行人">
                <Select
                  placeholder="请选择执行人"
                  autoComplete="off"
                  allowClear
                  getPopupContainer={() => document.getElementById('executor')}
                  onChange={executorChange}
                  defaultValue={useDetail.id}
                >
                  {executorList.length > 0 &&
                    executorList.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          );
        })}
      </Form>
    );
  };
  const renderFormScan = () => {
    return (
      <Form
        onValuesChange={searchHandle}
        layout="inline"
        form={scanForm}
        className={styles.scanForm_box}
      >
        <Form.Item name="sampleBarcode" label="样本条码">
          <Input placeholder="请输入样本条码" />
        </Form.Item>

        <Button btnType="primary">分配任务到仪器</Button>
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      {renderFormScan()}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        className={styles.table_box}
        dataSource={multiInstrument}
        scroll={{ x: 'calc(700px + 50%)' }}
      />
    </>
  );
};
export default MultiInstrument;
