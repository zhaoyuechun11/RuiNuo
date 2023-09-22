import React, { useRef, useImperativeHandle, useState } from 'react';
import { Dialog } from '@components';
import { Form, message, Select } from 'antd';
import { dictList, majorGroup } from '@/models/server';
import { flowchart, suitFlowCondAdd, suitFlowCondUpdate } from '../../../../models/server';
const { Option } = Select;
const AddOrEdit = ({ cRef, refresh }) => {
  const [form] = Form.useForm();
  const modalRef = useRef();
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [sampleSource, setSampleSource] = useState([]);
  const [majorGroupList, setMajorGroupList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [id, setId] = useState('');
  useImperativeHandle(cRef, () => ({
    show: (val: any) => {
      form.resetFields();
      getDictList({ type: 'BT' });
      getDictList({ type: 'FT' });
      getMajorGroup();
      getFlowchartList();
      if (val) {
        const { labClassId, sampleTypeId, source, flowId, id } = val;
        form.setFieldsValue({
          labClassId: labClassId.split(',').map((item: any) => Number(item)),
          sampleTypeId: sampleTypeId?.split(',').map((item: any) => Number(item)),
          source: source?.split(',').map((item: any) => Number(item)),
          flowId,
        });
        setId(id);
      }
      modalRef.current.show();
    },
  }));

  const onFinish = (values) => {
    let params = {
      flowId: values.flowId,
      labClassId: values.labClassId.join(','),
      sampleTypeId: values.sampleTypeId?.join(','),
      source: values.source?.join(','),
    };
    if (id) {
      suitFlowCondUpdate({ ...params, id }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          modalRef.current.hide();
          refresh();
        }
      });
      return;
    }
    suitFlowCondAdd(params).then((res) => {
      if (res.code == 200) {
        message.success('保存成功');
        modalRef.current.hide();
        refresh();
      }
    });
  };
  const getDictList = (type) => {
    dictList(type).then((res) => {
      if (res.code === 200) {
        if (type.type == 'BT') {
          setSampleTypeList(res.data);
        }
        if (type.type === 'FT') {
          setSampleSource(res.data);
        }
      }
    });
  };
  const getMajorGroup = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupList(res.data);
      }
    });
  };
  const getFlowchartList = () => {
    flowchart().then((res: any) => {
      if (res.code === 200) {
        setProcessList(res.data);
      }
    });
  };
  return (
    <Dialog
      title={id ? '编辑' : '添加'}
      width={640}
      ref={modalRef}
      onCancel={() => modalRef.current.hide()}
      onOk={() => {
        form.submit();
      }}
    >
      <div style={{ padding: '10px' }}>
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="检测类别"
            name="labClassId"
            rules={[{ required: true, message: '请选择检测类别' }]}
          >
            <Select placeholder="请选择检测类别" allowClear mode="multiple">
              {majorGroupList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="sampleTypeId" label="样本类型">
            <Select placeholder="请选择样本类型" allowClear mode="multiple">
              {sampleTypeList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.dictValue}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="source" label="病人类型">
            <Select placeholder="请选择病人类型" allowClear mode="multiple">
              {sampleSource?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.dictValue}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="flowId"
            label="适用流程"
            rules={[{ required: true, message: '请选择适用流程' }]}
          >
            <Select placeholder="请选择适用流程" allowClear>
              {processList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.flowName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Dialog>
  );
};

export default AddOrEdit;
