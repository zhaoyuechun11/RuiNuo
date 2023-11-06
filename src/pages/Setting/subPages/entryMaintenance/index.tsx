import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { Button, Icon, Table } from '@/components';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';
import { useDispatch, useSelector } from 'umi';
import { dictList } from '@/models/server';
import EditOrAddModal from './components/editOrAddModal';
const FormItem = Form.Item;
const { Option } = Select;
const EntryMaintenance = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const modalRef = useRef();
  const [list, setList] = useState([]);
  const [entryTypeList, setEntryTypeList] = useState([]);
  const Columns = [
    {
      title: '词条编码',
      dataIndex: 'entryId',
      sorter: (a, b) => a.entryId - b.entryId,
      align: 'center',
      width: 100,
    },
    {
      title: '词条类别',
      dataIndex: 'entryTypeValue',
      align: 'center',
      width: 100,
    },
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.seq - b.seq,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 100,
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      align: 'center',
      width: 100,
      render: (text: boolean | undefined, record: { id: any }) => {
        return (
          <Switch
            checked={text}
            onChange={() => {
              dispatch({
                type: 'Setting/fetchWordEntryChange',
                payload: {
                  id: record.id,
                  callback: (res: { code: number }) => {
                    if (res.code === 200) {
                      getList({ pageNum, pageSize });
                    }
                  },
                },
              });
            }}
          />
        );
      },
    },
    {
      title: '词条内容',
      dataIndex: 'wordContent',
      align: 'center',
      width: 200,
      render: (text) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (record: { id: any }) => {
        return (
          <div className={styles.tabale_operate_box}>
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
              style={{ margin: '0 4px' }}
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
      type: 'Setting/fetchWordEntry',
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
    getDictList();
  }, []);
  const deleteTemplate = (id: any) => {
    dispatch({
      type: 'Setting/fetchWordEntryDelete',
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
  const getDictList = () => {
    dictList({ type: 'SE' }).then((res) => {
      if (res.code === 200) {
        setEntryTypeList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <FormItem name="key">
          <Input
            placeholder="请输入关键字"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <FormItem name="entryType" label="词条类别">
          <Select placeholder="请选择词条类别" allowClear>
            {entryTypeList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
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
        scroll={{ x: 500 }}
      />
      <EditOrAddModal Ref={modalRef} refresh={() => getList({ pageNum, pageSize })} />
    </>
  );
};
export default EntryMaintenance;
