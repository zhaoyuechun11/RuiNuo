import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import styles from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
import { transferInstrList, RPCriticalValueDele } from '../../../../models/server';
const { Option } = Select;
const CriticalValue = ({ parent }) => {
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
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'instrName',
      align: 'center',
    },
    {
      title: '样本类型',
      dataIndex: 'sampleTypeName',
      align: 'center',
    },
    {
      title: '年龄从',
      dataIndex: 'ageFrom',
      align: 'center',
    },
    {
      title: '年龄单位从值',
      dataIndex: 'ageFromUnitValue',
      align: 'center',
    },
    {
      title: '年龄到',
      dataIndex: 'ageTo',
      align: 'center',
    },
    {
      title: '年龄单位到值',
      dataIndex: 'ageToUnitValue',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sexValue',
      align: 'center',
    },
    {
      title: '危机值下限',
      dataIndex: 'lowValue',
      align: 'center',
    },
    {
      title: '危机值下限提示字符',
      dataIndex: 'lowChar',
      align: 'center',
    },
    {
      title: '危机值上限值',
      dataIndex: 'highValue',
      align: 'center',
    },
    {
      title: '危机值上限字符',
      dataIndex: 'highChar',
      align: 'center',
    },
    // {
    //   title: '显示参考范围',
    //   dataIndex: 'displayRef',
    //   align: 'center',
    // },

    {
      title: '操作',
      align: 'center',
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
        type: 'commonMaterials/fetchRPCriticalValue',
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
      labItemId: parent.id,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    RPCriticalValueDele({ ids: [id] }).then((res) => {
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
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
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
      <div className={styles.operateBtns}>
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
export default CriticalValue;
