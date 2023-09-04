import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Switch, Select } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { reportUnitSelect } from '@/models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const [reportUnitList, setReportUnitList] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  useImperativeHandle(Ref, () => ({
    show: (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      getReportUnitSelect();
      if (record) {
        form.setFieldsValue({ ...record });
        setFlag(record.autoFlag === 1 ? true : false);
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
  const getReportUnitSelect = () => {
    reportUnitSelect({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnitList(res.data);
      }
    });
  };
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        dispatch({
          type: 'Setting/fetchInputTemplateUpdate',
          payload: {
            ...value,
            autoFlag: flag ? 1 : 0,
            id,
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
          type: 'Setting/fetchInputTemplateAdd',

          payload: {
            ...value,
            autoFlag: flag ? 1 : 0,
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
  const onChange = (e) => {
    setFlag(e);
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
        <Form.Item
          name="reportUnitId"
          label="报告单元"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Select placeholder="请选择报告单元" allowClear>
            {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="批输入模板名称" name="templateName">
          <Input placeholder="请输入批输入模板名称" />
        </Form.Item>
        <Form.Item label="自动输入标志" name="autoFlag">
          <Switch checked={flag} onChange={onChange} />
        </Form.Item>
        <Form.Item label="自动输入起始号" name="startNo">
          <Input placeholder="请输入自动输入起始号" disabled={!flag} />
        </Form.Item>
        <Form.Item label="自动输入终止号" name="endNo">
          <Input placeholder="请输入自动输入终止号" disabled={!flag} />
        </Form.Item>
        <Form.Item label="输入代号" name="inputCode">
          <Input placeholder="请输入输入代号" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
