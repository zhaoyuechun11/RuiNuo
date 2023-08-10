import React, { useState, useEffect } from 'react';
import { Button } from '@/components';
import { Table } from 'antd';
import { useDispatch } from 'umi';
const RightContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tableHeaderCoumn, setTableHeaderCoumn] = useState([]);
  useEffect(() => {
    getList({ reportUnitName: 'gg' });
  }, []);
  useEffect(() => {
    if (list.length > 0) {
      const firstColumm = list.splice(0, 1).map((column) => {
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

      const middleColumns = list.map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          width: 100,
          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      });
      const lastColumns = {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (text: string, record: Record<string, any>) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                // history.push(
                //   '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
                // );
              }}
            >
              编辑
            </Button>
            <Button
              onClick={() => {
                // deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button>
          </div>
        ),
      };
      const coumns = [...firstColumm, ...middleColumns, lastColumns];
      setTableHeaderCoumn(coumns);
    }
  }, [list]);

  const getList = (params) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportListTableHeader',
      payload: {
        ...params,
        callback: (res: { code: number; data: React.SetStateAction<never[]> }) => {
          if (res.code === 200) {
            setList(res.data);
          }
        },
      },
    });
  };

  return (
    <Table dataSource={[]} columns={tableHeaderCoumn} scroll={{ x: 1500, y: 300 }} size="middle" />
  );
};
export default RightContent;
