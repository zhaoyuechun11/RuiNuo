import React, { useEffect, useRef, useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { useDispatch } from 'umi';
import { Button } from '@/components';
import { DownOutlined } from '@ant-design/icons';
import {
  getMainEnterNotAuth,
  beforeOrderList,
  afterOrderList,
  getOrginOrderList,
} from '../../../../models/server';
import SetHeaderModal from '../SetHeaderModal';

const OriginApplyForm = () => {
  const [beforeOrderTableHeader, setBeforeOrderTableHeader] = useState([]);
  const [afterOrderTableHeader, setAfterOrderTableHeader] = useState([]);
  const [noAuthList, setNoAuthList] = useState([]);
  const [list, setList] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const setRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    getNoAuthList();
    orginOrderList();
  }, []);
  useEffect(() => {
    getBeforeOrderList();
    getAfterOrderList();
  }, [noAuthList]);
  useEffect(() => {
    let listSeqs = selectedColumns.map((item) => {
      return item.listSeq;
    });

    let sortResult = listSeqs.sort(function (a, b) {
      return a - b;
    });
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    const newSelectedColumns = tableFieldResult.map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        align: 'center',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    const columns = [
      ...firstColumm,
      ...newSelectedColumns,
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 180,
        render: (text, record) => (
          <Button style={{ margin: '0 8px' }} onClick={() => {}}>
            明细
          </Button>
        ),
      },
    ];
    setBeforeOrderTableHeader(columns);
  }, [selectedColumns]);
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          getBeforeOrderList();
        },
      },
    });
  };
  const getNoAuthList = () => {
    getMainEnterNotAuth().then((res: any) => {
      if (res.code === 200) {
        setNoAuthList(res.data);
      }
    });
  };
  const getBeforeOrderList = () => {
    beforeOrderList().then((res: any) => {
      if (res.code === 200) {
        res.data.push(...noAuthList);
        const selectedFields = res.data.filter(
          (item: Record<string, any>) => item?.isListDisplay == true,
        );
        setSelectedColumns(selectedFields);
        setColumnOptionsList(res.data);
        const firstColumm = res.data.splice(0, 1).map((column) => {
          return {
            title: column.name,
            dataIndex: column.key,
            width: 100,
            responsive: ['xl', 'xxl'],
            align: 'center',
            fixed: 'left',
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button>预览</Button>
              <Button>交接</Button>
            </div>
          ),
        };
        const allColumn = [...firstColumm, ...Columns, lastColumn];
        //setBeforeOrderTableHeader(allColumn);
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
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          ),
        };
        const allColumn = [...firstColumm, ...Columns, lastColumn];
        setAfterOrderTableHeader(allColumn);
      }
    });
  };
  const orginOrderList = () => {
    getOrginOrderList().then((res: any) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any) => {
          const childContent = item.childTableContent.map((childItem: any) => {
            return {
              ...childItem,
              ...item.extend.extendInfo,
            };
          });
          return {
            ...item,
            ...item.extend.extendInfo,
            childTableContent: childContent,
          };
        });
        setList(result);
      }
    });
  };
  const menu = (
    <Menu>
      <Menu.Item>溯源</Menu.Item>
      <Menu.Item>交接</Menu.Item>
    </Menu>
  );
  const expandedRowRender = (record) => {
    const data = record.childTableContent;
    return (
      <Table
        size="small"
        columns={afterOrderTableHeader}
        dataSource={data}
        pagination={false}
        scroll={{ x: 3000 }}
      />
    );
  };

  return (
    <>
      <Table
        title={() => <span onClick={() => setRef.current.show()}>自定义表头</span>}
        size="small"
        className="components-table-demo-nested"
        rowKey={(record) => record.id}
        columns={beforeOrderTableHeader}
        expandedRowRender={expandedRowRender}
        dataSource={list}
        scroll={{ x: 3000 }}
      />
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
    </>
  );
};
export default OriginApplyForm;
