import React, {  useEffect, useRef, useState } from 'react';
import { Form,Table,Popconfirm,message ,Select} from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button } from '@/components';
import {
  dataGatherSetList,
  dataGatherSetDelete,
  getListForLabClass,
} from '../../../../models/server';
import styles from './index.less';
import AddOrEditModal from './components/addOrEditModal';


const { Option } = Select;
const RightContent = () => {
  const { dataMaintenance } = useSelector((state: any) => state.IndoorQualityControMsg);

  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [instrList, setInstrList] = useState([]);
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'dataMaintenance',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  useEffect(() => {
    if (dataMaintenance.labClassId) {
      getInstrListForLabClass({ labClassId: dataMaintenance.labClassId });
    }
  }, [dataMaintenance]);
  useEffect(() => {
    if (dataMaintenance?.instrId) {
      getList({
        pageNum,
        pageSize,
        instrId: dataMaintenance.instrId,
        [sort]: order,
      });
    }
  }, [pageNum, pageSize, dataMaintenance?.instrId, sort, order]);
  const columns = [
    {
      title: '质控品批号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '水平',
      dataIndex: 'instrCode',
      align: 'center',
    },
    {
      title: '仪器',
      dataIndex: 'sampleNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '项目代号',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '质控日期',
      dataIndex: 'qcLevelName',
      align: 'center',
    },
    {
      title: '结果标识次数',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '结果时间',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '显示结果',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '计算结果',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '在控标志',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '累积标志',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '画图标志',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '计算的SD值',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '机器原始结果',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '靶值ID',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '审核标志',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '最后修改时间',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '最后修改人',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '质控品ID',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '质控结果ID',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: any) => {
        return (
          <div className={styles.table_operate_box}>
            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认要删除该条数据么?"
              onConfirm={() => confirm(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const confirm = (id: any) => {
    dataGatherSetDelete({ ids: [id] }).then((res: any) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: dataMaintenance.instrId,
        });
      }
    });
  };
  const getList = (params: any) => {
    dataGatherSetList(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    modalRef.current.show();
  };
  const getInstrListForLabClass = (params: any) => {
    getListForLabClass(params).then((res: any) => {
      form.setFieldsValue({ instrId: res.data[0].id });
      setInstrList(res.data);
    });
  };

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    setSort(sorter.field + 'Desc');
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {};
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="instrId">
          <Select placeholder="请选择仪器" allowClear>
            {instrList?.map((item) => {
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
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            添加
          </Button>
        </div>
      </div>
      <Table
        onChange={onTableChange}
        dataSource={list}
        columns={columns}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        scroll={{ x: 'max-content' }}
      />

      <AddOrEditModal
        Ref={modalRef}
        refresh={() => {
          getList({
            pageNum,
            pageSize,
            instrId: dataMaintenance.instrId,
          });
        }}
      />
    </>
  );



 
};

export default RightContent;
