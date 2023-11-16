import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, message, Table } from 'antd';
import { Button, Icon } from '@/components';
import { useDispatch, useSelector, history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { majorGroup, dictList } from '@/models/server';
import { downLoad, main, transformTree } from '@/utils';
import { QCDelete, QCExport } from '../../models/server';

import styles from './index.less';
import EditOrAddModal from './components/editOrAddModal';
const FormItem = Form.Item;
const { Option } = Select;
const useQcList = [
  {
    id: 'all',
    name: '全部',
  },
  {
    id: 'stop',
    name: '停用质控品',
  },
];
const reportFlag = [
  {
    id: 1,
    name: '是',
  },
  {
    id: 0,
    name: '否',
  },
];
const QualityControlProduct = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const [list, setList] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [QCLevel, setQCLevel] = useState([]);
  const modalRef = useRef();
  const [form] = Form.useForm();
  const searchVal = useRef();
  const Columns = [
    {
      title: '质控品ID',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '质控品名',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '专业类别',
      dataIndex: 'className',
      align: 'center',
    },
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '质控水平',
      dataIndex: 'qcLevelName',
      align: 'center',
    },
    {
      title: '启用日期',
      dataIndex: 'startDt',
      align: 'center',
      render: (text: any) => {
        return <span>{text.slice(0, 10)}</span>;
      },
    },
    {
      title: '有效期',
      dataIndex: 'exprieDt',
      align: 'center',
      render: (text: any) => {
        return <span>{text.slice(0, 10)}</span>;
      },
    },
    {
      title: '停用日期',
      dataIndex: 'stopDt',
      align: 'center',
      render: (text: any) => {
        return <span>{text.slice(0, 10)}</span>;
      },
    },
    {
      title: '生产厂家',
      align: 'center',
      dataIndex: 'manufacturerName',
    },
    {
      title: '供应商',
      align: 'center',
      dataIndex: 'venDonName',
    },
    {
      title: '停用者',
      align: 'center',
      dataIndex: 'stopUserName',
    },
    {
      title: '是否存在报告依据',
      align: 'center',
      dataIndex: 'checkReportFlag',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
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
            <Button onClick={() => deleteCurrentItem(record.id)}>删除</Button>
            <Button
              onClick={() => {
                history.push(`/indoorQualityControMsg/specimen/${record.id}/${record.classId}`);
              }}
            >
              适用项目
            </Button>
          </div>
        );
      },
    },
  ];
  const deleteCurrentItem = (id: any) => {
    QCDelete({ ids: [id] }).then((res: any) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({ pageNum, pageSize, ...form.getFieldsValue() });
      }
    });
  };
  const getList = (params: any) => {
    dispatch({
      type: 'indoorQualityControMsg/fetchQCList',
      payload: {
        ...params,
        callback: (res: any) => {
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
    majorGroupList();
    getDictList();
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
  const majorGroupList = () => {
    majorGroup({ userId: useDetail.id }).then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'QCLEVEL' }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setQCLevel(res.data);
        }
      },
    );
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box} form={form}>
        <Form.Item name="classId">
          <Select placeholder="请选择专业类别" allowClear>
            {majorGroupData.length > 0 &&
              majorGroupData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <FormItem name="batchNo">
          <Input
            placeholder="请输入质控品批号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <Form.Item name="qcLevel">
          <Select placeholder="请选择质控水平" allowClear>
            {QCLevel.length > 0 &&
              QCLevel.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="useQc">
          <Select placeholder="请选择在用质控品" allowClear>
            {useQcList.length > 0 &&
              useQcList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="checkReportFlag">
          <Select placeholder="请选择是否存在报告依据" allowClear>
            {reportFlag.length > 0 &&
              reportFlag.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const add = () => {
    modalRef.current.show();
  };
  const exportData = () => {
    QCExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '质控品');
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
        scroll={{ x: 'max-content' }}
      />
      <EditOrAddModal
        Ref={modalRef}
        majorGroupData={majorGroupData}
        QCLevel={QCLevel}
        reportFlag={reportFlag}
        refresh={() => getList({ pageNum, pageSize, ...form.getFieldsValue() })}
      />
    </>
  );
};
export default QualityControlProduct;
