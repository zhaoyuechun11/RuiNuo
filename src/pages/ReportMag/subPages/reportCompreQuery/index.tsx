import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { useSelector } from 'umi';
import { getReportListByHos } from '../../models/server';
import RightContent from '../reportReview/commones/rightContent';
import s from '../reportReview/index.less';
import ResultTable from './commones/resultTable';
import QueryData from './commones/QueryData';
const ReportCompreQuery = () => {
  const { queryDataReportCompre, pageNum } = useSelector((state: any) => state.reportMag);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [list, setList] = useState([]);
  const modalResultTable = useRef();
  useEffect(() => {}, []);
  useEffect(() => {
    reportListByHos({ ...queryDataReportCompre });
  }, [queryDataReportCompre]);
  const columns = [
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
      render: () => <a>申请单</a>,
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
      }
    });
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
            type="primary"
            size="small"
            onClick={() => modalResultTable.current.show()}
            style={{ margin: '0px 0px 5px 0px' }}
          >
            导出结果表
          </Button>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={[]}
            size="small"
            scroll={{ x: 1300 }}
          />
        </Col>
        <Col span={12} className={s.col_02}>
          <RightContent />
        </Col>
      </Row>
      <ResultTable Ref={modalResultTable} />
    </>
  );
};
export default ReportCompreQuery;
