import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spin, Form, Input, message, Switch } from 'antd';
import { useDispatch, useSelector, useParams } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, BackButton } from '@/components';
import { Table } from '@/common';
import { downLoad, transformTree, main } from '@/utils';
import { deleteBasic, basicDataExport } from '../../../models/server';
import styles from './index.less';
import EditOrAddModal from './components/editOrAddModal';
import BatchImport from '@/pages/CommonMaterials/commones/batchImport';

const FormItem = Form.Item;

export type RewardItem = {};

const Specimen = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // const [selectedCount, setSelectedCount] = useState(0); // 选中数量
  // const [selectedKeys, setSelectedKeys] = useState([]); // 选中的人员id列表
  const [statisticsList, setStatisticsList] = useState<RewardItem[]>([]);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const searchVal = useRef();
  const importRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const getList = useCallback(
    (param: any) => {
      dispatch({
        type: 'commonMaterials/fetchSecondPage',
        payload: {
          ...param,
          callback: (res: {
            code: number;
            data: {
              records: React.SetStateAction<RewardItem[]>;
              total: React.SetStateAction<number>;
            };
          }) => {
            if (res.code === 200) {
              setStatisticsList(res.data.records);
              setTotal(res.data.total);
            }
          },
        },
      });
    },
    [dispatch, sort, order],
  );

  useEffect(() => {
    getList({ pageNum, pageSize, parentId: Number(params.id) });
  }, [pageNum, pageSize]);
  useEffect(() => {
    const { btn } = main(transformTree(useDetail.permissions), '/commonMaterials/basicData');
    setBtnPermissions(btn);
  }, [useDetail]);

  const Columns = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典类别',
      dataIndex: 'dictType',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
      sorter: true,
      align: 'center',
    },
    {
      title: '英文',
      align: 'center',
      dataIndex: 'engValue',
    },
    {
      title: '对接编码',
      dataIndex: 'interfaceCode',
      align: 'center',
    },
    {
      title: '实验室ID',
      dataIndex: 'labId',
      align: 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      align: 'center',
      render: (text: boolean | undefined, record: { id: any }) => {
        return (
          <Switch
            checked={text}
            onChange={(checked) => {
              dispatch({
                type: 'commonMaterials/fetchIsDisable',
                payload: {
                  id: record.id,
                  callback: (res: { code: number }) => {
                    if (res.code === 200) {
                      getList({ pageNum, pageSize, parentId: Number(params.id) });
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
      title: '是否可以编辑',
      dataIndex: 'iseditable',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: RewardItem) => {
        return (
          <div style={{ display: 'flex' }}>
            {btnPermissions.map((item) => {
              return (
                <>
                  {item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        deleteBasicData(record);
                      }}
                    >
                      删除
                    </Button>
                  ) : item.mark === 'edit' ? (
                    <Button
                      onClick={() => {
                        modalRef.current &&
                          modalRef.current.show(record, 'edit', Number(params.id));
                      }}
                    >
                      修改
                    </Button>
                  ) : null}
                </>
              );
            })}
          </div>
        );
      },
    },
  ];

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    setSort(sorter.field);
  };
  const add = () => {
    modalRef.current && modalRef.current.show(null, null, Number(params.id));
  };
  const deleteBasicData = (record: { id?: any }) => {
    deleteBasic({ ids: [record.id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, parentId: Number(params.id) });
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    // const download_url = `${env.apiurl_web}/basic/dict/export?${stringify({
    //   parentId: Number(params.id),
    //   ...searchVal.current,
    // })}`;
    // window.open(download_url);
    basicDataExport({ ...searchVal.current, parentId: Number(params.id) }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '基础数据');
    });
  };
  const handleSelectRows = (rows) => {
    setSelectedRows(rows);
  };
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {};
  const handleSearch = (changedValues, allValues) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      parentId: Number(params.id),
      ...allValues,
    };
    getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <FormItem name="code">
          <Input
            placeholder="请输入字典编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <FormItem name="value">
          <Input
            placeholder="请输入字典值"
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
      <BackButton />
      <div className={styles.operateBtns}>
        {btnPermissions.map((item) => {
          return (
            <>
              {item.mark === 'add' ? (
                <Button btnType="primary" onClick={add}>
                  <PlusOutlined style={{ marginRight: 4 }} />
                  新增
                </Button>
              ) : item.mark === 'import' ? (
                <Button btnType="primary" onClick={importData}>
                  导入
                </Button>
              ) : item.mark === 'export' ? (
                <Button btnType="primary" onClick={exportData}>
                  导出
                </Button>
              ) : null}
            </>
          );
        })}
      </div>
      {renderForm()}
      {/* <Table
        columns={statisticsColumns}
        rowKey="id"
        // onSelectCount={(count, keys) => {
        //   setSelectedCount(count);
        //   setSelectedKeys(keys);
        // }}
        handleTableChange={onTableChange}
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={statisticsList}
      ></Table> */}
      <Table
        columns={Columns}
        unit="个"
        selectedRows={selectedRows}
        className={styles.tablePadding}
        rowClassName={styles.rowStyle}
        selectedRowKeys={selectedRows.map((i) => i.id)}
        data={{
          list: statisticsList,
          pagination: {
            total,
            current: pageNum,
            pageSize: pageSize,
          },
        }}
        locale={{
          emptyText: (
            <div style={{ padding: '190px 0 320px' }}>
              <img
                src={require('@assets/images/empty/table_empty.png')}
                alt=""
                width="115px"
                height="99px"
              />
              <div style={{ marginTop: '20px' }}>暂无数据</div>
            </div>
          ),
        }}
        // loading={this.props.positionLoading}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
        rowKey="id"
        isRowSelection={true}
      />
      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize, parentId: Number(params.id) })}
      ></EditOrAddModal>
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/basic/dict/importDict`}
        title={'数据字典'}
        refresh={() => getList({ pageNum, pageSize, parentId: Number(params.id) })}
      ></BatchImport>
    </>
  );
};

Specimen.defaultProps = {};

export default Specimen;
