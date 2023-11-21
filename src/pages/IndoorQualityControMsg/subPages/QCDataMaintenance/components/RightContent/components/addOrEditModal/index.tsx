import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, Select, Table, DatePicker } from 'antd';
import { Dialog } from '@components';
import { useSelector } from 'umi';

import {
  dataGatherSetAdd,
  dataGatherSetUpdate,
  getQcListForLabClass,
} from '../../../../../../models/server';
import { EditableCell, EditableRow } from '../editableRow';
import styles from './index.less';
import moment from 'moment';
const { Option } = Select;
const accumulateFlag = [
  {
    id: 1,
    name: '是',
  },
  {
    id: 0,
    name: '否',
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
  const { collectionControl } = useSelector((state: any) => state.IndoorQualityControMsg);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState(1);
  const [qcList, setQcList] = useState([]);
  const [selecteQq, setSelecteQq] = useState({});
  var now1 = moment().format('YYYY-MM-DD');
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      getQcListForLabClassId({ labClassId: collectionControl.labClassId });
      form.resetFields();
      form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
      dialogRef.current && dialogRef.current.show();
      //setId(val?.id);
      //setSelecteQq({ qcLevelName: val.qcLevelName, batchNo: val.batchNo });
      if (val) {
        form.setFieldsValue({
          ...val,
        });
      }
    },
  }));

  const onFinish = (value: any) => {
    let params = {
      ...value,
    };
    if (id) {
      dataGatherSetUpdate({ id, ...params }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      return;
    }

    dataGatherSetAdd({ ...params, instrId: collectionControl.instrId }).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const getQcListForLabClassId = (params: any) => {
    getQcListForLabClass(params).then((res) => {
      if (res.code === 200) {
        setQcList(res.data);
      }
    });
  };
  const qcChange = (val) => {
    const result = qcList.filter((item) => (item.id = val));
    setSelecteQq(result[0]);
  };
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: '',
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: '',
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ]);

  const defaultColumns = [
    {
      title: '项目代号',
      dataIndex: 'age',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '显示结果',
      dataIndex: 'name',
      width: '30%',
      align: 'center',
      editable: true,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
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
              <Input disabled value={selecteQq?.batchNo} />
            </Form.Item>
          </Col>

          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item label="质控品水平">
              <Input disabled value={selecteQq?.qcLevelName} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="sampleNo" label="仪器代号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="labDate" label="质控日期">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择质控日期" />
            </Form.Item>
          </Col>
        </Row>
        {id && (
          <>
            <Row>
              <Col span={11}>
                <Form.Item name="sampleNo" label="项目代号">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item name="labDate" label="项目名称">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="sampleNo" label="质控结果">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item name="labDate" label="结果录入时间">
                  <DatePicker format="YYYY-MM-DD HH:ss:mm" placeholder="请选择结果录入时间" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="sampleNo" label="累积标志">
                  <Select placeholder="请选择累积标志" allowClear >
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
                <Form.Item name="" label="画图标志">
                  <Select placeholder="请选择画图标志" allowClear >
                    {drawDesignsFlag.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
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
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      )}
    </Dialog>
  );
};
export default AddOrEditModal;
