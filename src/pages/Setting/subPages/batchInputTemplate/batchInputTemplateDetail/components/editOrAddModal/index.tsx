import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Switch, Select } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { reportProjectSele } from '@/models/server';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [pid, setPid] = useState();
  const dispatch = useDispatch();

  const [reportProjectList, setReportProjectList] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  useImperativeHandle(Ref, () => ({
    show: (record, pid) => {
      dialogRef.current && dialogRef.current.show();
      getReportProjectSelect();
      setPid(pid);
      if (record) {
        debugger;
        form.setFieldsValue({ ...record });

        setId(record.id);
      } else {
        setId(null);
        form && form.resetFields();
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const getReportProjectSelect = () => {
    reportProjectSele().then((res) => {
      if (res.code === 200) {
        setReportProjectList(res.data);
      }
    });
  };
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        dispatch({
          type: 'Setting/fetchInputTemplateDetailUpdate',
          payload: {
            ...value,
            id,
            mainId: pid,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('修改成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
        });
      } else {
        dispatch({
          type: 'Setting/fetchInputTemplateDetailAdd',
          payload: {
            ...value,
            mainId: pid,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('添加成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
        });
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
    >
      <Form form={form} {...layout} style={{ paddingTop: '20px' }}>
        <Form.Item label="默认的输入值" name="defaultValue">
          <Input placeholder="请输入默认的输入值" />
        </Form.Item>
        <Form.Item label="输入序号" name="orderNo">
          <Input placeholder="请输入输入序号" />
        </Form.Item>

        <Form.Item name="itemId" label="检验项目">
          <Select placeholder="请选择检验项目" allowClear>
            {reportProjectList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.itemName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
