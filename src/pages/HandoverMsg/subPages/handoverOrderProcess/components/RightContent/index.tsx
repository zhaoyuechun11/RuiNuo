import React, { Component, useState } from 'react';
import { useSelector } from 'umi';
import { Button, Icon } from '@/components';
import styles from './index.less';
import { Switch, Form, Input, Select, Dropdown, Menu, Tooltip, Table, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const getValue = (obj) =>
  Object.keys(obj)
    .map((key) => obj[key])
    .join(',');
const memberlistData = [
  {
    id: 817,
    name: '123',
    department: [
      '\u5ba2\u670d\u90e8',
      '\u8d22\u52a1\u90e8',
      '\u6280\u672f\u90e8',
      '\u9500\u552e\u4e8c\u7ec4',
    ],
    position: '\u5c0f\u8001\u677f',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 1,
    operator_id: '010468461120243427',
    use_name: '123',
    roles: [
      {
        name: '\u7528\u4eba\u7ecf\u7406',
        type: 4,
        pivot: {
          assignee_id: 817,
          role_id: 29921,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 818,
    name: '\u98ce\u884c',
    department: [],
    position: '',
    is_dismiss: 2,
    is_auth: 1,
    is_use: 2,
    is_admin: 3,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '263964061247550',
    use_name: '\u98ce\u884c1',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 818,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 819,
    name: '\u9a6c\u68a6\u6708',
    department: ['Joy\u7ec4'],
    position: 'php',
    is_dismiss: 2,
    is_auth: 2,
    is_use: 1,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '1121493352101821295',
    use_name: '',
    roles: [
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 819,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 820,
    name: '\u5e08\u592a',
    department: ['\u884c\u653f\u90e8'],
    position: '\u4e2d\u8001\u677f',
    is_dismiss: 2,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '035453314821501266',
    use_name: '',
    roles: [
      {
        name: '\u7528\u4eba\u7ecf\u7406',
        type: 4,
        pivot: {
          assignee_id: 820,
          role_id: 29921,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 823,
    name: '\u738b\u5149\u660e',
    department: ['\u51af\u5c9a\u7ec4', '\u884c\u653f\u90e8'],
    position: 'CEO',
    is_dismiss: 2,
    is_auth: 1,
    is_use: 2,
    is_admin: 3,
    bind_phone: '',
    email: '',
    is_login: 1,
    operator_id: '131209301529096624',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 823,
          role_id: 172,
        },
      },
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 823,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 825,
    name: '\u5f90\u946b\u946b',
    department: ['\u884c\u653f\u4e00\u90e8'],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '013860192124725744',
    use_name: '',
    roles: [
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 825,
          role_id: 174,
        },
      },
      {
        name: '\u7528\u4eba\u7ecf\u7406',
        type: 4,
        pivot: {
          assignee_id: 825,
          role_id: 29921,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 826,
    name: '\u4e8e\u6d2a\u94a7',
    department: [],
    position: 'CEO',
    is_dismiss: 2,
    is_auth: 2,
    is_use: 1,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 1,
    operator_id: '034531106320230091',
    use_name: '',
    roles: [
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 826,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 827,
    name: '\u6731\u68ee',
    department: ['Joy\u7ec4'],
    position: 'CFO',
    is_dismiss: 2,
    is_auth: 1,
    is_use: 2,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 1,
    operator_id: '1215594700845789',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 827,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 828,
    name: '\u6d4b\u8bd52',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '50150644639181',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 828,
          role_id: 172,
        },
      },
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 828,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 830,
    name: '\u6d4b\u8bd54',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '154657113226621130',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 830,
          role_id: 172,
        },
      },
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 830,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 834,
    name: '\u8212\u6653\u73b2',
    department: [],
    position: 'OOF',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '115124566732841041',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 834,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 837,
    name: '\u6d4b\u8bd57',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '081416152721753733',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 837,
          role_id: 172,
        },
      },
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 837,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 838,
    name: '\u6234\u660e\u6d01',
    department: ['\u7ea2\u831c\u7ec4'],
    position: 'OOF',
    is_dismiss: 2,
    is_auth: 1,
    is_use: 1,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '086363492924997351',
    use_name: '',
    roles: [
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 838,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 840,
    name: '\u9ec4\u747e',
    department: [],
    position: 'WEB\u524d\u7aef',
    is_dismiss: 2,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '03453864161289786',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 840,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 841,
    name: '\u6d4b\u8bd58',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '12155827061174367',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 841,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 842,
    name: '\u6d4b\u8bd59',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '116762434126380915',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 842,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 844,
    name: '\u77f3\u5c0f\u53ef',
    department: [],
    position: 'UI\u8bbe\u8ba1\u5e08',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '084728412630261491',
    use_name: '',
    roles: [
      {
        name: '\u7528\u4eba\u7ecf\u7406',
        type: 4,
        pivot: {
          assignee_id: 844,
          role_id: 29921,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 846,
    name: '\u6d4b\u8bd510',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '1314124754674653',
    use_name: '',
    roles: [
      {
        name: '\u7ba1\u7406\u5458',
        type: 1,
        pivot: {
          assignee_id: 846,
          role_id: 172,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 851,
    name: '\u6d4b\u8bd52123',
    department: ['\u6280\u672f\u90e8'],
    position: '\u6253\u94c1\u5320',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 1,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '042144364232082282',
    use_name: '\u6d4b\u8bd52123',
    roles: [
      {
        name: 'HR',
        type: 2,
        pivot: {
          assignee_id: 851,
          role_id: 173,
        },
      },
      {
        name: '\u9762\u8bd5\u5b98',
        type: 3,
        pivot: {
          assignee_id: 851,
          role_id: 174,
        },
      },
    ],
    use_department_name: '',
  },
  {
    id: 852,
    name: '\u6d4b\u8bd512',
    department: [],
    position: '',
    is_dismiss: 1,
    is_auth: 2,
    is_use: 1,
    is_admin: 2,
    bind_phone: '',
    email: '',
    is_login: 2,
    operator_id: '175564502038150242',
    use_name: '',
    roles: [],
    use_department_name: '',
  },
];

const RightContent = () => {
  const loading = useSelector((state: any) => state.loading.global);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '处理状态',
      dataIndex: 'department',
      render: (text, record, index) => {
        return <div>{text || '--'}</div>;
      },
    },
    {
      title: '提交人',
      dataIndex: 'position',
    },
    {
      title: '提交部门',
      dataIndex: 'roles',
    },
    {
      title: '处理类型',
      dataIndex: 'roles',
    },
    {
      title: '处理部门',
      dataIndex: 'roles',
    },
    {
      title: '条码',
      dataIndex: 'roles',
    },
    {
      title: '姓名',
      dataIndex: 'roles',
    },
    {
      title: '送检单位',
      dataIndex: 'roles',
    },
    {
      title: '交接内容',
      dataIndex: 'roles',
    },
    {
      title: '反馈内容',
      dataIndex: 'roles',
    },
    {
      title: '处理人',
      dataIndex: 'roles',
    },
    {
      title: '处理开始时间',
      dataIndex: 'roles',
      sorter: true,
    },
    {
      title: '处理结束时间',
      dataIndex: 'roles',
      sorter: true,
    },
    {
      title: '抄送部门1',
      dataIndex: 'roles',
    },
    {
      title: '抄送部门2',
      dataIndex: 'roles',
    },
    {
      title: '抄送部门3',
      dataIndex: 'roles',
    },
    {
      title: '紧急',
      dataIndex: 'roles',
    },
    {
      title: '追加人',
      dataIndex: 'roles',
    },
    {
      title: '确认人',
      dataIndex: 'roles',
    },
    {
      title: '确认时间',
      dataIndex: 'roles',
      sorter: true,
    },
    {
      title: '提交时间',
      dataIndex: 'roles',
      sorter: true,
    },
    {
      title: '完成时间',
      dataIndex: 'roles',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',

      fixed: 'right',

      render: (text, record, index) => {},
    },
  ];
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    // getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="preReceiveDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['完成开始时间', '完成结束时间']}
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
      </Form>
    );
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary">导出</Button>
        </div>
      </div>
      <Table
        loading={loading}
        className={styles.tablePadding}
        rowClassName={styles.rowStyle}
        columns={columns}
        dataSource={[]}
        size="small"
        scroll={{ x: 'max-content' }}
      ></Table>
    </>
  );
};

export default RightContent;
