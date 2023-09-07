import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, Select, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
import styles from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
import { reportItemBindsDelete, reportUnitReqItemChange } from '../../../../models/server';
const { Option } = Select;
const ReportItems = ({ parent }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const addModal = useRef();
  const [list, setList] = useState([]);
  const confirmModalRef = useRef();
  const idRef = useRef();
  const Columns = [
    {
      title: '报告单元代号',
      dataIndex: 'reportUnitId',
      align: 'center',
    },
    {
      title: '申请项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      align: 'center',
      render: (text, record) => {
        return <Switch onChange={(e) => isEnabledChange(record.id)} checked={text} />;
      },
    },
    {
      title: '申请项目code',
      dataIndex: 'reqItemCode',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                deleteBind(record.id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  const isEnabledChange = (id) => {
    reportUnitReqItemChange({ id }).then((res) => {
      if (res.code === 200) {
        message.success('改变成功');
        getList({ pageNum, pageSize, reportUnitId: parent.id });
      }
    });
  };
  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchReportItemBindsList',
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
    if (parent) {
      getList({ pageNum, pageSize, reportUnitId: parent.id });
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
      reportUnitId: parent.id,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    reportItemBindsDelete({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize, reportUnitId: parent.id });
        confirmModalRef.current.hide();
        message.success('删除成功');
      }
    });
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <Form.Item name="code">
          <Input
            placeholder="申请项目代号"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name">
          <Input
            placeholder="申请项目名称"
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
      </div>

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
      <EditOrAddModal
        Ref={addModal}
        parent={parent}
        refresh={() => getList({ pageNum, pageSize, reportUnitId: parent?.id })}
      ></EditOrAddModal>
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
export default ReportItems;
