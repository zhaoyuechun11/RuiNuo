import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, Select, message, DatePicker } from 'antd';
import { useSelector } from 'umi';
import moment from 'moment';
import { appraiseAdd, appraiseUpdate } from '../../../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const { TextArea } = Input;
const AddOrEdit = ({ Ref, refresh }) => {
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  const { AWQcList, AWItem } = useSelector((state: any) => state.IndoorQualityControMsg);
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      setId(record?.id);
      dialogRef.current && dialogRef.current.show();
      if (!record) {
        form && form.resetFields();
        form.setFieldsValue({
          operateTime: moment(now1, 'YYYY-MM-DD HH:mm:ss'),
          operateUser: useDetail.name,
          qcDate: moment(now1, 'YYYY-MM-DD'),
        });
      } else {
        form.setFieldsValue({
          ...record,
          qcDate: moment(record.qcDate),
          operateTime: moment(record.appraiseTime),
          operateUser: record.appraiseUserName,
        });
      }
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      const { appraiseText, qcId } = value;
      if (!id) {
        appraiseAdd({
          qcDate: value.qcDate.format('YYYY-MM-DD'),
          appraiseText,
          qcId,
          itemId: AWItem.id,
        }).then((res) => {
          if (res.code == 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
        return;
      }
      appraiseUpdate({
        qcDate: value.qcDate.format('YYYY-MM-DD'),
        appraiseText,
        qcId,
        itemId: AWItem.id,
        id,
      }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功');
          dialogRef.current && dialogRef.current.hide();
          refresh();
        }
      });
    });
  };

  return (
    <Dialog ref={dialogRef} width={640} title={id ? '编辑' : '新增'} onOk={onOk}>
      <Form form={form} {...layout} style={{ paddingTop: '20px' }}>
        <Form.Item name="qcId" label="质控品" rules={[{ required: true, message: '请选择质控品' }]}>
          <Select placeholder="请选择质控品ID+质控水平+质控品批号" allowClear>
            {AWQcList.length > 0 &&
              AWQcList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.id} {item.batchNo} {item.qcLevelName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="评价内容"
          name="appraiseText"
          rules={[{ required: true, message: '请输入评价内容' }]}
        >
          <TextArea placeholder="请输入评价内容" />
        </Form.Item>
        <Form.Item label="操作时间" name="operateTime">
          <DatePicker disabled showTime />
        </Form.Item>
        <Form.Item label="操作人" name="operateUser">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="评价日期"
          name="qcDate"
          rules={[{ required: true, message: '请选择评价日期' }]}
        >
          <DatePicker format={'YYYY-MM-DD'} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default AddOrEdit;
