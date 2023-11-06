import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Icon } from '@/components';
import { useDispatch, useSelector, useLocation } from 'umi';
import { downLoad, main, transformTree } from '@/utils';
import EditOrAddModal from './components/editOrAddModal';
import styles from '../index.less';
import BatchImport from '../../commones/batchImport';
import {
  insUnitDiscountListExport,
  hospitalSelectList,
  insUnitDiscountDele,
  oneLevelTypeModalSel,
} from '../../models/server';
const { Option } = Select;
const insUnitDiscount = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const addModal = useRef();
  const [hospitalList, setHospitalList] = useState([]);
  const [list, setList] = useState([]);
  const [returnTypeList, setReturnTypeList] = useState([]);
  const importRef = useRef();
  const searchVal = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const Columns = [
    {
      title: '单位编码',
      dataIndex: 'hospitalCode',
      align: 'center',
      width: 150,
      fixed: 'left',
      key: 'hospitalCode',
      sorter: (a, b) => a.hospitalCode.length - b.hospitalCode.length,
    },
    {
      title: '送检单位名称',
      dataIndex: 'hospitalName',
      align: 'center',
      width: 150,
      key: 'hospitalName',
      sorter: (a, b) => a.hospitalName.length - b.hospitalName.length,
    },
    {
      title: '回款类别',
      dataIndex: 'returnTypeName',
      align: 'center',
      width: 150,
    },
    {
      title: '申请项目编码',
      dataIndex: 'reqItemCode',
      align: 'center',
      width: 150,
      key: 'reqItemCode',
      sorter: (a, b) => a.reqItemCode?.length - b.reqItemCode?.length,
    },
    {
      title: '申请项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
      key: 'reqItemName',
      sorter: (a, b) => a.reqItemName?.length - b.reqItemName?.length,
    },
    {
      title: '标准价格',
      dataIndex: 'standardPrice',
      align: 'center',
      width: 150,
    },
    {
      title: '销售报价',
      dataIndex: 'salePrice',
      align: 'center',
      width: 150,
    },
    {
      title: '销售报价扣率',
      dataIndex: 'saleRate',
      align: 'center',
      width: 150,
    },
    {
      title: '合同价格',
      dataIndex: 'contractPrice',
      align: 'center',
      width: 150,
    },
    {
      title: '合同扣率',
      dataIndex: 'contractRate',
      align: 'center',
      width: 150,
    },
    {
      title: '销售成本',
      dataIndex: 'saleCosts',
      align: 'center',
      width: 150,
    },
    {
      title: '销售成本扣率',
      dataIndex: 'saleRate',
      align: 'center',
      width: 150,
    },
    {
      title: '净额',
      dataIndex: 'netAmount',
      align: 'center',
      width: 150,
    },
    {
      title: '启用',
      dataIndex: 'isDisable',
      align: 'center',
      width: 150,
      render: (text) => {
        return text ? '启用' : '禁用';
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatEr',
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
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (record: { id: any }) => {
        return (
          <div className={styles.action_btn}>
            {btnPermissions.map((item) => {
              return (
                <>
                  {item.mark === 'delete' ? (
                    <Button
                      onClick={() => {
                        deleteBind(record.id);
                      }}
                    >
                      删除
                    </Button>
                  ) : item.mark === 'edit' ? (
                    <Button
                      style={{ margin: '0 4px' }}
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

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchInsUnitDiscountList',
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
    getHospitalList();
    getReturnTypeList();
    const { btn } = main(transformTree(useDetail.permissions), location.pathname);
    setBtnPermissions(btn);
  }, []);

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
    insUnitDiscountDele({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize });
      }
    });
  };
  const getHospitalList = () => {
    hospitalSelectList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    insUnitDiscountListExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '运检单位折扣');
    });
  };
  const getReturnTypeList = () => {
    oneLevelTypeModalSel({ type: 'PM' }).then((res) => {
      if (res.code === 200) {
        setReturnTypeList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="hospitalCode">
          <Input
            placeholder="请输入单位编号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="hospitalId">
          <Select
            placeholder="请选择单位名称"
            allowClear
            showSearch
            style={{ width: 224, height: 35 }}
          >
            {hospitalList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.hospitalName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="reqItemCode">
          <Input
            placeholder="请输入项目编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="reqItemName">
          <Input
            placeholder="请输入项目名称或缩写"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="returnTypeId">
          <Select placeholder="请选择回款类别" allowClear style={{ width: 224, height: 35 }}>
            {returnTypeList?.map((item) => {
              return (
                <Option value={item.id} key={item.id} className={styles.returnType}>
                  {item.dictValue}
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
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          {btnPermissions.map((item) => {
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
      </div>
      <Table
        size={'small'}
        columns={Columns}
        rowKey="id"
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
        actionUrl={`${process.env.baseURL}/basic/hospitalItemPrice/importHospitalItemPrice`}
        title={'运检单位折扣'}
        refresh={() => getList({ pageNum, pageSize })}
      ></BatchImport>
      <EditOrAddModal
        Ref={addModal}
        hospitalList={hospitalList}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
    </>
  );
};
export default insUnitDiscount;
