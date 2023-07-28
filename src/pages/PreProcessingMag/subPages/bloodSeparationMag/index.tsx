import React, { useEffect, useState } from 'react';
import { Table, Tabs, Form, Input, message, DatePicker } from 'antd';
import { Button, Icon } from '@/components';
import { getCurrentTime } from '@/utils';
import { useDispatch, useSelector } from 'umi';
import { bloodSave } from '../../models/server';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const BloodSeparationMag = () => {
  const { scanBloodData } = useSelector((state: any) => state.preProcessingMag);
  const { useDetail } = useSelector((state: any) => state.global);
  const dispatch = useDispatch();
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  const [waitBloodList, setWaitBloodList] = useState([]);
  const [finishBloodList, setFinishBloodList] = useState([]);
  const [scanBloodList, setScanBloodList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [finishPageNum, setFinishPageNum] = useState(1);
  const [finishPageSize, setFinishPageSize] = useState(10);
  const [selectedRowKeysWaitBood, setSelectedRowKeysWaitBood] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalFinish, setTotalFinish] = useState(0);

  useEffect(() => {
    getWaitList({ pageNum, pageSize });
  }, [pageNum, pageSize]);
  useEffect(() => {
    getFinishBlood({ pageNum: finishPageNum, pageSize: finishPageSize });
  }, [finishPageNum, finishPageSize]);
  useEffect(() => {
    if (scanBloodList.length > 0) {
      const newData = scanBloodList.map((item) => {
        return {
          ...item,
          key: item.id,
          bloodBy: useDetail.name,
          bloodDate: getCurrentTime(),
        };
      });
      const mergedArray = [scanBloodData, newData].reduce((acc, val) => acc.concat(val), []);
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'scanBloodData',
          dataSource: mergedArray,
        },
      });
    }
  }, [scanBloodList]);
  const columns = [
    {
      title: '签收条码',
      dataIndex: 'receiveBarcode',
      width: 100,
      fixed: 'left',
    },

    {
      title: '申请号',
      dataIndex: 'subId',
      width: 100,
    },
    {
      title: '专业类别',
      dataIndex: 'labClassName',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 100,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleType',
      width: 100,
    },
    {
      title: '检测状态',
      dataIndex: 'detectionStatus',
      width: 100,
    },
    {
      title: '分拣时间',
      dataIndex: 'preSortDate',
      width: 100,
    },
    {
      title: '分血人',
      dataIndex: 'bloodBy',
      width: 100,
    },
    {
      title: '分血时间',
      dataIndex: 'bloodDate',
      width: 100,
    },
  ];
  const getWaitList = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchWaitBlood',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            setWaitBloodList(res.data.records);
            setTotal(res.data.total);
          }
        },
      },
    });
  };
  const getFinishBlood = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchFinishBlood',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            setFinishBloodList(res.data.records);
            setTotalFinish(res.data.total);
          }
        },
      },
    });
  };
  const getScanBlood = (params: any) => {
    dispatch({
      type: 'preProcessingMag/fetchScanBlood',
      payload: {
        ...params,
        callback: (res: {
          code: number;
          data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
        }) => {
          if (res.code === 200) {
            setScanBloodList(res.data);
          }
        },
      },
    });
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const onSelectChangeWaitBood = (keys) => {
    setSelectedRowKeysWaitBood(keys);
  };
  const rowSelectionWaitBlood = {
    selectedRowKeys: selectedRowKeysWaitBood,
    onChange: onSelectChangeWaitBood,
  };

  const handleSearchScanBlood = (changedValues: any, allValues: undefined) => {
    getScanBlood({ ...allValues });
  };
  const save = (val) => {
    if (val === 1) {
      let result = scanBloodData
        ?.filter((item) => selectedRowKeysVal.some((key) => key === item.id))
        .map((item) => {
          return { id: item.id, bloodBy: useDetail.id, bloodDate: item.bloodDate };
        });
      let residueResult = scanBloodData?.filter(
        (item) => !selectedRowKeysVal.some((key) => key === item.id),
      );

      bloodSave(result).then((res) => {
        if (res.code === 200) {
          message.success('保存成功');
          dispatch({
            type: 'preProcessingMag/save',
            payload: {
              type: 'scanBloodData',
              dataSource: residueResult,
            },
          });
        }
      });
    } else {
      const result = selectedRowKeysWaitBood.map((item) => {
        return { id: item };
      });
      bloodSave(result).then((res) => {
        if (res.code === 200) {
          message.success('保存成功');
          getFinishBlood({ pageNum: finishPageNum, pageSize: finishPageSize });
          getWaitList({ pageNum, pageSize });
        }
      });
    }
  };
  const batchBloodSearch = (changedValues: any, allValues: undefined) => {
    const time = {
      createDateStart:
        allValues.createDateStart && allValues.createDateStart[0]
          ? allValues.createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateEnd:
        allValues.createDateStart && allValues.createDateStart[1]
          ? allValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    };

    // getSortList(values);finishPageNum, finishPageSize
    getFinishBlood({ pageNum: finishPageNum, pageSize: finishPageSize, ...time });
    getWaitList({ pageNum, pageSize, ...time });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearchScanBlood} layout="inline">
        <Form.Item name="receiveBarcode">
          <Input
            placeholder="扫码分血"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const batchBloodForm = () => {
    return (
      <Form onValuesChange={batchBloodSearch} layout="inline">
        <Form.Item name="createDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['登记开始日期', '登记结束日期']}
            style={{ width: 340 }}
          />
        </Form.Item>
      </Form>
    );
  };
  const tabsChange = (e) => {
    if (e === '2') {
      getWaitList({ pageNum, pageSize });
      getFinishBlood({ pageNum: finishPageNum, pageSize: finishPageSize });
    }
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const pageChangeFinish = (page, size) => {
    setFinishPageNum(page);
    setFinishPageSize(size);
  };
  return (
    <Tabs type="card" onChange={tabsChange}>
      <TabPane tab="单个扫码分血" key={1}>
        <div style={{ marginBottom: '10px', display: 'flex' }}>
          {renderForm()}

          <Button btnType="primary" onClick={() => save(1)}>
            打印分血标签
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={scanBloodData}
          scroll={{ x: 'calc(700px + 50%)' }}
        />
      </TabPane>
      <TabPane tab="查询分血" key={2}>
        <div style={{ marginBottom: '10px', display: 'flex' }}>
          {batchBloodForm()}
          <Button btnType="primary" onClick={() => save(2)}>
            打印分血标签
          </Button>
        </div>
        <div>待分血列表</div>
        <Table
          rowSelection={rowSelectionWaitBlood}
          columns={columns}
          dataSource={waitBloodList}
          scroll={{ x: 'calc(700px + 50%)' }}
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total,
            onChange: pageChange,
            showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
          }}
        />
        <div>已分血列表</div>
        <Table
          columns={columns}
          dataSource={finishBloodList}
          scroll={{ x: 'calc(700px + 50%)' }}
          pagination={{
            current: finishPageNum,
            pageSize: finishPageSize,
            total: totalFinish,
            onChange: pageChangeFinish,
            showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
          }}
        />
      </TabPane>
    </Tabs>
  );
};
export default BloodSeparationMag;