import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, Confirm } from '@/components';
import { Form, Input, message, Tabs, Select, Table } from 'antd';
import { downLoad, main, transformTree } from '@/utils';
import {
  majorGroup,
  transferInstrList,
  instrReqItemDelete,
  instrReqItemExport,
} from '../../models/server';
import styles from '../index.less';
import s from './index.less';
import BatchImport from '../../commones/batchImport';
import InstrChannelNum from './subPages/InstrChannelNum';
import ReferenceValue from './subPages/referenceValue';
import CriticalValue from './subPages/criticalValue';
import Formula from './subPages/formula';
import CommonResults from './subPages/commonResults';
import Bind from './components/bind';
import Update from './components/update';

const { TabPane } = Tabs;
const InstrProjectMaintenance = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const { instrList, instrId, majorGroupId, selectInstrName } = useSelector(
    (state: any) => state.commonMaterials,
  );
  const modalRef = useRef();
  const updateModalRef = useRef();
  const searchVal = useRef();
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const importRef = useRef();
  const confirmModalRef = useRef();
  const idRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);
  const [list, setList] = useState([]);
  const [addInstrNameList, setAddInstrNameList] = useState([]);
  const [selectIndex, setSelectIndex] = useState(0);
  const [activeKey, setActiveKey] = useState('0');
  // const [selectInstrName, setSelectInstrName] = useState('');
  const columns = [
    {
      title: '检验仪器',
      dataIndex: 'instrName',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '报告单元',
      dataIndex: 'reportUnitName',

      align: 'center',
    },
    {
      title: '项目类别',
      dataIndex: 'labClassName',
      align: 'center',
      sorter: (a, b) => a.labClassName?.length - b.labClassName?.length,
    },

    {
      title: '项目编号',
      dataIndex: 'itemCode',
      align: 'center',
      sorter: (a, b) => a.itemCode?.length - b.itemCode?.length,
    },
    {
      title: '中文名称',
      dataIndex: 'itemName',
      align: 'center',
      sorter: (a, b) => a.itemName?.length - b.itemName?.length,
    },
    {
      title: '缩写代号',
      dataIndex: 'shortName',
      align: 'center',
      key: 'shortName',
    },
    {
      title: '英文名称',
      dataIndex: 'enName',
      align: 'center',
      sorter: (a, b) => a.enName.length - b.enName.length,
    },

    {
      title: '数据类型',
      dataIndex: 'dataType',
      align: 'center',
    },
    {
      title: '数值单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '小数位',
      dataIndex: 'decimalPlaces',
      align: 'center',
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
      title: '计算项目',
      dataIndex: 'calculateFlag',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '计算项目是否自动添加',
      dataIndex: 'autoAdd',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '测试方法',
      dataIndex: 'method',
      align: 'center',
    },
    {
      title: '临床意义',
      dataIndex: 'significance',
      align: 'center',
      render: (text: any) => {
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
    },

    {
      title: '其他编码2',
      dataIndex: 'extCode2',
      align: 'center',
    },
    {
      title: '打印顺序',
      dataIndex: 'seq',
      align: 'center',
    },
    {
      title: '是否质控项目',
      dataIndex: 'qcFlag',
      align: 'center',
      render: (text) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '质控项目是否在用',
      dataIndex: 'qcInuse',
      align: 'center',
      render: (text) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '最大CV%',
      dataIndex: 'maxCv',
      align: 'center',
    },
    {
      title: '质控数据上报代码',
      dataIndex: 'uploadCode',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.action_btn}>
            {/* <Button
              onClick={(e) => {
                e.stopPropagation();
                updateModalRef.current.show(record);
              }}
            >
              修改
            </Button> */}

            <Button
              style={{ margin: '0 4px' }}
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

  const getList = (params: any) => {
    dispatch({
      type: 'commonMaterials/fetchGetInstrReportProject',
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
    if (instrId) {
      getList({ pageNum, pageSize, instrId });
    }
    dispatch({
      type: 'commonMaterials/save',
      payload: {
        type: 'instrId',
        dataSource: '',
      },
    });
  }, [pageNum, pageSize, location.pathname]);
  useEffect(() => {
    const result = list.map((item) => {
      return { instrName: selectInstrName, ...item };
    });
    setAddInstrNameList(result);
  }, [list]);
  useEffect(() => {
    majorGroupList();
    getInstrList();
    const { btn } = main(transformTree(useDetail.permissions), location.pathname);
    setBtnPermissions(btn);
  }, []);

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const { instrId, name } = allValues;
    searchVal.current = { instrId, name };
    const values = {
      pageNum,
      pageSize,
      instrId,
      name,
    };
    if (instrId) {
      getList(values);
    }
  };
  const add = () => {
    if (!instrId || !majorGroupId) {
      message.warning('请先选择仪器和专业哦!');
      return;
    }
    modalRef.current && modalRef.current.show();
  };
  const deleteCurrentItem = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    instrReqItemDelete({ ids: [idRef.current] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize, instrId });
        confirmModalRef.current.hide();
        message.success('删除成功');
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    instrReqItemExport({ ...searchVal.current }).then((res) => {
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
  const getRowClassName = (record: any, index: any) => {
    let className = '';
    className = index === selectIndex ? styles.selectedRow : '';
    return className;
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <Form.Item name="labClassId">
          <Select placeholder="请选择项目类别" allowClear onChange={majorGroupChange}>
            {majorGroupData.length > 0 &&
              majorGroupData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="instrId">
          <Select placeholder="请选择仪器" allowClear onChange={instrChange}>
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
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
  const getInstrList = () => {
    transferInstrList().then((res) => {
      if (res.code === 200) {
        dispatch({
          type: 'commonMaterials/save',
          payload: {
            type: 'instrList',
            dataSource: res.data,
          },
        });
      }
    });
  };
  const instrChange = (e: any, option: any) => {
    dispatch({
      type: 'commonMaterials/save',
      payload: {
        type: 'instrId',
        dataSource: e,
      },
    });
    dispatch({
      type: 'commonMaterials/save',
      payload: {
        type: 'selectInstrName',
        dataSource: option?.children,
      },
    });
  };
  const majorGroupChange = (e: any) => {
    dispatch({
      type: 'commonMaterials/save',
      payload: {
        type: 'majorGroupId',
        dataSource: e,
      },
    });
  };
  const tabRenderForm = () => {
    return (
      <Form layout="inline" className={styles.search_box}>
        <Form.Item name="instrId" label="检验仪器">
          <Select placeholder="请选择仪器" allowClear onChange={instrChange}>
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const activeKeyChange = (e) => {
    setActiveKey(e);
  };

  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            绑定
          </Button>

          {/* <Button btnType="primary" onClick={importData} style={{ marginRight: 4 }} key={index}>
            导入
          </Button> */}

          <Button btnType="primary" onClick={exportData} style={{ marginRight: 4 }}>
            导出
          </Button>
        </div>
      </div>
      <Table
        size={'small'}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={addInstrNameList}
        rowClassName={getRowClassName}
        onRow={(record, index) => {
          return {
            onClick: () => {
              // 设置选中的index
              setSelectIndex(index);
              getCurrentItem(record);
            },
          };
        }}
        scroll={{ x: 'max-content' }}
      />
      <Bind Ref={modalRef} refresh={() => getList({ pageNum, pageSize, instrId })}></Bind>
      <Update Ref={updateModalRef} refresh={() => getList({ pageNum, pageSize, instrId })} />
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/basic/labItem/importLabItem`}
        title={'报告'}
        refresh={() => getList({ pageNum, pageSize })}
      ></BatchImport>
      <div className={s.tabsTitle}>
        <div>
          <span>项目类别:</span>
          {currentItem?.labClassName || list[0]?.labClassName}
        </div>
        <div>
          <span style={{ marginLeft: '20px' }}>项目代号:</span>
          {currentItem?.shortName || list[0]?.shortName}
        </div>
        <div>
          <span style={{ marginLeft: '20px' }}>检验仪器:</span>
          {selectInstrName}
          {/* {tabRenderForm()} */}
        </div>
      </div>
      <Tabs activeKey={activeKey} onChange={activeKeyChange}>
        <TabPane tab="仪器通道号" key="0">
          <InstrChannelNum parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="参考值" key="1">
          <ReferenceValue
            parent={currentItem || list[0]}
            btnPermissions={btnPermissions}
            refresh={() => getList({ pageNum, pageSize })}
          />
        </TabPane>
        <TabPane tab="危机值" key="2">
          <CriticalValue parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="计算公式" key="3">
          <Formula parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="常用结果" key="4">
          <CommonResults parent={currentItem || list[0]} btnPermissions={btnPermissions} />
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
export default InstrProjectMaintenance;
