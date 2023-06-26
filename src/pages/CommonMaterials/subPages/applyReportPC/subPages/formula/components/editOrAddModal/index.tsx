import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Radio, Button } from 'antd';
import debounce from 'lodash/debounce';
import {
  formulaAdd,
  formulaUpdate,
  reportProjectSele,
  getCalculationResults,
} from '../../../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const { TextArea } = Input;
const EditOrAddModal = ({ Ref, refresh, instrList, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [list, setList] = useState();
  const [activation, setActivation] = useState(true);
  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      reportProjectSeleList('');
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
  const charChange = (e) => {
    console.log('e', e.target.value);
    setActivation(true);

    switch (e.target.value) {
      case 0:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + '+' });
        break;
      case 1:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + '-' });
        break;
      case 2:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + '*' });
        break;
      case 3:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + '/' });
        break;
      case 4:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + '(' });
        break;
      case 5:
        form.setFieldsValue({ formula: form.getFieldValue('formula') + ')' });
        break;
      case 6:
        form.setFieldsValue({ formula: '' });
        break;
      case 7:
        calculationResults();
        break;
    }
  };
  const calculationResults = () => {
    console.log(form.getFieldValue('formula').replace(/\[|]/g, ''));

    getCalculationResults({ expression: form.getFieldValue('formula').replace(/\[|]/g, '') }).then(
      (res) => {
        if (res.code === 200) {
          if (!isNaN(res.data)) {
            message.success('验证成功');
            setActivation(false);
          } else {
            message.success('验证失败');
            setActivation(true);
          }
        }
      },
    );
  };
  const add = (val) => {
    setActivation(true);
    if (form.getFieldValue('formula')) {
      form.setFieldsValue({ formula: form.getFieldValue('formula') + '[' + val + ']' });
    } else {
      form.setFieldsValue({ formula: '[' + val + ']' });
    }
  };
  const keywordsChange = (e) => {
    reportProjectSeleList(e.target.value);
  };
  return (
    <Dialog
      ref={dialogRef}
      width={864}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      footer={
        <Button disabled={activation} onClick={onOk}>
          保存
        </Button>
      }
      // onOk={onOk}

      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item label="仪器" name="instrId" rules={[{ required: true, message: '请选择仪器' }]}>
          <Select
            placeholder="请选择仪器"
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
        <Form.Item label="检测项目">
          <div>
            <Input
              placeholder="请输入关键字"
              onChange={keywordsChange}
              allowClear
              style={{ marginBottom: '10px' }}
            />

            {list?.map((item) => {
              return (
                <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div>{item.itemName}</div>
                    <div>
                      <Button onClick={() => add(item.id)}>添加</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Form.Item>
        <Form.Item name="formula" label="计算公式">
          <TextArea></TextArea>
        </Form.Item>
        <Form.Item label="运算符">
          <Radio.Group buttonStyle="solid" onChange={charChange}>
            <Radio.Button value={0}>+</Radio.Button>
            <Radio.Button value={1}>-</Radio.Button>
            <Radio.Button value={2}>*</Radio.Button>
            <Radio.Button value={3}>/</Radio.Button>
            <Radio.Button value={4}>(</Radio.Button>
            <Radio.Button value={5}>)</Radio.Button>
            <Radio.Button value={6}>清空</Radio.Button>
            <Radio.Button value={7}>验证</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
