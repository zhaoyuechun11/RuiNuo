import React, { useEffect, useRef, useState } from 'react';
import { Table } from '@common';
import { Icon } from '@/components';
import { Form, Input, message, Select, DatePicker, Tooltip, Button } from 'antd';
import { useDispatch } from 'umi';
import { getHospitalList, userList, examineData, getMainOrder } from '../../models/server';
import SampleApplication from './components/SampleApplication';
import SetHeaderModal from '../sampleRegistration/components/SetHeaderModal';
import s from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
let columns: (
  | {
      title: any;
      dataIndex: any;
      responsive: string[];
      align: string;
      render: (text: string | number) => React.JSX.Element;
    }
  | {
      title: string;
      dataIndex: string;
      fixed: string;
      align: string;
      width: number;
      render: (text: any, record: any) => React.JSX.Element;
    }
)[] = [];
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
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: selectedField(column.key),
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    const newSelectedColumns = tableFieldResult.map((column) => {
      return {
        title: column.name,
        dataIndex: selectedField(column.key),
        responsive: ['xl', 'xxl'],
        align: 'center',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    columns = [
      ...firstColumm,
      ...newSelectedColumns,
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 180,
        render: (text, record) => (
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
  const getApplicationForm = (params: { pageNum: any; pageSize: any }) => {
    dispatch({
      type: 'preProcessingMag/feactApplicationForm',
      payload: {
        ...params,
        callback: (res) => {
          setList(res.data.records);
          setTotal(res.data.total);
          if (res.data.records.length > 0) {
            detail(res.data.records[0]?.id);
          } else {
            setDetailData({});
          }
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
  const selectedField = (val: any) => {
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
      <Form onValuesChange={handleSearch} layout="inline" className={s.form_box}>
        <Form.Item name="hospitalId">
          <Select placeholder="请选择送检单位" allowClear>
            {hospital?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.hospitalName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="creatErId">
          <Select placeholder="请选择登记人" allowClear>
            {personList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="createDateStart">
          <RangePicker
            showTime
            placeholder={['登记开始日期', '登记结束日期']}
            style={{ width: 300, height: 35, border: '1px solid #9d9fa0' }}
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
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
        {renderForm()}
        <Button type="primary" onClick={examine} size="small">
          审核
        </Button>
        <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
          <span
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
      {!(JSON.stringify(detailData) == '{}') && <SampleApplication data={detailData} />}
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
