import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, DatePicker, Row, Col } from 'antd';
import { dictList } from '@/models/server';
import { QCAdd, QCUpdate } from '../../../../models/server';
import moment from 'moment';
import { useSelector } from 'umi';

const { Option } = Select;
const EditOrAddModal = ({ Ref, refresh, majorGroupData, QCLevel, reportFlag }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [manufacturer, setManufacturer] = useState([]);
  var now1 = moment().format('YYYY-MM-DD');
  useImperativeHandle(Ref, () => ({
    show: (record: any) => {
      getDictList();
      form && form.resetFields();
      dialogRef.current && dialogRef.current.show();
      if (record) {
        form.setFieldsValue({
          ...record,
          startDt: record.startDt ? moment(record.startDt) : '',
          exprieDt: moment(record.exprieDt),
          stopDt: moment(record.stopDt),
          stopUser: useDetail.name,
          checkReportFlag:record.checkReportFlag?1:0
        });
        setId(record.id);
      } else {
        form.setFieldsValue({ startDt: moment(now1, 'YYYY-MM-DD'), stopUser: useDetail.name });
        setId(null);
      }
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        QCUpdate({
          id: id,
          ...value,
          startDt: value.startDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          exprieDt: value.exprieDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          stopDt: value.stopDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          stopUser: useDetail.id,
        }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        QCAdd({
          ...value,
          startDt: value.startDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          exprieDt: value.exprieDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          stopDt: value.stopDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
          stopUser: useDetail.id,
        }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'QCGYSZKP' }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setManufacturer(res.data);
        }
      },
    );
  };
  return (
    <Dialog ref={dialogRef} width={640} title={id ? '编辑' : '新增'} onOk={onOk}>
      <Form form={form} style={{ padding: '20px' }} layout="vertical">
        <Row>
          <Col span={11}>
            <Form.Item
              name="classId"
              label="专业类别"
              rules={[{ required: true, message: '请选择专业类别' }]}
            >
              <Select placeholder="请选择专业类别" allowClear>
                {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="startDt"
              label="启用日期"
              rules={[{ required: true, message: '请选择启用日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择启用日期" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              label="请输入质控品名称"
              name="qcName"
              rules={[{ required: true, message: '请输入质控品名称' }]}
            >
              <Input placeholder="请输入质控品名称" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="exprieDt"
              label="有效期"
              rules={[{ required: true, message: '请选择有效期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择有效期" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="质控品批号" name="batchNo">
              <Input placeholder="请输入质控品批号" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="manufacturerId"
              label="生产厂家"
              rules={[{ required: true, message: '请选择生产厂家' }]}
            >
              <Select placeholder="请选择生产厂家" allowClear>
                {manufacturer.length > 0 &&
                  manufacturer.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="qcLevel" label="质控水平">
              <Select placeholder="请选择质控水平" allowClear>
                {QCLevel.length > 0 &&
                  QCLevel.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="venDonId"
              label="供应商"
              rules={[{ required: true, message: '请选择供应商' }]}
            >
              <Select placeholder="请选择供应商" allowClear>
                {manufacturer.length > 0 &&
                  manufacturer.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.dictValue}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="stopDt"
              label="停用日期"
              rules={[{ required: true, message: '请选择停用日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择停用日期" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="stopUser" label="停用操作者">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="录入日期">
              <DatePicker format="YYYY-MM-DD" disabled defaultValue={moment(now1, 'YYYY-MM-DD')} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item label="录入操作者">
              <Input disabled defaultValue={useDetail.name} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="checkReportFlag">
              <Select placeholder="请选择是否存在报告依据" allowClear>
                {reportFlag.length > 0 &&
                  reportFlag.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
