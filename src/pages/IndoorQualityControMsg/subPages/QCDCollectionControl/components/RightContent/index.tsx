import React, { useEffect, useRef, useState } from 'react';
import { Table,  Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button } from '@/components';
import { dataGatherSetList, dataGatherSetDelete } from '../../../../models/server';
import styles from './index.less';
import AddOrEditModal from './components/addOrEditModal';
const RightContent = () => {
  const { collectionControl } = useSelector((state: any) => state.IndoorQualityControMsg);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);

  const dispatch = useDispatch();
  const modalRef = useRef();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'collectionControl',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  useEffect(() => {
    if (collectionControl?.instrId) {
      getList({
        pageNum,
        pageSize,
        instrId: collectionControl.instrId,
        [sort]: order,
      });
    }
  }, [pageNum, pageSize, collectionControl?.instrId, sort, order]);
  const columns = [
    {
      title: '采集对照ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'instrCode',
      align: 'center',
    },
    {
      title: '标本号/质控位号',
      dataIndex: 'sampleNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '质控品号',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '质控水平',
      dataIndex: 'qcLevelName',
      align: 'center',
    },
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
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
    dataGatherSetDelete({ ids: [id] }).then((res: any) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: collectionControl.instrId,
        });
      }
    });
  };
  const getList = (params: any) => {
    dataGatherSetList(params).then((res: any) => {
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
    setSort(sorter.field + 'Desc');
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  return (
    <>
      <Button btnType="primary" onClick={add} className={styles.add_btn}>
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
            instrId: collectionControl.instrId,
          });
        }}
      />
    </>
  );
};

export default RightContent;
