import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Table } from 'antd';
import { useSelector } from 'umi';
import { Button } from '@/components';
import { byHospitalGetReport, getReportListByHos } from '../../models/server';
import QueryData from './commones/QueryData';
import s from './index.less';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';
const ReportPrintByHospital = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeHP, setPageSizeHP] = useState(10);
  const [pageNumHP, setPageNumHP] = useState(1);
  const [totalHP, setTotalHP] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeysHR, setSelectedRowKeysHR] = useState([]);
  const [hospitalReport, setHospitalReport] = useState([]);
  const [tableId, setTableId] = useState([]);
  const { queryDataByHosPrint } = useSelector((state: any) => state.reportMag);
  const [list, setList] = useState([]);
  const applyFormRef = useRef();
  useEffect(() => {
    getByHospitalGetReport({ hospitalId: '', pageNum: pageNumHP, pageSize: pageSizeHP });
  }, []);
  useEffect(() => {
    getByHospitalGetReport({ hospitalId: queryDataByHosPrint.hospitalId });
    //reportListByHos({ ...queryDataByHosPrint });
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
      align: 'center',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      align: 'center',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      width: 90,
    },
    {
      title: '报告日期',
      dataIndex: 'labDate',
      align: 'center',
      width: 200,
    },
    {
      title: '样本号',
      dataIndex: 'sampleNo',
      align: 'center',
      width: 100,
    },
    {
      title: '样本条码',
      dataIndex: 'sampleBarcode',
      align: 'center',
      width: 100,
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      align: 'center',
      width: 100,
    },
    {
      title: '送检医生',
      dataIndex: 'sendDoctor',
      align: 'center',
      width: 100,
    },
    {
      title: '送检科室',
      dataIndex: 'sendDept',
      align: 'center',
      width: 100,
    },
    {
      title: '采样时间',
      dataIndex: 'collectDate',
      width: 180,
      align: 'center',
    },
    {
      title: '前处理签收时间',
      dataIndex: 'preReceiveDate',
      width: 180,
      align: 'center',
    },
    {
      title: '打印标志',
      dataIndex: 'printFlag',
      width: 180,
      align: 'center',
      render: (text: any) => {
        return <span>{text === 0 ? '未打印' : '已打印'}</span>;
      },
    },
    {
      title: '打印次数',
      dataIndex: 'printCount',
      width: 180,
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'lastAuditDate',
      width: 180,
      align: 'center',
    },
    {
      title: '发布日期',
      dataIndex: 'reportPublishDate',
      width: 180,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (record: any) => (
        <div className={s.action}>
          <Button>报告单预览</Button>{' '}
          <Button onClick={() => applyFormRef.current.show(record)}>申请单</Button>
        </div>
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
  const onSelectChangeHR = (keys: any) => {
    setSelectedRowKeysHR(keys);
    reportListByHos({ ...queryDataByHosPrint, pageNum, pageSize, hospitalId: keys.join(',') });
  };
  const rowSelectionHR = {
    selectedRowKeys: selectedRowKeysHR,
    onChange: onSelectChangeHR,
  };
  const getByHospitalGetReport = (params: any) => {
    byHospitalGetReport(params).then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any) => {
          return {
            ...item,
            key: Number(item.hospitalId),
          };
        });
        const ids = result.map((item: any) => item.key);

        setHospitalReport(result);
        setSelectedRowKeysHR(ids);
        setTotalHP(res.data.total);
        //setTableId(res.data[0].hospitalId);
        // if (params.hospitalId === '') {
        //   reportListByHos(res.data[0]?.hospitalId);
        // }
        reportListByHos({ ...queryDataByHosPrint, pageNum, pageSize, hospitalId: ids.join(',') });
      }
    });
  };
  const reportListByHos = (params: any) => {
    getReportListByHos(params).then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any) => {
          return {
            ...item,
            key: item.id,
          };
        });
        const ids = result.map((item: any) => item.id);
        setSelectedRowKeys(ids);
        setList(result);
        setTotal(res.data.total);
      }
    });
  };
  const setRowClassName = (record: any) => {
    return record.hospitalId === tableId ? `${s.clickRowStyl}` : '';
  };
  const pageChange = (page: any, size: any) => {
    setPageNum(page);
    setPageSize(size);
  };
  const pageChangeHP = (page: any, size: any) => {
    setPageNumHP(page);
    setPageSizeHP(size);
  };
  return (
    <>
      <QueryData />
      <Row gutter={12}>
        <Col span={6}>
          <Table
            rowSelection={rowSelectionHR}
            columns={columns}
            dataSource={hospitalReport}
            size="small"
            onRow={(record) => {
              return {
                onClick: (event) => {
                  reportListByHos({ hospitalId: record.hospitalId });
                  setTableId(record.hospitalId);
                },
              };
            }}
            rowClassName={setRowClassName}
            pagination={{
              current: pageNumHP,
              pageSize: pageSizeHP,
              total: totalHP,
              onChange: pageChangeHP,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </Col>
        <Col span={18}>
          <Table
            rowSelection={rowSelection}
            columns={columns1}
            dataSource={list}
            size="small"
            scroll={{ x: 1300 }}
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </Col>
      </Row>
      <ApplyFormModal Ref={applyFormRef} />
    </>
  );
};
export default ReportPrintByHospital;
