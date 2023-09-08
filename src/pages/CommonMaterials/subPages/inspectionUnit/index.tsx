import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon } from '@/components';
import { Form, Input, message, Switch, Table } from 'antd';
import { downLoad, main, transformTree } from '@/utils';
import { deleteHospital, hospitalExport } from '../../models/server';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';
import BatchImport from '../../commones/batchImport';

const InspectionUnit = () => {
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
  const importRef = useRef();
  const [list, setList] = useState([]);
  const [btnPermissions, setBtnPermissions] = useState([]);
  const columns = [
    {
      title: '账期(天为单位)',
      dataIndex: 'accountPeriod',
      fixed: 'left',
      width: 120,
      align: 'center',
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      width: 150,
      align: 'center',
    },
    {
      title: '地区名称',
      dataIndex: 'areaName',
      width: 180,
      align: 'center',
    },
    {
      title: '开户行帐号',
      dataIndex: 'bankAccount',
      width: 150,
      align: 'center',
    },
    {
      title: '开户行',
      dataIndex: 'bankName',
      width: 150,
      align: 'center',
    },
    {
      title: '条形码长度',
      dataIndex: 'barcodeLen',
      width: 150,
      align: 'center',
    },
    {
      title: '条形码最大值',
      dataIndex: 'barcodeMax',
      width: 150,
      align: 'center',
    },
    {
      title: '收样条码打印前缀',
      dataIndex: 'barcodePreCode',
      width: 150,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contractMan',
      width: 150,
      align: 'center',
    },
    {
      title: '价格类别',
      dataIndex: 'feeTypeName',
      width: 150,
      align: 'center',
    },
    {
      title: '财务系统编码（U8等）',
      dataIndex: 'financeCode',
      width: 150,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '送检单位编码',
      dataIndex: 'hospitalCode',
      width: 150,
      align: 'center',
    },
    {
      title: '医院级别名称',
      dataIndex: 'hospitalLevelName',
      width: 150,
      align: 'center',
    },
    {
      title: '送检单位名称',
      dataIndex: 'hospitalName',
      width: 150,
      align: 'center',
    },
    {
      title: '送检单位类别',
      dataIndex: 'hospitalType',
      width: 150,
      align: 'center',
    },
    {
      title: '接口编码',
      dataIndex: 'interfaceCode',
      width: 150,
      align: 'center',
    },
    {
      title: '发票抬头',
      dataIndex: 'invoiceHead',
      width: 150,
      align: 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      width: 150,
      align: 'center',
      render: (text, record, index) => {
        return (
          <Switch
            checked={text}
            onChange={(checked) => {
              dispatch({
                type: 'commonMaterials/fetchHospitalIsDisable',
                payload: {
                  id: record.id,
                  callback: (res) => {
                    if (res.code === 200) {
                      getList({ pageNum, pageSize });
                    }
                  },
                },
              });
            }}
          />
        );
      },
    },
    {
      title: '价格默认扣率',
      dataIndex: 'priceRate',
      width: 150,
      align: 'center',
    },
    {
      title: '回款类型名称',
      dataIndex: 'returnTypeName',
      width: 150,
      align: 'center',
    },
    {
      title: '销售员名称',
      dataIndex: 'saleManName',
      width: 150,
      align: 'center',
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      width: 150,
      align: 'center',
    },
    {
      title: '税号',
      dataIndex: 'taxNo',
      width: 150,
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'telPhoneNo',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (text, record: any) => {
        return (
          <div className={styles.action_btn}>
            {btnPermissions.map((item, index) => {
              return (
                <div key={index}>
                  {item.mark === 'edit' ? (
                    <Button
                      onClick={() => {
                        modalRef.current.show(record);
                      }}
                    >
                      修改
                    </Button>
                  ) : item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 4px' }}
                      onClick={() => {
                        deleteCurrentItem(record.id);
                      }}
                    >
                      删除
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      },
    },
  ];

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchHospitalList',
      payload: {
        ...params,
        callback: (res: any) => {
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
  const deleteCurrentItem = (id) => {
    deleteHospital({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
      }
    });
  };
  const importData = () => {
    importRef.current?.show();
  };
  const exportData = () => {
    hospitalExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '运检单位维护');
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="code">
          <Input
            placeholder="请输入送检单位代号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="请输入送检单位名称"
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
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          {btnPermissions.map((item, index) => {
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
      </div>
      <Table
        size={'small'}
        columns={columns}
        scroll={{
          x: 1500,
        }}
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
      <BatchImport
        cRef={importRef}
        refresh={() => getList({ pageNum, pageSize })}
        actionUrl={`${process.env.baseURL}/basic/hospital/importHospital`}
        title={'运检单位'}
      ></BatchImport>
    </>
  );
};
export default InspectionUnit;
