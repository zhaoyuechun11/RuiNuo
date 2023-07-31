import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table } from '@common';
import { Form, Input, Select, Button, Tabs, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { Icon } from '@/components';
import { majorGroup, getDictList, getHospitalList } from '../../../../../../models/server';
import ReportItems from '../ReportItems';
const { Option } = Select;
const { TabPane } = Tabs;
const getValue = (obj) =>
  Object.keys(obj)
    .map((key) => obj[key])
    .join(',');
const AddApply = ({ refs }) => {
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [sample, setSample] = useState([]);
  const dispatch = useDispatch();
  const dialog = useRef();
  const searchVal = useRef();
  const [hospital, setHospital] = useState([]);
  const [val, setVal] = useState([]);
  const typeVal = useRef();
  const [form] = Form.useForm();
  const reportItemsRef = useRef();
  const { applyList, selectedRowKeys } = useSelector((state: any) => state.preProcessingMag);

  useImperativeHandle(refs, () => ({
    show: (val, type) => {
      dialog.current && dialog.current.show();
      getList({ pageNum, pageSize });
      majorGroupList();
      dictList({ type: 'BT' });
      setVal(val);
      hospitalList();
      typeVal.current = type;
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  const getList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchPageForReqMainEnter',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            //setList(res.data.records);
            setTotal(res.data.total);
            console.log(applyList);
            if (typeVal.current === 'edit') {
              if (applyList.length > 0) {
                for (let i = 0; i < res.data.records.length; i++) {
                  for (let j = 0; j < applyList.length; j++) {
                    if (res.data.records[i].id === applyList[j].itemId) {
                      res.data.records[i].id = applyList[j].itemId;
                      res.data.records[i].defaultSampleTypeId = applyList[j].defaultSampleTypeId;
                      res.data.records[i].defaultSampleTypeName =
                        applyList[j].defaultSampleTypeName;
                    }
                  }
                }

                let newArr = res.data.records.map((item) => {
                  return { key: item.id, ...item };
                });

                let filterResult = applyList?.filter(
                  (item) => !newArr.some((data) => data.id === item.itemId),
                );

                let filterResult1 = applyList?.filter((item) =>
                  newArr.some((data) => data.id === item.itemId),
                );
                let keys = filterResult1.map((item) => item.itemId);

                dispatch({
                  type: 'preProcessingMag/save',
                  payload: {
                    type: 'applyList',
                    dataSource: filterResult,
                  },
                });
                setList(newArr);
                setSelectedRowKeysVal(keys);
                dispatch({
                  type: 'preProcessingMag/save',
                  payload: {
                    type: 'selectedRowKeys',
                    dataSource: keys,
                  },
                });
              } else {
                let resMap = res.data.records.map((item) => {
                  return { key: item.id, ...item };
                });
                setList(resMap);
                let filterResult = applyList?.filter(
                  (item) => !res.data.records.some((data) => data.id === item.itemId),
                );
                let filterResult1 = applyList?.filter((item) =>
                  res.data.records.some((data) => data.id === item.itemId),
                );
                //setSelectedRows(filterResult1);

                dispatch({
                  type: 'preProcessingMag/save',
                  payload: {
                    type: 'applyList',
                    dataSource: filterResult,
                  },
                });
              }

              // setSelectedRows(result);
              return;
            }
            if (applyList.length > 0) {
              let result = [];
              for (let i = 0; i < res.data.records.length; i++) {
                let isExist = false;
                for (let j = 0; j < applyList.length; j++) {
                  if (res.data.records[i].id === applyList[j].id) {
                    isExist = true;
                    result.push({
                      ...res.data.records[i],
                      defaultSampleTypeId: applyList[j].defaultSampleTypeId,
                      defaultSampleTypeName: applyList[j].defaultSampleTypeName,
                      key: res.data.records[i].id,
                    });
                    break;
                  }
                }

                if (!isExist) {
                  result.push({ ...res.data.records[i], key: res.data.records[i].id });
                }
              }

              let filterResult = applyList?.filter(
                (item) => !result.some((data) => data.id === item.itemId),
              );

              let filterResult1 = applyList?.filter((item) =>
                result.some((data) => data.id === item.itemId),
              );
              let keys = filterResult1.map((item) => item.itemId);
              //debugger
              //setSelectedRows(filterResult1);

              dispatch({
                type: 'preProcessingMag/save',
                payload: {
                  type: 'applyList',
                  dataSource: filterResult,
                },
              });
              setList(result);
              setSelectedRowKeysVal(keys);
              dispatch({
                type: 'preProcessingMag/save',
                payload: {
                  type: 'selectedRowKeys',
                  dataSource: keys,
                },
              });
            } else {
              let resMap = res.data.records.map((item) => {
                return { key: item.id, ...item };
              });
              setList(resMap);
              let filterResult = applyList?.filter(
                (item) => !res.data.records.some((data) => data.id === item.itemId),
              );
              let filterResult1 = applyList?.filter((item) =>
                res.data.records.some((data) => data.id === item.itemId),
              );
              //setSelectedRows(filterResult1);

              dispatch({
                type: 'preProcessingMag/save',
                payload: {
                  type: 'applyList',
                  dataSource: filterResult,
                },
              });
            }
          }
        },
      },
    });
  };
  const columns = [
    {
      title: '项目编码',
      dataIndex: 'reqItemCode',
      align: 'center',
      width: 150,
      key: 'reqItemCode',
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
      key: 'reqItemName',
    },
    {
      title: '默认样本类型',
      dataIndex: 'defaultSampleTypeId',
      align: 'center',
      width: 150,
      key: 'defaultSampleTypeName',
      render: (text, record) => {
        return (
          <Select
            placeholder="请选择默认值"
            autoComplete="off"
            allowClear
            value={text}
            onChange={(e) => defaultValChange(e, record)}
          >
            {sample?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '项目类别',
      dataIndex: 'labClassName',
      fixed: 'left',
      align: 'center',
      key: 'labClassName',
      width: 150,
    },
    {
      title: '外送',
      dataIndex: 'isOut',
      align: 'center',
      width: 150,
    },
    {
      title: '外送单位',
      dataIndex: 'outCompanyName',
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <Button
            style={{ margin: 'auto' }}
            onClick={() => {
              // deleteBind(record.id);
              reportItemsRef.current.show(record.id);
            }}
          >
            明细
          </Button>
        );
      },
    },
  ];
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    //setSelectedRows([]);

    setPageNum(pagination.current);
    getList(params);
  };

  const handleSelectRows = (rows) => {
    setSelectedRows(rows);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };

    getList(values);
  };
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const dictList = (type) => {
    getDictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        setSample(res.data);
      }
    });
  };

  const add = () => {
    console.log(selectedRowKeysVal);
    let resVal = [];
    list.map((item) => {
      selectedRowKeysVal.map((key) => {
        if (item.id === key) {
          resVal.push(item);
        }
      });
    });
    if (applyList?.length > 0) {
      resVal.push(...applyList);
    }

    const result = resVal.map((item) => {
      return {
        itemName: item.reqItemName,
        sampleTypeId: item.defaultSampleTypeId,
        itemId: item.id,
        ...item,
      };
    });
    const sampleResult = resVal.map((item) => {
      return {
        sampleTypeName: item.defaultSampleTypeName,
        sampleTypeId: item.defaultSampleTypeId,
        sampleStateName: '正常',
        sampleStateId: 1130,
      };
    });

    dialog.current && dialog.current.hide();
    debugger;
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'applyList',
        dataSource: result,
      },
    });
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'sampleList',
        dataSource: sampleResult,
      },
    });
  };
  const defaultValChange = (e, record) => {
    console.log(e, record, applyList, val, selectedRowKeys);

    let sampleTypeIds = list
      ?.filter((item) => selectedRowKeys?.some((key) => key === item.id))
      .map((item) => item.defaultSampleTypeId);
    if (sampleTypeIds?.includes(e)) {
      message.warn('已经有其他项目选择了,请选择其他的样本');
      return;
    }

    const sampleVal = sample.filter((item) => item.id == e);

    let result = list.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          defaultSampleTypeName: sampleVal[0]?.dictValue,
          defaultSampleTypeId: e,
        };
      }
      return item;
    });
    setList(result);
  };
  const onClose = () => {
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'applyList',
        dataSource: val,
      },
    });
    setSelectedRowKeysVal([]);
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
      }
    });
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);

    let sampleTypeIds = list
      ?.filter((item) => selectedRowKeys?.some((key) => key === item.id))
      .map((item) => item.defaultSampleTypeId);
    let sampleTypeId = list
      ?.filter((item) => selectedRowKeys.slice(-1)?.some((key) => key === item.id))
      .map((item) => item.defaultSampleTypeId);

    var nary = sampleTypeIds.sort();

    for (var i = 0; i < sampleTypeIds.length; i++) {
      if (nary[i] == nary[i + 1]) {
        message.warn('已经有其他项目选择了,请选择其他的样本');
        return;
      }
    }

    setSelectedRowKeysVal(selectedRowKeys);
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'selectedRowKeys',
        dataSource: selectedRowKeys,
      },
    });
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  return (
    <div>
      <Dialog ref={dialog} footer={null} width={864} onClose={onClose}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '10px' }}>
          <Tabs defaultActiveKey="1" style={{ width: '80%' }}>
            <TabPane tab="Tab 1" key="1">
              <Form onValuesChange={handleSearch} layout="inline" form={form}>
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
                <Form.Item name="name">
                  <Input
                    placeholder="请输入项目名称"
                    autoComplete="off"
                    suffix={<Icon name="icongongzuotai-sousuo" />}
                    allowClear
                  />
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              <Form onValuesChange={handleSearch} layout="inline" form={form}>
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
                <Form.Item name="name">
                  <Input
                    placeholder="请输入医院套餐名称"
                    autoComplete="off"
                    suffix={<Icon name="icongongzuotai-sousuo" />}
                    allowClear
                  />
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
        {/* <Table
          unit="个"
          columns={columns}
          selectedRowKeys={selectedRows.map(item=>item.key)}
          data={list}
          pagination={{ current: pageNum, total: total }}
          onChange={handleStandardTableChange}
          onSelectRow={handleSelectRows}
          isRowSelection={true}
          rowKey="key"
          locale={{
            emptyText: (
              <div>
                <img
                  width="115px"
                  height="99px"
                  src={require('@assets/images/empty/table_empty.png')}
                  alt=""
                />
                <div>暂无数据</div>
              </div>
            ),
          }}
        /> */}
        <Table rowSelection={rowSelection} columns={columns} dataSource={list} />
      </Dialog>
      <ReportItems refs={reportItemsRef} />
    </div>
  );
};
export default AddApply;
