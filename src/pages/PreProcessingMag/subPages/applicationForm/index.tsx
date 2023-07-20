import React, { useEffect, useRef, useState } from 'react';
import { Table } from '@common';
import { Button, Icon } from '@/components';
import { Form, Input, message, Select, DatePicker, Tooltip } from 'antd';
import { useDispatch } from 'umi';
import { getHospitalList, userList, examineData, getMainOrder } from '../../models/server';
import SampleApplication from './components/SampleApplication';
import SetHeaderModal from '../sampleRegistration/components/SetHeaderModal';
const { Option } = Select;
const { RangePicker } = DatePicker;
let columns = [];
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
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const setRef = useRef();

  useEffect(() => {
    getApplicationForm({ pageNum, pageSize });
    hospitalList();
    getUserList();
    getCustomHeader();
  }, []);
  useEffect(() => {
    let listSeqs = selectedColumns.map((item) => {
      return item.listSeq;
    });

    let sortResult = listSeqs.sort(function (a, b) {
      return a - b;
    });
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });

    const newSelectedColumns = tableFieldResult.map((column) => {
      return {
        title: column.name,
        dataIndex: selectedField(column.key),
        responsive: ['xl', 'xxl'],
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    columns = [
      ...newSelectedColumns,
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 180,
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
  }, [selectedColumns]);
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
        getApplicationForm({ pageNum, pageSize });
      }
    });
  };
  const getCustomHeader = () => {
    dispatch({
      type: 'preProcessingMag/getExamineCustomHeader',
      payload: {
        callback: (res: { code: number; data: any[] }) => {
          if (res.code === 200) {
            const selectedFields = res.data.filter(
              (item: Record<string, any>) => item?.isListDisplay == true,
            );
            console.log(selectedFields);
            setSelectedColumns(selectedFields);
            setColumnOptionsList(res.data);
          }
        },
      },
    });
  };
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          getCustomHeader();
        },
      },
    });
  };
  const selectedField = (val) => {
    switch (val) {
      case 'sex':
        return 'sexName';
      case 'sendDeptId':
        return 'sendDeptName';
      case 'sendDoctorId':
        return 'sendDoctorName';
      case 'hospitalId':
        return 'hospitalName';
      default:
        return val;
    }
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
        <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
          <span
            //   className={styles.settings}
            onClick={() => {
              setRef.current && setRef.current?.show();
            }}
          >
            <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20 }} />
          </span>
        </Tooltip>
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
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
    </>
  );
};
export default applicationForm;
