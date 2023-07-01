import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, message, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Icon } from '@/components';
import { useDispatch, useSelector, useLocation } from 'umi';
import { downLoad, main } from '@/utils';
import EditOrAddModal from './components/editOrAddModal';
import styles from './index.less';
import { dictList, paramsSetExport, paramsSetDelete } from '../../models/server';
import BatchImport from '@/pages/CommonMaterials/commones/batchImport';
const { Option } = Select;
const GlobalOptionsSet = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const addModal = useRef();
  const [paramTypeList, setParamTypeList] = useState([]);
  const [list, setList] = useState([]);
  const importRef = useRef();
  const searchVal = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const Columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center',
      width: 150,
      fixed: 'left',
      key: 'id',
    },
    {
      title: '参数类别',
      dataIndex: 'paramTypeName',
      align: 'center',
      width: 150,
      key: 'paramTypeName',
      sorter: (a, b) => a.paramTypeName.length - b.paramTypeName.length,
    },
    {
      title: '参数编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      key: 'code',
      sorter: (a, b) => a.code.length - b.code.length,
    },
    {
      title: '参数值1',
      dataIndex: 'value1',
      align: 'center',
      width: 150,
    },
    {
      title: '参数值2',
      dataIndex: 'value2',
      align: 'center',
      width: 150,
    },
    {
      title: '参数值3',
      dataIndex: 'value3',
      align: 'center',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
    },
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
      width: 150,
      key: 'code',
      sorter: (a, b) => a.seq.length - b.seq.length,
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {btnPermissions?.map((item) => {
              return (
                <>
                  {item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        deleteBind(record.id);
                      }}
                    >
                      删除
                    </Button>
                  ) : item.mark === 'edit' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        addModal.current.show(record, 'edit');
                      }}
                    >
                      编辑
                    </Button>
                  ) : null}
                </>
              );
            })}
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params: any) => {
      dispatch({
        type: 'Setting/fetchParamsSetList',
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
    [dispatch],
  );
  useEffect(() => {
    getList({ pageNum, pageSize });
    getDictList();
  }, [pageNum, pageSize]);
  useEffect(() => {
    const { btn } = main(useDetail.permissions, location.pathname);
    setBtnPermissions(btn);
  }, [useDetail]);

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
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    paramsSetDelete({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize });
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'GP' }).then((res) => {
      if (res.code === 200) {
        setParamTypeList(res.data);
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    paramsSetExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '系统全局选项');
    });
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="paramTypeId">
          <Select placeholder="请选择类别" allowClear showSearch style={{ width: 224, height: 35 }}>
            {paramTypeList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="code">
          <Input
            placeholder="请输入参数编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="remark">
          <Input
            placeholder="请输入备注"
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
      <div className={styles.operateBtns}>
        {btnPermissions?.map((item) => {
          return (
            <>
              {item.mark === 'add' ? (
                <Button
                  btnType="primary"
                  onClick={() => {
                    addModal.current.show();
                  }}
                >
                  <PlusOutlined style={{ marginRight: 4 }} />
                  新增
                </Button>
              ) : item.mark === 'import' ? (
                <Button btnType="primary" onClick={importData}>
                  导入
                </Button>
              ) : item.mark === 'export' ? (
                <Button btnType="primary" onClick={exportData}>
                  导出
                </Button>
              ) : null}
            </>
          );
        })}
      </div>
      {renderForm()}
      <Table
        columns={Columns}
        rowKey
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
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/basic/parameter/importParameter`}
        title={'系统全局选项设置'}
        refresh={() => getList({ pageNum, pageSize })}
      ></BatchImport>
      <EditOrAddModal
        Ref={addModal}
        paramTypeList={paramTypeList}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
    </>
  );
};
export default GlobalOptionsSet;
