import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useLocation, useSelector } from 'umi';
import { Button, Icon } from '@/components';
import styles from './index.less';
import { Form, Select, Table, message, Menu, Dropdown } from 'antd';
import { itemTgValueDelete, itemTgValueList, getListForLabClass } from '../../../../models/server';

import ReverseHandoverModal from './components/reverseHandoverModal';
import StopTimeModal from './components/stopTimeModal';
const { Option } = Select;
const RightContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.loading.global);
  const { leftMenuParams, selectedInstr } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const reverseHandoverModalRef = useRef();
  const stopTimeModalRef = useRef();
  const [instrList, setInstrList] = useState([]);
  useEffect(() => {
    if (leftMenuParams?.labClassId) {
      getInstrListForLabClass({ labClassId: leftMenuParams?.labClassId });
    }
  }, []);
  useEffect(() => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'leftMenuParams',
        dataSource: {},
      },
    });

    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'selectedInstr',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  const getInstrListForLabClass = (params: any) => {
    getListForLabClass(params).then((res: any) => {
      form.setFieldsValue({ instrId: res.data[0].id });
      setInstrList(res.data);
      getList({
        pageNum,
        pageSize,
        instrId: res.data[0].id,
        itemId: leftMenuParams.itemId,
        qcId: leftMenuParams.qcId,
      });

      dispatch({
        type: 'IndoorQualityControMsg/save',
        payload: {
          type: 'selectedInstr',
          dataSource: res.data[0],
        },
      });
    });
  };
  const columns = [
    {
      title: '仪器名称',
      dataIndex: 'instrName',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '靶值ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '启用时间',
      dataIndex: 'startDt',
      align: 'center',
      render: (text: any) => {
        return text ? text.slice(0, 11) : '';
      },
    },
    {
      title: '靶值',
      align: 'center',
      dataIndex: 'tagValue',
    },
    {
      title: 'SD',
      dataIndex: 'sd',
      align: 'center',
    },
    {
      title: 'CV',
      dataIndex: 'cv',
      align: 'center',
    },
    {
      title: '失控上限',
      dataIndex: 'limitHigh',
      align: 'center',
    },
    {
      title: '失控下限',
      dataIndex: 'limitLow',
      align: 'center',
    },
    {
      title: '试剂供应商',
      dataIndex: 'reagentVendorName',
      align: 'center',
    },
    {
      title: '试剂批号',
      dataIndex: 'reagenBatchNo',
      align: 'center',
    },
    {
      title: '校准品批号',
      dataIndex: 'calibrateNo',
      align: 'center',
    },
    {
      title: '试剂厂商',
      dataIndex: 'reagentManufacturerName',
      align: 'center',
    },
    {
      title: '方法学',
      dataIndex: 'qcMethodName',
      align: 'center',
    },
    {
      title: '更换靶值原因',
      dataIndex: 'modifyReason',
      align: 'center',
    },
    {
      title: '质控品ID',
      dataIndex: 'qcId',
      align: 'center',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifyDt',
      align: 'center',
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifyUserName',
      align: 'center',
    },
    {
      title: '停用时间',
      dataIndex: 'stopDt',
      align: 'center',
      render: (text: any) => {
        return text ? text.slice(0, 11) : '';
      },
    },
    {
      title: '停用者',
      align: 'center',
      dataIndex: 'stopUserName',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        return (
          <div id="dropdown" className={styles.dropdown_content}>
            <Dropdown
              overlay={() => menu(record)}
              overlayStyle={{ width: '100px' }}
              placement="bottomLeft"
            >
              <div style={{ cursor: 'pointer' }}>
                <Icon name="iconmianshirili-gengduo1" nameStyle={{ color: '#007BFF' }} />
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  const menu = (record: any) => (
    <Menu>
      <Menu.Item>
        <span onClick={() => stopCurrentItem(record)}>停用</span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => deleteCurrentItem(record)}>删除</span>
      </Menu.Item>

      <Menu.Item>
        <span onClick={() => reverseHandoverModalRef.current.show(record)}>编辑</span>
      </Menu.Item>
    </Menu>
  );
  const stopCurrentItem = (val: any) => {
    stopTimeModalRef.current.show(val);
  };
  const deleteCurrentItem = (val: any) => {
    itemTgValueDelete({ ids: [val.id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getList({
          pageNum,
          pageSize,
          instrId: selectedInstr.id,
          itemId: leftMenuParams.itemId,
          qcId: leftMenuParams.qcId,
        });
      }
    });
  };

  const handleSearch = (changedValues: any, allValues: undefined) => {
    const instrItem = instrList.filter((item) => item.id == allValues.instrId);
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'selectedInstr',
        dataSource: instrItem[0],
      },
    });
    if (allValues.instrId) {
      const values = {
        pageNum,
        pageSize,
        itemId: leftMenuParams.itemId,
        qcId: leftMenuParams.qcId,
        ...allValues,
      };
      getList(values);
    }
  };
  const getList = (params: any) => {
    itemTgValueList(params).then((res: any) => {
      if (res.code == 200) {
        setList(res.data.records);
        setTotal(res.data.total);
      }
    });
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="instrId">
          <Select placeholder="请选择仪器" allowClear>
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
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    setPageSize(pageSize);
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {};
  const add = () => {
    reverseHandoverModalRef.current.show();
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            添加
          </Button>
        </div>
      </div>
      <Table
        loading={loading}
        className={styles.tablePadding}
        rowClassName={styles.rowStyle}
        columns={columns}
        dataSource={list}
        size="small"
        scroll={{ x: 'max-content' }}
        onChange={onTableChange}
        pagination={{
          pageSize,
          current: pageNum,
          total,
          onChange: pageChange,
          showTotal: (total, range) => `共 ${total} 条`,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true,
        }}
      ></Table>
      <ReverseHandoverModal
        Ref={reverseHandoverModalRef}
        refresh={() => {
          getList({
            pageNum,
            pageSize,
            instrId: selectedInstr.id,
            itemId: leftMenuParams.itemId,
            qcId: leftMenuParams.qcId,
          });
        }}
      />
      <StopTimeModal
        Ref={stopTimeModalRef}
        refresh={() => {
          getList({
            pageNum,
            pageSize,
            instrId: selectedInstr.id,
            itemId: leftMenuParams.itemId,
            qcId: leftMenuParams.qcId,
          });
        }}
      />
    </>
  );
};

export default RightContent;
