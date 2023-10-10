import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table } from '@/components';
import styles from '../index.less';
import { useDispatch, useSelector, history } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
const FormItem = Form.Item;
const ApplicationFormModel = ({ type = 1 }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const [list, setList] = useState([]);
  const modalRef = useRef();
  const Columns = [
    {
      title: '模块名',
      dataIndex: 'name',
      sorter: true,
      align: 'center',
    },
    {
      title: '是否是默认模块',
      dataIndex: 'isDefault',
      align: 'center',
      render: (text: boolean | undefined, record: { id: any }) => {
        return <Switch onChange={() => isDefaultChange(record.id)} checked={text} />;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.tabale_operate_box}>
            <Button
              onClick={() => {
                history.push(`/setting/sampleFieldCustom/${record.id}/${type}`);
              }}
            >
              明细
            </Button>
            <Button
              style={{ margin: '0 4px' }}
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              修改
            </Button>
            <Button
              onClick={() => {
                deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  const isDefaultChange = (id: any) => {
    dispatch({
      type:
        type === 1
          ? 'Setting/fetchMainEnterDefault'
          : type === 2
          ? 'Setting/updateReportDataDefault'
          : type === 3
          ? 'Setting/updateReportDataDetailDefault'
          : type === 5
          ? 'Setting/reportListDefaultUpdate'
          : 'Setting/reportListDefaultUpdate',
      payload: {
        id,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            message.success('修改成功');
            getList({ pageNum, pageSize });
          }
        },
      },
    });
  };
  const getList = (params: { pageNum: number; pageSize: number }) => {
    dispatch({
      type:
        type === 1
          ? 'Setting/fetchMainEnterPage'
          : type === 2
          ? 'Setting/reportMainDataPage'
          : type === 3
          ? 'Setting/reportMainDataDetailPage'
          : type === 5
          ? 'Setting/reportMainDataListPage'
          : 'Setting/reportMainDataListPage',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
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
  const deleteCurrentItem = (id: any) => {
    dispatch({
      type: 'Setting/fetchMainEnterPageDele',
      payload: {
        ids: [id],
        callback: (res: { code: number }) => {
          if (res.code === 200) {
            getList({ pageNum, pageSize });
            message.success('删除成功');
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
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <FormItem name="name">
          <Input
            placeholder="请输入模块名"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
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
      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize })}
        type={type}
      ></EditOrAddModal>
    </>
  );
};
export default ApplicationFormModel;
