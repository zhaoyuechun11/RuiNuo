import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon } from '@/components';
import { Form, Input, message, Select, Tabs, Table } from 'antd';
import { main, transformTree } from '@/utils';
import EditOrAddModal from './components/editOrAddModal';
import { reportUnitDelete } from '../../models/server';
import { majorGroup } from '@/models/server';
import styles from '../index.less';
import InstrumentList from './subPages/instrumentList';
import ReportItems from './subPages/reportItems';
const { Option } = Select;
const { TabPane } = Tabs;
const ReportingUnit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const loading = useSelector((state) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const modalRef = useRef();
  const searchVal = useRef();
  const [list, setList] = useState([]);
  const [btnPermissions, setBtnPermissions] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const [selectIndex, setSelectIndex] = useState(0);
  const manageGroupColumns = [
    {
      title: '序列号',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      title: '报告单元名字',
      dataIndex: 'reportUnitName',
      align: 'center',
    },
    {
      title: '报告单元代码',
      dataIndex: 'reportUnitCode',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '专业分类名字',
      dataIndex: 'labClassName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div className={styles.action_btn}>
            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
            >
              修改
            </Button>
            <Button
              style={{ margin: '0 4px' }}
              onClick={() => {
                deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button>
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

  const getList = (params: { pageNum: number; pageSize: number }) => {
    dispatch({
      type: 'commonMaterials/fetchReportUnitList',
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
  useEffect(() => {
    const { btn } = main(transformTree(useDetail.permissions), location.pathname);
    setBtnPermissions(btn);
    majorGroupList();
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
    // setSort(sorter.field);
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

  const deleteCurrentItem = (id) => {
    reportUnitDelete({ ids: [id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize });
        message.success('删除成功');
      }
    });
  };
  const add = () => {
    modalRef.current && modalRef.current.show();
  };

  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
        dispatch({
          type: 'commonMaterials/save',
          payload: {
            type: 'labClass',
            dataSource: res.data,
          },
        });
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
          <Select placeholder="请选择专业类别" allowClear>
            {majorGroupData.length > 0 &&
              majorGroupData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="reportUnitCode">
          <Input
            placeholder="请输入报告单元code值"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
        <Form.Item name="reportUnitName">
          <Input
            placeholder="请输入报告单元名称"
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
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
      </div>
      <Table
        size={'small'}
        columns={manageGroupColumns}
        rowKey="id"
        onChange={onTableChange}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
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
      />
      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize })}
      ></EditOrAddModal>
      <div style={{ marginBottom: '20px' }}>
        <span>报告单元名字:</span>
        {currentItem?.reportUnitName || list[0]?.reportUnitName}
        <span style={{ marginLeft: '20px' }}>报告单元代码:</span>
        {currentItem?.reportUnitCode || list[0]?.reportUnitCode}
      </div>
      <Tabs>
        <TabPane tab="仪器" key="0">
          <InstrumentList parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
        <TabPane tab="申请项目" key="1">
          <ReportItems parent={currentItem || list[0]} btnPermissions={btnPermissions} />
        </TabPane>
      </Tabs>
    </>
  );
};
export default ReportingUnit;
