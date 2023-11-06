import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Table } from 'antd';
import { useSelector } from 'umi';
import { Button } from '@/components';
import { getReportListByHos } from '../../models/server';
import RightContent from '../reportReview/commones/rightContent';
import s from '../reportReview/index.less';
import ResultTable from './commones/resultTable';
import QueryData from './commones/QueryData';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';
import ReportPreview from '../reportReview/commones/reportPreview ';
const ReportCompreQuery = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { queryDataReportCompre } = useSelector((state: any) => state.reportMag);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [list, setList] = useState([]);
  const modalResultTable = useRef();
  const applyFormRef = useRef();
  useEffect(() => {}, []);
  useEffect(() => {
    reportListByHos({ ...queryDataReportCompre, pageNum, pageSize });
  }, [queryDataReportCompre]);
  const columns = [
    {
      title: '报告单元',
      dataIndex: 'reportUnitName',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      aligin: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
    },
    {
      title: '报告日期',
      dataIndex: 'labDate',
      align: 'center',
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
      align: 'center',
    },
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      align: 'center',
    },
    {
      title: '送检医生',
      dataIndex: 'sendDoctor',
      align: 'center',
    },
    {
      title: '送检科室',
      dataIndex: 'sendDept',
      align: 'center',
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      align: 'center',
    },
    {
      title: '前处理签收时间',
      dataIndex: 'preReceiveDate',
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'lastAuditDate',
      align: 'center',
    },
    {
      title: '发布日期',
      dataIndex: 'reportPublishDate',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record: any) => (
        <Button onClick={() => applyFormRef.current.show(record)}>申请单</Button>
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

  const reportListByHos = (params: any) => {
    getReportListByHos(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.tatal);
      }
    });
  };
  const pageChange = (page: any, size: any) => {
    setPageNum(page);
    setPageSize(size);
  };
  return (
    <>
      <QueryData />

      <Row gutter={12}>
        <Col span={12} className={s.col_01}>
          {/* <Button type="primary" size="small">
            打印
          </Button>
          <Button type="primary" size="small" style={{ margin: '5px' }}>
            导出PDF
          </Button> */}

          <Button
            btnType="primary"
            size="small"
            onClick={() => modalResultTable.current.show()}
            style={{ margin: '0px 0px 5px 0px' }}
          >
            导出结果表
          </Button>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list}
            size="small"
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </Col>
        <Col span={12} className={s.col_02}>
          <ReportPreview />
        </Col>
      </Row>
      <ResultTable Ref={modalResultTable} />
      <ApplyFormModal Ref={applyFormRef} />
    </>
  );
};
export default ReportCompreQuery;
