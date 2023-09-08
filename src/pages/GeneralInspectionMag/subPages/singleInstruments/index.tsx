import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from '@components';
import { Table, Form, Input, DatePicker, Select, message } from 'antd';
import { reportUnitSelect } from '@/models/server';
import {
  reportUnitInstr,
  executorByReportUnit,
  getSampleNo,
  oneInstrAllocationScan,
  instrMachineAllocation,
} from '../../models/server';
import { createStr, containsNumbers, minusCreateStr } from '@/utils';
import styles from '../index.less';
import { useSelector, useDispatch, useLocation } from 'umi';
const { Option } = Select;
const SingleInstrument = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  const [reportUnitList, setReportUnitList] = useState([]);
  const [reportUnitInstrList, setReportUnitInstrList] = useState([]);
  const [executorList, setExecutorList] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  const { singleInstrument, singleInstrSeletedKeys } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const [singleInstrumentList, setSingleInstrumentList] = useState([]);
  const [reportUnitCodeVal, setReportUnitCodeVal] = useState();
  const [execByName, setExecByName] = useState();
  var now1 = moment().format('YYYY-MM-DD');
  useEffect(() => {
    form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
    getReportUnitSelect();
  }, []);
  useEffect(() => {
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'singleInstrument',
        dataSource: [],
      },
    });
  }, [pathname]);
  useEffect(() => {
    if (singleInstrumentList.length > 0) {
      const newData = singleInstrumentList.map((item) => {
        return {
          ...item,
          key: item.id,
          reportUnitCode: reportUnitCodeVal,
          sampleNo: scanForm.getFieldsValue().no,
          createBy: useDetail.name,
          taskTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          execBy: execByName,
        };
      });

      const mergedArray = [newData, singleInstrument].reduce((acc, val) => acc.concat(val), []);
      const ids = mergedArray.map((item) => item.id);
      //setSelectedRowKeysVal(ids);
      add();
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'singleInstrument',
          dataSource: mergedArray,
        },
      });
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'singleInstrSeletedKeys',
          dataSource: ids,
        },
      });
    }
  }, [singleInstrumentList]);
  const search = () => {};
  const add = () => {
    if (!isNaN(scanForm.getFieldsValue().no)) {
      const strData = scanForm.getFieldsValue().no;
      let specifyValue = strData.match(/\d+(\.\d+)?/g).pop(); //获取字符串中最后出现的数值
      console.log('最后的结果 :>> ', createStr(strData, specifyValue)); //abc1235ee1235d00020hhh
      scanForm.setFieldsValue({ no: createStr(strData, specifyValue) });
    } else {
      var lastChar = scanForm.getFieldsValue().no?.charAt(scanForm.getFieldsValue().no.length - 1);
      const strData = scanForm.getFieldsValue().no;
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
          scanForm.setFieldsValue({ no: createStr(strData, specifyValue) });
        }
      } else {
        message.warning('末位非数字，无法增加！');
      }
    }
  };
  const minus = () => {
    const no = scanForm.getFieldsValue().no;
    var lastChar = scanForm.getFieldsValue().no?.charAt(scanForm.getFieldsValue().no.length - 1);
    if (!no && no !== 0) {
      message.warning('请先输入样本号!');
      return;
    }
    if (Number(no) === 0) {
      message.warning('不可再减了哦!');
      return;
    }

    if (!isNaN(Number(no))) {
      scanForm.setFieldsValue({ no: Number(no) - 1 });
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
      return;
    }
    if (minusCreateStr(no, specifyValue)) {
      scanForm.setFieldsValue({ no: minusCreateStr(no, specifyValue) });
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

        if (res.data.length > 0) {
          form.setFieldsValue({ instrId: res.data[0].id });
          getSampleNoData({
            instrId: res.data[0].id,
            labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
          });
        }
      }
    });
  };
  const getSampleNoData = (params) => {
    getSampleNo(params).then((res) => {
      if (res.code === 200) {
        if (res.data !== '') {
          scanForm.setFieldsValue({ no: res.data });
        }
      }
    });
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

  const instrChange = (e) => {
    if (e) {
      getSampleNoData({
        instrId: e,
        labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
      });
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
    // setSelectedRowKeysVal(selectedRowKeys);
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'singleInstrSeletedKeys',
        dataSource: selectedRowKeys,
      },
    });
  };
  const rowSelection = {
    selectedRowKeys: singleInstrSeletedKeys,
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
        <div className={styles.action_btn}>
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
    const result = singleInstrument.filter((item) => item.id !== id);
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'singleInstrument',
        dataSource: result,
      },
    });
  };
  const getOneInstrAllocationScan = (params) => {
    oneInstrAllocationScan(params).then((res) => {
      if (res.code === 200) {
        let flag = false;

        for (let i = 0; i < singleInstrument.length; i++) {
          if (singleInstrument[i].id === res.data[0].id) {
            flag = true;
          }
        }
        if (flag) {
          message.warning('该条数据已扫过,不可重复再扫!');
          return;
        }
        setSingleInstrumentList(res.data);
      }
    });
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {
    if (!allValues?.sampleBarcode) {
      return;
    }
    if ('no' in changedValues) {
      return;
    }
    if (!scanForm.getFieldValue('no')) {
      message.warning('请先输入样本号!');
      scanForm.resetFields();
      return;
    }
    const params = {
      sampleBarcode: allValues?.sampleBarcode,
      instrId: form.getFieldValue('instrId'),
      reportUnitId: form.getFieldValue('reportUnitId'),
    };
    getOneInstrAllocationScan(params);
  };
  const AssignTasksToInstr = () => {
    let result = singleInstrument
      ?.filter((item) => singleInstrSeletedKeys.some((key) => key === item.id))
      .map((item) => {
        return {
          id: item.id,
          createBy: useDetail.id,
          taskTime: item.taskTime,
          execBy: form.getFieldValue('executor'),
          instrId: item.instrId,
          labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
          reportUnitCode: item.reportUnitCode,
          reqItemCode: item.reqItemCode,
          sampleNo: item.sampleNo,
        };
      });
    let residueResult = singleInstrument?.filter(
      (item) => !singleInstrSeletedKeys.some((key) => key === item.id),
    );
    instrMachineAllocation(result).then((res) => {
      if (res.code === 200) {
        message.success('分配成功');
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'singleInstrument',
            dataSource: residueResult,
          },
        });
      }
    });
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

        <div id="instrId">
          <Form.Item name="instrId" label="检测仪器">
            <Select
              onChange={instrChange}
              placeholder="请选择检测仪器"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('instrId')}
            >
              {reportUnitInstrList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.instrName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="labDate" rules={[{ required: true, message: '请选择检验日期' }]}>
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="请选择检验日期"
            style={{ width: 200 }}
            onChange={labDateChange}
          />
        </Form.Item>
        <div id="executor">
          <Form.Item name="executor" label="执行人">
            <Select
              placeholder="请选择执行人"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('executor')}
              onChange={executorChange}
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

        <Form.Item name="no" label="样本编号">
          <Input placeholder="请输入样本编号" />
        </Form.Item>
        <Button btnType="primary" onClick={add}>
          +
        </Button>
        <Button
          btnType="primary"
          onClick={minus}
          className={styles.minus}
          style={{ margin: '0 15px' }}
        >
          -
        </Button>
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      <div className={styles.scan_box}>
        {renderFormScan()}
        <Button btnType="primary" onClick={AssignTasksToInstr}>
          分配任务到仪器
        </Button>
      </div>
      <Table
        size={'middle'}
        rowSelection={rowSelection}
        columns={columns}
        className={styles.table_box}
        dataSource={singleInstrument}
        scroll={{ x: 'calc(700px + 50%)' }}
        footer={() =>
          singleInstrument.length > 0 && (
            <div>
              <span>
                当前待分配样本数:
                {
                  singleInstrument.filter(
                    (obj, index) =>
                      singleInstrument.findIndex(
                        (item) => item.sampleBarcode === obj.sampleBarcode,
                      ) === index,
                  ).length
                }
              </span>
            </div>
          )
        }
      />
    </>
  );
};
export default SingleInstrument;
