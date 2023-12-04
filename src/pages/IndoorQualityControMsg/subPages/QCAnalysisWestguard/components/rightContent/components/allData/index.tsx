import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useSelector } from 'umi';
import { downLoad } from '@/utils';
import { allData, graphicalExport } from '../../../../../../models/server';

const AllData = () => {
  const { AWSelectedQcIds, AWItem, AWFormData } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const [list, setList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  useEffect(() => {
    if (
      AWSelectedQcIds.length > 0 &&
      AWItem !== '' &&
      AWFormData.instrId !== '' &&
      AWFormData.instrId !== undefined &&
      AWFormData.startDate !== null
    ) {
      getAllData({
        instrId: AWFormData.instrId,
        qcDateStart: AWFormData.startDate[0].format('YYYY-MM-DD'),
        qcDateEnd: AWFormData.startDate[1].format('YYYY-MM-DD'),
        itemId: AWItem.id,
        qcIds: AWSelectedQcIds,
        pageNum,
        pageSize,
      });
    }
  }, [AWSelectedQcIds, AWItem, AWFormData.instrId, AWFormData.startDate, pageNum, pageSize]);
  const getAllData = (params: any) => {
    allData(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.Total);
      }
    });
  };
  const pageChange = (page: any, size: any) => {
    setPageNum(page);
    setPageSize(size);
  };
  const columns = [
    {
      title: '在控标志',
      dataIndex: 'controlStatus',
      fixed: 'left',
      align: 'center',
      render: (text: any) => {
        return text ? '在控' : '失控';
      },
    },
    {
      title: '质控日期',
      dataIndex: 'qcDate',
      align: 'center',
    },
    {
      title: '水平',
      dataIndex: 'qcLevelName',
      align: 'center',
    },
    {
      title: '结果时间',
      dataIndex: 'resultDt',
      align: 'center',
    },
    {
      title: '计算结果',
      dataIndex: 'calculateValue',
      align: 'center',
    },
    {
      title: '计算的SD值',
      dataIndex: 'calculateSd',
      align: 'center',
    },
    {
      title: '累积',
      dataIndex: 'inuseFlag',
      align: 'center',
      render: (text: any) => {
        return text ? '采用' : '无效';
      },
    },
    {
      title: '画图',
      dataIndex: 'drawFlag',
      align: 'center',
      render: (text: any) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '失控提示',
      align: 'center',
      dataIndex: 'outControlTips',
    },
    {
      title: '靶值',
      align: 'center',
      dataIndex: 'tagValue',
    },
    {
      title: 'SD',
      align: 'center',
      dataIndex: 'sd',
    },
    {
      title: 'CV',
      align: 'center',
      dataIndex: 'cv',
    },
    {
      title: '签名',
      align: 'center',
      dataIndex: '',
    },

    {
      title: '失控原因',
      dataIndex: 'outControlReason',
      align: 'center',
    },
    {
      title: '失控处理',
      dataIndex: 'outControlOperation',
      align: 'center',
    },
    {
      title: '处理结果',
      dataIndex: 'outControlResult',
      align: 'center',
    },
    {
      title: '处理人',
      dataIndex: 'outControlUser',
      align: 'center',
    },
    {
      title: '处理时间',
      dataIndex: 'outControlOperateDt',
      align: 'center',
    },
    {
      title: '临床影响',
      dataIndex: 'clinicEffect',
      align: 'center',
    },
    {
      title: '预防措施',
      dataIndex: 'preMunition',
      align: 'center',
    },
    {
      title: '机器原始结果',
      dataIndex: 'originalValue',
      align: 'center',
    },
    {
      title: '质控结果ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '质控品ID',
      dataIndex: 'qcId',
      align: 'center',
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '结果标识',
      dataIndex: 'qcValueSign',
      align: 'center',
    },
    {
      title: '靶值标准ID',
      dataIndex: 'qcItemValueId',
      align: 'center',
    },
    {
      title: '审核标志',
      dataIndex: 'checkFlag',
      align: 'center',
      render: (text: any) => {
        return text ? '审核' : '未审核';
      },
    },
    {
      title: '审核时间',
      dataIndex: 'checkDt',
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      align: 'center',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifyDt',
      align: 'center',
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifyUser',
      align: 'center',
    },
    {
      title: '失控上限',
      dataIndex: 'limitHigh',
      align: 'center',
    },
    {
      title: '失控下限',
      dataIndex: 'limitLow',
      fixed: 'right',
      align: 'center',
    },
  ];
  const exportData = () => {
    if (
      AWSelectedQcIds.length > 0 &&
      AWItem !== '' &&
      AWFormData.instrId !== '' &&
      AWFormData.instrId !== undefined &&
      AWFormData.startDate !== null
    ) {
      graphicalExport({
        instrId: AWFormData.instrId,
        qcDateStart: AWFormData.startDate[0].format('YYYY-MM-DD'),
        qcDateEnd: AWFormData.startDate[1].format('YYYY-MM-DD'),
        itemId: AWItem.id,
        qcIds: AWSelectedQcIds,
      }).then((res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const href = URL.createObjectURL(blob);
        downLoad(href, '所有数据');
      });
    }
  };
  return (
    <>
      <Button type="primary" onClick={exportData} style={{ margin: '10px' }}>
        导出
      </Button>
      <Table
        scroll={{ x: 'max-content' }}
        size="small"
        dataSource={list}
        columns={columns}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      ></Table>
    </>
  );
};
export default AllData;
