import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'umi';
import {
  afterOrderList,
  getMainEnterNotAuth,
  getProfessionalApplyForm,
} from '../../../../models/server';

const ProfessionalApplyForm = () => {
  const { queryParams, pageNum } = useSelector((state: any) => state.applicationFormMsg);
  const [afterOrderTableHeader, setAfterOrderTableHeader] = useState([]);
  const [noAuthList, setNoAuthList] = useState([]);
  const [list, setList] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    getNoAuthList();
  }, []);
  useEffect(() => {
    getAfterOrderList();
  }, [noAuthList]);
  useEffect(() => {
    getList({
      pageNum,
      pageSize,
      [sort]: order,
      ...queryParams,
    });
  }, [sort, order, pageNum, queryParams]);
  const getNoAuthList = () => {
    getMainEnterNotAuth().then((res: any) => {
      if (res.code === 200) {
        setNoAuthList(res.data);
      }
    });
  };
  const getList = (params: any) => {
    getProfessionalApplyForm(params).then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any) => {
          return {
            ...item,
            ...item.extend.extendInfo,
          };
        });
        setList(result);
        setTotal(res.data.total);
      }
    });
  };
  const getAfterOrderList = () => {
    afterOrderList().then((res: any) => {
      if (res.code === 200) {
        res.data.push(...noAuthList);
        const firstColumm = res.data.splice(0, 1).map((column) => {
          return {
            title: column.name,
            dataIndex: column.key,
            responsive: ['xl', 'xxl'],
            align: 'center',
            fixed: 'left',
            width: 100,
            sorter: true,
            render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
          };
        });
        const Columns = res.data.map((column: any) => {
          if (column.key !== 'sampleType') {
            return {
              title: column.name,
              dataIndex: column.key,
              width: 100,
              responsive: ['xl', 'xxl'],
              align: 'center',
              sorter:
                column.key === 'receiveBarcode' ||
                column.key === 'hospitalName' ||
                column.key === 'sendDeptName' ||
                column.key === 'sendDoctorName' ||
                column.key === 'hospitalBarcode' ||
                column.key === 'patientId' ||
                column.key === 'patientNo' ||
                column.key === 'sourceName' ||
                column.key === 'patientName' ||
                column.key === 'sampleTypeIds' ||
                column.key === 'applyDate' ||
                column.key === 'collectDate' ||
                column.key === 'receiveDate' ||
                column.key === 'createDate'
                  ? true
                  : false,
              render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
            };
          } else {
            return {
              title: column.name,
              dataIndex: column.key,
              width: 100,
              responsive: ['xl', 'xxl'],
              align: 'center',
              key: column.key,
              sorter: (a, b) => a.column.key.length - b.column.key.length,
              render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
            };
          }
        });
        const lastColumn = {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: 180,
          render: (text: string, record: Record<string, any>) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>3333</div>
          ),
        };
        const allColumn = [...firstColumm, ...Columns, lastColumn];
        setAfterOrderTableHeader(allColumn);
      }
    });
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);

    if (sorter.field !== 'reqItemName' && sorter.field !== 'sampleType') {
      setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
      setSort(sorter.field + 'Desc');
    }
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    dispatch({
      type: 'applicationFormMsg/save',
      payload: {
        type: 'pageNum',
        dataSource: page,
      },
    });
    setPageSize(size);
  };
  return (
    <Table
      rowKey={(record) => record.id}
      columns={afterOrderTableHeader}
      dataSource={list}
      scroll={{ x: 3000 }}
      size="small"
      onChange={onTableChange}
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
export default ProfessionalApplyForm;
