import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Form,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Tabs,
  Button,
  Popover,
  message,
  Popconfirm,
} from 'antd';
import { useDispatch, useSelector, useLocation } from 'umi';
import moment from 'moment';
import {
  getHospitalList,
  dictList,
  getDoctorList,
  reportUnitReqItem,
  reportUnitList,
  reportUnitInstr,
  listByReportUnit,
} from '@/models/server';
import {
  reportMainUpdate,
  updateRefuse,
  reportResultSave,
  reportResultUpdate,
  reportResult,
  addCommonUpdate,
  firstAudit,
  secondAudit,
} from '../../../../models/server';
import styles from '../index.less';
import style from './index.less';
import ReviewModal from './commones/reviewModal';
import AuditWarning from './commones/auditWarning';
const { Option } = Select;
const { TabPane } = Tabs;

const RightContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tableHeaderCoumn, setTableHeaderCoumn] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();
  const [hospitalList, setHospitalList] = useState([]);
  const [sampleSource, setSampleSource] = useState([]);
  const [sex, setSex] = useState([]);
  const [department, setDepartment] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [reportUnitReqItemList, setReportUnitReqItemList] = useState([]);
  const [reportUnit, setReportUnit] = useState([]);
  const [creenReportList, setCreenReportList] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const { useDetail } = useSelector((state: any) => state.global);
  const [activeKey, setActiveKey] = useState('10');
  const updateInfoData = useRef();
  const location = useLocation();
  const auditModal = useRef();
  const {
    reportLefUpdate,
    instrAndRecordId,
    isChangeReportResult,
    reportResultList,
    reportMiddleUpdate,
    batchAdd,
    personList,
    reportUnitInstrList,
    reviewReultsFlag,
  } = useSelector((state: any) => state.generalInspectionMag);
  const [clickRow, setClickRow] = useState();
  var now1 = moment().format('YYYY-MM-DD');
  const reviewModal = useRef();

  useEffect(() => {
    form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
    hospital();
    getDictList({ type: 'SX' });
    getDictList({ type: 'DP' });
    getDictList({ type: 'FT' });
    getReportUnitList();
    const reportUnit = localStorage.getItem('reportUnit');
    if (reportUnit) {
      const newReportUnit = JSON.parse(reportUnit);
      form.setFieldsValue({ reportUnitCode: newReportUnit.value });
      getReportUnitReqItem(newReportUnit.key);
      getReportUnitInstr(newReportUnit.key);
      getListByReportUnit(newReportUnit.key);
      getList({ reportUnitName: newReportUnit.children });
    } else {
      getList({ reportUnitName: '' });
    }
    getCreenReportList({
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      labDate: form.getFieldValue('labDate').format('YYYY-MM-DD HH:mm:ss'),
    });
  }, []);
  useEffect(() => {
    if (reportMiddleUpdate) {
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'reportMiddleUpdate',
          dataSource: false,
        },
      });
    }
  }, [location.pathname]);
  useEffect(() => {
    if (list.length > 0) {
      const firstColumm = list?.slice(0, 1).map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          fixed: 'left',
          width: 120,
          ellipsis: true,
          sorter: column.key === 'sampleBarcode',
          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      });

      const middleColumns = list?.slice(1).map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          sorter:
            column.key === 'labDate' ||
            column.key === 'sampleNo' ||
            column.key === 'patientName' ||
            column.key === 'age' ||
            column.key === 'sendDept' ||
            column.key === 'sendDoctor'
              ? true
              : false,
          responsive: ['xl', 'xxl'],
          align: 'center',
          width: column.key === 'instrName' || column.key === 'sampleNo' ? 160 : 60,
          ellipsis: true,
          render: (text: string | number) => {
            return (
              <span>
                {typeof text === 'boolean'
                  ? text && column.key === 'overdueFlag'
                    ? '✓'
                    : text && column.key !== 'overdueFlag'
                    ? '是'
                    : '否'
                  : text || '-'}
              </span>
            );
          },
        };
      });

      const coumns = [...firstColumm, ...middleColumns];
      setTableHeaderCoumn(coumns);
    }
  }, [list]);
  useEffect(() => {
    getCreenReportList({
      ...form.getFieldsValue(),
      labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
      ...extendForm.getFieldsValue(),
      [sort]: order,
      pageNum,
      pageSize,
    });
  }, [pageNum, pageSize, sort, order, reportLefUpdate, reportMiddleUpdate, reviewReultsFlag]);

  const getList = (params) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportListTableHeader',
      payload: {
        ...params,
        callback: (res: { code: number; data: React.SetStateAction<never[]> }) => {
          if (res.code === 200) {
            setList(res.data);
          }
        },
      },
    });
  };
  const checkChange = (e) => {};
  const instrChange = (e) => {};
  const searchHandle = (changedValues: any, allValues: undefined) => {
    // getCreenReportList({
    //   ...allValues,
    //   pageNum,
    //   pageSize,
    //   ...extendForm.getFieldsValue(),
    //   labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
    // });
  };
  const seach = () => {
    let param = {};
    if (activeKey !== '10') {
      setActiveKey('10');
    }
    if (/-/.test(form.getFieldValue('sampleNoStart'))) {
      console.log(form.getFieldValue('sampleNoStart').split('-'));
      let result = form.getFieldValue('sampleNoStart').split('-');
      param = {
        sampleNoStart: result[0],
        sampleNoEnd: result[1],
      };
    }
    getCreenReportList({
      ...form.getFieldsValue(),
      ...param,
      pageNum,
      pageSize,
      ...extendForm.getFieldsValue(),
      labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
    });
  };
  const renderForm = () => {
    return (
      <Form form={form} layout="inline" onValuesChange={searchHandle}>
        <Form.Item name="labDate">
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="请选择检验日期"
            style={{ width: 120, marginBottom: '15px' }}
          />
        </Form.Item>
        <Form.Item name="execBy">
          <Select allowClear placeholder="检验技师" style={{ width: 120 }}>
            {personList.map(
              (item: {
                id: React.Key | null | undefined;
                name:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
              }) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              },
            )}
          </Select>
        </Form.Item>
        <Form.Item name="reqItemIds">
          <Select
            allowClear
            onChange={checkChange}
            placeholder="检验目的"
            mode="multiple"
            style={{ width: 120 }}
          >
            {reportUnitReqItemList?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reqItemName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="reportUnitCode">
          <Select
            allowClear
            onChange={reportUnitChange}
            placeholder="报告单元"
            style={{ width: 120 }}
          >
            {reportUnit?.map((item) => {
              return (
                <Option value={item.reportUnitCode} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="instrId">
          <Select allowClear onChange={instrChange} placeholder="检验仪器" style={{ width: 120 }}>
            {reportUnitInstrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="sampleNoStart">
          <Input placeholder="样本编号或范围" style={{ width: 120 }} allowClear />
        </Form.Item>
      </Form>
    );
  };

  const reset = () => {
    form.setFieldsValue({ instrId: '', reqItemIds: [], sampleNoStart: '', sampleNoEnd: '' });
  };
  const extend = () => {};

  const onChangeSelected = (selectedRowKeys, selectedRows) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    onChange: onChangeSelected,
  };
  const audit = () => {
    if (selectedKeys.length === 0) {
      message.warning('审核时请选择要审核的数据!');
      return;
    }
    firstAudit({ ids: selectedKeys }).then((res) => {
      if (res.code === 200) {
        if (res.data.length !== 0) {
          //message.warning(res.data);
          auditModal.current.show(res.data);
        } else {
          message.success('成功!');
        }
      }
    });
  };
  const finshAudit = () => {
    if (selectedKeys.length === 0) {
      message.warning('审核时请选择要审核的数据!');
      return;
    }
    secondAudit({ ids: selectedKeys }).then((res) => {
      if (res.code === 200) {
        message.success(res.msg);
      }
    });
  };
  const getRowClassName = (record, index) => {
    let className = 'normal';
    if (record.id === clickRow) {
      className = styles.blue;
      return className;
    }

    // if (
    //   record?.id == creenReportList[creenReportList.length - 1]?.id &&
    //   Math.ceil(total / 50) == pageNum
    // ) {
    //   // let paramsVal = {
    //   //   id: creenReportList[creenReportList.length - 1]?.id,
    //   //   instrId: form.getFieldValue('instrId'),
    //   // };
    //   // dispatch({
    //   //   type: 'generalInspectionMag/save',
    //   //   payload: {
    //   //     type: 'instrAndRecordId',
    //   //     dataSource: paramsVal,
    //   //   },
    //   // });

    //   className = styles.blue;
    //   return className;
    // }
  };
  const hospital = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
        getDoctorListData(res.data[0].id);
      }
    });
  };
  const getDictList = (type) => {
    dictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'SX') {
          setSex(res.data);
        }
        if (type.type === 'DP') {
          setDepartment(res.data);
        }
        if (type.type === 'FT') {
          setSampleSource(res.data);
        }
      }
    });
  };
  const getDoctorListData = (id) => {
    getDoctorList({ hospitalId: id }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setDoctorList(res.data);
        }
      },
    );
  };
  const getReportUnitList = () => {
    reportUnitList({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnit(res.data);
        if (res.data.length > 0) {
          getReportUnitReqItem(res.data[0].id);
        }
      }
    });
  };
  const getReportUnitReqItem = (reportUnitId: any) => {
    reportUnitReqItem({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setReportUnitReqItemList(res.data);
      }
    });
  };
  const reportUnitChange = (e: any, option: any) => {
    localStorage.setItem('reportUnit', JSON.stringify(option));
    if (e) {
      getReportUnitReqItem(option.key);
      getReportUnitInstr(option.key);
      getListByReportUnit(option.key);
    }
  };
  const getReportUnitInstr = (reportUnitId: any) => {
    reportUnitInstr({ reportUnitId }).then((res: any) => {
      if (res.code === 200) {
        res.data.unshift({ id: 0, instrName: '手工' });

        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportUnitInstrList',
            dataSource: res.data,
          },
        });
      }
    });
  };
  const getListByReportUnit = (reportUnitId: any) => {
    listByReportUnit({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'personList',
            dataSource: res.data,
          },
        });
        if (res.data.length > 0) {
          form.setFieldsValue({ execBy: useDetail.id });
        } else {
          form.setFieldsValue({ execBy: '' });
        }
      }
    });
  };
  const hospitalChange = (e: any) => {
    if (e) {
      getDoctorListData(e);
    }
  };
  const tapClear = () => {
    extendForm.resetFields();
    form.setFieldsValue({ instrId: '', reqItemIds: [], sampleNoStart: '', sampleNoEnd: '' });
    setPopoverVisible(false);
  };
  const pageChange = (num, size) => {
    setPageNum(num);
    setPageSize(size);
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
    setSort(sorter.field + 'Desc');
  };
  const getCreenReportList = (params: any) => {
    dispatch({
      type: 'generalInspectionMag/fetchCreenReportList',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            const result = res.data.records.map((item) => {
              return {
                ...item,
                key: item.id,
              };
            });
            setCreenReportList(result);
            setTotal(res.data.total);
            if (Math.ceil(res.data.total / 50) == pageNum && !reportMiddleUpdate) {
              let paramsVal = {
                id: res.data.records[res.data.records.length - 1]?.id,
                instrId: form.getFieldValue('instrId'),
                sampleBarcode: res.data.records[res.data.records.length - 1]?.sampleBarcode,
              };
              dispatch({
                type: 'generalInspectionMag/save',
                payload: {
                  type: 'instrAndRecordId',
                  dataSource: paramsVal,
                },
              });
            }

            if (res.data.total === 0) {
              dispatch({
                type: 'generalInspectionMag/save',
                payload: {
                  type: 'instrAndRecordId',
                  dataSource: {},
                },
              });
              dispatch({
                type: 'generalInspectionMag/save',
                payload: {
                  type: 'reportResultList',
                  dataSource: [],
                },
              });
            }

            if (res.data.current === res.data.pages && !reportMiddleUpdate) {
              setClickRow(res.data.records[res.data.records.length - 1]?.id);
            }
          }
        },
      },
    });
  };
  const handleQuery = () => {
    if (activeKey !== '10') {
      setActiveKey('10');
    }
    getCreenReportList({
      ...extendForm.getFieldsValue(),
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
    });
  };
  const tabChange = (e) => {
    let params = {};
    setActiveKey(e);
    switch (Number(e)) {
      case 1:
        params = { auditStatus: Number(e) };
        break;
      case 0:
        params = { auditStatus: Number(e) };
        break;
      case 2:
        params = { auditStatus: Number(e) };
        break;
      case 5:
        params = {
          retestFlag: 1,
        };
        break;
      case 6:
        params = {
          overdueFlag: 1,
        };
        break;
      case 7:
        params = {
          printFlag: 1,
        };
        break;
      case 8:
        params = {
          printFlag: 0,
        };
        break;
      case 9:
        params = {
          isEmer: 1,
        };
        break;
      default:
        params = {};
    }
    getCreenReportList({
      ...params,
      ...extendForm.getFieldsValue(),
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
    });
  };
  const reviewOrpositive = (val) => {
    let params = { id: instrAndRecordId.id };
    let newParams = {};
    if (val === 1) {
      if (selectedKeys.length === 0) {
        message.warning('请选择要复查的项目!');
        return;
      }
      reviewModal.current.show(selectedKeys);
      return;
    } else {
      newParams = {
        ...params,
        isPositive: true,
      };
    }
    reportMainUpdate(newParams).then((res) => {
      if (res.code === 200) {
        message.success('修改成功');
        getCreenReportList({
          ...form.getFieldsValue(),
          labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD HH:mm:ss'),
          ...extendForm.getFieldsValue(),
          [sort]: order,
          pageNum,
          pageSize,
        });
      }
    });
  };
  const confirmRefuse = () => {
    updateRefuse({ id: instrAndRecordId.id }).then((res) => {
      if (res.code === 200) {
        message.success('拒检成功！');
        getCreenReportList({
          ...form.getFieldsValue(),
          labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD HH:mm:ss'),
          ...extendForm.getFieldsValue(),
          [sort]: order,
          pageNum,
          pageSize,
        });
      }
    });
  };
  const addCommonUpdateInfo = () => {
    let updateInfo = [];
    var reg = /result/;

    reportResult({ reportId: instrAndRecordId.id, instrId: instrAndRecordId.instrId }).then(
      (res: any) => {
        if (res.code === 200) {
          let hasIdReportData = reportResultList.filter((item) => {
            if ('id' in item) {
              return item;
            }
          });

          hasIdReportData.map((el, index) => {
            Object.keys(el).forEach(function (key) {
              if (reg.test(key) && key !== 'resultFlag' && res.data[index][key] !== el[key]) {
                updateInfo.push({
                  itemId: el?.itemId,
                  [key]: res.data[index][key] + '|' + el[key],
                });
              }
            });
          });

          updateInfoData.current = updateInfo?.reduce(function (acc, curr) {
            let findIndex = acc.findIndex(function (item) {
              return item?.itemId === curr?.itemId;
            });

            if (findIndex === -1) {
              acc.push(curr);
            } else {
              acc[findIndex] = Object.assign({}, acc[findIndex], curr);
            }

            return acc;
          }, []);
        }
      },
    );
  };
  const onRowClick = (record: any, index: any) => {
    let hasIdReportData = reportResultList.filter((item) => {
      if ('id' in item) {
        return item;
      }
    });

    let noIdReportData = reportResultList
      ?.filter((item: any) => !hasIdReportData.some((data) => data.id === item.id))
      .map((item: any) => {
        return {
          reportId: instrAndRecordId.id,
          instrId: instrAndRecordId.instrId,
          colonyCount: item?.colonyCount,
          itemId: item?.itemId,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item?.result,
          result1: item?.result1,
          result2: item?.result2,
          result3: item?.result3,
          result4: item?.result4,
          resultFlag: item?.resultFlag,
        };
      });
    if (isChangeReportResult) {
      addCommonUpdateInfo();

      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'isChangeReportResult',
          dataSource: false,
        },
      });

      let params = hasIdReportData.map((item) => {
        return {
          id: item.id,
          colonyCount: item?.colonyCount,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item?.result,
          result1: item?.result1,
          result2: item?.result2,
          result3: item?.result3,
          result4: item?.result4,
          resultFlag: item?.resultFlag,
        };
      });

      reportResultUpdate(params).then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          let param = {
            data: updateInfoData.current,
          };
          addCommonUpdate({
            beforeChange: param,
            objectId: instrAndRecordId.id,
            winName: '普检数据报告管理',
          }).then((res) => {
            if (res.code === 200) {
              message.success('添加修改日志成功');
            }
          });
        }
      });
    }
    if (noIdReportData.length > 0 && batchAdd) {
      reportResultSave(noIdReportData).then((res) => {
        if (res.code === 200) {
          message.success('保存成功');
          dispatch({
            type: 'generalInspectionMag/save',
            payload: {
              type: 'reportMiddleUpdate',
              dataSource: true,
            },
          });
        }
      });
    }
    setClickRow(record.id);
    let idParams = {
      id: record.id,
      instrId: form.getFieldValue('instrId'),
      sampleBarcode: record.sampleBarcode,
    };
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'instrAndRecordId',
        dataSource: idParams,
      },
    });
  };
  const refresh = () => {
    let hasIdReportData = reportResultList.filter((item) => {
      if ('id' in item) {
        return item;
      }
    });
    let noIdReportData = reportResultList
      ?.filter((item: any) => !hasIdReportData.some((data) => data.id === item.id))
      .map((item: any) => {
        return {
          reportId: instrAndRecordId.id,
          instrId: instrAndRecordId.instrId,
          colonyCount: item?.colonyCount,
          itemId: item.itemId,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item.result,
          result1: item.result1,
          result2: item.result2,
          result3: item.result3,
          result4: item.result4,
          resultFlag: item.resultFlag,
        };
      });
    if (isChangeReportResult) {
      addCommonUpdateInfo();
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'isChangeReportResult',
          dataSource: false,
        },
      });

      let params = hasIdReportData.map((item) => {
        return {
          id: item.id,
          colonyCount: item?.colonyCount,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item.result,
          result1: item.result1,
          result2: item.result2,
          result3: item.result3,
          result4: item.result4,
          resultFlag: item.resultFlag,
        };
      });

      reportResultUpdate(params).then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          let param = {
            data: updateInfoData.current,
          };
          addCommonUpdate({
            beforeChange: param,
            objectId: instrAndRecordId.id,
            winName: '普检数据报告管理',
          }).then((res) => {
            if (res.code === 200) {
              message.success('添加修改日志成功');
            }
          });
          getCreenReportList({
            ...form.getFieldsValue(),
            labDate: form.getFieldValue('labDate')?.format('YYYY-MM-DD'),
            ...extendForm.getFieldsValue(),
            [sort]: order,
            pageNum,
            pageSize,
          });
        }
      });
    }
    if (noIdReportData.length > 0 && batchAdd) {
      reportResultSave(noIdReportData).then((res) => {
        if (res.code === 200) {
          message.success('保存成功');
          dispatch({
            type: 'generalInspectionMag/save',
            payload: {
              type: 'reportMiddleUpdate',
              dataSource: true,
            },
          });
        }
      });
    }
  };
  const popover_content = () => {
    return (
      <div className={style.popover_content}>
        <div className={style.popover_form}>
          <Form form={extendForm} layout="vertical">
            <Row>
              <Col span={8}>
                <Form.Item name="hospitalId" label="送检单位">
                  <Select placeholder="请选择送检单位" allowClear onChange={hospitalChange}>
                    {hospitalList?.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.hospitalName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div id="source">
                  <Form.Item name="source" label="病人类型">
                    <Select
                      placeholder="请选择病人类型"
                      autoComplete="off"
                      allowClear
                      getPopupContainer={() => document.getElementById('source')}
                    >
                      {sampleSource?.map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.dictValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={8}>
                <Form.Item name="sampleBarcode" label="样本条码号">
                  <Input placeholder="请输入样本条码号" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="patientName" label="病人姓名">
                  <Input placeholder="请输入病人姓名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="sex" label="性别">
                  <Select placeholder="请选择性别" allowClear>
                    {sex.map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.dictValue}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="sendDeptId" label="送检科室">
                  <Select placeholder="请选择送检科室" allowClear>
                    {department.map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.dictValue}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="sendDoctorId" label="送检医生">
                  <Select placeholder="请选择送检医生" allowClear>
                    {doctorList?.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="patientNo" label="门诊/住院号">
                  <Input placeholder="请输入门诊/住院号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="bedNo" label="床号">
                  <Input placeholder="请输入床号" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            <Button
              type="primary"
              style={{ marginRight: 12 }}
              onClick={() => {
                tapClear();
              }}
            >
              清空
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setPopoverVisible(false);
                handleQuery();
              }}
            >
              查询
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.right_content}>
      <Row>
        <Col span={18}>{renderForm()}</Col>
        <Col span={2}>
          {' '}
          <Button type="primary" onClick={seach} size="small">
            查询
          </Button>
          <Button type="primary" onClick={reset} size="small" style={{ margin: '5px 0' }}>
            重置
          </Button>
          <Popover
            content={popover_content}
            placement="bottomRight"
            trigger="click"
            // visible={visible}
            // onVisibleChange={(visible) => setVisible(visible)}
            open={popoverVisible}
            onOpenChange={(val) => setPopoverVisible(val)}
          >
            <Button type="primary" onClick={extend} size="small">
              扩展
            </Button>
          </Popover>
        </Col>
      </Row>
      <Tabs
        defaultActiveKey="10"
        size="small"
        onChange={tabChange}
        activeKey={activeKey}
        tabBarStyle={{ borderBottom: '1px solid #cecece' }}
      >
        <TabPane tab="全部" key="10"></TabPane>
        <TabPane tab="已初审" key="1"></TabPane>
        <TabPane tab="已终审" key="2"></TabPane>
        <TabPane tab="未审核" key="0"></TabPane>
        <TabPane tab="复查" key="5"></TabPane>
        <TabPane tab="超期" key="6"></TabPane>
        <TabPane tab="已打印" key="7"></TabPane>
        <TabPane tab="未打印" key="8"></TabPane>
        <TabPane tab="急诊" key="9"></TabPane>
      </Tabs>

      <Button type="primary" size="small" onClick={() => refresh()}>
        刷新
      </Button>
      <Button type="primary" size="small" onClick={audit}>
        报告初审
      </Button>
      <Button type="primary" size="small" onClick={finshAudit}>
        报告终审
      </Button>
      <Button type="primary" size="small">
        解初审
      </Button>
      <Button type="primary" size="small">
        解终审
      </Button>
      <Button type="primary" size="small">
        结果导出
      </Button>
      <Button type="primary" size="small">
        报告删除
      </Button>
      <Button type="primary" size="small">
        报告打印
      </Button>
      <Button type="primary" size="small" onClick={() => reviewOrpositive(1)}>
        复查
      </Button>
      <Button type="primary" size="small" onClick={() => reviewOrpositive(2)}>
        阳性
      </Button>
      <Popconfirm
        title="是否确认要取消本次检验?"
        onConfirm={confirmRefuse}
        okText="确定"
        cancelText="取消"
      >
        <Button type="primary" size="small">
          拒检
        </Button>
      </Popconfirm>
      <Table
        dataSource={creenReportList}
        columns={tableHeaderCoumn}
        scroll={{ x: 500 }}
        size="small"
        rowSelection={rowSelection}
        rowClassName={getRowClassName}
        rowKey={(record) => record.key}
        onChange={onTableChange}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        onRow={(record, index) => {
          return {
            onClick: (event) => {
              onRowClick(record, index);
            },
          };
        }}
      />
      <ReviewModal Ref={reviewModal} />
      <AuditWarning Ref={auditModal} />
    </div>
  );
};
export default RightContent;
