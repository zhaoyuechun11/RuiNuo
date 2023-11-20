import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import { Dialog } from '@components';
import { useSelector } from 'umi';
import moment from 'moment';
import { ruleSettingAdd, ruleSettingUpdate, getItemByInstr } from '../../../../../../models/server';
const { Option } = Select;
const qcRuleList = [
  {
    id: '1_2S',
    name: '一个质控测定值超过X±2s质控限。传统上，这是作为Levey-Jennings质控图上的 警告限',
  },
  {
    id: '1_3S',
    name: '一个质控测定值超过X±3s质控限。传统上，这是作为Levey-Jennings质控图上的 失控限。',
  },
  {
    id: '2_2S',
    name: '两个连续的质控测定值同时超过X-2s 或X+2s质控限,或同一天不同水平同时超过±2S',
  },
  {
    id: 'R4S',
    name: '同一天不同水平质控测定值一个超过+2S，一个超过-2S',
  },
  {
    id: '3_1S',
    name: '三个连续的质控测定值同时超过X-1s 或X+1s',
  },
  {
    id: '4_1S',
    name: '四个连续的质控测定值同时超过X-1s 或X+1s',
  },
  {
    id: '5T',
    name: '五个连续的质控测定值呈现出向上或向下的趋势',
  },
  {
    id: '7T',
    name: '七个连续的质控测定值呈现出向上或向下的趋势',
  },
  {
    id: '8X',
    name: '八个连续的质控测定值落在靶值（X）的同一侧',
  },
  {
    id: '10X',
    name: '十个连续的质控测定值落在靶值（X）的同一侧',
  },
  {
    id: '12X',
    name: '十二个连续的质控测定值落在靶值（X）的同一侧',
  },
  {
    id: 'R4S_',
    name: '连续两个测定值之差超过4S',
  },
];
const qcRuleType = [
  {
    id: 1,
    name: 'Westgard',
  },
  {
    id: 2,
    name: '绝对值',
  },
  {
    id: 3,
    name: '百分比',
  },
];
const AddOrEditModal = ({ Ref, refresh, from = '', itemList = [] }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const { leftMenuParamsRules, selectedInstr } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();

  var now1 = moment().format('YYYY-MM-DD');
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      console.log(leftMenuParamsRules);
      debugger;
      form.resetFields();
      dialogRef.current && dialogRef.current.show();
      setId(val?.qcRuleId);
      if (val) {
        form.setFieldsValue({
          ...val,
          createBy: useDetail.name,
          instrId: leftMenuParamsRules.instrCode,
          createDate: moment(val.createDate, 'YYYY-MM-DD'),
          startDt: moment(val.startDt, 'YYYY-MM-DD'),
          stopDt: moment(val.stopDt, 'YYYY-MM-DD'),
          qcRule: val?.qcRule.split(','),
          itemId: val.itemId,
        });
        return;
      }
      form.setFieldsValue({
        startDt: moment(now1, 'YYYY-MM-DD'),
        createDate: moment(now1, 'YYYY-MM-DD'),
        createBy: useDetail.name,
        instrId: leftMenuParamsRules.instrCode,
      });
    },
  }));

  const onFinish = (value: any) => {
    debugger;
    let params = {
      ...value,
      startDt: value.startDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      stopDt: value.stopDt?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      createDate: value.createDate?.format('YYYY-MM-DD') + ' ' + '00:00:00',
      stopUser: useDetail.id,
      instrId: leftMenuParamsRules.instrId,
      itemId: from === 'rulesInstr' ? 0 : value.itemId,
      createBy: useDetail.id,
      qcRule: value?.qcRule.join(','),
    };
    if (id) {
      ruleSettingUpdate({ qcRuleId: id, ...params }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
      return;
    }

    ruleSettingAdd(params).then((res) => {
      if (res.code === 200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };

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
            <Form.Item name="instrId" label="仪器代号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            {from !== 'rulesInstr' && (
              <Form.Item name="itemId" label="项目代号">
                <Select placeholder="请选择项目" allowClear>
                  {itemList.map((item) => {
                    return (
                      <Option value={item.itemId} key={item.itemId}>
                        {item.itemCode}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {from !== 'rulesItem' && (
              <Form.Item name="qcRuleType" label="规则大类">
                <Select placeholder="请选择规则大类" allowClear>
                  {qcRuleType.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="startDt"
              label="启用日期"
              rules={[{ required: true, message: '请选择启用日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择启用日期" />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item
              name="stopDt"
              label="停用日期"
              rules={[{ required: true, message: '请选择停用日期' }]}
            >
              <DatePicker format="YYYY-MM-DD" placeholder="请选择停用日期" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item name="createBy" label="创建人">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Form.Item name="createDate" label="创建日期">
              <DatePicker format="YYYY-MM-DD" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item name="qcRule" label="WestGard质控规则">
              <Select placeholder="请选择WestGard质控规则" allowClear mode="multiple">
                {qcRuleList.length > 0 &&
                  qcRuleList.map((item) => (
                    <Option value={item.id} key={item.id}>
                     {item.id} {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={2}></Col>
          <Col span={11}> */}
            {/* {from === 'rulesItem' && (
              <Form.Item name="qcRuleType" label="规则大类">
                <Select placeholder="请选择规则大类" allowClear>
                  {qcRuleType.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )} */}
          {/* </Col> */}
        </Row>
        {from === 'rulesItem' && (
              <Form.Item name="qcRuleType" label="规则大类">
                <Select placeholder="请选择规则大类" allowClear>
                  {qcRuleType.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
        {/* <Row>
         <Col span={11}>
            <Form.Item name="labId" label="实验室代号">
              <Input placeholder="请输入实验代号" />
            </Form.Item>
          </Col> 
         <Col span={2}></Col> 
          <Col span={11}>
            <Form.Item name="qcRule" label="WestGard质控规则">
              <Select placeholder="请选择WestGard质控规则" allowClear>
                {qcRuleList.length > 0 &&
                  qcRuleList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
    </Dialog>
  );
};
export default AddOrEditModal;
