import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table } from '@common';
import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'umi';
import { Icon } from '@/components';
import { majorGroup, getDictList } from '../../../../../../models/server';
const { Option } = Select;
const getValue = (obj) =>
  Object.keys(obj)
    .map((key) => obj[key])
    .join(',');
const AddApply = ({ applyListData, refs }) => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [sample, setSample] = useState([]);
  const [sampleType, setSampleType] = useState();
  const dispatch = useDispatch();
  const dialog = useRef();
  const searchVal = useRef();
  useImperativeHandle(refs, () => ({
    show: (val) => {
      dialog.current && dialog.current.show();
      getList({ pageNum, pageSize });
      majorGroupList();
      dictList({ type: 'BT' });
      setSelectedRows(val);
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  const getList = (params: any) => {
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
  };
  const columns = [
    {
      title: '项目编码',
      dataIndex: 'reqItemCode',
      align: 'center',
      width: 150,
      key: 'reqItemCode',
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
      key: 'reqItemName',
    },
    {
      title: '默认样本类型',
      dataIndex: 'defaultSampleTypeId',
      align: 'center',
      width: 150,
      key: 'defaultSampleTypeName',
      render: (text, record) => {
        return (
          <Select
            placeholder="请选择默认值"
            autoComplete="off"
            allowClear
            value={text}
            onChange={(e) => defaultValChange(e, record)}
          >
            {sample?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '项目类别',
      dataIndex: 'labClassName',
      fixed: 'left',
      align: 'center',
      key: 'labClassName',
      width: 150,
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
  ];
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    setSelectedRows([]);

    getList(params);
  };
  const handleSelectRows = (rows) => {
    console.log('rows', rows);
    setSelectedRows(rows);
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
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const dictList = (type) => {
    getDictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        setSample(res.data);
      }
    });
  };
  const add = () => {
    applyListData(selectedRows);
    dialog.current && dialog.current.hide();
  };
  const defaultValChange = (e, record) => {
    let result = list.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          defaultSampleTypeId: e,
        };
      }
      return item;
    });
    setList(result);
  };

  return (
    <div>
      <Dialog ref={dialog} footer={null} width={864}>
        <div style={{ display: 'flex' }}>
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
            <Form.Item name="name">
              <Input
                placeholder="请输入项目名称"
                autoComplete="off"
                suffix={<Icon name="icongongzuotai-sousuo" />}
                allowClear
              />
            </Form.Item>
          </Form>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
        <Table
          unit="个"
          columns={columns}
          selectedRowKeys={selectedRows.map((i) => i.id)}
          data={list}
          pagination={{ current: pageNum, total: total }}
          onChange={handleStandardTableChange}
          onSelectRow={handleSelectRows}
          isRowSelection={true}
          rowKey="id"
          locale={{
            emptyText: (
              <div>
                <img
                  width="115px"
                  height="99px"
                  src={require('@assets/images/empty/table_empty.png')}
                  alt=""
                />
                <div>暂无数据</div>
              </div>
            ),
          }}
        />
      </Dialog>
    </div>
  );
};
export default AddApply;
