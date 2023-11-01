import React, { useRef, useState } from 'react';
import { Form, Input, message, Tabs, Select, Table, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon } from '@/components';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';
const { RangePicker } = DatePicker;
const HandoverRegistration = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const addOrEditRef = useRef();
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    // getList(values);
  };
  const add = () => {
    addOrEditRef.current.show();
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '处理状态',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '提交人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '提交部门',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '处理类型',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '处理部门',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '条码',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '姓名',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '送检单位',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '交接内容',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '反馈内容',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '处理人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '处理开始时间',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
    },
    {
      title: '处理结束时间',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
    },
    {
      title: '抄送部门1',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '抄送部门2',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '抄送部门3',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '紧急',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '追加人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '确认人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '确认时间',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
    },
    {
      title: '提交时间',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
    },
    {
      title: '完成时间',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
      fixed: 'right',
    },
  ];
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="preReceiveDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        <Form.Item name="code">
          <Input
            placeholder="请输入条码或内容"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="labClassId">
          <Select placeholder="请选择处理状态" allowClear>
            {/* {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))} */}
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
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>

          <Button btnType="primary">导出</Button>
        </div>
      </div>
      <Table dataSource={[]} columns={columns} scroll={{ x: 'max-content' }} size="small" />;
      <EditOrAddModal Ref={addOrEditRef} />
    </>
  );
};
export default HandoverRegistration;
