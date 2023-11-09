import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useLocation, useSelector } from 'umi';
import { Icon, Button } from '@/components';
import { Table, Form, Input, Checkbox, Dropdown, Menu, Row, Col, Tabs, Radio } from 'antd';
import { signForSingle } from '../../../../models/server';
const { TabPane } = Tabs;
import s from '../index.less';
import LogList from '../logList';
import ApplyForm from '../applyForm';
import AbandonedInspection from '../abandonedInspection';
import DeliveryReceipt from '../deliveryReceipt';

const SingleReceipt = ({ receiptTableHeader }) => {
  const { pathname } = useLocation();
  const { scanSignData, singleReceiptRefresh } = useSelector(
    (state: any) => state.preProcessingMag,
  );
  const [scanForm] = Form.useForm();
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState(1);
  const [signList, setSignList] = useState([]);
  const [isExpand, setIsExpand] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [mainId, setMainId] = useState();
  const [subId, setSubId] = useState();
  const [clickRow, setClickRow] = useState(0);
  const giveUpCheckRef = useRef();

  useEffect(() => {
    if (signList.length > 0) {
      const mergedArray = [signList, scanSignData].reduce((acc, val) => acc.concat(val), []);
      setMainId(mergedArray[0].id);
      const keys = mergedArray.map((item) => item.id);
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'scanSignData',
          dataSource: mergedArray,
        },
      });
      if (isExpand) {
        setExpandedRowKeys(keys);
      }
    }
  }, [signList]);
  useEffect(() => {
    if (singleReceiptRefresh) {
      let params = scanForm.getFieldsValue();
      getSignForSingle({ ...params });
    }
  }, [singleReceiptRefresh]);
  useEffect(() => {
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'scanSignData',
        dataSource: [],
      },
    });
  }, [pathname]);

  const getSignForSingle = (params) => {
    signForSingle(params).then((res) => {
      if (res.code === 200) {
        setSignList([res.data]);
        if (singleReceiptRefresh) {
          dispatch({
            type: 'preProcessingMag/save',
            payload: {
              type: 'singleReceiptRefresh',
              dataSource: false,
            },
          });
        }
      }
    });
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    getSignForSingle(changedValues);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={scanForm}>
        <Form.Item
          name={`${
            radioValue === 1 ? 'receiveBarcode' : radioValue === 2 ? 'patientId' : 'patientNo'
          }`}
        >
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
  const onChangeRadio = (e: any) => {
    setRadioValue(e.target.value);
  };
  const onChangeExpand = (e: any) => {
    setIsExpand(e.target.checked);
  };

  const scanMenu = (
    <Menu>
      <Menu.Item>
        <Checkbox>签收时仅打印分杯码</Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={onChangeExpand} checked={isExpand}>
          签收时弹开展现分单行{isExpand}
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <div style={{ marginBottom: '10px' }}>单个样本签收读取规则</div>
        <Radio.Group onChange={onChangeRadio} value={radioValue}>
          <Radio value={1}>收样条码号</Radio>
          <Radio value={2}>病人ID</Radio>
          <Radio value={3}>门诊/住院号</Radio>
        </Radio.Group>
      </Menu.Item>
    </Menu>
  );

  const expandedRowRender = (record: any) => {
    const columns = [
      { title: '样本条码', dataIndex: 'sampleBarcode', key: 'sampleBarcode' },
      { title: '样本编号', dataIndex: 'sampleNo', key: 'sampleNo' },
      {
        title: '专业类别',
        key: 'labClassName',
        dataIndex: 'labClassName',
      },
      { title: '样本类型', dataIndex: 'sampleType', key: 'sampleType' },
      { title: '申请项目', dataIndex: 'itemName', key: 'itemName' },
      {
        title: '急诊',
        dataIndex: 'isEmer',
        key: 'isEmer',
        render: (text: any) => <span>{text ? '是' : '否'}</span>,
      },
      {
        title: '分杯标记',
        dataIndex: 'bloodFlag',
        key: 'bloodFlag',
        render: (text: any) => <span>{text ? '是' : '否'}</span>,
      },
      { title: '下一节点', dataIndex: 'nextNodeName', key: 'nextNodeName' },
      { title: '接收时间', dataIndex: 'preReceiveDate', key: 'preReceiveDate' },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        render: (text, record, index) => (
          <Button onClick={() => giveUpCheckRef.current.show(text, record, index)}>拒检</Button>
        ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={record.childTableContent}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showHeader={false}
        onRow={(record, index) => {
          return {
            onClick: (event) => {
              setSubId(record.key);
            },
          };
        }}
      />
    );
  };
  const clear = () => {
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'scanSignData',
        dataSource: [],
      },
    });
  };
  const onRowClick = (record, index) => {
    setClickRow(index);
    setMainId(record.id);
  };
  const getRowClassName = (record, index) => {
    let className = 'normal';
    if (index === clickRow) {
      className = s.blue;
      return className;
    }
  };
  const onExpand = (expanded, record) => {
    if (!expanded) {
      let result = expandedRowKeys.filter((key) => key !== record.id);
      setExpandedRowKeys(result);
    } else {
      let id = scanSignData.map((item) => item.id).filter((id) => id === record.id);
      setExpandedRowKeys(id);
    }
  };
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
              <Button btnType="primary" style={{ margin: '0 5px' }} onClick={clear}>
                清空
              </Button>
            </div>
          </div>
          <Table
            className={s.batch_table}
            columns={receiptTableHeader}
            expandedRowRender={expandedRowRender}
            dataSource={scanSignData}
            expandedRowKeys={expandedRowKeys}
            onExpand={onExpand}
            scroll={{ x: 'max-content' }}
            size="small"
            rowClassName={getRowClassName}
            onRow={(record, index) => {
              return {
                onClick: (event) => {
                  onRowClick(record, index);
                },
              };
            }}
          />
        </Col>
        <Col span={10} className={s.border_line}>
          <Tabs defaultActiveKey="1" className={s.tabs_box}>
            <TabPane tab="原始申请单" key="1">
              <ApplyForm mainId={mainId} />
            </TabPane>
            <TabPane tab="交接单" key="2">
              <DeliveryReceipt mainId={mainId} subId={subId} />
            </TabPane>
            <TabPane tab="订单流转日志" key="3">
              <LogList mainId={mainId} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <AbandonedInspection
        Ref={giveUpCheckRef}
        refresh={() => getSignForSingle({ ...scanForm.getFieldsValue() })}
      />
    </>
  );
};
export default SingleReceipt;
