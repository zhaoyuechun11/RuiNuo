import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import {
  Form,
  Input,
  message,
  Select,
  InputNumber,
  Tooltip,
  Switch,
  DatePicker,
  Transfer,
} from 'antd';

import styles from './index.less';
import // formulaAdd,
// formulaUpdate,
// reportProjectSele,
// getCalculationResults,
'../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh, instrList, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [list, setList] = useState();

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      // reportProjectSeleList('');
      form && form.resetFields();

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
        formulaUpdate({
          id: id,
          labItemId: parent.id,
          instrId: value.instrId,
          formula: value.formula,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        formulaAdd({ instrId: value.instrId, formula: value.formula, labItemId: parent.id }).then(
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

  const reportProjectSeleList = (val: string) => {
    reportProjectSele({ key: val }).then((res) => {
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
      // footer={
      //   <Button disabled={activation} onClick={onOk}>
      //     保存
      //   </Button>
      // }
      onOk={onOk}

      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="单位名称"
          name="instrId"
          rules={[{ required: true, message: '请选择单位名称' }]}
        >
          <Select
            placeholder="请选择单位名称"
            autoComplete="off"
            allowClear
            // onInputKeyDown={onInputKeyDownPosition}
            optionFilterProp="searchData"
            filterOption={(input, option) =>
              option.searchData.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.searchData.toLowerCase().localeCompare(optionB.searchData.toLowerCase())
            }
            // onChange={projectCategoryChange}
          >
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id} searchData={item.position_name}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="回款类别"
          name="instrId"
          rules={[{ required: true, message: '请选择回款类别' }]}
        >
          <Select
            placeholder="请选择回款类别"
            autoComplete="off"
            allowClear
            // onChange={projectCategoryChange}
          >
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="formula" label="合同价扣率">
          <InputNumber className={styles.number}></InputNumber>
        </Form.Item>
        <Form.Item name="formula" label="销售成本">
          <InputNumber className={styles.number}></InputNumber>
        </Form.Item>
        <Form.Item name="formula" label={<Tooltip title="标准价折数">销售报价扣率</Tooltip>}>
          <InputNumber className={styles.number}></InputNumber>
        </Form.Item>
        <Form.Item label="启用">
          <Switch></Switch>
        </Form.Item>
        <Form.Item label="启用日期">
          <DatePicker />
        </Form.Item>
        <Form.Item label="启用日期">
          <Select
            placeholder="请选择回款类别"
            autoComplete="off"
            allowClear
            // onChange={projectCategoryChange}
          >
            {instrList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
          <Transfer
            style={{ marginTop: '10px' }}
            dataSource={[]}
            showSearch
            // filterOption={this.filterOption}
            // targetKeys={this.state.targetKeys}

            // render={(item) => item.title}
          />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
