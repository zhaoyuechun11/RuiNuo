import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table } from '@common';
import { Form, Input, Select, Button, Tabs } from 'antd';
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
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [sample, setSample] = useState([]);
  const [sampleType, setSampleType] = useState();
  const dispatch = useDispatch();
  const dialog = useRef();
  const searchVal = useRef();
  const [hospital, setHospital] = useState([]);
  const [form] = Form.useForm();
  const reportItemsRef = useRef();
  const { applyList } = useSelector((state: any) => state.preProcessingMag);

  useImperativeHandle(refs, () => ({
    show: (val) => {
      dialog.current && dialog.current.show();
      getList({ pageNum, pageSize });
      majorGroupList();
      dictList({ type: 'BT' });
      setSelectedRows(val);
      hospitalList();
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
            setList(res.data.records);
            setTotal(res.data.total);
            let filterResult = applyList?.filter(
              (item) => !res.data.records.some((data) => data.id === item.id),
            );
            dispatch({
              type: 'preProcessingMag/save',
              payload: {
                type: 'applyList',
                dataSource: filterResult,
              },
            });
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

    setSelectedRows([]);
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
    // debugger;
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
    if (applyList?.length > 0) {
      selectedRows.push(...applyList);
    }
    const result = selectedRows.map((item) => {
      return {
        itemName: item.reqItemName,
        sampleTypeId: item.defaultSampleTypeId,
        itemId: item.id,
        ...item,
      };
    });
    const sampleResult = selectedRows.map((item) => {
      return {
        sampleTypeName: item.defaultSampleTypeName,
        sampleTypeId: item.defaultSampleTypeId,
        sampleStateName: '正常',
        sampleStateId: 1130,
      };
    });

    dialog.current && dialog.current.hide();
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
    console.log(e, record);
    console.log(sample);
    const sampleVal = sample.filter((item) => item.id == e);
    console.log(sampleVal);
    let result = list.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          defaultSampleTypeName: sampleVal[0].dictValue,
          defaultSampleTypeId: e,
        };
      }
      return item;
    });
    console.log(result);
    if (selectedRows.length > 0) {
      let selectedResult = selectedRows.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            defaultSampleTypeName: sampleVal[0].dictValue,
            defaultSampleTypeId: e,
          };
        }
        {
          return { ...item };
        }
      });
      setSelectedRows(selectedResult);
    }
    //debugger
    console.log(selectedRows);
    setList(result);
  };
  const onClose = () => {
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'applyList',
        dataSource: selectedRows,
      },
    });
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
      }
    });
  };
  const tabCallback = (e) => {};
  return (
    <div>
      <Dialog ref={dialog} footer={null} width={864} onClose={onClose}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '10px' }}>
          <Tabs defaultActiveKey="1" onChange={tabCallback} style={{ width: '80%' }}>
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
        <Table
          unit="个"
          columns={columns}
          selectedRowKeys={selectedRows.map((i) => i?.id)}
          data={list}
          pagination={{ current: pageNum, total: total }}
          onChange={handleStandardTableChange}
          onSelectRow={handleSelectRows}
          isRowSelection={true}
          rowKey="id"
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
        />
      </Dialog>
      <ReportItems refs={reportItemsRef} />
    </div>
  );
};
export default AddApply;
