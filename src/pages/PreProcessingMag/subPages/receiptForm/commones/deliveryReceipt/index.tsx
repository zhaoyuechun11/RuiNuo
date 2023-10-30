import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table } from 'antd';
import { Dialog } from '@components';
import { deliveryReceiptList } from '../../../../models/server';

const DeliveryReceipt = ({ refs }) => {
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const dialog = useRef();
  useImperativeHandle(refs, () => ({
    show: (val: any) => {
      getList({
        pageNum,
        pageSize,
        mainOrderId: val.id,
      });
      dialog.current && dialog.current.show();
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));

  const getList = (params: any) => {
    deliveryReceiptList(params).then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any, index: any) => {
          return {
            ...item,
            index: index + 1,
          };
        });
        setList(result);
        setTotal(res.data.total);
      }
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
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
            {text === 0 ? '未处理' : text === 1 ? '处理中' : text === 2 ? '已完成' : '已确认'}
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
    <Dialog ref={dialog} width={864} title="交接单">
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
      ;
    </Dialog>
  );
};
export default DeliveryReceipt;
