import React, { useState, useEffect } from 'react';
import { useSelector } from 'umi';
import { Icon } from '@/components';
import { Form, Input, Table, DatePicker, Select } from 'antd';

import moment from 'moment';
import { instrList } from '@/models/server';
import { qcDataQueryList, getQcListForLabClas } from '../../models/server';
import styles from './index.less';
const { Option } = Select;
const accumulateFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '累计',
  },
  {
    id: 0,
    name: '累计',
  },
];
const drawDesignsFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '画图',
  },
  {
    id: 0,
    name: '不画图',
  },
];
const auditFlag = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '已审核',
  },
  {
    id: 0,
    name: '未审核',
  },
];
const controlStatus = [
  {
    id: '',
    name: '全部',
  },
  {
    id: 1,
    name: '在空',
  },
  {
    id: 0,
    name: '失控',
  },
  {
    id: 2,
    name: '未判定',
  },
];
const { RangePicker } = DatePicker;
const QCDataQuery = () => {
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state) => state.loading.global);
  const [list, setList] = useState([]);
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
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
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
    },
    {
      title: '计算结果',
      dataIndex: 'calculateValue',
      align: 'center',
    },
    {
      title: '计算的SD值',
      dataIndex: 'calculateSd',
      align: 'center',
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
      title: '累计标志',
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
        return text ? '是' : '否';
      },
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
      title: '靶值启用日期',
      dataIndex: 'outControlTips',
      align: 'center',
    },
    {
      title: '基准靶值',
      dataIndex: 'tagValue',
      align: 'center',
    },
    {
      title: '基准SD值',
      dataIndex: 'sd',
      align: 'center',
    },
    {
      title: '失控提示',
      dataIndex: 'outControlTips',
      align: 'center',
    },
    {
      title: '失控原因',
      dataIndex: 'outControlReason',
      align: 'center',
    },
    {
      title: '失控处理',
      dataIndex: 'outControlOperation',
      align: 'center',
    },
    {
      title: '处理结果',
      dataIndex: 'outControlResult',
      align: 'center',
    },
    {
      title: '处理人',
      dataIndex: 'outControlUser',
      align: 'center',
    },
    {
      title: '处理时间',
      dataIndex: 'outControlOperateDt',
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'checkDt',
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      align: 'center',
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
      title: '备注',
      dataIndex: 'comments',
      align: 'center',
    },
    {
      title: '机器原始结果',
      dataIndex: 'originalValue',
      align: 'center',
    },
    {
      title: '结果标识',
      dataIndex: 'qcValueSign',
      align: 'center',
    },
    {
      title: '质控品名称',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '质控品ID',
      dataIndex: 'qcId',
      align: 'center',
    },
  ];

  const getList = (params: any) => {
    qcDataQueryList(params).then((res) => {
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
      qcDateStart: [moment(now1, 'YYYY-MM-DD'), moment(now1, 'YYYY-MM-DD')],
      inuseFlag: accumulateFlag[0].id,
      drawFlag: drawDesignsFlag[0].id,
      checkFlag: auditFlag[0].id,
      controlStatus: controlStatus[0].id,
    });
    getInstrList();
  }, []);
  useEffect(() => {
    getList({
      pageNum,
      pageSize,
      qcDateStart: form.getFieldsValue()?.qcDateStart
        ? form.getFieldsValue().qcDateStart[0].format('YYYY-MM-DD')
        : '',
      qcDateStartEnd: form.getFieldsValue()?.qcDateStart
        ? form.getFieldsValue().qcDateStart[1].format('YYYY-MM-DD')
        : '',
      [sort]: order,
    });
  }, [pageNum, pageSize, sort, order]);
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
    debugger;
    let values = {
      pageNum,
      pageSize,
      ...allValues,
      qcDateStart: allValues?.qcDateStart ? allValues.qcDateStart[0].format('YYYY-MM-DD') : '',
      qcDateStartEnd: allValues?.qcDateStart ? allValues.qcDateStart[1].format('YYYY-MM-DD') : '',
    };
    if (allValues.qcLevel) {
      const result = qcList.filter((item) => item.id == allValues.qcLevel);

      getList({
        ...values,
        batchNo: result[0].batchNo,
        qcLevel: result[0].qcLevel,
        qcId: result[0].id,
      });
      return;
    }

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

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} form={form} layout="vertical" className={styles.form_box}>
        <Form.Item name="qcDateStart" label="质控日期">
          <RangePicker
            showTime={{ format: 'YYYY-MM-DD' }}
            format="YYYY-MM-DD"
            placeholder={['质控开始时间', '质控结束时间']}
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
        <Form.Item name="qcLevel" label="质控ID/质控品水平/质控品批号">
          <Select placeholder="请选择质控ID/质控品水平/质控品批号" allowClear>
            {qcList.length > 0 &&
              qcList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.id} {item.batchNo} {item.qcLevelName}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="inuseFlag" label="累积标志">
          <Select placeholder="请选择累积标志" allowClear>
            {accumulateFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="drawFlag" label="画图标志">
          <Select placeholder="请选择画图标志" allowClear>
            {drawDesignsFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="checkFlag" label="审核标志">
          <Select placeholder="请选择审核标志" allowClear>
            {auditFlag.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="controlStatus" label="失控标志">
          <Select placeholder="请选择失控标志" allowClear>
            {controlStatus.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
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
export default QCDataQuery;
