import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import { Form, Input, message } from 'antd';
import { downLoad, main ,transformTree} from '@/utils';
import EditOrAddModal from './components/editOrAddModal';
import { deleteManageGroup, manageGroupExport } from '../../models/server';
import styles from './index.less';
const ManageGroup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const modalRef = useRef();
  const searchVal = useRef();
  const [list, setList] = useState([]);
  const [btnPermissions, setBtnPermissions] = useState([]);
  const manageGroupColumns = [
    {
      title: 'code值',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      align: 'center',
      render: (text: any) => {
        return (
          <span
            style={{
              backgroundColor: text,
              display: 'inline-block',
              width: '10px',
              height: '10px',
            }}
          ></span>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
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
    (params) => {
      dispatch({
        type: 'commonMaterials/fetchManageGroupList',
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
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };

  const deleteCurrentItem = (id) => {
    deleteManageGroup({ ids: [id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
      }
    });
  };
  const add = () => {
    modalRef.current && modalRef.current.show();
  };
  const importData = () => {};
  const exportData = () => {
    manageGroupExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '管理分类维护');
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="code">
          <Input
            placeholder="请输入code值"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="请输入名称"
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
              ) : null}
            </>
          );
        })}
      </div>
      {renderForm()}
      <Table
        columns={manageGroupColumns}
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
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
    </>
  );
};
export default ManageGroup;
