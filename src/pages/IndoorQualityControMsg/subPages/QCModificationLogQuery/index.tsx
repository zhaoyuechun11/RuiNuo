import React, { useState, useEffect } from 'react';
import { useSelector } from 'umi';
import { Icon } from '@/components';
import { Form, Input, Table, DatePicker, Select } from 'antd';
import moment from 'moment';
import { instrList, getUserList } from '@/models/server';
import { modifyLogList, getQcListForLabClas } from '../../models/server';
import styles from './index.less';
const { Option } = Select;

const { RangePicker } = DatePicker;
const QCModificationLogQuery = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state) => state.loading.global);
  const [list, setList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [instr, setInstr] = useState([]);
  const [qcList, setQcList] = useState([]);
  const [form] = Form.useForm();
  var now1 = moment().format('YYYY-MM-DD');
  const columns = [
    {
      title: '仪器',
      dataIndex: 'instrCode',
      fixed: 'left',
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
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
      sorter: true,
    },
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
      sorter: true,
    },
    {
      title: '质控水平',
      dataIndex: 'qcLevelName',
      align: 'center',
      sorter: true,
    },
    {
      title: '结果标示',
      dataIndex: 'qcValueSign',
      align: 'center',
    },
    {
      title: '质控品名称',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      align: 'center',
      render: (text: any) => {
        return text === 'M' ? '修改' : text === 'D' ? '删除' : '';
      },
    },
    {
      title: '旧计算值',
      dataIndex: 'oldCalculateValue',
      align: 'center',
    },
    {
      title: '旧显示值',
      dataIndex: 'oldDisplayValue',
      align: 'center',
    },
    {
      title: '新计算值',
      dataIndex: 'newCalculateValue',
      align: 'center',
    },
    {
      title: '新显示值',
      dataIndex: 'newDisplayValue',
      align: 'center',
    },
    {
      title: '修改日期',
      dataIndex: 'modifyDt',
      align: 'center',
      sorter: true,
    },
    {
      title: '修改人',
      dataIndex: 'modifyUser',
      align: 'center',
    },
    {
      title: '修改原因',
      dataIndex: 'modifyReason',
      align: 'center',
    },
  ];

  const getList = (params: any) => {
    modifyLogList(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };
  const getQcList = (params: any) => {
    getQcListForLabClas(params).then((res) => {
      if (res.code === 200) {
        setQcList(res.data);
      }
    });
  };
  const instrChange = (e, option) => {
    getQcList({ labClassId: option.labClassId });
  };

  useEffect(() => {
    form.setFieldsValue({
      modifyDtStart: [moment(now1, 'YYYY-MM-DD'), moment(now1, 'YYYY-MM-DD')],
    });
    getInstrList();
    getUserListData();
  }, []);
  useEffect(() => {
    getList({
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      modifyDtStart: form.getFieldsValue()?.modifyDtStart
        ? form.getFieldsValue().modifyDtStart[0].format('YYYY-MM-DD')
        : '',
      modifyDtEnd: form.getFieldsValue()?.modifyDtStart
        ? form.getFieldsValue().modifyDtStart[1].format('YYYY-MM-DD')
        : '',
      [sort]: order,
    });
  }, [pageNum, pageSize, sort, order, instr]);
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
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
    setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    let values = {
      pageNum,
      pageSize,
      ...allValues,
      modifyDtStart: allValues?.modifyDtStart
        ? allValues.modifyDtStart[0].format('YYYY-MM-DD')
        : '',
      modifyDtEnd: allValues?.modifyDtStart ? allValues.modifyDtStart[1].format('YYYY-MM-DD') : '',
    };

    getList(values);
  };
  const getInstrList = () => {
    instrList().then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ instrId: res.data[0].id });
        getQcList({ labClassId: res.data[0].labClassId });
        setInstr(res.data);
      }
    });
  };

  const getUserListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} form={form} layout="vertical" className={styles.form_box}>
        <Form.Item name="modifyDtStart" label="修改日期">
          <RangePicker
            showTime={{ format: 'YYYY-MM-DD' }}
            format="YYYY-MM-DD"
            placeholder={['修改开始时间', '修改结束时间']}
          />
        </Form.Item>
        <Form.Item label="仪器" name="instrId">
          <Select placeholder="请选择仪器" allowClear onChange={instrChange}>
            {instr.map((item) => {
              return (
                <Option value={item.id} key={item.id} labClassId={item.labClassId}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="项目代号/名称">
          <Input
            placeholder="请输入项目代号/名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="qcId" label="质控ID/质控品水平/质控品批号">
          <Select placeholder="请选择质控ID/质控品水平/质控品批号" allowClear>
            {qcList.length > 0 &&
              qcList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.id} {item.batchNo} {item.qcLevelName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="modifyUser" label="修改人">
          <Select
            placeholder="请选择修改人"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {userList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="modifyReason" label="修改原因">
          <Input
            placeholder="请输入修改原因"
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
      {renderForm()}

      <Table
        size={'small'}
        columns={columns}
        onChange={onTableChange}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};
export default QCModificationLogQuery;
