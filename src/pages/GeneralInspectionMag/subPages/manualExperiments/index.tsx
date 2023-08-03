import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Icon } from '@components';
import { Table, Form, Input, DatePicker, Select, message } from 'antd';
import { reportUnitSelect } from '@/models/server';
import {  executorByReportUnit,manualAllocationScan } from '../../models/server';
import styles from './index.less';
const { Option } = Select;
const ManualExperiments = () => {
  const [form] = Form.useForm();
  const [scanForm] = Form.useForm();
  const [reportUnitList, setReportUnitList] = useState([]);

  const [executorList, setExecutorList] = useState([]);
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([]);
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  useEffect(() => {
    form.setFieldsValue({ createDateStart: moment(now1, 'YYYY-MM-DD HH:mm:ss') });
    getReportUnitSelect();
  }, []);

  const search = () => {};
  const add = () => {
    console.log(isNaN(scanForm.getFieldsValue().no));
    if (!isNaN(scanForm.getFieldsValue().no)) {
    } else {
      var lastChar = scanForm.getFieldsValue().no.charAt(scanForm.getFieldsValue().no.length - 1);
      console.log(isNaN(lastChar));
    }
  };
  const minus = () => {};
  const getReportUnitSelect = () => {
    reportUnitSelect().then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };

  const getExecutorByReportUnit = (reportUnitId) => {
    executorByReportUnit({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setExecutorList(res.data);
      }
    });
  };
  const reportUnitChange = (e) => {
    if (e) {
      getExecutorByReportUnit(e);
    }
  };
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysVal,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: '样本条码',
      dataIndex: 'receiveBarcode',
      width: 100,
      fixed: 'left',
      ellipsis: true,
    },

    {
      title: '报告单元',
      dataIndex: 'isEmer',
      width: 100,
    },
    {
      title: '专业',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '仪器',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '样本号',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '申请项目代号',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '申请项目',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '分配人',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '执行人',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '分配时间',
      dataIndex: 'subId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 180,
      render: (text: string, record: Record<string, any>) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              // history.push(
              //   '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
              // );
            }}
          >
            打印条码
          </Button>
          <Button
            onClick={() => {
              // deleteCurrentItem(record.id);
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  const renderForm = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={form} className={styles.search_box}>
        <Form.Item name="labClassManageId" label="报告单元">
          <Select
            placeholder="请选择报告单元"
            autoComplete="off"
            allowClear
            onChange={reportUnitChange}
          >
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="createDateStart">
          <DatePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择检验日期"
            style={{ width: 340 }}
          />
        </Form.Item>
        <div id="labClassId">
          <Form.Item name="labClassId" label="执行人">
            <Select
              placeholder="请选择执行人"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('labClassId')}
            >
              {executorList.length > 0 &&
                executorList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    );
  };
  const renderFormScan = () => {
    return (
      <Form onValuesChange={search} layout="inline" form={scanForm} className={styles.scanForm_box}>
        <Form.Item name="hospitalId" label="样本条码">
          <Input placeholder="请输入样本条码" />
        </Form.Item>

        <Form.Item name="no" label="样本编号">
          <Input placeholder="请输入样本编号" />
        </Form.Item>
        <Button btnType="primary" onClick={add}>
          +
        </Button>
        <Button
          btnType="primary"
          onClick={minus}
          className={styles.minus}
          style={{ margin: '0 15px' }}
        >
          -
        </Button>
        <Button btnType="primary">分配任务到仪器</Button>
      </Form>
    );
  };
  return (
    <>
      {renderForm()}
      {renderFormScan()}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        className={styles.table_box}
        dataSource={[]}
        scroll={{ x: 'calc(700px + 50%)' }}
      />
    </>
  );
};
export default ManualExperiments;
