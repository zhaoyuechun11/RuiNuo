import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button, Icon } from '@components';
import { Table, Form, Input, DatePicker, Select, message, Row, Col, Popconfirm } from 'antd';
import { reportUnitSelect } from '@/models/server';
import {
  reportUnitInstr,
  executorByReportUnit,
  getSampleNo,
  manyInstrAllocationScan,
  instrMachineAllocation,
} from '../../models/server';
import { createStr, containsNumbers, minusCreateStr } from '@/utils';
import s from './index.less';
import styles from '../index.less';
import { useSelector, useDispatch, useLocation } from 'umi';
import ApplyProjectByInstr from './components/applyProjectByInstr';
const { Option } = Select;
const MultiInstrument = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
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
  const [instrNum, setInstrNum] = useState();
  var now1 = moment().format('YYYY-MM-DD');
  const applyProjectByInstrRef = useRef();
  useEffect(() => {
    form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
    getReportUnitSelect();
  }, []);
  useEffect(() => {
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'multiInstrument',
        dataSource: [],
      },
    });
  }, [pathname]);
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
          execId: executorId ? executorId : useDetail.id,
        };
      });

      const mergedArray = [newData, multiInstrument].reduce((acc, val) => acc.concat(val), []);
      const ids = mergedArray.map((item) => item.id);
      setSelectedRowKeysVal(ids);
      add(multiInstrumentList[0].instrId);
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'multiInstrument',
          dataSource: mergedArray,
        },
      });
    }
  }, [multiInstrumentList]);
  const add = (index) => {
    let fieldName = 'no' + index;
    console.log(form.getFieldValue(fieldName));
    if (!isNaN(form.getFieldValue(fieldName))) {
      const strData = form.getFieldValue(fieldName);
      let specifyValue = strData.match(/\d+(\.\d+)?/g).pop(); //获取字符串中最后出现的数值
      console.log('最后的结果 :>> ', createStr(strData, specifyValue)); //abc1235ee1235d00020hhh
      form.setFieldsValue({ [fieldName]: createStr(strData, specifyValue) });
    } else {
      var lastChar = form
        .getFieldValue(fieldName)
        ?.charAt(form.getFieldValue(fieldName).length - 1);
      const strData = form.getFieldValue(fieldName);
      if (!strData) {
        message.warning('请先输入编号再增加!');
        return;
      }
      if (!isNaN(lastChar)) {
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
    var lastChar = form.getFieldValue(fieldName)?.charAt(form.getFieldValue(fieldName).length - 1);
    if (!no && no !== 0) {
      message.warning('请先输入样本号!');
      return;
    }
    if (Number(no) === 0) {
      message.warning('不可再减了哦!');
      return;
    }

    if (!isNaN(Number(no))) {
      form.setFieldsValue({ [fieldName]: Number(no) - 1 });
      return;
    }
    if (isNaN(lastChar)) {
      message.warning('末位非数字无法减!');
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
    }
  };

  const labDateChange = (e) => {
    if (e && instrNum?.length > 0) {
      test(instrNum);
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
      align: 'center',
    },

    {
      title: '报告单元',
      dataIndex: 'reportUnitCode',
      width: 100,
      align: 'center',
    },
    {
      title: '专业',
      dataIndex: 'labClassName',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'instrName',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '申请项目代号',
      dataIndex: 'reqItemCode',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '申请项目',
      dataIndex: 'reqItemName',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '分配人',
      dataIndex: 'createBy',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '执行人',
      dataIndex: 'execBy',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '分配时间',
      dataIndex: 'taskTime',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 200,
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
        let flag = false;
        for (let i = 0; i < multiInstrument.length; i++) {
          if (multiInstrument[i].id === res.data[0].id) {
            flag = true;
          }
        }
        if (flag) {
          message.warning('该条数据已扫过,不可重复再扫!');
          return;
        }
        setMultiInstrumentList(res.data);
      }
    });
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {
    if (!allValues?.sampleBarcode) {
      return;
    }
    let flag = false;
    for (let i = 0; i < instrNum.length; i++) {
      if (!form.getFieldValue('no' + instrNum[i])) {
        flag = true;
      }
    }
    if (flag) {
      message.warning('有样本编码未输入,请先输入！');
      scanForm.resetFields();
      return;
    }
    const params = {
      sampleBarcode: allValues?.sampleBarcode,
      instrIds: instrNum,
      reportUnitId: form.getFieldValue('reportUnitId'),
    };
    getManyInstrAllocationScan(params);
  };
  const AssignTasksToInstr = () => {
    let result = multiInstrument
      ?.filter((item) => selectedRowKeysVal.some((key) => key === item.id))
      .map((item) => {
        return {
          id: item.id,
          createBy: useDetail.id,
          taskTime: item.taskTime,
          execBy: item.execId,
          instrId: item.instrId,
          labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
          reportUnitCode: item.reportUnitCode,
          reqItemCode: item.reqItemCode,
          sampleNo: item.sampleNo,
        };
      });
    let residueResult = multiInstrument?.filter(
      (item) => !selectedRowKeysVal.some((key) => key === item.id),
    );
    instrMachineAllocation(result).then((res) => {
      if (res.code === 200) {
        message.success('分配成功');
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'multiInstrument',
            dataSource: residueResult,
          },
        });
      }
    });
  };
  const view = (id) => {
    applyProjectByInstrRef.current.show(id);
  };

  const confirm = () => {
    scanForm.resetFields();
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'multiInstrument',
        dataSource: [],
      },
    });
  };

  const renderForm = () => {
    return (
      <Form form={form} className={`${styles.search_box} ${s.multiInstr_form}`}>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box">
              <Form.Item name="reportUnitId" label="报告单元">
                <Select
                  placeholder="请选择报告单元"
                  autoComplete="off"
                  allowClear
                  onChange={reportUnitChange}
                  style={{ width: 200 }}
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
            </div>
            <div>
              <Form.Item name="labDate" label="检验日期">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请选择检验日期"
                  style={{ width: 200 }}
                  onChange={labDateChange}
                />
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            {instrNum?.map((item, index) => {
              return (
                <div id="instrId" style={{ display: 'flex' }}>
                  <Form.Item name={`${`instrId` + index}`} label={`${`检测仪器`}`}>
                    <Select
                      placeholder="请选择检测仪器"
                      autoComplete="off"
                      allowClear
                      getPopupContainer={() => document.getElementById('instrId')}
                      defaultValue={item}
                      disabled
                      style={{ width: 200 }}
                    >
                      {reportUnitInstrList?.map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.instrName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    btnType="primary"
                    onClick={() => view(item)}
                    style={{ height: '32px', marginLeft: '10px' }}
                  >
                    查看
                  </Button>
                </div>
              );
            })}
          </Col>
          <Col className="gutter-row" span={6}>
            {instrNum?.map((item, index) => {
              return (
                <div style={{ display: 'flex' }}>
                  <Form.Item name={`${`no` + item}`} label="样本编号">
                    <Input placeholder="请输入样本编号" />
                  </Form.Item>
                  <Button
                    btnType="primary"
                    onClick={() => add(item)}
                    style={{ height: '32px', marginLeft: '10px' }}
                  >
                    +
                  </Button>
                  <Button
                    btnType="primary"
                    onClick={() => minus(item)}
                    className={styles.minus}
                    style={{ height: '32px' }}
                  >
                    -
                  </Button>
                </div>
              );
            })}
          </Col>
          <Col className="gutter-row" span={4}>
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
          </Col>
        </Row>
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
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      <div className={s.search_box_scan}>
        {renderFormScan()}
        <Button btnType="primary" onClick={AssignTasksToInstr}>
          分配任务到仪器
        </Button>
        <Popconfirm title="是否取消本次任务分配？" onConfirm={confirm} okText="是" cancelText="否">
          <Button btnType="primary">重置</Button>
        </Popconfirm>
      </div>
      <Table
        size={'middle'}
        rowSelection={rowSelection}
        columns={columns}
        className={styles.table_box}
        dataSource={multiInstrument}
        scroll={{ x: 'calc(700px + 50%)' }}
        footer={() =>
          multiInstrument.length > 0 && (
            <div>
              <span>
                当前待分配样本数:
                {
                  multiInstrument.filter(
                    (obj, index) =>
                      multiInstrument.findIndex(
                        (item) => item.sampleBarcode === obj.sampleBarcode,
                      ) === index,
                  ).length
                }
              </span>
            </div>
          )
        }
      />
      <ApplyProjectByInstr Ref={applyProjectByInstrRef} />
    </>
  );
};
export default MultiInstrument;
