import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { Button, Icon, Table } from '@/components';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';
import { useDispatch, useSelector, history } from 'umi';
import { reportUnitSelect } from '@/models/server';
import EditOrAddModal from './components/editOrAddModal';
const FormItem = Form.Item;
const { Option } = Select;
const BatchInputTemplate = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const modalRef = useRef();
  const [reportUnitList, setReportUnitList] = useState([]);
  const [list, setList] = useState([]);
  const Columns = [
    {
      title: '报告单元',
      dataIndex: 'reportUnitName',
      sorter: true,
      align: 'center',
    },
    {
      title: '输入模版名称',
      dataIndex: 'templateName',
      sorter: true,
      align: 'center',
    },
    {
      title: '输入代号',
      dataIndex: 'inputCode',
      sorter: true,
      align: 'center',
    },
    {
      title: '自动标志',
      dataIndex: 'autoFlag',
      align: 'center',
      render: (text) => {
        return <span>{text === 1 ? '自动' : '非自动'}</span>;
      },
    },
    {
      title: '自动输入起始号',
      dataIndex: 'startNo',
      align: 'center',
    },
    {
      title: '自动输入终止号',
      dataIndex: 'endNo',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button
              onClick={() => {
                dispatch({
                  type: 'Setting/save',
                  payload: {
                    type: 'reportTempleName',
                    dataSource: record.templateName,
                  },
                });
                history.push(`/Setting/batchInputTemplateDetail/${record.id}`);
              }}
            >
              明细
            </Button>
            <Button
              onClick={() => {
                modalRef.current && modalRef.current.show(record);
              }}
            >
              修改
            </Button>
            <Button
              onClick={() => {
                deleteTemplate(record.id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = (params: any) => {
    dispatch({
      type: 'Setting/fetchInputTemplate',
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
    getReportUnitSelect();
  }, []);
  const deleteTemplate = (id: any) => {
    dispatch({
      type: 'Setting/fetchInputTemplateDelete',
      payload: {
        ids: [id],
        callback: (res: any) => {
          if (res.code === 200) {
            getList({ pageNum, pageSize });
          }
        },
      },
    });
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    // setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    // setSort(sorter.field);
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues, allValues) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const getReportUnitSelect = () => {
    reportUnitSelect({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <FormItem name="key">
          <Input
            placeholder="请输入关键字"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <FormItem name="reportUnitId" label="报告单元">
          <Select placeholder="请选择报告单元" allowClear>
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      </Form>
    );
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button
            btnType="primary"
            onClick={() => {
              modalRef.current.show();
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
      </div>
      <Table
        size={'small'}
        columns={Columns}
        rowKey="id"
        handleTableChange={onTableChange}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      />
      <EditOrAddModal Ref={modalRef} refresh={() => getList({ pageNum, pageSize })} />
    </>
  );
};
export default BatchInputTemplate;
