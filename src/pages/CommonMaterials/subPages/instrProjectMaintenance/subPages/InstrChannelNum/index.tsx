import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
import styles from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
import { RPInstrChannelNumDele } from '../../../../models/server';
const InstrChannelNum = ({ parent, btnPermissions }) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state: any) => state.loading.global);
  const { instrId } = useSelector((state: any) => state.commonMaterials);
  const addModal = useRef();
  const [list, setList] = useState([]);
  const confirmModalRef = useRef();
  const idRef = useRef();
  const Columns = [
    {
      title: '仪器',
      dataIndex: 'instrName',
      align: 'center',
      width: 200,
    },
    {
      title: '项目代号',
      dataIndex: 'projectCode',
      align: 'center',
    },
    {
      title: '通道号',
      dataIndex: 'interCode',
      align: 'center',
      width: 100,
    },
    {
      title: '禁用',
      dataIndex: 'isDisable',
      align: 'center',
      width: 100,
      render: (text) => {
        return <span>{text ? '禁用' : '启用'}</span>;
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      align: 'center',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'creatEr',
      align: 'center',
      width: 150,
    },
    // {
    //   title: '操作',
    //   align: 'center',
    //   render: (record: { id: any }) => {
    //     return (
    //       <div className={styles.action_btn}>
    //         <Button
    //           onClick={() => {
    //             deleteBind(record.id);
    //           }}
    //         >
    //           删除
    //         </Button>

    //         <Button
    //           style={{ margin: '0 4px' }}
    //           onClick={() => {
    //             addModal.current.show(record, 'edit');
    //           }}
    //         >
    //           编辑
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchreRPInstrChannelNum',
      payload: {
        ...params,
        callback: (res: any) => {
          if (res.code === 200) {
            const result = res.data.records.map((item) => {
              return {
                ...item,
                projectCode: parent.shortName,
              };
            });
            setList(result);
            setTotal(res.data.total);
          }
        },
      },
    });
  };

  useEffect(() => {
    if (parent) {
      getList({ pageNum, pageSize, labItemId: parent.id, instrId });
    }
  }, [pageNum, pageSize, parent, instrId]);

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues, allValues) => {
    const values = {
      pageNum,
      pageSize,
      labItemId: parent.id,
      ...allValues,
    };
    getList(values);
  };
  const deleteBind = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    RPInstrChannelNumDele({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize, labItemId: parent.id });
        confirmModalRef.current.hide();
        message.success('删除成功');
      }
    });
  };
  const add = () => {
    if (!instrId) {
      message.warning('请先选择仪器!');
      return;
    }
    addModal.current.show();
  };
  const renderForm = () => {
    return (
      <Form
        onValuesChange={handleSearch}
        layout="inline"
        className={styles.search_box}
        style={{ padding: '10px 0 10px 0' }}
      >
        <Form.Item name="code">
          <Input
            placeholder="请输入通道号"
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

        {/* <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div> */}
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
      />
      <EditOrAddModal
        Ref={addModal}
        parent={parent}
        refresh={() => getList({ pageNum, pageSize, labItemId: parent?.id, instrId })}
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
export default InstrChannelNum;
