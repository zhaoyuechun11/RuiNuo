import React, { useEffect, useRef, useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button, Icon } from '@/components';
import { DownOutlined } from '@ant-design/icons';
import {
  getMainEnterNotAuth,
  beforeOrderList,
  afterOrderList,
  getOrginOrderList,
  getQuerySplitNum,
} from '../../../../models/server';
import SetHeaderModal from '../SetHeaderModal';
import SourceModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/sourceModal';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';

const OriginApplyForm = () => {
  const [beforeOrderTableHeader, setBeforeOrderTableHeader] = useState([]);
  const [afterOrderTableHeader, setAfterOrderTableHeader] = useState([]);
  const [noAuthList, setNoAuthList] = useState([]);
  const [list, setList] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [professionalGroup, setProfessionalGroup] = useState(0);
  const setRef = useRef();
  const sourceModal = useRef();
  const applyFormRef = useRef();
  const dispatch = useDispatch();
  const { queryParams, pageNum } = useSelector((state: any) => state.applicationFormMsg);
  useEffect(() => {
    getNoAuthList();
    getQuerySplitNumFun();
  }, []);
  useEffect(() => {
    getBeforeOrderList();
    getAfterOrderList();
  }, [noAuthList]);
  useEffect(() => {
    orginOrderList({
      [sort]: order,
      pageNum,
      pageSize,
      ...queryParams,
    });
  }, [pageNum, pageSize, sort, order, queryParams]);
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
  const getQuerySplitNumFun = () => {
    getQuerySplitNum().then((res) => {
      if (res.code === 200) {
        setProfessionalGroup(res.data);
      }
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
        const selectedFields = res.data.filter(
          (item: Record<string, any>) => item?.isListDisplay == true,
        );

        setColumnOptionsList(res.data);
        setSelectedColumns(selectedFields);
        setTableHeader(selectedFields);
      }
    });
  };
  const setTableHeader = (selectedColumns: any) => {
    let listSeqs = selectedColumns.map((item) => {
      return item.listSeq;
    });

    let sortResult = listSeqs
      .sort(function (a, b) {
        return a - b;
      })
      .filter((item) => item !== undefined);
    let noSeq = [];
    noSeq = selectedColumns.filter((item) => item.listSeq == undefined);
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });
    if (noSeq.length > 0) {
      tableFieldResult.push(...noSeq);
    }
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        width: 100,
        sorter: true,
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    const Columns = tableFieldResult.map((column: any) => {
      if (column.key !== 'reqItemName' && column.key !== 'sampleType') {
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
    const noAuthColumns = noAuthList.map((column) => {
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
          <Button onClick={() => applyFormRef.current.show(record)}>预览</Button>
          <Button>交接</Button>
        </div>
      ),
    };

    const allColumn = [...firstColumm, ...Columns, ...noAuthColumns, lastColumn];
    const originOrderExoprtColumm = allColumn.map((item) => item.dataIndex);
    dispatch({
      type: 'applicationFormMsg/save',
      payload: {
        type: 'originOrderExoprtColumm',
        dataSource: originOrderExoprtColumm,
      },
    });
    setBeforeOrderTableHeader(allColumn);
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
            <Dropdown overlay={() => menu(record)}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          ),
        };
        const allColumn = [...firstColumm, ...Columns, lastColumn];
        const professionExoprtColumm = allColumn.map((item) => item.dataIndex);
        dispatch({
          type: 'applicationFormMsg/save',
          payload: {
            type: 'professionExoprtColumm',
            dataSource: professionExoprtColumm,
          },
        });
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
  const orginOrderList = (params: any) => {
    getOrginOrderList(params).then((res: any) => {
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
        setTotal(res.data.total);
      }
    });
  };
  const menu = (record: any) => {
    return (
      <Menu>
        <Menu.Item onClick={() => sourceModal.current.show(record)}>溯源</Menu.Item>
        <Menu.Item>交接</Menu.Item>
      </Menu>
    );
  };

  const expandedRowRender = (record) => {
    const data = record.childTableContent;
    return (
      <Table
        size="small"
        columns={afterOrderTableHeader}
        dataSource={data}
        pagination={false}
        scroll={{ x: 300 }}
      />
    );
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
        title={() => (
          <span onClick={() => setRef.current.show()} style={{ display: 'flex' }}>
            <Icon name="iconhouxuanren-shezhi" />
            自定义表头
          </span>
        )}
        footer={() => (
          <div>
            <span>原始申请单数:{total}</span>
            <span>专业组单数:{professionalGroup}</span>
          </div>
        )}
        size="small"
        className="components-table-demo-nested"
        rowKey={(record) => record.id}
        columns={beforeOrderTableHeader}
        expandedRowRender={expandedRowRender}
        dataSource={list}
        scroll={{ x: 'calc(700px + 50%)' }}
        onChange={onTableChange}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
      <SourceModal Ref={sourceModal} />
      <ApplyFormModal Ref={applyFormRef} from="originApplyForm" />
    </>
  );
};
export default OriginApplyForm;
