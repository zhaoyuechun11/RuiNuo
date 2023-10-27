import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, Select } from 'antd';
import { Dialog } from '@components';
import { dictList } from '@/models/server';
import { giveUpCheck } from '../../../../models/server';
const { Option } = Select;
const AbandonedInspection = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [giveUpCheckList, setGiveUpCheckList] = useState([]);
  const [splitId, setSplitId] = useState();
  useImperativeHandle(Ref, () => ({
    show: (val, record, index) => {
      setSplitId(record.key);
      form.resetFields();
      getDictList();
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const getDictList = () => {
    dictList({ type: 'ABNORMALID' }).then((res) => {
      if (res.code === 200) {
        setGiveUpCheckList(res.data);
      }
    });
  };
  const onOk = () => {
    let giveUpReason = form.getFieldsValue()['giveUpReason'].join('|');
    giveUpCheck({ giveUpReason, splitId, winName: '单个签收页面弃检' }).then((res) => {
      if (res.code === 200) {
        message.success('弃检成功!');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  return (
    <Dialog ref={dialogRef} title={'据检'} onOk={onOk}>
      <Form layout="inline" form={form}>
        <Form.Item
          name="giveUpReason"
          style={{ padding: '20px', width: '100%' }}
          rules={[{ required: true, message: '请选择弃检原因' }]}
        >
          <Select placeholder="请选择弃检原因" allowClear mode="multiple">
            {giveUpCheckList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default AbandonedInspection;
