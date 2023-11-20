import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, Checkbox, Table } from 'antd';
import { useDispatch, useSelector, useParams } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, BackButton } from '@/components';

import { transformTree, main } from '@/utils';
import { controlsItemDelete, QCItemList } from '../../../models/server';
import styles from '../index.less';
import Bind from './components/bind';
import Update from './components/update';
const FormItem = Form.Item;
export type RewardItem = {};
const Specimen = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const updateModalRef = useRef();
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const searchVal = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getList({ pageNum, pageSize, qcId: Number(params.id), ...form.getFieldsValue() });
  }, [pageNum, pageSize, params]);
  useEffect(() => {
    const { btn } = main(transformTree(useDetail.permissions), '/commonMaterials/basicData');
    setBtnPermissions(btn);
  }, [useDetail]);
  const getList = (param: any) => {
    QCItemList(param).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const Columns = [
    {
      title: '质控品id',
      dataIndex: 'qcId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '质控品名称',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '类别',
      align: 'center',
      dataIndex: 'className',
    },
    {
      title: '序号',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '报告依据',
      dataIndex: 'checkReportFlag',
      align: 'center',
      render: (text: boolean | undefined, record: { id: any }) => {
        return (
          <Checkbox
            checked={text}
            onChange={(checked) => {
              dispatch({
                type: 'indoorQualityControMsg/fetchControlsItemStatusChange',
                payload: {
                  id: record.id,
                  callback: (res: { code: number }) => {
                    if (res.code === 200) {
                      getList({
                        pageNum,
                        pageSize,
                        qcId: Number(params.id),
                        ...form.getFieldsValue(),
                      });
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
      title: '方法学',
      dataIndex: 'methodName',
      align: 'center',
    },
    {
      title: '试剂供应商',
      dataIndex: 'reagentVendorName',
      align: 'center',
    },
    {
      title: '试剂厂商',
      dataIndex: 'reagentManufacturerName',
      align: 'center',
    },
    {
      title: '允许最大误差',
      dataIndex: 'maxCv',
      align: 'center',
    },
    {
      title: '录入日期',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '录入操作者',
      dataIndex: 'createBy',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (record: RewardItem) => {
        return (
          <div style={{ display: 'flex' }}>
            {btnPermissions.map((item) => {
              return (
                <>
                  {item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 4px' }}
                      onClick={() => {
                        deleteCurrentItem(record);
                      }}
                    >
                      删除
                    </Button>
                  ) : item.mark === 'edit' ? (
                    <Button
                      onClick={() => {
                        updateModalRef.current.show(record);
                      }}
                    >
                      修改
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

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    modalRef.current && modalRef.current.show(Number(params.labClassId), Number(params.id));
  };
  const deleteCurrentItem = (record: { id?: any }) => {
    controlsItemDelete({ ids: [record.id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, qcId: Number(params.id), ...form.getFieldsValue() });
      }
    });
  };

  const handleSearch = (changedValues, allValues) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      qcId: Number(params.id),
      ...allValues,
    };
    getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box} form={form}>
        <FormItem name="name">
          <Input
            placeholder="请输入项目名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
      </Form>
    );
  };
  return (
    <>
      <BackButton />
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
      </div>
      <Table
        columns={Columns}
        rowKey="id"
        loading={loading}
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      ></Table>
      <Bind
        Ref={modalRef}
        refresh={() =>
          getList({ pageNum, pageSize, qcId: Number(params.id), ...form.getFieldsValue() })
        }
      ></Bind>
      <Update
        Ref={updateModalRef}
        refresh={() =>
          getList({ pageNum, pageSize, qcId: Number(params.id), ...form.getFieldsValue() })
        }
      ></Update>
    </>
  );
};

Specimen.defaultProps = {};

export default Specimen;
