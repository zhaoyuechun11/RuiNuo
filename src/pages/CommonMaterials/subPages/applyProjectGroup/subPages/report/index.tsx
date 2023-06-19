import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import styles from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import {
  APItemReportBindsTranL,
  APItemReportBindsTranR,
  APItemReportBindsAdd,
  APItemReportBindsDel,
  labItemResultsList,
  labItemResultsUpdate,
} from '../../../../models/server';
import ReportAdd from '../components/reportAdd';
const ReportProject = ({ parent }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const [defaultValList, setDefaultValList] = useState([]);
  const loading = useSelector((state: any) => state.loading.global);
  const addModal = useRef();

  const [list, setList] = useState([]);
  const Columns = [
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '项目编码',
      dataIndex: 'labItemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'labItemName',
      sorter: true,
      align: 'center',
      // sorter: (a, b) => a.dictValue - b.dictValue,
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      align: 'center',
      render: (text, record) => {
        return (
          <Select
            placeholder="请选择默认值"
            autoComplete="off"
            allowClear
            value={text}
            onChange={(e) => defaultValChange(e, record)}
          >
            {defaultValList?.map((item) => {
              return (
                <Option value={item.resultFlag} key={item.resultFlag}>
                  {item.result}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <Button
            style={{ margin: 'auto' }}
            onClick={() => {
              deleteBind(record.id);
            }}
          >
            删除
          </Button>
        );
      },
    },
  ];

  const getList = useCallback(
    (params: any) => {
      dispatch({
        type: 'commonMaterials/fetchAPItemReport',
        payload: {
          ...params,
          callback: (res: ResponseData<{ list: RewardItem[]; count: number }>) => {
            if (res.code === 200) {
              setList(res.data.records);
              setTotal(res.data.total);
              if (res.data.records.length > 0) {
                getLabItemResultsList(res.data.records[0]?.labItemId);
              }
            }
          },
        },
      });
    },
    [dispatch, sort, order],
  );
  useEffect(() => {
    if (parent) {
      getList({ pageNum, pageSize, reqItemId: parent.id });
    }
  }, [pageNum, pageSize, parent]);

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
      reqItemId: parent.id,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    APItemReportBindsDel({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, reqItemId: parent.id });
      }
    });
  };
  const getLabItemResultsList = (val) => {
    labItemResultsList({ labItemId: val }).then((res) => {
      if (res.code === 200) {
        setDefaultValList(res.data);
      }
    });
  };
  const defaultValChange = (val, record) => {
    // debugger;
    labItemResultsUpdate({ id: record.id, defaultValue: val }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize, reqItemId: parent.id });
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <Form.Item name="code">
          <Input
            placeholder="请输入报告编码"
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
      <div className={styles.operateBtns}>
        <Button
          btnType="primary"
          onClick={() => {
            addModal.current.show();
          }}
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
      </div>
      {renderForm()}
      <Table
        columns={Columns}
        rowKey="id"
        // onSelectCount={(count, keys) => {
        //   setSelectedCount(count);
        //   setSelectedKeys(keys);
        // }}
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
      <ReportAdd
        Ref={addModal}
        title="报告项目"
        parent={parent}
        bindsListUrl={APItemReportBindsTranL}
        leftList={APItemReportBindsTranR}
        add={APItemReportBindsAdd}
        refresh={() => getList({ pageNum, pageSize, reqItemId: parent?.id })}
      ></ReportAdd>
    </>
  );
};
export default ReportProject;
