import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { Button, Icon } from '@/components';
import { useDispatch, useSelector, history } from 'umi';
import { scanSortingSave, getHospitalList, sampleHandoverSave } from '../../models/server';
import { majorGroup, manageListSelect } from '@/models/server';
import { getCurrentTime } from '@/utils';
import styles from './index.less';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const SampleHandover = () => {
  const { useDetail } = useSelector((state: any) => state.global);
  const { scanSampleHandoverData } = useSelector((state: any) => state.preProcessingMag);
  const dispatch = useDispatch();
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const [selectedRowKeysValSort, setSelectedRowKeysValSort] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [scanSampleHandover, setScanSampleHandover] = useState([]);
  const [sampleHandover, setSampleHandover] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [manageClass, setManageClass] = useState([]);

  useEffect(() => {
    hospitalList();
    majorGroupList();
    getManageList();
  }, []);
  useEffect(() => {
    console.log(getCurrentTime());
    if (scanSampleHandover.length > 0) {
      const newData = scanSampleHandover.map((item) => {
        return {
          ...item,
          key: item.id,
          preTransferBy: useDetail.name,
          preTransferDate: getCurrentTime(),
        };
      });

      const mergedArray = [scanSampleHandoverData, newData].reduce(
        (acc, val) => acc.concat(val),
        [],
      );

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'scanSampleHandoverData',
          dataSource: mergedArray,
        },
      });
    }
  }, [scanSampleHandover]);

  useEffect(() => {
    getSampleHandover({ pageNum, pageSize });
  }, [pageNum, pageSize]);
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

  const columns = [
    {
      title: '收样条码',
      dataIndex: 'receiveBarcode',
      width: 100,
      fixed: 'left',
    },

    {
      title: '申请号',
      dataIndex: 'sampleBarcode',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
    },
    {
      title: '专业类别',
      dataIndex: 'labClassName',
      width: 100,
    },
    {
      title: '样本编号',
      dataIndex: 'sampleNo',
      width: 100,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleType',
      width: 100,
    },
    {
      title: '检测项目',
      dataIndex: 'reqItemName',
      width: 100,
    },
    {
      title: '检测状态',
      dataIndex: 'detectionStatus',
      width: 100,
    },
    {
      title: '运检单位',
      dataIndex: 'hospitalName',
      width: 100,
    },
    {
      title: '接收人',
      dataIndex: 'labReceiveBy',
      width: 100,
    },

    {
      title: '移交人',
      dataIndex: 'preTransferBy',
      width: 100,
    },
    {
      title: '移交时间',
      dataIndex: 'preTransferDate',
      width: 100,
    },
    {
      title: '分拣时间',
      dataIndex: 'preSortDate',
      width: 100,
    },
    {
      title: '分拣人',
      dataIndex: 'preSortBy',
      width: 100,
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      width: 100,
    },
    {
      title: '前处理接收时间',
      dataIndex: 'preReceiveDate',
      width: 100,
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
              saveCurrent(record);
            }}
          >
            交接
          </Button>
          <Button>删除</Button>
        </div>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const onSelectChangeSort = (keys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysValSort(keys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const rowSelectionSort = {
    selectedRowKeys: selectedRowKeysValSort,
    onChange: onSelectChangeSort,
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      ...allValues,
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
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const getManageList = () => {
    manageListSelect().then((res) => {
      if (res.code === 200) {
        setManageClass(res.data);
      }
    });
  };
  const batchSortinSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      pageNum,
      pageSize,
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
    getSampleHandover(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="receiveBarcode">
          <Input
            placeholder="扫码分拣"
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
      <Form onValuesChange={batchSortinSearch} layout="inline">
        <Form.Item name="createDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['登记开始日期', '登记结束日期']}
            style={{ width: 340 }}
          />
        </Form.Item>

        <Form.Item name="labClassManageId">
          <Select placeholder="请选择管理分类" autoComplete="off" allowClear>
            {manageClass.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <div id="hospitalId">
          <Form.Item name="hospitalId">
            <Select
              placeholder="请选择送检单位"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('hospitalId')}
            >
              {hospital?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.hospitalName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div id="labClassId">
          <Form.Item name="labClassId">
            <Select
              placeholder="请选择项目类别"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('labClassId')}
            >
              {majorGroupData.length > 0 &&
                majorGroupData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    );
  };
  const saveCurrent = () => {
    const result = selectedRowKeysValSort.map((item) => {
      return { id: item };
    });
    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        getSampleHandover({ pageNum, pageSize });
      }
    });
  };
  const save = () => {
    let result = scanSampleHandoverData
      ?.filter((item) => selectedRowKeysVal.some((key) => key === item.id))
      .map((item) => {
        return { id: item.id, preSortBy: useDetail.id, preSortDate: item.preSortDate };
      });
    let residueResult = scanSampleHandoverData?.filter(
      (item) => !selectedRowKeysVal.some((key) => key === item.id),
    );

    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        dispatch({
          type: 'preProcessingMag/save',
          payload: {
            type: 'scanSampleHandoverData',
            dataSource: residueResult,
          },
        });
      }
    });
  };
  const sortSave = () => {
    console.log(selectedRowKeysValSort);
    const result = selectedRowKeysValSort.map((item) => {
      return { id: item };
    });
    sampleHandoverSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        getSampleHandover({ pageNum, pageSize });
      }
    });
  };
  const menu = (
    <Menu className={styles.operatorMenu}>
      <Menu.Item>
        <Checkbox>移交样本列的排序方式</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>查询后默认自动选中</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>移交保存时自动打印移交清单</Checkbox>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Tabs type="card">
        <TabPane tab="扫码致交接列" key="1">
          <div style={{ marginBottom: '10px' }} className={styles.common}>
            {renderForm()}
            <div className={styles.common} style={{ alignItems: 'center' }}>
              <Button btnType="primary" onClick={save}>
                移交信息保存
              </Button>
              <Checkbox>移交保存时自动打印移交清单</Checkbox>
            </div>
          </div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={scanSampleHandoverData}
            scroll={{ x: 'calc(700px + 50%)' }}
          />
        </TabPane>
        <TabPane tab="批量查询至交接列" key="2">
          <div style={{ marginBottom: '10px', alignItems: 'center' }} className={styles.common}>
            {batchSortingForm()}
            <div style={{ height: '40px' }} className={styles.common}>
              <Button btnType="primary" style={{ margin: '0 10px' }} onClick={sortSave}>
                移交信息保存
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
            rowSelection={rowSelectionSort}
            columns={columns}
            dataSource={sampleHandover}
            scroll={{ x: 'calc(700px + 50%)' }}
          />
        </TabPane>
      </Tabs>
    </>
  );
};
export default SampleHandover;
