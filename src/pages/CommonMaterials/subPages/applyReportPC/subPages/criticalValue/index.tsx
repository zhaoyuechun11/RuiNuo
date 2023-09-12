import React, { useEffect, useRef, useState } from 'react';
import { message, Checkbox, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Confirm } from '@/components';
import styles from '../../index.less';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
import { RPCriticalValueDele } from '../../../../models/server';
const CriticalValue = ({ parent, btnPermissions }) => {
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
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
      fixed: 'left',
      width: 40,
    },
    {
      title: '仪器',
      dataIndex: 'instrName',
      align: 'center',
      width: 110,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleTypeName',
      align: 'center',
      width: 100,
    },
    {
      title: '年龄从',
      dataIndex: 'ageFrom',
      align: 'center',
      width: 40,
    },
    {
      title: '年龄单位',
      dataIndex: 'ageFromUnitValue',
      align: 'center',
      width: 35,
    },
    {
      title: '年龄到',
      dataIndex: 'ageTo',
      align: 'center',
      width: 40,
    },
    {
      title: '年龄单位',
      dataIndex: 'ageToUnitValue',
      align: 'center',
      width: 35,
    },
    {
      title: '性别',
      dataIndex: 'sexValue',
      align: 'center',
      width: 40,
    },
    {
      title: '下限',
      dataIndex: 'lowValue',
      align: 'center',
      width: 100,
    },
    {
      title: '下限提示字符',
      dataIndex: 'lowChar',
      align: 'center',
      width: 50,
      // ellipsis: true,
    },
    {
      title: '上限',
      dataIndex: 'highValue',
      align: 'center',
      width: 100,
    },
    {
      title: '上限提示字符',
      dataIndex: 'highChar',
      align: 'center',
      width: 50,
      // ellipsis: true,
    },
    {
      title: '最近两次结果相隔天数',
      dataIndex: 'highValue',
      align: 'center',
      width: 100,
    },
    {
      title: '最近两次结果不可能的差值',
      dataIndex: 'highChar',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {btnPermissions?.map((item) => {
              return item.mark === 'criticalValueDelete' ? (
                <Button
                  onClick={() => {
                    deleteBind(record.id);
                  }}
                >
                  删除
                </Button>
              ) : item.mark === 'criticalValueEdit' ? (
                <Button
                  style={{ margin: '0 4px' }}
                  onClick={() => {
                    addModal.current.show(record, 'edit');
                  }}
                >
                  编辑
                </Button>
              ) : null;
            })}
          </div>
        );
      },
    },
  ];

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchRPCriticalValue',
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
      getList({ pageNum, pageSize, labItemId: parent.id, instrId });
    }
  }, [pageNum, pageSize, parent, instrId]);

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };

  const deleteBind = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    RPCriticalValueDele({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, labItemId: parent.id });
        confirmModalRef.current.hide();
      }
    });
  };

  return (
    <>
      <div className={styles.search_bth}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '80px' }}>参考值与:</div>
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={7}>
                <Checkbox value="A">性别有关</Checkbox>
              </Col>
              <Col span={7}>
                <Checkbox value="B">年龄有关</Checkbox>
              </Col>
              <Col span={10}>
                <Checkbox value="C">样本类型有关</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
        {btnPermissions?.map((item: any) => {
          return (
            item.mark === 'criticalValueAdd' && (
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
        scroll={{ x: 1300 }}
      />
      <EditOrAddModal
        Ref={addModal}
        parent={parent}
        refresh={() => getList({ pageNum, pageSize, labItemId: parent?.id })}
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
export default CriticalValue;
