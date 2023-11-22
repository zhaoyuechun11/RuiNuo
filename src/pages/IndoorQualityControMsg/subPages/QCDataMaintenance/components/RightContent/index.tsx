import React, { useEffect, useRef, useState } from 'react';
import { Form, Table, Popconfirm, message, Select, DatePicker, Input } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { Button } from '@/components';
import {
  dataMaintenanceList,
  dataMaintenanceDelete,
  getListForLabClass,
} from '../../../../models/server';
import styles from './index.less';
import AddOrEditModal from './components/addOrEditModal';
import moment from 'moment';

const { Option } = Select;
const RightContent = () => {
  const { dataMaintenance, dataMaintenanceInstr } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );

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
    // dispatch({
    //   type: 'IndoorQualityControMsg/save',
    //   payload: {
    //     type: 'dataMaintenance',
    //     dataSource: {
    //       ...dataMaintenance,
    //       labClassId: '',
    //     },
    //   },
    // });
  }, [location.pathname]);
  useEffect(() => {
    if (dataMaintenance.labClassId) {
      getInstrListForLabClass({ labClassId: dataMaintenance.labClassId });
    }
  }, [dataMaintenance.labClassId]);
  useEffect(() => {
    var now1 = moment().format('YYYY-MM');
    form.setFieldsValue({
      qcDate: moment(now1, 'YYYY-MM'),
    });
    if (dataMaintenanceInstr?.id && dataMaintenance.qcId) {
      getList({
        pageNum,
        pageSize,
        instrId: dataMaintenanceInstr.id,
        qcId: dataMaintenance.qcId,
        qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
        [sort]: order,
      });
    }
  }, [pageNum, pageSize, dataMaintenanceInstr.id, dataMaintenance.qcId, sort, order]);
  const columns = [
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
      fixed: 'left',
      sorter: true,
    },
    {
      title: '水平',
      dataIndex: 'qcLevelName',
      align: 'center',
      sorter: true,
    },
    {
      title: '仪器',
      dataIndex: 'instrCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '质控日期',
      dataIndex: 'qcDate',
      align: 'center',
      sorter: true,
    },
    {
      title: '结果标识次数',
      dataIndex: 'qcValueSign',
      align: 'center',
      sorter: true,
    },
    {
      title: '结果时间',
      dataIndex: 'resultDt',
      align: 'center',
      sorter: true,
    },
    {
      title: '显示结果',
      dataIndex: 'displayValue',
      align: 'center',
      sorter: true,
    },
    {
      title: '计算结果',
      dataIndex: 'calculateValue',
      align: 'center',
      sorter: true,
    },
    {
      title: '在控标志',
      dataIndex: 'controlStatus',
      align: 'center',
      sorter: true,
      render: (text: any) => {
        return text ? '在控' : '失控';
      },
    },
    {
      title: '累积标志',
      dataIndex: 'inuseFlag',
      align: 'center',
      render: (text: any) => {
        return text ? '采用' : '无效';
      },
    },
    {
      title: '画图标志',
      dataIndex: 'drawFlag',
      align: 'center',
      render: (text: any) => {
        console.log('text', text);
        return text ? '是' : '否';
      },
    },
    {
      title: '计算的SD值',
      dataIndex: 'calculateSd',
      align: 'center',
      sorter: true,
    },
    {
      title: '机器原始结果',
      dataIndex: 'originalValue',
      align: 'center',
      sorter: true,
    },
    {
      title: '靶值ID',
      dataIndex: 'qcItemValueId',
      align: 'center',
    },
    {
      title: '审核标志',
      dataIndex: 'checkFlag',
      align: 'center',
      render: (text: any) => {
        return text ? '审核' : '未审核';
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifyDt',
      align: 'center',
      sorter: true,
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifyUser',
      align: 'center',
      sorter: true,
    },
    {
      title: '质控品ID',
      dataIndex: 'qcId',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
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
    dataMaintenanceDelete({ ids: [id] }).then((res: any) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: dataMaintenanceInstr.id,
          qcId: dataMaintenance.qcId,
          qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
        });
      }
    });
  };
  const getList = (params: any) => {
    dataMaintenanceList(params).then((res: any) => {
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
      dispatch({
        type: 'IndoorQualityControMsg/save',
        payload: {
          type: 'dataMaintenanceInstr',
          dataSource: res.data[0],
        },
      });
    });
  };

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    if (sorter.field === 'instrCode') {
      setSort('instrIdDesc');
    } else if (sorter.field === 'itemCode') {
      setSort('itemIdDesc');
    } else if (sorter.field === 'batchNo') {
      setSort('qcIdDesc');
    } else if (sorter.field === 'qcLevelName') {
      setSort('qcLevelDesc');
    } else {
      setSort(sorter.field + 'Desc');
    }
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    if (allValues.instrId) {
      debugger;
      const result = instrList.filter((item) => item.id == allValues.instrId);
      dispatch({
        type: 'IndoorQualityControMsg/save',
        payload: {
          type: 'dataMaintenanceInstr',
          dataSource: result[0],
        },
      });
    }
    getList({
      pageNum,
      pageSize,
      instrId: allValues.instrId,
      qcId: dataMaintenance.qcId,
      name: allValues.name,
      qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
    });
  };

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
        <Form.Item name="qcDate">
          <DatePicker format="YYYY-MM" placeholder="请选择质控月份" />
        </Form.Item>
        <Form.Item name="name">
          <Input placeholder="请输入项目代号和名称" allowClear />
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
            instrId: dataMaintenanceInstr.id,
            qcId: dataMaintenance.qcId,
            qcDate: form.getFieldsValue().qcDate.format('YYYY-MM'),
          });
        }}
      />
    </>
  );
};

export default RightContent;
