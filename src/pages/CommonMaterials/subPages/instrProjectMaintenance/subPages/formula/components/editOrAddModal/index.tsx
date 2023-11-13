import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Radio, Button, Row, Col } from 'antd';

import {
  formulaAdd,
  formulaUpdate,
  getDataTypeNumList,
  getCalculationResults,
} from '../../../../../../models/server';
import { useSelector } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
const EditOrAddModal = ({ Ref, refresh, parent }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [list, setList] = useState();
  const [activation, setActivation] = useState(true);
  const { instrId } = useSelector((state: any) => state.commonMaterials);
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
          instrId,
          formula: value.formula,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        formulaAdd({ instrId, formula: value.formula, labItemId: parent.id }).then(
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
    getDataTypeNumList().then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const charChange = (e) => {
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
    }
  };
  const clear = () => {
    form.setFieldsValue({ formula: '' });
  };
  const verify = () => {
    calculationResults();
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
  const add = (val: any) => {
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
      width={640}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      footer={
        <>
          <Button type="primary" onClick={clear}>
            清空
          </Button>
          <Button type="primary" onClick={verify}>
            验证
          </Button>
          <Button disabled={activation} onClick={onOk}>
            保存
          </Button>
        </>
      }
    >
      <Form form={form} className={styles.form_box}>
        <Row>
          <Col span={24}>
            <Form.Item name="formula">
              <TextArea></TextArea>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10} style={{ border: '1px solid #9d9fa0' }}>
            <div style={{ height: 300, overflowY: 'scroll', padding: 10 }}>
              {list?.map((item: any) => {
                return (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <div>{item.itemName}</div>
                      <div>
                        <Button onClick={() => add(item.id)} size="small" type="primary">
                          添加
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col span={2}></Col>
          <Col span={12}>
            <Form.Item>
              <Radio.Group buttonStyle="solid" onChange={charChange}>
                <Radio.Button value={0}>+</Radio.Button>
                <Radio.Button value={1}>-</Radio.Button>
                <Radio.Button value={2}>*</Radio.Button>
                <Radio.Button value={3}>/</Radio.Button>
                <Radio.Button value={4}>(</Radio.Button>
                <Radio.Button value={5}>)</Radio.Button>
                {/* <Radio.Button value={6}>清空</Radio.Button> */}
                {/* <Radio.Button value={7}>验证</Radio.Button> */}
              </Radio.Group>
            </Form.Item>
            <div>
              <div>说明:</div>
              <div>1.计算公式中不可包括其他计算项目,若有需要,一律转换为最原始的计算公式</div>
              <div>2.所有项目代号必须“[”和“]”括起来</div>
              <div>3.表达式可以为常数和空字符串</div>
            </div>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
