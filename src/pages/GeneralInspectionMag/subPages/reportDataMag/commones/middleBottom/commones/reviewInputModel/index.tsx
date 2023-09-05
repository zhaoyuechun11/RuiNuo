import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import Icon from '@components/Icon';
import { Select, message, Form, Input, Row, Col, Checkbox, Button } from 'antd';
import { useSelector, useDispatch } from 'umi';
import styles from './index.less';
import ResizableTable from './commones/resizableTable';
import FlagModal from './commones/flagModal';
import { reexamineResultAdd } from '../../../../../../models/server';
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ReviewInputModel = ({ Ref, refresh }) => {
  const dispatch = useDispatch();
  const { useDetail } = useSelector((state: any) => state.global);
  const { personList, reportUnitInstrList, instrAndRecordId, reportLeftVal, reviewReultsList } =
    useSelector((state: any) => state.generalInspectionMag);
  const [form] = Form.useForm();
  const dialogRef = useRef();
  const editModalRef = useRef();
  useImperativeHandle(Ref, () => ({
    showModal: () => {
      dialogRef.current && dialogRef.current.show();
      form.setFieldsValue({ instrId: instrAndRecordId.instrId });
      if (personList.length > 0) {
        form.setFieldsValue({ reOperator: useDetail.id, reResultEnteredBy: useDetail.id });
      } else {
        form.setFieldsValue({ reOperator: '', reResultEnteredBy: '' });
      }
      getList();
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'reviewReultsFlag',
          dataSource: false,
        },
      });
    },
  }));

  const onOk = () => {
    form.validateFields().then((value) => {
      let result = reviewReultsList.map((item) => {
        return {
          itemId: item.itemId,
          overKey: item.overKey,
          reResult1: item.reResult1,
          reexamineReqId: item.id,
          ...value,
        };
      });
      reexamineResultAdd(result).then((res) => {
        if (res.code === 200) {
          message.success('复查结果录入成功!');
          refresh();
          dialogRef.current && dialogRef.current.hide();
          dispatch({
            type: 'generalInspectionMag/save',
            payload: {
              type: 'reviewReultsFlag',
              dataSource: true,
            },
          });
        }
      });
    });
  };
  const getList = () => {
    dispatch({
      type: 'generalInspectionMag/fetchReexamineReq',
      payload: {
        reportId: instrAndRecordId.id,
        callback: (res: any) => {
          if (res.code === 200) {
            dispatch({
              type: 'generalInspectionMag/save',
              payload: {
                type: 'reviewReultsList',
                dataSource: res.data,
              },
            });
          }
        },
      },
    });
  };
  const columns = [
    {
      title: '代号',
      dataIndex: 'itemCode',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '复查项目名称',
      dataIndex: 'itemName',
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      title: '复查结果',
      dataIndex: 'reResult1',
      align: 'center',
      width: 100,
      render: (text: string | number, record: any) => {
        return (
          <div className={styles.icon_edit}>
            {text}
            {record.dataType === 1 ? (
              <Icon name="iconanniu-bianji" onClick={() => resultEdit(record, 'reResult1', 1)} />
            ) : record.dataType === 3 ? (
              <Button size="small" onClick={() => resultEdit(record, 'reResult1', 2)}>
                选择
              </Button>
            ) : record.dataType === 2 ? (
              <>
                <Icon name="iconanniu-bianji" onClick={() => resultEdit(record, 'reResult1', 1)} />
                <Button size="small" onClick={() => resultEdit(record, 'reResult1', 2)}>
                  选择
                </Button>
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      title: '替换',
      dataIndex: 'overKey',
      align: 'center',
      render: (text: any, record: any) => {
        return <Checkbox checked={text} onChange={(e) => overKeyChange(e, record)} />;
      },
    },
  ];
  const overKeyChange = (e, record) => {
    record['overKey'] = e.target.checked;
    const result = reviewReultsList.map((item) => {
      if (item.id === record.id) {
        return (item = record);
      } else {
        return item;
      }
    });

    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'reviewReultsList',
        dataSource: result,
      },
    });
  };
  const resultEdit = (record: any, fieldName: any, type: any) => {
    editModalRef.current.showModal(record, fieldName, type);
  };
  return (
    <Dialog ref={dialogRef} title={'复查结果录入'} onOk={onOk}>
      <Form layout="inline" form={form} {...layout} className={styles.form_box}>
        <Row>
          <Col style={{ marginLeft: '28px' }}>复查样本:</Col>
          <Col>{reportLeftVal.sampleBarcode}</Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="reSampleNo"
              label="样本号"
              rules={[{ required: true, message: '请输入样本号' }]}
            >
              <Input placeholder="请输入复查样本号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="plateNo" label="板号">
              <Input placeholder="请输入复查板号" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="position" label="位置号">
              <Input placeholder="请输入复查位置号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reOperator"
              label="实验人"
              rules={[{ required: true, message: '请选择实验人' }]}
            >
              <Select allowClear placeholder="请选择实验人">
                {personList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="reResultEnteredBy"
              label="录入人"
              rules={[{ required: true, message: '请选择录入人' }]}
            >
              <Select allowClear placeholder="请选择录入人">
                {personList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="instrId" label="仪器">
              <Select allowClear placeholder="检验仪器">
                {reportUnitInstrList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.instrName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <ResizableTable column={columns} data={reviewReultsList} />
      <FlagModal Ref={editModalRef} />
    </Dialog>
  );
};
export default ReviewInputModel;
