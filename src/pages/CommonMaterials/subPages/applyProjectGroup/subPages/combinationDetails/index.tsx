import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
import styles from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import ComDetailsAdd from '../components/comDetailsAdd';
import { applyProjectItemByCompBindDe } from '../../../../models/server';
const CombinationDetails = ({ parent, btnPermissions }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
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
      title: '编码',
      dataIndex: 'reqItemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
    },
    {
      title: '缩写',
      dataIndex: 'shortName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return btnPermissions.map((item) => {
          return (
            item.mark === 'combinationDetailsDelete' && (
              <Button
                style={{ margin: 'auto' }}
                onClick={() => {
                  deleteCurrentItem(record.id);
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
        type: 'commonMaterials/fetchAPItemBindComposition',
        payload: {
          ...params,
          callback: (res: ResponseData<{ list: RewardItem[]; count: number }>) => {
            if (res.code === 200) {
              setList(res.data.records);
              setTotal(res.data.total);
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
  const deleteCurrentItem = (id) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    applyProjectItemByCompBindDe({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, reqItemId: parent.id });
        confirmModalRef.current.hide();
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <Form.Item name="code">
          <Input
            placeholder="请输入项目编号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="请输入项目名称"
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
          item.mark === 'combinationDetailsAdd' && (
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
      <ComDetailsAdd
        Ref={addModal}
        title="组合明细"
        parent={parent}
        refresh={() => getList({ pageNum, pageSize, reqItemId: parent?.id })}
      ></ComDetailsAdd>
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
export default CombinationDetails;
