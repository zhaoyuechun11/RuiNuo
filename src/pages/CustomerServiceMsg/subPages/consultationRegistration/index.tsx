import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, Tabs, Select, Table, DatePicker, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon } from '@/components';
import { downLoad } from '@/utils';
import {
  consultRegisterList,
  consultRegisterDelete,
  consultRegisterExport,
} from '../../models/server';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';
const { RangePicker } = DatePicker;
const consultationType = [
  {
    name: '电话咨询',
    id: 1,
  },
  {
    name: '微信QQ咨询',
    id: 2,
  },
  {
    name: '邮件咨询',
    id: 3,
  },
];
const completionStatus = [
  {
    name: '是',
    id: 1,
  },
  {
    name: '否',
    id: 0,
  },
];
const { Option } = Select;
const ConsultationRegistration = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const addOrEditRef = useRef();
  const searchVal = useRef();
  useEffect(() => {
    getList({ pageNum, pageSize, [sort]: order });
  }, [pageNum, pageSize, sort, order]);
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = {
      ...allValues,
      createDateStart: allValues?.createDateStart
        ? allValues.createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      createDateEnd: allValues?.createDateStart
        ? allValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    const values = {
      pageNum,
      pageSize,
      ...allValues,
      createDateStart: allValues?.createDateStart
        ? allValues.createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      createDateEnd: allValues?.createDateStart
        ? allValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    getList(values);
  };
  const getList = (params: any) => {
    consultRegisterList(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.records.map((item, index) => {
          return {
            index: index + 1,
            ...item,
          };
        });
        setList(result);
        setTotal(res.data.total);
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
      title: '咨询类型',
      dataIndex: 'consultType',
      key: 'consultType',
      sorter: true,
      align: 'center',
      render: (text) => {
        return <span>{text === 1 ? '电话咨询' : text === 2 ? ' 微信QQ咨询' : '邮件咨询'}</span>;
      },
    },
    {
      title: '地区',
      dataIndex: 'area',
      key: 'area',
      align: 'center',
    },
    {
      title: '来/去电日期',
      dataIndex: 'consultTime',
      key: 'consultTime',
      sorter: true,
      align: 'center',
    },
    {
      title: '来电人',
      dataIndex: 'callEr',
      key: 'callEr',
      align: 'center',
    },
    {
      title: '接电人',
      dataIndex: 'telRecipientName',
      key: 'telRecipientName',
      sorter: true,
      align: 'center',
    },
    {
      title: '咨询单位',
      dataIndex: 'consultHospitalName',
      key: 'consultHospitalName',
      sorter: true,
      align: 'center',
    },
    {
      title: '事项类型',
      dataIndex: 'eventTypeName',
      key: 'eventTypeName',
      sorter: true,
      align: 'center',
    },
    {
      title: '来/去电事由/咨询内容',
      dataIndex: 'consultContent',
      key: 'consultContent',
      align: 'center',
    },
    {
      title: '咨询结果',
      dataIndex: 'consultResult',
      key: 'consultResult',
      align: 'center',
    },
    {
      title: '是否完成',
      dataIndex: 'isFinished',
      key: 'isFinished',
      align: 'center',
      render: (text) => {
        return text == 0 ? '否' : '是';
      },
    },
    {
      title: '处理完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      align: 'center',
    },
    {
      title: '被咨询者',
      dataIndex: 'respondentName',
      key: 'respondentName',
      align: 'center',
    },
    {
      title: '所属部门',
      dataIndex: 'belongDeptName',
      key: 'belongDeptName',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      render: (record: any) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button
              onClick={() => {
                if (record.isFinished) {
                  message.warning('已完成的不可修改哦!');
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
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="createDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        <Form.Item name="key">
          <Input
            placeholder="请输入关键字"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="consultType">
          <Select placeholder="请选择咨询类型" allowClear>
            {consultationType.length > 0 &&
              consultationType.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="isFinished">
          <Select placeholder="请选择完成情况" allowClear>
            {completionStatus.length > 0 &&
              completionStatus.map((item) => (
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
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    if (sorter.field === 'consultHospitalName') {
      setSort('consultHospitalDesc');
    } else if (sorter.field === 'eventTypeName') {
      setSort('eventTypeDesc');
    } else if (sorter.field === 'telRecipientName') {
      setSort('telRecipientDesc');
    } else {
      setSort(sorter.field + 'Desc');
    }
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  const deleteCurrentItem = (record: any) => {
    if (record.isFinished) {
      message.warning('已完成不可删除哦!');
      return;
    }
    consultRegisterDelete({ ids: [record.id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({ pageNum, pageSize, [sort]: order });
      }
    });
  };
  const exportData = () => {
    consultRegisterExport({ ...searchVal.current, [sort]: order }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '咨询管理登记');
    });
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
export default ConsultationRegistration;
