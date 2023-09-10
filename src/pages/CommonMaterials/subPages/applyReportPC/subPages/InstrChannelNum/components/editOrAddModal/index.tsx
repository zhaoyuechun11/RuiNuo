import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Switch } from 'antd';
import { RPInstrChannelNumAdd, RPInstrChannelNumUpdate } from '../../../../../../models/server';
import { useSelector } from 'umi';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState();
  const { instrList, instrId } = useSelector((state: any) => state.commonMaterials);
  const [selecteInstr, setSelecteInstr] = useState();
  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      // form.setFieldsValue({ instrId });
      getInstr();
      if (record) {
        form.setFieldsValue({
          ...record,
        });
        setId(record.id);
        setDisable(record.isDisable);
      } else {
        setDisable(false);
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
        RPInstrChannelNumUpdate({
          id: id,
          labItemId: parent.id,
          instrId,
          ...value,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        RPInstrChannelNumAdd({ ...value, labItemId: parent.id, instrId }).then(
          (res: { code: number }) => {
            if (res.code === 200) {
              message.success('添加成功');
              dialogRef.current && dialogRef.current.hide();
              refresh();
            }
          },
        );
      }
    });
  };
  const isDisableChange = (e: boolean | ((prevState: boolean) => boolean)) => {
    setDisable(e);
  };
  const getInstr = () => {
    let result = instrList.filter((item: any) => item.id == instrId);
    setSelecteInstr(result[0].instrName);
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
      {!id && (
        <div
          style={{
            borderBottom: '1px solid #cecede',
            paddingBottom: '10px',
            margin: '20px 55px',
          }}
        >
          <span>检验仪器:</span>
          {selecteInstr}
        </div>
      )}
      <Form form={form} {...layout}>
        {/* <Form.Item label="检验仪器" name="instrId">
          <Select placeholder="请选择仪器" allowClear disabled>
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item> */}

        <Form.Item
          label="通道号"
          name="interCode"
          rules={[{ required: true, message: '请输入通道号' }]}
        >
          <Input maxLength={10} placeholder="请输入通道号" />
        </Form.Item>
        <Form.Item name="isDisable" label="禁用">
          <Switch onChange={isDisableChange} checked={disable} />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
