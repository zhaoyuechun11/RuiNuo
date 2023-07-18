import React, { useEffect, useState } from 'react';
import { Table } from '@common';
import { Button, Icon } from '@/components';
import { Form, Input, message, Select, DatePicker } from 'antd';
import { useDispatch } from 'umi';
import { getHospitalList, userList, examineData, getMainOrder } from '../../models/server';
import SampleApplication from './components/SampleApplication';
const { Option } = Select;
const { RangePicker } = DatePicker;
const applicationForm = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [detailData, setDetailData] = useState({});
  useEffect(() => {
    getApplicationForm({ pageNum, pageSize });
    hospitalList();
    getUserList();
  }, []);
  const columns = [
    {
      title: '送检样本码',
      dataIndex: 'receiveBarcode',
      align: 'center',
      width: 150,
      key: 'receiveBarcode',
      fixed: 'left',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      align: 'center',
      width: 150,
      key: 'hospitalName',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      align: 'center',
      width: 150,
      key: 'patientName',
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      align: 'center',
      key: 'sexName',
      width: 150,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      width: 150,
    },
    {
      title: '年龄单位',
      dataIndex: 'ageUnitName',
      align: 'center',
      width: 150,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleType',
      align: 'center',
      width: 150,
    },
    {
      title: '样本来源',
      dataIndex: 'source',
      align: 'center',
      width: 150,
    },
    {
      title: '送检医生',
      dataIndex: 'sendDoctorName',
      align: 'center',
      width: 150,
    },
    {
      title: '送检科室',
      dataIndex: 'sendDeptName',
      align: 'center',
      width: 150,
    },
    {
      title: '业务员',
      dataIndex: 'saleManName',
      align: 'center',
      width: 150,
    },
    {
      title: '申请项目',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      align: 'center',
      width: 150,
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      align: 'center',
      width: 150,
    },
    {
      title: '物流收样时间',
      dataIndex: 'receiveDate',
      align: 'center',
      width: 150,
    },
    {
      title: '登记日期',
      dataIndex: 'createDate',
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        <Button
          style={{ margin: '0 8px' }}
          onClick={() => {
            detail(record.id);
          }}
        >
          明细
        </Button>
      ),
    },
  ];
  const detail = (id) => {
    getMainOrder({ id }).then((res) => {
      if (res.code === 200) {
        setDetailData(res.data);
      }
    });
  };
  const getApplicationForm = (params) => {
    dispatch({
      type: 'preProcessingMag/feactApplicationForm',
      payload: {
        ...params,
        callback: (res) => {
          setList(res.data.records);
          setTotal(res.data.total);
          detail(res.data.records[0].id);
        },
      },
    });
  };
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
    setPageNum(pagination.current);
    setPageSize(pagination.pageSize);
    getApplicationForm(params);
  };
  const handleSelectRows = (rows) => {
    setSelectedRows(rows);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
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
    getApplicationForm(values);
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
      }
    });
  };
  const getUserList = () => {
    userList().then((res) => {
      if (res.code === 200) {
        setPersonList(res.data);
      }
    });
  };
  const examine = () => {
    if (selectedRows.length === 0) {
      message.warn('请选择要审核的数据');
      return;
    }
    const ids = selectedRows.map((item) => {
      return item.id;
    });
    examineData({ ids: ids }).then((res) => {
      if (res.code === 200) {
        message.success('审核成功');
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
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
        <div id="creatErId">
          <Form.Item name="creatErId">
            <Select
              placeholder="请选择登记人"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('creatErId')}
            >
              {personList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="createDateStart">
          <RangePicker
            showTime
            placeholder={['登记开始日期', '登记结束日期']}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item name="receiveBarcode">
          <Input
            placeholder="请输入送检样本条码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <div style={{ display: 'flex' }}>
        {renderForm()}
        <Button btnType="primary" onClick={examine}>
          审核
        </Button>
      </div>
      <Table
        scroll={{ x: 1300 }}
        unit="个"
        columns={columns}
        selectedRowKeys={selectedRows.map((i) => i.id)}
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
      <SampleApplication data={detailData} />
    </>
  );
};
export default applicationForm;
