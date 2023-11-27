import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button } from '@/components';
import { convertRuleList, convertRuleDelete } from '../../../../models/server';
import styles from './index.less';
import AddOrEditModal from './components/addOrEditModal';
const RightContent = () => {
  const { leftMenuParamsDCRules } = useSelector((state: any) => state.IndoorQualityControMsg);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'leftMenuParamsDCRules',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  useEffect(() => {
    if (leftMenuParamsDCRules?.instrId) {
      getList({
        pageNum,
        pageSize,
        instrId: leftMenuParamsDCRules.instrId,
        [sort]: order,
      });
    }
  }, [pageNum, pageSize, leftMenuParamsDCRules?.instrId, sort, order]);
  const columns = [
    {
      title: '处理ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'instrName',
      align: 'center',
    },
    {
      title: '规则应用对象',
      dataIndex: 'itemName',
      align: 'center',
      sorter: true,
    },
    {
      title: '优先级',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '条件',
      dataIndex: 'conKind',
      align: 'center',
    },
    {
      title: '条件取值1',
      dataIndex: 'conParam1',
      align: 'center',
    },
    {
      title: '处理方式',
      dataIndex: 'transKind',
      align: 'center',
    },
    {
      title: '处理取值1',
      dataIndex: 'transParam1',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: any) => {
        return (
          <div className={styles.table_operate_box}>
            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认要删除该条数据么?"
              onConfirm={() => confirm(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const confirm = (id: any) => {
    convertRuleDelete({ ids: [id] }).then((res: any) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: leftMenuParamsDCRules.instrId,
        });
      }
    });
  };
  const getList = (params: any) => {
    convertRuleList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    modalRef.current.show();
  };

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    if (sorter.field === 'itemName') {
      setSort('itemIdDesc');
    } else {
      setSort(sorter.field + 'Desc');
    }
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  return (
    <>
      <Button btnType="primary" onClick={add} style={{ marginBottom: '10px' }}>
        添加
      </Button>
      <Table
        onChange={onTableChange}
        dataSource={list}
        columns={columns}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        scroll={{ x: 'max-content' }}
      />

      <AddOrEditModal
        Ref={modalRef}
        refresh={() => {
          getList({
            pageNum,
            pageSize,
            instrId: leftMenuParamsDCRules.instrId,
          });
        }}
      />
    </>
  );
};

export default RightContent;
