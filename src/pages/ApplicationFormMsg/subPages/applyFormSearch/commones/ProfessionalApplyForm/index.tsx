import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import { Button } from '@/components';
import { useDispatch, useSelector } from 'umi';
import {
  afterOrderList,
  getMainEnterNotAuth,
  getProfessionalApplyForm,
} from '../../../../models/server';
import SourceModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/sourceModal';
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
  const sourceModal = useRef();
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
        const firstColumm = res.data.splice(0, 1).map((column: any) => {
          return {
            title: column.name,
            dataIndex: column.key,
            responsive: ['xl', 'xxl'],
            align: 'center',
            fixed: 'left',
            sorter: true,
            render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
          };
        });
        const Columns = res.data.map((column: any) => {
          if (column.key !== 'sampleType') {
            return {
              title: column.name,
              dataIndex: column.key,
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
          width: 120,
          render: (text: string, record: Record<string, any>) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => sourceModal.current.show(record)}>溯源</Button>
              <Button style={{ marginLeft: '10px' }}>交接</Button>
            </div>
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
    <>
      <Table
        rowKey={(record) => record.id}
        columns={afterOrderTableHeader}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        footer={() => (
          <div>
            <span>专业组单数:{total}</span>
          </div>
        )}
      />
      <SourceModal Ref={sourceModal} />
    </>
  );
};
export default ProfessionalApplyForm;
