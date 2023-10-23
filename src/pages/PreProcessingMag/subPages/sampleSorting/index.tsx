import React, { useEffect, useState } from 'react';
import { Table, Tabs, Form, Input, DatePicker, Select, message, Button } from 'antd';
import { Icon } from '@/components';
import { useDispatch, useSelector, history } from 'umi';
import { scanSortingSave, preSortNum } from '../../models/server';
import { majorGroup, manageListSelect, getHospitalList } from '@/models/server';
import { getCurrentTime } from '@/utils';
import styles from './index.less';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SampleSorting = () => {
  const { useDetail } = useSelector((state: any) => state.global);
  const { scanSortData } = useSelector((state: any) => state.preProcessingMag);
  const dispatch = useDispatch();
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const [selectedRowKeysValSort, setSelectedRowKeysValSort] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [scanTotal, setScanTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [scanPageNum, setScanPageNum] = useState(1);
  const [scanPageSize, setScanPageSize] = useState(10);
  const [scanSortlist, setScanSortlist] = useState([]);
  const [sortList, setSortList] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [manageClass, setManageClass] = useState([]);
  const [preSortNumData, setPreSortNumData] = useState({});

  useEffect(() => {
    hospitalList();
    majorGroupList();
    getManageList();
  }, []);
  useEffect(() => {
    if (scanSortlist.length > 0) {
      const newData = scanSortlist.map((item) => {
        return {
          ...item,
          key: item.id,
          preSortBy: useDetail.name,
          preSortDate: getCurrentTime(),
        };
      });

      const mergedArray = [newData, scanSortData].reduce((acc, val) => acc.concat(val), []);

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'scanSortData',
          dataSource: mergedArray,
        },
      });
    }
  }, [scanSortlist]);

  useEffect(() => {
    getSortList({ pageNum, pageSize });
    getPreSortNum({ pageNum, pageSize });
  }, [pageNum, pageSize]);
  const getList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchScanSorting',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            let flag = false;
            for (let i = 0; i < scanSortData.length; i++) {
              if (scanSortData[i].id === res.data[0]?.id) {
                flag = true;
              }
            }
            if (flag) {
              message.warning('该条数据已扫过,不可重复再扫!');
              return;
            }
            setScanSortlist(res.data);
          }
        },
      },
    });
  };
  const getSortList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchSortingList',
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
            setSortList(result);
            setTotal(res.data.total);
          }
        },
      },
    });
  };
  const getPreSortNum = (params) => {
    preSortNum(params).then((res) => {
      if (res.code === 200) {
        setPreSortNumData(res.data);
      }
    });
  };

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
      title: '急诊',
      dataIndex: 'isEmer',
      width: 100,
      align: 'center',
    },
    {
      title: '申请号',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 100,
      align: 'center',
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
      width: 100,
      ellipsis: true,
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
      title: '送检单位',
      dataIndex: 'hospitalName',
      width: 100,
      align: 'center',
    },
    {
      title: '是否含外送项',
      dataIndex: 'isOut',
      width: 130,
      align: 'center',
    },
    {
      title: '分血标记',
      dataIndex: 'bloodFlag',
      width: 100,
      align: 'center',
      render: (text) => {
        <span className={styles.bloodFlag}>{text}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      align: 'center',
    },
    {
      title: '分拣人',
      dataIndex: 'preSortBy',
      width: 100,
      align: 'center',
    },
    {
      title: '分拣时间',
      dataIndex: 'preSortDate',
      width: 200,
      ellipsis: true,
      align: 'center',
    },

    {
      title: '采样时间',
      dataIndex: 'collectDate',
      width: 200,
      ellipsis: true,
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              // history.push(
              //   '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
              // );
            }}
          >
            交接
          </Button>
          <Button
            onClick={() => {
              // deleteCurrentItem(record.id);
            }}
          >
            打印标签
          </Button>
        </div>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
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
    getSortList(values);
    getPreSortNum(values);
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
  const save = () => {
    let result = scanSortData
      ?.filter((item) => selectedRowKeysVal.some((key) => key === item.id))
      .map((item) => {
        return { id: item.id, preSortBy: useDetail.id, preSortDate: item.preSortDate };
      });
    let residueResult = scanSortData?.filter(
      (item) => !selectedRowKeysVal.some((key) => key === item.id),
    );

    scanSortingSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        dispatch({
          type: 'preProcessingMag/save',
          payload: {
            type: 'scanSortData',
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
    scanSortingSave(result).then((res) => {
      if (res.code === 200) {
        message.success('保存成功');
        getSortList({ pageNum, pageSize });
      }
    });
  };
  const pageChange = (num: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(num);
    setPageSize(size);
  };
  const scanPageChange = (num, size) => {
    setScanPageNum(num);
    setScanPageSize(size);
  };
  return (
    <>
      <Tabs>
        <TabPane tab="单个扫码分拣" key="1">
          <div style={{ margin: '10px 0' }} className={styles.common}>
            {renderForm()}
            <div className={styles.common}>
              <Button type="primary" onClick={save} size="small">
                分拣信息保存
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ margin: '0 10px' }}
                onClick={() => {
                  history.push('/preProcessingMag/bloodSeparationMag');
                }}
              >
                开始分血
              </Button>
              {/* <Button btnType="primary">选项</Button> */}
            </div>
          </div>
          <Table
            size={'small'}
            rowSelection={rowSelection}
            columns={columns}
            className={styles.table_box}
            dataSource={scanSortData}
            scroll={{ x: 'calc(700px + 50%)' }}
            footer={() =>
              scanSortData.length > 0 && (
                <div>
                  <span>
                    收样条码数:
                    {
                      scanSortData.filter(
                        (obj, index) =>
                          scanSortData.findIndex(
                            (item) => item.receiveBarcode === obj.receiveBarcode,
                          ) === index,
                      ).length
                    }
                  </span>
                  <span> 分单后实际样本数:{scanSortData.length}</span>
                </div>
              )
            }
            pagination={{
              pageSize: scanPageSize,
              current: scanPageNum,
              total: scanTotal,
              onChange: scanPageChange,
              showTotal: (total, range) => `共 ${total} 条`,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '30', '40'],
              showSizeChanger: true,
            }}
          />
        </TabPane>
        <TabPane tab="批量查询分拣" key="2">
          <div style={{ margin: '10px 0', alignItems: 'center' }} className={styles.common}>
            {batchSortingForm()}
            <div style={{ height: '40px' }} className={styles.common}>
              {/* <Button btnType="primary" onClick={save}>
                查询待分拣样本
              </Button> */}
              <Button type="primary" style={{ margin: '0 10px' }} onClick={sortSave} size="small">
                分拣信息保存
              </Button>
              <Button type="primary" size="small">
                打印标签
              </Button>
              {/* <Button btnType="primary" style={{ margin: '0px 0px 0px 10px' }}>
                选项
              </Button> */}
            </div>
          </div>
          <Table
            size={'small'}
            rowSelection={rowSelectionSort}
            columns={columns}
            dataSource={sortList}
            scroll={{ x: 'calc(700px + 50%)' }}
            className={styles.table_box}
            footer={() => (
              <div>
                <span>收样条码数:{preSortNumData.receiveNum}</span>
                <span> 分单后实际样本数:{preSortNumData.splitNum}</span>
              </div>
            )}
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </TabPane>
      </Tabs>
    </>
  );
};
export default SampleSorting;
