import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, Select, Table, DatePicker } from 'antd';
import { Dialog } from '@components';
import { useSelector } from 'umi';

import {
  dataMaintenanceAdd,
  dataMaintenanceUpdate,
  getQcListForInstr,
  modifyLogAdd,
} from '../../../../../../models/server';
import { EditableCell, EditableRow } from '../editableRow';
import styles from './index.less';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const accumulateFlag = [
  {
    id: 1,
    name: '采用',
  },
  {
    id: 0,
    name: '无效',
  },
];
const drawDesignsFlag = [
  {
    id: 1,
    name: '是',
  },
  {
    id: 0,
    name: '否',
  },
];
const AddOrEditModal = ({ Ref, refresh }) => {
  const { dataMaintenance, dataMaintenanceInstr } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [qcList, setQcList] = useState([]);
  const [record, setRecord] = useState({});

  var now1 = moment().format('YYYY-MM-DD');
  var now2 = moment().format('YYYY-MM-DD HH:ss:mm');
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      form.resetFields();
      form.setFieldsValue({
        qcDate: moment(now1, 'YYYY-MM-DD'),
        resultDt: moment(now2, 'YYYY-MM-DD HH:ss:mm'),
      });
      getQcDataList({ qcId: dataMaintenance.qcId, instrId: dataMaintenanceInstr.id, qcDate: now1 });
      dialogRef.current && dialogRef.current.show();
      setId(val?.id);
      setRecord(val);
      if (val) {
        form.setFieldsValue({
          ...val,
          qcDate: moment(val.qcDate, 'YYYY-MM-DD'),
          resultDt: moment(val.resultDt, 'YYYY-MM-DD HH:ss:mm'),
          inuseFlag: val.inuseFlag ? 1 : 0,
          drawFlag: val.drawFlag ? 1 : 0,
        });
      }
    },
  }));

  const onFinish = (value: any) => {
    debugger;
    if (id) {
      const { displayValue, drawFlag, inuseFlag, resultDt } = value;
      dataMaintenanceUpdate({
        id,
        displayValue,
        drawFlag,
        inuseFlag,
        resultDt: resultDt.format('YYYY-MM-DD HH:ss:mm'),
      }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
          const { instrId, itemId, qcId, qcDate, qcValueSign, displayValue, calculateValue } =
            record;
          const logParams = {
            modifyReason: value.modifyReason,
            oldDisplayValue: displayValue,
            oldCalculateValue: calculateValue,
            newCalculateValue: Number(value?.displayValue)?.toFixed(3),
            newDisplayValue: Number(value?.displayValue)?.toFixed(4),
            instrId,
            itemId,
            qcId,
            qcDate,
            qcValueSign,
          };
          modifyLog(logParams);
        }
      });
      return;
    }
    const result = qcList
      .filter((item) => item.displayValue !== '' && item.displayValue !== undefined)
      .map((item) => {
        return {
          itemId: item.id,
          displayValue: item.displayValue,
        };
      });

    let params = {
      qcId: dataMaintenance.qcId,
      instrId: dataMaintenanceInstr.id,
      qcDate: value.qcDate.format('YYYY-MM-DD'),
      items: result,
    };
    dataMaintenanceAdd({ ...params }).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const modifyLog = (params: any) => {
    modifyLogAdd(params).then((res: any) => {
      if (res.code === 200) {
        message.success('添加日志成功!');
      }
    });
  };
  const getQcDataList = (params: any) => {
    getQcListForInstr(params).then((res) => {
      if (res.code === 200) {
        setQcList(res.data);
      }
    });
  };

  const defaultColumns = [
    {
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '显示结果',
      dataIndex: 'displayValue',
      width: '30%',
      align: 'center',
      editable: true,
    },
  ];

  const handleSave = (row) => {
    const newData = [...qcList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setQcList(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <Dialog
      ref={dialogRef}
      width={700}
      title={id ? '编辑' : '添加'}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} style={{ padding: '20px' }} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col span={11}>
            <Form.Item label="质控品批号">
              <Input disabled value={dataMaintenance?.batchNo} />
            </Form.Item>
          </Col>

          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item label="质控品水平">
              <Input disabled value={dataMaintenance?.qcLevelName} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="仪器代号">
              <Input disabled value={dataMaintenanceInstr?.instrCode} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="qcDate"
              label="质控日期"
              rules={[{ required: true, message: '请选择质控日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择质控日期" />
            </Form.Item>
          </Col>
        </Row>
        {id && (
          <>
            <Row>
              <Col span={11}>
                <Form.Item label="项目代号">
                  <Input disabled value={record.itemCode} />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label="项目名称">
                  <Input disabled value={record.itemName} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="displayValue" label="质控结果">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name="resultDt"
                  label="结果录入时间"
                  rules={[{ required: true, message: '请选择结果录入时间' }]}
                >
                  <DatePicker format="YYYY-MM-DD HH:ss:mm" placeholder="请选择结果录入时间" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="inuseFlag" label="累积标志">
                  <Select placeholder="请选择累积标志" allowClear>
                    {accumulateFlag.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item name="drawFlag" label="画图标志">
                  <Select placeholder="请选择画图标志" allowClear>
                    {drawDesignsFlag.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="modifyReason" label="修改原因">
                  <TextArea></TextArea>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>

      {!id && (
        <Table
          className={styles.table_box}
          components={components}
          size="small"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={qcList}
          columns={columns}
          pagination={false}
        />
      )}
    </Dialog>
  );
};
export default AddOrEditModal;
