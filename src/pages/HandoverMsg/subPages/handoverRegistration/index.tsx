import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, Select, Table, DatePicker, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon } from '@/components';
import { downLoad } from '@/utils';
import {
  deliveryReceiptList,
  deliveryReceiptDelete,
  deliveryReceiptExport,
} from '../../models/server';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';

import moment from 'moment';
const { RangePicker } = DatePicker;
const processState = [
  {
    name: '未处理',
    id: 0,
  },
  {
    name: '处理中',
    id: 1,
  },
  {
    name: '处理完成',
    id: 2,
  },
  {
    name: '确认完成',
    id: 3,
  },
];
const { Option } = Select;
const HandoverRegistration = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const addOrEditRef = useRef();
  const searchVal = useRef();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      deliveryStartTime: [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')],
    });
    getList({
      pageNum,
      pageSize,
      [sort]: order,
      ...form.getFieldsValue(),
      deliveryStartTime: form.getFieldsValue()?.deliveryStartTime
        ? form.getFieldsValue().deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: form.getFieldsValue()?.deliveryStartTime
        ? form.getFieldsValue().deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    });
  }, [pageNum, pageSize, sort, order]);
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = {
      ...allValues,
      deliveryStartTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    const values = {
      pageNum,
      pageSize,
      ...allValues,
      deliveryStartTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    getList(values);
  };
  const getList = (params: any) => {
    deliveryReceiptList(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.records.map((item, index) => {
          return {
            index: index + 1,
            ...item,
          };
        });
        setList(result);
        setTotal(res.total);
      }
    });
  };
  const add = () => {
    addOrEditRef.current.show();
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (text) => {
        return (
          <span>
            {text === 0 ? (
              <Badge status="default" text="未处理" />
            ) : text === 1 ? (
              <Badge status="processing" text="处理中" />
            ) : text === 2 ? (
              <Badge status="success" text="已完成" />
            ) : (
              <Badge status="warning" text="已确认" />
            )}
          </span>
        );
      },
    },
    {
      title: '提交人',
      dataIndex: 'submitByName',
      key: 'submitByName',
      align: 'center',
    },
    {
      title: '提交部门',
      dataIndex: 'submitDeptName',
      key: 'submitDeptName',
      align: 'center',
    },
    {
      title: '处理类型',
      dataIndex: 'problemTypeName',
      key: 'problemTypeName',
      align: 'center',
    },
    {
      title: '处理部门',
      dataIndex: 'solveDeptName',
      key: 'solveDeptName',
      align: 'center',
    },
    {
      title: '条码',
      dataIndex: 'receiveBarcode',
      key: 'receiveBarcode',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      align: 'center',
    },
    {
      title: '交接内容',
      dataIndex: 'submitContent',
      key: 'submitContent',
      align: 'center',
      width: 150,
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '反馈内容',
      dataIndex: 'solveContent',
      key: 'solveContent',
      width: 150,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理人',
      dataIndex: 'solveByName',
      key: 'solveByName',
      align: 'center',
    },
    {
      title: '处理开始时间',
      dataIndex: 'solveTime',
      key: 'solveTime',
      align: 'center',
      sorter: true,
    },
    {
      title: '处理结束时间',
      dataIndex: 'doneTime',
      key: 'doneTime',
      align: 'center',
      sorter: true,
    },
    {
      title: '抄送部门1',
      dataIndex: 'copyTo1Name',
      key: 'copyTo1Name',
      align: 'center',
    },
    {
      title: '抄送部门2',
      dataIndex: 'copyTo2Name',
      key: 'copyTo2Name',
      align: 'center',
    },
    {
      title: '抄送部门3',
      dataIndex: 'copyTo3Name',
      key: 'copyTo3Name',
      align: 'center',
    },
    {
      title: '紧急',
      dataIndex: 'isEmer',
      key: 'isEmer',
      align: 'center',
      render: (text: any) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '追加人',
      align: 'center',
      dataIndex: 'appendByName',
      key: 'appendByName',
    },
    {
      title: '确认人',
      align: 'center',
      dataIndex: 'confirmByName',
      key: 'confirmByName',
    },
    {
      title: '确认时间',
      align: 'center',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      sorter: true,
    },
    {
      title: '提交时间',
      align: 'center',
      dataIndex: 'submitTime',
      key: 'submitTime',
      sorter: true,
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishTime',
      key: 'finishTime',
      sorter: true,
    },
    {
      title: '操作',
      sorter: true,
      fixed: 'right',
      render: (record: any) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button
              onClick={() => {
                if (record.status !== 0) {
                  message.warning('只有未处理的可修改哦!');
                  return;
                }
                addOrEditRef.current.show(record);
              }}
            >
              修改
            </Button>

            <Button
              onClick={() => {
                deleteCurrentItem(record);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  const deleteCurrentItem = (record: any) => {
    if (record.status !== 0) {
      message.warning('只有未处理的可修改哦!');
      return;
    }
    deliveryReceiptDelete({ ids: [record.id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({ pageNum, pageSize });
      }
    });
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="deliveryStartTime">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        <Form.Item name="barcodeContent">
          <Input
            placeholder="请输入条码或内容"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="请选择处理状态" allowClear>
            {processState.length > 0 &&
              processState.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    setPageSize(pageSize);
  };
  const exportData = () => {
    deliveryReceiptExport({ ...searchVal.current, [sort]: order }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '交接管理登记');
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
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>

          <Button btnType="primary" onClick={exportData}>
            导出
          </Button>
        </div>
      </div>
      <Table
        dataSource={list}
        columns={columns}
        onChange={onTableChange}
        scroll={{ x: 'max-content' }}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />
      <EditOrAddModal Ref={addOrEditRef} refresh={() => getList({ pageNum, pageSize })} />
    </>
  );
};
export default HandoverRegistration;
