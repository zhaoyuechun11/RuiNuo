import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'antd';
import { useSelector } from 'umi';
import { byHospitalGetReport, getReportListByHos } from '../../models/server';
import QueryData from './commones/QueryData';

const ReportPrintByHospital = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [hospitalReport, setHospitalReport] = useState([]);
  const { queryDataByHosPrint, pageNum } = useSelector((state: any) => state.reportMag);
  useEffect(() => {
    getByHospitalGetReport({ hospitalId: '' });
  }, []);
  useEffect(() => {
    getByHospitalGetReport({ hospitalId: queryDataByHosPrint.hospitalId });
    reportListByHos({ ...queryDataByHosPrint });
  }, [queryDataByHosPrint]);
  const columns = [
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
    },
    {
      title: '报告数',
      dataIndex: 'reportPublishNum',
    },
  ];
  const columns1 = [
    {
      title: '报告单元',
      dataIndex: 'reportUnitName',
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '报告日期',
      dataIndex: 'labDate',
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
    },
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
    },
    {
      title: '送检医生',
      dataIndex: 'sendDoctor',
    },
    {
      title: '送检科室',
      dataIndex: 'sendDept',
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      width: 200,
    },
    {
      title: '前处理签收时间',
      dataIndex: 'preReceiveDate',
      width: 200,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => (
        <>
          <a>报告单预览</a> <a>申请单</a>
        </>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const getByHospitalGetReport = (params: any) => {
    byHospitalGetReport(params).then((res) => {
      if (res.code === 200) {
      }
    });
  };
  const reportListByHos = (params: any) => {
    getReportListByHos(params).then((res) => {
      if (res.code === 200) {
      }
    });
  };
  return (
    <>
      <QueryData />
      <Row gutter={12}>
        <Col span={6}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={[]} size="small" />
        </Col>
        <Col span={18}>
          {' '}
          <Table
            rowSelection={rowSelection}
            columns={columns1}
            dataSource={[]}
            size="small"
            scroll={{ x: 1300 }}
          />
        </Col>
      </Row>
    </>
  );
};
export default ReportPrintByHospital;
