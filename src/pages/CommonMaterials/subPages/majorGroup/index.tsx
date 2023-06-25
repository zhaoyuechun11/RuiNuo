import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import { Form, Input, message } from 'antd';
import { downLoad } from '@/utils';
import { deleteMajorGroup, majorGroupExport } from '../../models/server';
import styles from './index.less';
import EditOrAddModal from './components/editOrAddModal';
import BindModal from './components/bindModal';
const MajorGroup = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state) => state.loading.global);
  const modalRef = useRef();
  const searchVal = useRef();
  const bindRef = useRef();
  const [list, setList] = useState([]);
  const columns = [
    {
      title: '条码号内容(01样本条码，02病理编号)',
      dataIndex: 'barcodeContent',
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '分类编码',
      dataIndex: 'classCode',
      align: 'center',
      width: 150,
    },
    {
      title: '分类名称',
      dataIndex: 'className',
      align: 'center',
      width: 150,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      align: 'center',
      width: 150,
      render: (text) => {
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
      title: '创建者id',
      dataIndex: 'createBy',
      align: 'center',
      width: 150,
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      align: 'center',
      width: 150,
    },
    {
      title: '是否自动生成预制样本号',
      dataIndex: 'isAutoSampleId',
      align: 'center',
      width: 180,
    },
    {
      title: '创建者id',
      dataIndex: 'createBy',
      align: 'center',
      width: 150,
    },
    {
      title: '是否打印样本条码',
      dataIndex: 'isPrintBarcode',
      align: 'center',
      width: 150,
    },
    {
      title: '样本号用作样本条码号',
      dataIndex: 'isSampleIdAsBarcode',
      align: 'center',
      width: 180,
    },
    {
      title: '管理分类id',
      dataIndex: 'labClassManageId',
      align: 'center',
      width: 150,
    },
    {
      title: '管理分类名称',
      dataIndex: 'labClassManageName',
      align: 'center',
      width: 150,
    },
    {
      title: '实验室编码',
      dataIndex: 'labId',
      align: 'center',
      width: 150,
    },
    {
      title: '样本号重置规则',
      dataIndex: 'sampleIdResetRule',
      align: 'center',
      width: 150,
    },
    {
      title: '样本号生成规则',
      dataIndex: 'sampleIdRule',
      align: 'center',
      width: 150,
    },
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              修改
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                bindRef.current.show(record.id);
              }}
            >
              绑
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params) => {
      dispatch({
        type: 'commonMaterials/fetchMajorGroupList',
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
  const deleteCurrentItem = (id: any) => {
    deleteMajorGroup({ ids: [id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
      }
    });
  };
  const importData = () => {};
  const exportData = () => {
    majorGroupExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '专业分类维护');
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="code">
          <Input
            placeholder="请输入分类编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="请输入分类名称"
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
        <Button btnType="primary" onClick={add}>
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
        <Button btnType="primary" onClick={importData}>
          导入
        </Button>
        <Button btnType="primary" onClick={exportData}>
          导出
        </Button>
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
      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
      <BindModal Ref={bindRef} refresh={() => getList({ pageNum, pageSize })}></BindModal>
    </>
  );
};
export default MajorGroup;
