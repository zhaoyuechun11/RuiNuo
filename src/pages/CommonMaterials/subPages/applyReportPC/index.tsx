import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector,useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Table, Confirm } from '@/components';
import { Form, Input, message, Tabs, Select } from 'antd';
import { downLoad, main,transformTree } from '@/utils';
import { reportProjectExport, majorGroup, reportProjectDelete } from '../../models/server';
import styles from '../index.less';
import EditOrAddModal from './components/editOrAddModal';
import BatchImport from '../../commones/batchImport';
import InstrChannelNum from './subPages/InstrChannelNum';
import ReferenceValue from './subPages/referenceValue';
import CriticalValue from './subPages/criticalValue';
import Formula from './subPages/formula';
import CommonResults from './subPages/commonResults';

const { TabPane } = Tabs;
const ApplyReportPC = () => {
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
  const confirmModalRef = useRef();
  const idRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const [list, setList] = useState([]);
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
      title: '编号',
      dataIndex: 'itemCode',
      align: 'center',
      width: 150,
      key: 'itemCode',
      sorter: (a, b) => a.itemCode.length - b.itemCode.length,
      sortOrder: sortedInfo.columnKey === 'itemCode' ? sortedInfo.order : null,
    },
    {
      title: '中文名称',
      dataIndex: 'itemName',
      align: 'center',
      width: 150,
      key: 'itemName',
      sorter: (a, b) => a.itemName.length - b.itemName.length,
      sortOrder: sortedInfo.columnKey === 'itemName' ? sortedInfo.order : null,
    },
    {
      title: '英文名称',
      dataIndex: 'enName',
      align: 'center',
      width: 150,
      key: 'enName',
      sorter: (a, b) => a.enName.length - b.enName.length,
      sortOrder: sortedInfo.columnKey === 'enName' ? sortedInfo.order : null,
    },
    {
      title: '缩写代号',
      dataIndex: 'shortName',
      align: 'center',
      width: 150,
      key: 'shortName',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      align: 'center',
      width: 150,
    },
    {
      title: '数值单位',
      dataIndex: 'unit',
      align: 'center',
      width: 180,
    },
    {
      title: '小数位',
      dataIndex: 'decimalPlaces',
      align: 'center',
      width: 150,
      render: (
        text:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactFragment
          | null
          | undefined,
      ) => {
        return <span>{text === 0 ? '保留原始值' : text}</span>;
      },
    },
    {
      title: '测试方法',
      dataIndex: 'method',
      align: 'center',
      width: 150,
    },
    {
      title: '临床意义',
      dataIndex: 'significance',
      align: 'center',
      width: 180,
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
      title: '其他编码1',
      dataIndex: 'extCode1',
      align: 'center',
      width: 150,
    },
    {
      title: '其他编码2',
      dataIndex: 'extCode2',
      align: 'center',
      width: 150,
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
        type: 'commonMaterials/fetchreRortProjectList',
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
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    reportProjectDelete({ ids: [idRef.current] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        confirmModalRef.current.hide();
        message.success('删除成功');
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    reportProjectExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '报告');
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
      {btnPermissions.map((item) => {
        return (
          <div className={styles.operateBtns}>
            {item.mark === 'add' ? (
              <Button btnType="primary" onClick={add} >
                <PlusOutlined style={{ marginRight: 4 }} />
                新增
              </Button>
            ) : item.mark === 'import' ? (
              <Button btnType="primary" onClick={importData} style={{ marginRight: 4 }} >
                导入
              </Button>
            ) : item.mark === 'export' ? (
              <Button btnType="primary" onClick={exportData} style={{ marginRight: 4 }} >
                导出
              </Button>
            ) : null}
          </div>
        );
      })}
      {renderForm()}
      <Table
        columns={columns}
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
        Ref={modalRef}
        majorGroupData={majorGroupData}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/basic/labItem/importLabItem`}
        title={'报告'}
        refresh={() => getList({ pageNum, pageSize })}
      ></BatchImport>
      <div style={{ marginBottom: '20px' }}>
        <span>项目类别:</span>
        {currentItem?.labClassName || list[0]?.labClassName}
        <span style={{ marginLeft: '20px' }}>项目编号:</span>
        {currentItem?.itemCode || list[0]?.itemCode}
      </div>
      <Tabs type="card">
        <TabPane tab="仪器通道号" key="0">
          <InstrChannelNum parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="参考值" key="1">
          <ReferenceValue parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="危机值" key="2">
          <CriticalValue parent={currentItem || list[0]}  btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="计算公式" key="3">
          <Formula parent={currentItem || list[0]}  btnPermissions={btnPermissions}  />
        </TabPane>
        <TabPane tab="常用结果" key="4">
          <CommonResults parent={currentItem || list[0]}  btnPermissions={btnPermissions} />
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
export default ApplyReportPC;
