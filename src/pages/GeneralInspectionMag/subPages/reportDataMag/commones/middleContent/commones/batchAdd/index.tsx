import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table, Form, Input, Checkbox, Row, Col } from 'antd';
import { templateList, templateDetailList, getListByItems } from '../../../../../../models/server';

import styles from './index.less';
import { useSelector, useDispatch } from 'umi';
const BatchAdd = ({ Ref }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [templateData, setTemplateData] = useState([]);
  const [list, setList] = useState([]);
  const reportUnit = localStorage.getItem('reportUnit');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { templateId, instrAndRecordId, resultListCheckItemUsed } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const dispatch = useDispatch();
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
      setCurrentIndex(0);
      if (reportUnit) {
        const newReportUnit = JSON.parse(reportUnit);
        getTemplateList(newReportUnit.key, '');
      }
    },
  }));
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'name',
      width: 150,
    },
    {
      title: '结果',
      dataIndex: 'defaultValue',
      key: 'age',
      width: 80,
    },
  ];

  const onOk = () => {
    templateDetailList({ mainIds: templateId }).then((res) => {
      if (res.code === 200) {
        const temp = res.data.reduce((tempArr: any, item: any) => {
          if (tempArr.findIndex((ele: any) => ele.itemId === item.itemId) === -1) {
            tempArr.push(item);
          }
          return tempArr;
        }, []);
        console.log(temp);
        getListByItems({
          instrId: instrAndRecordId.instrId,
          reportId: instrAndRecordId.id,
          labItemIds: temp.map((item) => item.itemId),
        }).then((res) => {
          if (res.code === 200) {
            res.data.map((item, index) => {
              temp.map((tempItem) => {
                if (item.itemId === tempItem.itemId) {
                  res.data[index]['result'] = tempItem.defaultValue;
                }
              });
            });
            const mergedArray = [resultListCheckItemUsed, res.data].reduce(
              (acc, val) => acc.concat(val),
              [],
            );
            const result = mergedArray.reduce((tempArr: any, item: any) => {
              if (tempArr.findIndex((ele: any) => ele.itemId === item.itemId) === -1) {
                tempArr.push(item);
              }
              return tempArr;
            }, []);
            dispatch({
              type: 'generalInspectionMag/save',
              payload: {
                type: 'reportResultList',
                dataSource: result,
              },
            });
            dispatch({
              type: 'generalInspectionMag/save',
              payload: {
                type: 'batchAdd',
                dataSource: true,
              },
            });
          }
        });
      }
    });
    dialogRef.current && dialogRef.current.hide();
  };

  const searchHandle = (changedValues: any, allValues: undefined) => {
    const newReportUnit = JSON.parse(reportUnit);
    getTemplateList(newReportUnit.key, allValues.key);
  };
  const getTemplateList = (val, key) => {
    templateList({ reportUnitId: val, key }).then((res) => {
      if (res.code === 200) {
        setTemplateData(res.data);
        getTemplateDetailList([res.data[0]?.id]);
      }
    });
  };
  const getTemplateDetailList = (id) => {
    templateDetailList({ mainIds: id }).then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };

  const onChange = (e) => {
    templateId.push(e.id);
  };
  const clickName = (index: any, item: any) => {
    setCurrentIndex(index);
    getTemplateDetailList([item.id]);
  };

  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'批量录入'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      {/* <Form onValuesChange={searchHandle} layout="inline" form={form}>
        <Select placeholder="请选择录入模版" allowClear onChange={templateChange} mode="multiple">
          {templateData?.map((item, index) => {
            return (
              <Option value={item.id} key={index}>
                {item.templateName}
              </Option>
            );
          })}
        </Select>
      </Form> */}
      <Row>
        <Col span={8} className={styles.list_form}>
          <Form
            onValuesChange={searchHandle}
            layout="inline"
            form={form}
            className={styles.form_box}
          >
            <Form.Item name="key">
              <Input placeholder="请输入关键字" allowClear />
            </Form.Item>
          </Form>
          {templateData?.map((item, index) => {
            return (
              <div className={styles.list} key={index}>
                <Checkbox onChange={() => onChange(item)}></Checkbox>
                <div
                  onClick={() => clickName(index, item)}
                  className={`${currentIndex === index ? styles.blue : ''}`}
                >
                  {item.templateName}
                </div>
              </div>
            );
          })}
        </Col>
        <Col span={16}>
          <Table columns={columns} dataSource={list} pagination={false} size="small" />
        </Col>
      </Row>
    </Dialog>
  );
};
export default BatchAdd;
