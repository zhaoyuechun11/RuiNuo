import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { Button, Icon } from '@/components';
import { Form, Input, Table } from 'antd';
import { main, transformTree } from '@/utils';
import BindModal from './components/bindModal';
const TaskGroup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const bindRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const [list, setList] = useState([]);
  const statisticsColumns = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典类别',
      dataIndex: 'dictType',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
      sorter: true,
      align: 'center',
    },
    {
      title: '英文',
      dataIndex: 'engValue',
      align: 'center',
    },
    {
      title: '对接编码',
      dataIndex: 'interfaceCode',
      align: 'center',
    },
    {
      title: '实验室ID',
      dataIndex: 'labId',
      align: 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '是否可以编辑',
      dataIndex: 'iseditable',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '顺序',
      align: 'center',
      dataIndex: 'seq',
    },

    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return btnPermissions?.map((item) => {
          return (
            item.mark === 'bind' && (
              <Button
                style={{ display: 'initial' }}
                onClick={() => {
                  bindRef.current.show(record.id);
                }}
              >
                绑定
              </Button>
            )
          );
        });
      },
    },
  ];

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchTaskPageData',
      payload: {
        ...params,
        callback: (res: ResponseData<{ list: RewardItem[]; count: number }>) => {
          if (res.code === 200) {
            setList(res.data.records);
            setTotal(res.data.total);
          }
        },
      },
    });
  };

  useEffect(() => {
    getList({ pageNum, pageSize });
  }, [pageNum, pageSize]);
  useEffect(() => {
    const { btn } = main(transformTree(useDetail.permissions), location.pathname);
    setBtnPermissions(btn);
  }, []);
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    // setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    // setSort(sorter.field);
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues, allValues) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Form.Item name="code">
          <Input
            placeholder="请输入字典编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="value">
          <Input
            placeholder="请输入字典值"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      <Table
        size={'small'}
        columns={statisticsColumns}
        handleTableChange={onTableChange}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      />
      <BindModal Ref={bindRef} refresh={() => getList({ pageNum, pageSize })}></BindModal>
    </>
  );
};

export default TaskGroup;
