import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
import { Form, Input, message, Tabs, Select, Switch } from 'antd';
import { downLoad, main, transformTree } from '@/utils';
import { applyProjectDelete, applyProjectExport, majorGroup } from '../../models/server';
import styles from '../index.less';
import UseHospital from './subPages/useHospital';
import CombinationDetails from './subPages/combinationDetails';
import Instrument from './subPages/instrument';
import ReportProject from './subPages/report';
import GuidePrice from './subPages/guidePrice';
import EditOrAddModal from './components/editOrAddModal';
import BatchImport from '../../commones/batchImport';
const { TabPane } = Tabs;
const ApplyProjectGroup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [sortedInfo, setSortedInfo] = useState({});
  const loading = useSelector((state) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const modalRef = useRef();
  const searchVal = useRef();
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const importRef = useRef();
  const [list, setList] = useState([]);
  const confirmModalRef = useRef();
  const idRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const columns = [
    {
      title: '项目类别',
      dataIndex: 'labClassName',
      fixed: 'left',
      align: 'center',
      key: 'labClassName',
      width: 150,
      sorter: (a, b) => a.labClassName.length - b.labClassName.length,
      sortOrder: sortedInfo.columnKey === 'labClassName' ? sortedInfo.order : null,
    },
    {
      title: '顺序',
      dataIndex: 'seq',
      align: 'center',
      width: 150,
    },
    {
      title: '物价编码',
      dataIndex: 'priceCode',
      align: 'center',
      width: 150,
      key: 'priceCode',
      sorter: (a, b) => a.priceCode?.length - b.priceCode?.length,
      sortOrder: sortedInfo.columnKey === 'priceCode' ? sortedInfo.order : null,
    },
    {
      title: '项目编码',
      dataIndex: 'reqItemCode',
      align: 'center',
      width: 150,
      key: 'reqItemCode',
      sorter: (a, b) => a.reqItemCode.length - b.reqItemCode.length,
      sortOrder: sortedInfo.columnKey === 'reqItemCode' ? sortedInfo.order : null,
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
      key: 'reqItemName',
      sorter: (a, b) => a.reqItemName.length - b.reqItemName.length,
      sortOrder: sortedInfo.columnKey === 'reqItemName' ? sortedInfo.order : null,
    },
    {
      title: '是否组合套餐',
      dataIndex: 'isCombo',
      align: 'center',
      width: 150,
    },
    {
      title: '组合组成描述',
      dataIndex: 'comboDescribe',
      align: 'center',
      width: 180,
    },
    {
      title: '缩写',
      dataIndex: 'shortName',
      align: 'center',
      width: 150,
    },
    {
      title: '默认样本类型',
      dataIndex: 'defaultSampleTypeName',
      align: 'center',
      width: 150,
      key: 'defaultSampleTypeName',
      sorter: (a, b) => a.defaultSampleTypeName.length - b.defaultSampleTypeName.length,
      sortOrder: sortedInfo.columnKey === 'defaultSampleTypeName' ? sortedInfo.order : null,
    },
    {
      title: '禁用',
      dataIndex: 'isDisable',
      align: 'center',
      width: 180,
      render: (text, record) => {
        return (
          <Switch
            checked={record.isDisable}
            onChange={(checked) => {
              dispatch({
                type: 'commonMaterials/fetchApplyProjectState',
                payload: {
                  id: record.id,
                  callback: (res) => {
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
      title: '外送',
      dataIndex: 'isOut',
      align: 'center',
      width: 150,
    },
    {
      title: '外送单位',
      dataIndex: 'outCompanyName',
      align: 'center',
      width: 150,
    },
    {
      title: '检测方法',
      dataIndex: 'method',
      align: 'center',
      width: 150,
    },
    {
      title: '报告周期',
      dataIndex: 'reportCycle',
      align: 'center',
      width: 150,
    },
    {
      title: '报告周期单位',
      dataIndex: 'reportCycleType',
      align: 'center',
      width: 150,
    },
    {
      title: '临床意义',
      dataIndex: 'significance',
      align: 'center',
      width: 100,
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
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {btnPermissions?.map((item) => {
              return (
                <>
                  {item.mark === 'edit' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        modalRef.current.show(record);
                      }}
                    >
                      修改
                    </Button>
                  ) : item.mark === 'delete' ? (
                    <Button
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        deleteCurrentItem(record.id);
                      }}
                    >
                      删除
                    </Button>
                  ) : null}
                </>
              );
            })}
            <Button
              onClick={() => {
                getCurrentItem(record);
              }}
            >
              明细
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params: any) => {
      dispatch({
        type: 'commonMaterials/fetchApplyProjectList',
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
    },
    [dispatch, sort],
  );
  useEffect(() => {
    getList({ pageNum, pageSize });
    majorGroupList();
  }, [pageNum, pageSize]);
  useEffect(() => {
    majorGroupList();
    const { btn } = main(transformTree(useDetail.permissions), location.pathname);
    setBtnPermissions(btn);
  }, []);

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    // setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    // setOrder(sorter);
    setSortedInfo(sorter);
    setSort(sorter.field);
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const add = () => {
    modalRef.current && modalRef.current.show();
  };
  const deleteCurrentItem = (id: any) => {
    idRef.current = id;
    confirmModalRef.current.show();
  };
  const handleConfirmOk = () => {
    applyProjectDelete({ ids: [idRef.current] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
        confirmModalRef.current.hide();
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    applyProjectExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '申请项目');
    });
  };
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const getCurrentItem = (val: React.SetStateAction<undefined>) => {
    setCurrentItem(val);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <div id="labClassId">
          <Form.Item name="labClassId">
            <Select
              placeholder="请选择项目类别"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('labClassId')}
            >
              {majorGroupData.length > 0 &&
                majorGroupData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="code">
          <Input
            placeholder="请输入项目编码"
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
      {btnPermissions?.map((item) => {
        return (
          <div className={styles.operateBtns}>
            {item.mark === 'add' ? (
              <Button btnType="primary" onClick={add}>
                <PlusOutlined style={{ marginRight: 4 }} />
                新增
              </Button>
            ) : item.mark === 'import' ? (
              <Button btnType="primary" onClick={importData} style={{ marginRight: 4 }}>
                导入
              </Button>
            ) : item.mark === 'export' ? (
              <Button btnType="primary" onClick={exportData} style={{ marginRight: 4 }}>
                导出
              </Button>
            ) : null}
          </div>
        );
      })}
      {renderForm()}
      <Table
        size={'small'}
        columns={columns}
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
        majorGroupData={majorGroupData}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/basic/reqItem/importReqItem`}
        title={'申请'}
        refresh={() => getList({ pageNum, pageSize })}
      ></BatchImport>
      <div>
        <span>项目编码:</span>
        {currentItem?.reqItemCode || list[0]?.reqItemCode}
        <span style={{ marginLeft: '20px' }}>项目名称:</span>
        {currentItem?.reqItemName || list[0]?.reqItemName}
      </div>
      <Tabs>
        <TabPane tab="使用医院" key="0">
          <UseHospital parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="组合明细" key="1">
          <CombinationDetails parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="仪器" key="2">
          <Instrument parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="报告项目" key="3">
          <ReportProject parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="基准价格" key="4">
          <GuidePrice parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
      </Tabs>
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
export default ApplyProjectGroup;
