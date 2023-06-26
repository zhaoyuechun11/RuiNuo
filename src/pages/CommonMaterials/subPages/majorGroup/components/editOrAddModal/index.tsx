import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Row, Col } from 'antd';
import { addMajorGroup, updateMajorGroup, manageListSelect } from '../../../../models/server';
import ColorPicker from '@/pages/CommonMaterials/commones/colorPicker';
const { Option } = Select;
const layout = {
  // labelCol: { span: 5 },
  // wrapperCol: { span: 16 },
};
const sampleRule = ['yyyy', 'yyyymm', 'yyyymmdd', 'mm', 'mmdd', 'dd'];
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [record, setRecord] = useState({});

  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      getManageList();
      dialogRef.current && dialogRef.current.show();
      if (record) {
        let sampleRuleVal = '';
        if (record.sampleIdRule) {
          sampleRuleVal = record.sampleIdRule.split('-');
        }
        form.setFieldsValue({
          ...record,
          sampleIdRule0: sampleRuleVal[0],
          sampleIdRule1: sampleRuleVal[1],
          sampleIdRule2: sampleRuleVal[2],
        });
        setId(record.id);
        setRecord(record);
      } else {
        form && form.resetFields();
        setId(null);
        setRecord({});
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      const {
        barcodeContent,
        classCode,
        className,
        color,
        isAutoSampleId,
        isPrintBarcode,
        isSampleIdAsBarcode,
        labClassManageId,
        sampleIdResetRule,
        sampleIdRule0,
        sampleIdRule1,
        sampleIdRule2,
        seq,
      } = value;
      let firstVal = sampleIdRule0;
      let secondVal = sampleIdRule1;
      let third = sampleIdRule2;
      if (!sampleIdRule0) {
        firstVal = '';
      }
      if (!sampleIdRule1) {
        secondVal = '';
      }
      if (!sampleIdRule2) {
        third = '';
      }
      let params = {
        barcodeContent,
        classCode,
        className,
        color,
        isAutoSampleId,
        isPrintBarcode,
        isSampleIdAsBarcode,
        labClassManageId,
        sampleIdResetRule,
        sampleIdRule: firstVal + '-' + secondVal + '-' + third,
        seq,
      };
      if (id) {
        updateMajorGroup({ id: id, ...params }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        addMajorGroup({ ...params }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };
  const getManageList = () => {
    manageListSelect().then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };

  return (
    <Dialog
      ref={dialogRef}
      width={864}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="条码号内容(01样本条码，02病理编号)"
              name="barcodeContent"
              rules={[{ required: true, message: '请选择条码号内容(01样本条码，02病理编号)' }]}
            >
              <Select
                placeholder="请选择条码号内容(01样本条码，02病理编号)"
                autoComplete="off"
                allowClear
              >
                <Option value={`01`} key={1}>
                  01
                </Option>
                <Option value={`02`} key={2}>
                  02
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="分类编码" name="classCode">
              <Input
                style={{ backgroundColor: '#ffffff' }}
                maxLength={10}
                placeholder="请输入分类编码"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="分类名称"
              name="className"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input
                style={{ backgroundColor: '#ffffff' }}
                maxLength={10}
                placeholder="请输入分类名称"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="颜色" name="color">
              <ColorPicker backgroundColor={record} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="样本号重置规则"
              name="sampleIdResetRule"
              rules={[{ required: true, message: '请选择样本号重置规则' }]}
            >
              <Select placeholder="请选择样本号重置规则" autoComplete="off" allowClear>
                <Option value={`yy`} key={1}>
                  yy年
                </Option>
                <Option value={`mm`} key={2}>
                  mm月
                </Option>
                <Option value={`dd`} key={3}>
                  dd日
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="样本号生成规则"
              rules={[{ required: true, message: '请输入样本号生成规则' }]}
            >
              <Row>
                <Col span={8}>
                  <Form.Item name="sampleIdRule0" style={{ marginBottom: '0' }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="sampleIdRule1" style={{ marginBottom: '0' }}>
                    <Select allowClear>
                      {sampleRule.map((item) => {
                        return <Option value={item}>{item}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="sampleIdRule2" style={{ marginBottom: '0' }}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="顺序" name="seq" rules={[{ required: true, message: '请输入顺序' }]}>
              <Input
                style={{ backgroundColor: '#ffffff' }}
                maxLength={10}
                placeholder="请输入顺序"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isAutoSampleId"
              label="是否自动生成预制样本号"
              rules={[{ required: true, message: '请选择是否自动生成预制样本号' }]}
            >
              <Select placeholder="请选择是否自动生成预制样本号" autoComplete="off" allowClear>
                <Option value={true} key={1}>
                  是
                </Option>
                <Option value={false} key={2}>
                  否
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="isPrintBarcode" label="是否打印样本条码">
              <Select placeholder="请选择是否打印样本条码" autoComplete="off" allowClear>
                <Option value={true} key={1}>
                  是
                </Option>
                <Option value={false} key={2}>
                  否
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isSampleIdAsBarcode" label="是否样本号用作样本条码号">
              <Select placeholder="请选择是否样本号用作样本条码号" autoComplete="off" allowClear>
                <Option value={true} key={1}>
                  是
                </Option>
                <Option value={false} key={2}>
                  否
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="labClassManageId" label="管理分类">
              <Select placeholder="请选择管理分类" autoComplete="off" allowClear>
                {list.map((item) => {
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
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
