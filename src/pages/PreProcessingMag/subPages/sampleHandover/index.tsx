import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Tabs,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Checkbox,
  Dropdown,
  Menu,
  Popconfirm,
} from 'antd';
import { Button, Icon } from '@/components';
import { useDispatch, useSelector } from 'umi';

import {
  getHospitalList,
  sampleHandoverSave,
  recipientList,
  labClassByUser,
  preTransferNum,
} from '../../models/server';
import { duplicatesAndNum } from '@/utils';
import styles from './index.less';
import Password from './components/Password';
import moment from 'moment';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const SampleHandover = () => {
  const { useDetail } = useSelector((state: any) => state.global);
  const { scanSampleHandoverData, duplicatesNameAndNum } = useSelector(
    (state: any) => state.preProcessingMag,
  );
  const dispatch = useDispatch();

  const [selectedRowKeysValSort, setSelectedRowKeysValSort] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [scanSampleHandover, setScanSampleHandover] = useState([]);
  const [sampleHandover, setSampleHandover] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [batchForm] = Form.useForm();
  const [isAutoSelecte, setIsAutoSelecte] = useState(false);
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [paramsVal, setParamsVal] = useState();
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  const passwordRef = useRef();
  const [receiverList, setReceiverList] = useState([]);
  const [isPreSortDateSort, setIsPreSortDateSort] = useState(true);
  const [isReceiveBarcodeSort, setReceiveBarcodeSort] = useState(false);
  const [receiverVal, setReceiverVal] = useState();
  const [defaultLabClass, setDefaultLabClass] = useState([]);
  const [preTransferNumData, setPreTransferNumData] = useState([]);

  useEffect(() => {
    hospitalList();
    getReceiverList();
  }, []);
  useEffect(() => {
    if (isAutoSelecte && !objectKeyIsEmpty(paramsVal)) {
      const ids = sampleHandover.map((item) => item.id);
      setSelectedRowKeysValSort(ids);
    }
    if (isAutoSelecte && objectKeyIsEmpty(paramsVal)) {
      const ids = sampleHandover.map((item) => item.id);
      setSelectedRowKeysValSort([]);
    }
  }, [sampleHandover]);
  const objectKeyIsEmpty = (obj) => {
    let empty = null;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          empty = true;
        } else {
          empty = false;
          break;
        }
      }
    }
    return empty;
  };
  useEffect(() => {
    if (scanSampleHandover.length > 0) {
      const newData = scanSampleHandover.map((item) => {
        return {
          ...item,
          key: item.id,
          preTransferBy: useDetail.name,
          preTransferDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
      });

      const mergedArray = [newData, scanSampleHandoverData].reduce(
        (acc, val) => acc.concat(val),
        [],
      );
      const result = mergedArray.map((item) => item.labClassName);
      const duplicates = duplicatesAndNum(result);

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'scanSampleHandoverData',
          dataSource: mergedArray,
        },
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'duplicatesNameAndNum',
          dataSource: duplicates,
        },
      });
    }
  }, [scanSampleHandover]);

  useEffect(() => {
    getSampleHandover({
      pageNum,
      pageSize,
      preSortDateKey: isPreSortDateSort,
      receiveBarcodeKey: isReceiveBarcodeSort,
      labClassId: defaultLabClass,
    });
    getPreTransferNum({
      preSortDateKey: isPreSortDateSort,
      receiveBarcodeKey: isReceiveBarcodeSort,
      labClassId: defaultLabClass,
    });
  }, [pageNum, pageSize, defaultLabClass, isReceiveBarcodeSort]);
  const getList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchScanSampleHandover',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            let flag = false;
            for (let i = 0; i < scanSampleHandoverData.length; i++) {
              if (scanSampleHandoverData[i].id === res.data[0]?.id) {
                flag = true;
              }
            }
            if (flag) {
              message.warning('该条数据已扫过,不可重复再扫!');
              return;
            }
            setScanSampleHandover(res.data);
          }
        },
      },
    });
  };
  const getSampleHandover = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchSampleHandover',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            let result = res.data.records.map((item) => {
              return {
                key: item.id,
                ...item,
              };
            });
            setSampleHandover(result);
          }
        },
      },
    });
  };
  const getPreTransferNum = (params) => {
    preTransferNum(params).then((res) => {
      if (res.code === 200) {
        setPreTransferNumData(res.data);
      }
    });
  };

  const getColumns = (val) => {
    const columns = [
      {
        title: '收样条码',
        dataIndex: 'receiveBarcode',
        width: 100,
        fixed: 'left',
        ellipsis: true,
        align: 'center',
      },

      {
        title: '申请号',
        dataIndex: 'subId',
        width: 100,
        ellipsis: true,
      },
      {
        title: '姓名',
        dataIndex: 'patientName',
        width: 100,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '性别',
        dataIndex: 'sexName',
        width: 100,
        align: 'center',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        align: 'center',
      },
      {
        title: '专业类别',
        dataIndex: 'labClassName',
        width: 100,
        align: 'center',
      },
      {
        title: '样本编号',
        dataIndex: 'sampleNo',
        width: 150,
        align: 'center',
      },
      {
        title: '样本类型',
        dataIndex: 'sampleType',
        width: 100,
        align: 'center',
      },
      {
        title: '检测项目',
        dataIndex: 'reqItemName',
        width: 100,
        ellipsis: true,
        align: 'center',
      },
      {
        title: '检测状态',
        dataIndex: 'detectionStatus',
        width: 100,
        align: 'center',
      },
      {
        title: '运检单位',
        dataIndex: 'hospitalName',
        width: 100,
        align: 'center',
      },
      {
        title: '接收人',
        dataIndex: 'labReceiveBy',
        width: 100,
        align: 'center',
      },

      {
        title: '移交人',
        dataIndex: 'preTransferBy',
        width: 100,
        align: 'center',
      },
      {
        title: '移交时间',
        dataIndex: 'preTransferDate',
        width: 200,
        align: 'center',
      },
      {
        title: '分拣时间',
        dataIndex: 'preSortDate',
        width: 200,
        align: 'center',
      },
      {
        title: '分拣人',
        dataIndex: 'preSortBy',
        width: 100,
      },
      {
        title: '采样时间',
        dataIndex: 'collectDate',
        width: 200,
        align: 'center',
      },
      {
        title: '前处理接收时间',
        dataIndex: 'preReceiveDate',
        width: 200,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 180,
        render: (text: string, record: Record<string, any>) => (
          <div
            style={{
              display: 'flex',
              justifyContent: val === 1 ? 'space-between' : 'space-around',
            }}
          >
            <Button
              onClick={() => {
                saveCurrent(record);
              }}
            >
              交接
            </Button>
            {val === 1 && <Button onClick={() => deleteCurrentItem(record)}>删除</Button>}
          </div>
        ),
      },
    ];
    return columns;
  };
  const deleteCurrentItem = (record) => {
    const result = scanSampleHandoverData.filter((item) => item.id != record.id);
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'scanSampleHandoverData',
        dataSource: result,
      },
    });
  };

  const onSelectChangeSort = (keys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysValSort(keys);
  };

  const rowSelectionSort = {
    selectedRowKeys: selectedRowKeysValSort,
    onChange: onSelectChangeSort,
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    if (!form.getFieldsValue().labReceiveBy) {
      message.warning('请先选择接收人');
      scanForm.resetFields();
      return;
    }

    const values = {
      ...allValues,
      labReceiveBy: form.getFieldsValue().labReceiveBy,
    };
    getList(values);
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
      }
    });
  };
  const batchSortinSearch = (changedValues: any, allValues: undefined) => {
    if (!form.getFieldsValue().receiver) {
      message.warning('请先选择接收人');
      batchForm.resetFields();
      batchForm.setFieldsValue({ labClassId: [] });
      return;
    }
    const values = {
      preSortDateKey: isPreSortDateSort,
      receiveBarcodeKey: isReceiveBarcodeSort,
      ...allValues,
      createDateStart:
        allValues.createDateStart && allValues.createDateStart[0]
          ? allValues.createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateEnd:
        allValues.createDateStart && allValues.createDateStart[1]
          ? allValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    };
    let params = {
      pageNum,
      pageSize,
      ...values,
    };
    getSampleHandover(params);
    getPreTransferNum(values);
    setParamsVal(allValues);
  };
  const labClassChange = () => {
    if (!form.getFieldsValue().receiver) {
      message.warning('请先选择接收人');
      return;
    }
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={scanForm}>
        <Form.Item name="sampleBarcode">
          <Input
            placeholder="扫码移交"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const batchSortingForm = () => {
    return (
      <Form
        onValuesChange={batchSortinSearch}
        layout="inline"
        form={batchForm}
        className={styles.batch_form}
      >
        <Form.Item name="createDateStart" label="登记日期">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['登记开始日期', '登记结束日期']}
            style={{ width: 340 }}
          />
        </Form.Item>

        <Form.Item name="hospitalId" label="送检单位">
          <Select placeholder="请选择送检单位" allowClear>
            {hospital?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.hospitalName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="labClassId" label="专业类别">
          <Select
            placeholder="请选择专业类别"
            allowClear
            mode="multiple"
            defaultValue={() => majorGroupData.map((item) => item.id)}
            onSearch={labClassChange}
            className={styles.major_group}
          >
            {majorGroupData.length > 0 &&
              majorGroupData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const reset = () => {
    batchForm.resetFields();
    batchForm.setFieldsValue({ labClassId: [] });
    form.setFieldsValue({ receiver: '' });
    setDefaultLabClass([]);
    getSampleHandover({
      pageNum,
      pageSize,
      preSortDateKey: isPreSortDateSort,
      receiveBarcodeKey: isReceiveBarcodeSort,
    });
  };
  const saveCurrent = () => {
    const result = selectedRowKeysValSort.map((item) => {
      return { id: item };
    });
    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        getSampleHandover({
          pageNum,
          pageSize,
          preSortDateKey: isPreSortDateSort,
          receiveBarcodeKey: isReceiveBarcodeSort,
        });
      }
    });
  };
  const save = () => {
    let result = scanSampleHandoverData.map((item) => {
      return {
        id: item.id,
        preTransferBy: useDetail.id,
        preTransferDate: item.preTransferDate,
        labReceiveBy: form.getFieldsValue().labReceiveBy,
      };
    });

    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        dispatch({
          type: 'preProcessingMag/save',
          payload: {
            type: 'scanSampleHandoverData',
            dataSource: [],
          },
        });
      }
    });
  };
  const sortSave = () => {
    console.log(selectedRowKeysValSort);
    const result = selectedRowKeysValSort.map((item) => {
      return { id: item, labReceiveBy: form.getFieldsValue().receiver };
    });

    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        getSampleHandover({ pageNum, pageSize });
      }
    });
  };
  const autoSelect = (e) => {
    setIsAutoSelecte(e.target.checked);
  };
  const receiverChange = (e) => {
    if (isAuthentication) {
      passwordRef.current.show(e);
    }
  };
  const authenticationChange = (e) => {
    setIsAuthentication(e.target.checked);
  };
  const confirmCancel = (e) => {
    scanForm.resetFields();
    form.resetFields();
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'scanSampleHandoverData',
        dataSource: [],
      },
    });
  };
  const receiverChangeBatch = (e) => {
    if (sampleHandover.length > 0 && defaultLabClass.length > 0) {
      message.warning('先清空查询条件后才能变更哦!');
      form.setFieldsValue({ receiver: receiverVal });
      return;
    }
    setReceiverVal(e);
    labClassByUser({ userId: e }).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => item.id);
        setMajorGroupData(res.data);
        batchForm.setFieldsValue({ labClassId: result });
        setDefaultLabClass(result);
      }
    });
  };
  const getReceiverList = () => {
    recipientList().then((res) => {
      if (res.code === 200) {
        setReceiverList(res.data);
      }
    });
  };
  const sortingTimeChange = (e) => {
    setIsPreSortDateSort(e.target.checked);
  };
  const receiveBarcodeChange = (e) => {
    setReceiveBarcodeSort(e.target.checked);
  };
  const menu = (
    <Menu className={styles.operatorMenu} style={{ width: 300 }}>
      <Menu.Item>
        <Checkbox>移交样本列的排序方式</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={autoSelect} checked={isAutoSelecte}>
          查询后默认自动选中
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>移交保存时自动打印移交清单</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={sortingTimeChange} checked={isPreSortDateSort}>
          按分拣时间排序
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={receiveBarcodeChange}>按接收条码号排序</Checkbox>
      </Menu.Item>
    </Menu>
  );
  const scanMenu = (
    <Menu className={styles.operatorMenu}>
      <Menu.Item>
        <Checkbox>移交保存时自动打印移交清单</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={authenticationChange} checked={isAuthentication}>
          选择接收人时需做身份验证
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Tabs>
        <TabPane tab="扫码至交接列" key="1">
          <div style={{ margin: '10px 0' }} className={styles.common}>
            {renderForm()}
            <Form layout="inline" form={form} className={styles.receiver_form}>
              <Form.Item name="labReceiveBy">
                <Select
                  placeholder="请选择接收人"
                  autoComplete="off"
                  allowClear
                  onChange={receiverChange}
                >
                  {receiverList.length > 0 &&
                    receiverList.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Form>
            <div className={styles.common} style={{ alignItems: 'center' }}>
              <Button btnType="primary" onClick={save}>
                移交信息保存
              </Button>
              <Popconfirm title="确定取消本次移交么" onConfirm={confirmCancel}>
                <Button btnType="primary" style={{ margin: '0 10px' }}>
                  取消本次移交
                </Button>
              </Popconfirm>
              <Dropdown overlay={scanMenu}>
                <div style={{ cursor: 'pointer' }}>
                  <Button btnType="primary" style={{ margin: '0 10px' }}>
                    选项
                  </Button>
                </div>
              </Dropdown>
            </div>
          </div>
          <Table
            className={styles.scanTable}
            footer={() =>
              duplicatesNameAndNum?.map((item) => {
                return (
                  <div>
                    <span>{item.name}</span>:<span>{item.num}</span>
                  </div>
                );
              })
            }
            columns={getColumns(1)}
            dataSource={scanSampleHandoverData}
            scroll={{ x: 'calc(700px + 50%)' }}
            size={'small'}
          />
        </TabPane>
        <TabPane tab="批量查询至交接列" key="2">
          <div style={{ margin: '10px 0', alignItems: 'center' }} className={styles.common}>
            {batchSortingForm()}
            <Form layout="inline" form={form} className={styles.receiver_form}>
              <Form.Item name="receiver">
                <Select
                  placeholder="请选择接收人"
                  autoComplete="off"
                  allowClear
                  onChange={receiverChangeBatch}
                  value={receiverVal}
                >
                  {receiverList.length > 0 &&
                    receiverList.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Form>
            <div className={styles.common}>
              <Button btnType="primary" style={{ margin: '0 10px' }} onClick={sortSave}>
                移交信息保存
              </Button>
              <Button btnType="primary" style={{ margin: '0 10px' }} onClick={reset}>
                重置
              </Button>
              <Dropdown overlay={menu}>
                <div style={{ cursor: 'pointer' }}>
                  <Button btnType="primary" style={{ margin: '0 10px' }}>
                    选项
                  </Button>
                </div>
              </Dropdown>
            </div>
          </div>
          <Table
            size={'small'}
            rowSelection={rowSelectionSort}
            columns={getColumns(2)}
            dataSource={sampleHandover}
            scroll={{ x: 'calc(700px + 50%)' }}
            className={styles.scanTable}
            footer={() =>
              preTransferNumData?.map((item) => {
                return (
                  <div>
                    <span>{item.labClassName}</span>:<span>{item.num}</span>
                  </div>
                );
              })
            }
          />
        </TabPane>
      </Tabs>
      <Password passwordRef={passwordRef} />
    </>
  );
};
export default SampleHandover;
