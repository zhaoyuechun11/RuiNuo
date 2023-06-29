import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
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
const ReportProject = ({ parent, btnPermissions }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const [defaultValList, setDefaultValList] = useState([]);
  const loading = useSelector((state: any) => state.loading.global);
  const addModal = useRef();
  const confirmModalRef = useRef();
  const idRef = useRef();

  const [list, setList] = useState([]);
  const Columns = [
    {
      title: '顺序',
      dataIndex: 'id',
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
        return btnPermissions.map((item) => {
          return (
            item.mark === 'reportDelete' && (
              <Button
                style={{ margin: 'auto' }}
                onClick={() => {
                  deleteBind(record.id);
                }}
              >
                删除
              </Button>
            )
          );
        });
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
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    APItemReportBindsDel({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, reqItemId: parent.id });
        confirmModalRef.current.hide();
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
      {btnPermissions.map((item) => {
        return (
          item.mark === 'reportAdd' && (
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
          )
        );
      })}
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
      <Confirm
        confirmRef={confirmModalRef}
        img="commom/remind.png"
        imgStyle={{ width: 73 }}
        title="是否确认删除?"
        content="你正在删除该条数据, 删除后不能恢复"
        width={640}
        onOk={handleConfirmOk}
      />
    </>
  );
};
export default ReportProject;
