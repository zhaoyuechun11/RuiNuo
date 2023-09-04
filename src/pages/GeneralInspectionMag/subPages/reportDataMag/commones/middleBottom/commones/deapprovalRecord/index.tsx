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
