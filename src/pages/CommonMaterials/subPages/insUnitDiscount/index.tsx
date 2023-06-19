import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table } from '@/components';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
// import { transferInstrList, formulaDele } from '../../../../models/server';
const { Option } = Select;
const insUnitDiscount = ({ parent }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state: any) => state.loading.global);
  const addModal = useRef();
  const [instrList, setInstrList] = useState([]);

  const [list, setList] = useState([]);
  const Columns = [
    {
      title: '单位编码',
      dataIndex: 'instrName',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '送检单位名称',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '回款类别',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '申请项目编码',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '申请项目名称',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '标准价格',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '销售报价',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '销售报价扣率',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '合同价格',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '合同扣率',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '销售成本',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '销售成本扣率',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '净额',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '启用',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '启用日期',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '创建日期',
      dataIndex: 'formula',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                deleteBind(record.id);
              }}
            >
              删除
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                addModal.current.show(record, 'edit');
              }}
            >
              编辑
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params: any) => {
      dispatch({
        type: 'commonMaterials/fetchFormulaList',
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
    },
    [dispatch, sort, order],
  );
  useEffect(() => {
    if (parent) {
      getList({ pageNum, pageSize, labItemId: parent.id });
      getInstrList();
    }
  }, [pageNum, pageSize, parent]);

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
      reqItemId: parent.id,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    formulaDele({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, labItemId: parent.id });
      }
    });
  };
  const getInstrList = () => {
    transferInstrList().then((res) => {
      if (res.code === 200) {
        setInstrList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="instrId">
          <Select
            placeholder="请选择仪器"
            autoComplete="off"
            allowClear
            // onChange={projectCategoryChange}
          >
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <div>
        <Button
          btnType="primary"
          onClick={() => {
            addModal.current.show();
          }}
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
      </div>
      {renderForm()}
      <Table
        columns={Columns}
        rowKey="id"
        // onSelectCount={(count, keys) => {
        //   setSelectedCount(count);
        //   setSelectedKeys(keys);
        // }}
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
      <EditOrAddModal
        Ref={addModal}
        instrList={instrList}
        parent={parent}
        refresh={() => getList({ pageNum, pageSize, labItemId: parent?.id })}
      ></EditOrAddModal>
    </>
  );
};
export default insUnitDiscount;
