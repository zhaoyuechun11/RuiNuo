import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import {
  afterOrderList,
  getMainEnterNotAuth,
  getProfessionalApplyForm,
} from '../../../../models/server';
const ProfessionalApplyForm = () => {
  const [afterOrderTableHeader, setAfterOrderTableHeader] = useState([]);
  const [noAuthList, setNoAuthList] = useState([]);
  const [list, setList] = useState([]);
  useEffect(() => {
    getNoAuthList();
    getList();
  }, []);
  useEffect(() => {
    getAfterOrderList();
  }, [noAuthList]);
  const getNoAuthList = () => {
    getMainEnterNotAuth().then((res: any) => {
      if (res.code === 200) {
        setNoAuthList(res.data);
      }
    });
  };
  const getList = () => {
    getProfessionalApplyForm().then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any) => {
          return {
            ...item,
            ...item.extend.extendInfo,
          };
        });
        setList(result);
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
            render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
          };
        });
        const Columns = res.data.map((column: any) => {
          return {
            title: column.name,
            dataIndex: column.key,
            width: 100,
            responsive: ['xl', 'xxl'],
            align: 'center',
            render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
          };
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
  return (
    <Table
      rowKey={(record) => record.id}
      columns={afterOrderTableHeader}
      dataSource={list}
      scroll={{ x: 3000 }}
    />
  );
};
export default ProfessionalApplyForm;
