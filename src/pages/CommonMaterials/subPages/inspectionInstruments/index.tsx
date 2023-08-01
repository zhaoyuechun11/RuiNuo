import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { downLoad, main, transformTree } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import { Form, Input, message, Tabs } from 'antd';
import { deleteInstr, instrExport } from '../../models/server';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';
import BindModal from './components/bindModal';
import PrintSeq from './subPages/printSeq';

const { TabPane } = Tabs;
const inspectionInstruments = () => {
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
  const modalRef = useRef();
  const searchVal = useRef();
  const [list, setList] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const [btnPermissions, setBtnPermissions] = useState([]);
  console.log('location', location);
  console.log('useDetail', useDetail);
  const columns = [
    {
      title: '资产编号',
      dataIndex: 'assetsNo',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: '仪器型号',
      dataIndex: 'instType',
      align: 'center',
      width: 100,
    },
    {
      title: '仪器代号',
      dataIndex: 'instrCode',
      align: 'center',
      width: 100,
    },
    {
      title: '仪器名称',
      dataIndex: 'instrName',
      align: 'center',
      width: 100,
      ellipsis:true,
    },
    {
      title: '管理分类名称',
      dataIndex: 'labClassManageName',
      align: 'center',
      width: 100,
      ellipsis:true
    },
    {
      title: '实验室编码',
      dataIndex: 'labId',
      align: 'center',
      width: 100,
    },
    {
      title: '仪器类型',
      dataIndex: 'pageTypeName',
      align: 'center',
      width: 100,
    },
    {
      title: '注册码',
      dataIndex: 'regCode',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 400,
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {btnPermissions?.map((item) => {
              return (
                <>
                  {item.mark === 'edit' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        modalRef.current.show(record);
                      }}
                    >
                      修改
                    </Button>
                  ) : item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        deleteCurrentItem(record.id);
                      }}
                    >
                      删除
                    </Button>
                  ) : item.mark === 'bind' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        bindRef.current.show(record.id);
                      }}
                    >
                      绑定
                    </Button>
                  ) : null}
                </>
              );
            })}
            <Button
              onClick={() => {
                getCurrentItem(record);
              }}
            >
              明细
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params: any) => {
      dispatch({
        type: 'commonMaterials/fetchInstrList',
        payload: {
          ...params,
          callback: (res: {
            code: number;
            data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
          }) => {
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
    getList({ pageNum, pageSize });
    if (useDetail) {
      // const { btn } = main(transformTree(useDetail.permissions), location.pathname);
      // console.log(transformTree(useDetail.permissions));
      // console.log(useDetail.permissions);
      const { btn } = main(transformTree(useDetail.permissions), location.pathname);
      setBtnPermissions(btn);
    }
  }, [pageNum, pageSize, useDetail]);

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
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const add = () => {
    modalRef.current && modalRef.current.show();
  };
  const importData = () => {};
  const exportData = () => {
    instrExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '仪器维护');
    });
  };

  const deleteCurrentItem = (id) => {
    deleteInstr({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
      }
    });
  };
  const getCurrentItem = (val: React.SetStateAction<undefined>) => {
    setCurrentItem(val);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="code">
          <Input
            placeholder="请输入仪器代号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="请输入仪器名称"
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
          return item.mark === 'add' ? (
            <Button btnType="primary" onClick={add}>
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
          ) : null;
        })}
      </div>
      {renderForm()}
      <Table
        columns={columns}
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
      <BindModal Ref={bindRef} refresh={() => getList({ pageNum, pageSize })}></BindModal>
      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
      <Tabs type="card">
        <TabPane tab="打印顺序" key="0">
          <PrintSeq parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
      </Tabs>
    </>
  );
};
export default inspectionInstruments;
