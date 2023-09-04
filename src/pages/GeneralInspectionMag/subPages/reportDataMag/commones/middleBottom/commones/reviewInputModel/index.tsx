import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Select, message, Form, Input, Row, Col, Table, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'umi';
const { Option } = Select;
const ReviewInputModel = ({ Ref }) => {
  const dispatch = useDispatch();
  const { useDetail } = useSelector((state: any) => state.global);
  const { personList, reportUnitInstrList, instrAndRecordId, reportLeftVal } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const [list, setList] = useState([]);
  useImperativeHandle(Ref, () => ({
    showModal: () => {
      dialogRef.current && dialogRef.current.show();
      if (personList.length > 0) {
        form.setFieldsValue({ reOperator: useDetail.id, reResultEnteredBy: useDetail.id });
      } else {
        form.setFieldsValue({ reOperator: '', reResultEnteredBy: '' });
      }
      getList();
    },
  }));

  const onOk = () => {};
  const getList = () => {
    dispatch({
      type: 'generalInspectionMag/fetchReexamineReq',
      payload: {
        reportId: instrAndRecordId.id,
        callback: (res: any) => {
          if (res.code === 200) {
            setList(res.data.records);
          }
        },
      },
    });
  };
  const columns = [
    {
      title: '代号',
      dataIndex: 'itemCode',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '复查项目名称',
      dataIndex: 'itemName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '复查结果',
      dataIndex: 'reResult1',
      align: 'center',
    },
    {
      title: '替换',
      dataIndex: 'overKey',
      align: 'center',
      render: (text, record) => {
        return (
          <Checkbox
            checked={record.isEnabled}
            onChange={(checked) => {
              dispatch({
                type: 'commonMaterials/fetchAPItemInstrBindsState',
                payload: {
                  id: record.id,
                  callback: (res) => {
                    if (res.code === 200) {
                      getList({ pageNum, pageSize, reqItemId: parent.id });
                    }
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];
  return (
    <Dialog ref={dialogRef} title={'复查结果录入'} onOk={onOk}>
      <Form layout="inline" form={form}>
        <Row>
          <Col>复查样本:</Col>
          <Col>{reportLeftVal.sampleBarcode}</Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              name="reSampleNo"
              label="样本号"
              rules={[{ required: true, message: '请输入样本号' }]}
            >
              <Input placeholder="请输入复查样本号" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="plateNo" label="板号">
              <Input placeholder="请输入复查板号" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item name="position" label="位置号">
              <Input placeholder="请输入复查位置号" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="reOperator"
              label="实验人"
              rules={[{ required: true, message: '请选择实验人' }]}
            >
              <Select allowClear placeholder="请选择实验人" style={{ width: 120 }}>
                {personList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              name="reResultEnteredBy"
              label="录入人"
              rules={[{ required: true, message: '请选择录入人' }]}
            >
              <Select allowClear placeholder="请选择录入人" style={{ width: 120 }}>
                {personList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="instrId" label="仪器">
              <Select allowClear placeholder="检验仪器" style={{ width: 120 }}>
                {reportUnitInstrList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.instrName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} dataSource={list} bordered size="small" pagination={false} />
    </Dialog>
  );
};
export default ReviewInputModel;
