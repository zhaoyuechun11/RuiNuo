import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useSelector, useDispatch } from 'umi';
const DeapprovalRecord = () => {
  const dispatch = useDispatch();
  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    getList({ reportId: instrAndRecordId.id, pageNum, pageSize });
  }, [pageNum, pageSize]);

  const getList = (params: any) => {
    dispatch({
      type: 'generalInspectionMag/fetchDeApprovalList',
      payload: {
        ...params,
        callback: (res: any) => {
          if (res.code === 200) {
            setList(res.data.records);
            setTotal(res.data.total);
          }
        },
      },
    });
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const columns = [
    {
      title: '实验室Id',
      dataIndex: 'labId',
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: '异常操作对象的ID',
      dataIndex: 'objectId',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      align: 'center',
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      align: 'center',
      width: 100,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      align: 'center',
      width: 100,
    },
    {
      title: '表名',
      dataIndex: 'tableName',
      align: 'center',
      width: 100,
    },
    {
      title: '异常操作类型',
      dataIndex: 'traceType',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (text) => {
        return (
          <span>
            {text === 1
              ? '反审核'
              : text === 2
              ? '样本复查'
              : text === 3
              ? '拒检'
              : text === 4
              ? '延迟'
              : text === 5
              ? '撤销拒检'
              : null}
          </span>
        );
      },
    },
    {
      title: '操作页面的名称',
      dataIndex: 'winName',
      align: 'center',
      fixed: 'right',
      width: 100,
      ellipsis: true,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={list}
        bordered
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        scroll={{ x: 200 }}
      />
    </>
  );
};
export default DeapprovalRecord;
