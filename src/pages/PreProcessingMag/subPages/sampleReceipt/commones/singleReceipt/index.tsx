import React, { useState } from 'react';
import { useDispatch } from 'umi';
import { Icon, Button } from '@/components';
import {
  Table,
  Form,
  Input,
  message,
  Checkbox,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
  Tooltip,
  Tabs,
} from 'antd';
const { TabPane } = Tabs;
import s from '../index.less';
import SetHeaderModal from '../SetHeaderModal';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';

const SingleReceipt = () => {
  const [scanForm] = Form.useForm();
  const setRef = Form.useForm();
  const applyFormRef = Form.useForm();
  const dispatch = useDispatch();
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const handleSearch = (changedValues: any, allValues: undefined) => {};
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={scanForm}>
        <Form.Item name="sampleBarcode">
          <Input
            placeholder="扫码/读卡"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const scanMenu = (
    <Menu>
      <Menu.Item>
        <Checkbox>非自动生成样本编号</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>签收时仅打印分杯码</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>签收时弹开展现分单行</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox>单个样本签收读取规则</Checkbox>
      </Menu.Item>
    </Menu>
  );
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          //getBeforeOrderList();
        },
      },
    });
  };
  const expandedRowRender = () => {
    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Status',
        key: 'state',
        render: () => <span>Finished</span>,
      },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <span className="table-operation">
            <a>Pause</a>
            <a>Stop</a>
          </span>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Platform', dataIndex: 'platform', key: 'platform' },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
  ];

  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: 'Screem',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    });
  }
  return (
    <>
      <Row>
        <Col span={14}>
          <div className={`${s.form_button} ${s.common}`}>
            {renderForm()}
            <div className={`${s.but_box} ${s.common}`}>
              <Button btnType="primary">打印签收单</Button>
              <Button btnType="primary" style={{ margin: '0 5px' }}>
                打印条码
              </Button>
              <Dropdown overlay={scanMenu}>
                <div style={{ cursor: 'pointer' }}>
                  <Button btnType="primary" style={{ margin: '0 5px' }}>
                    选项
                  </Button>
                </div>
              </Dropdown>
              <Button btnType="primary" style={{ margin: '0 5px' }}>
                清空
              </Button>
              <Button btnType="primary" style={{ margin: '0 5px' }}>
                交接
              </Button>
              {/* <Button
                style={{ margin: '0 5px 0' }}
                btnType="primary"
                onClick={() => {
                  setRef.current.show();
                }}
              >
                自定义表头
              </Button> */}
              <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
                <span
                  className={s.settings}
                  onClick={() => {
                    setRef.current && setRef.current?.show();
                  }}
                >
                  <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20 }} />
                </span>
              </Tooltip>
            </div>
          </div>
          <Table
            className="components-table-demo-nested"
            columns={columns}
            expandedRowRender={expandedRowRender}
            dataSource={data}
            defaultExpandAllRows={true}
          />
          <SetHeaderModal
            refs={setRef}
            columnOptions={columnOptionsList}
            columnChecked={selectedColumns}
            handleChangeColumn={changeColumn}
          />
        </Col>
        <Col span={10} className={s.border_line}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="原始申请单" key="1">
              <ApplyFormModal Ref={applyFormRef} />
            </TabPane>
            <TabPane tab="交接单" key="2"></TabPane>
            <TabPane tab="订单流转日志" key="3"></TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
export default SingleReceipt;
