import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Confirm } from '@/components';
import styles from '../../index.less';
import s from '../../../index.less';
import { useDispatch, useSelector } from 'umi';
import EditOrAddModal from './components/editOrAddModal';
import { formulaDele } from '../../../../models/server';
const Formula = ({ parent, btnPermissions }) => {
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
      title: '检验仪器',
      dataIndex: 'instrName',
      align: 'center',
      width:180
    },
    {
      title: '项目代号',
      dataIndex: 'projectCode',
      align: 'center',
      width:200
    },
    {
      title: '计算公式',
      dataIndex: 'formula',
      align: 'center',
      width:450
    },

    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={s.action_btn}>
            {btnPermissions.map((item) => {
              return item.mark === 'formulaDelete' ? (
                <Button
                  onClick={() => {
                    deleteBind(record.id);
                  }}
                >
                  删除
                </Button>
              ) : item.mark === 'formulaEdit' ? (
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
      type: 'commonMaterials/fetchFormulaList',
      payload: {
        ...params,
        callback: (res: any) => {
          if (res.code === 200) {
            const result = res.data.records.map((item: any) => {
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
  const deleteBind = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    formulaDele({ ids: [idRef.current] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, labItemId: parent.id });
        confirmModalRef.current.hide();
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
  return (
    <>
      <div className={styles.search_bth}>
        {btnPermissions.map((item) => {
          return (
            item.mark === 'formulaAdd' && (
              <div className={styles.operateBtns}>
                <Button btnType="primary" onClick={add}>
                  计算向导...
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
export default Formula;
