import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, message, Select, InputNumber } from 'antd';
import {
  printOrderAdd,
  printOrderUpdate,
  reportProjectSele,
} from '../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [reportProjectlist, setReportProjectlist] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      getReportProjectList();
      if (record) {
        form.setFieldsValue({
          ...record,
        });
        setId(record.id);
      } else {
        setId(null);
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        printOrderUpdate({
          id: id,
          instrId: parent.id,
          ...value,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        printOrderAdd({ ...value, instrId: parent.id }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };
  const getReportProjectList = () => {
    reportProjectSele().then((res) => {
      if (res.code === 200) {
        setReportProjectlist(res.data);
      }
    });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout} style={{ paddingTop: '20px' }}>
        {/* <Form.Item
          name="labItemId"
          label="报告项目"
          rules={[{ required: true, message: '请选择报告项目' }]}
        >
          <Select
            placeholder="请选择报告项目"
            allowClear
          >
            {reportProjectlist.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.itemName}
                </Option>
              );
            })}
          </Select>
        </Form.Item> */}
        <Form.Item label="顺序" name="seq">
          <InputNumber />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
