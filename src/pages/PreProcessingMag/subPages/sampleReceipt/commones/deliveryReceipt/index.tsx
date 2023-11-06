import React, { useEffect, useState } from 'react';
import { Table, Badge } from 'antd';
import { deliveryReceiptList } from '../../../../models/server';
const DeliveryReceipt = ({ mainId, subId }) => {
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (mainId) {
      getList({
        pageNum,
        pageSize,
        mainOrderId: mainId,
        subId,
      });
    }
  }, [mainId, subId]);
  const getList = (params: any) => {
    deliveryReceiptList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.total);
      }
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'nodeName',
      key: 'nodeName',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text: any) => {
        return (
          <span>
            {text === 0 ? (
              <Badge status="default" text="未处理" />
            ) : text === 1 ? (
              <Badge status="processing" text="处理中" />
            ) : text === 2 ? (
              <Badge status="success" text="已完成" />
            ) : (
              <Badge status="warning" text="已确认" />
            )}
          </span>
        );
      },
    },
    {
      title: '交接内容',
      dataIndex: 'submitContent',
      key: 'submitContent',
      align: 'center',
    },
    {
      title: '反馈内容',
      key: 'solveContent',
      dataIndex: 'solveContent',
      align: 'center',
    },
    {
      title: '处理人',
      key: 'solveBy',
      dataIndex: 'solveBy',
      align: 'center',
    },
    {
      title: '提交人',
      key: 'submitBy',
      dataIndex: 'submitBy',
      align: 'center',
    },
    {
      title: '提交时间',
      key: 'submitTime',
      dataIndex: 'submitTime',
      align: 'center',
    },
    {
      title: '处理时间',
      key: 'solveTime',
      dataIndex: 'solveTime',
      align: 'center',
      fixed: 'right',
    },
  ];
  const pageChange = (page: any, pageSize: any) => {
    setPageNum(page);
    setPageSize(pageSize);
  };
  return (
    <Table
      columns={columns}
      dataSource={list}
      scroll={{ x: 'max-content' }}
      size="small"
      pagination={{
        current: pageNum,
        pageSize: pageSize,
        total,
        onChange: pageChange,
        showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
      }}
    />
  );
};
export default DeliveryReceipt;
