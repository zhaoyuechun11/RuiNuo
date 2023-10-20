import React, { useState, useRef, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import { Select, Form } from 'antd';
import { downLoad } from '@/utils';
import { reportComQueryList, reportCompQueryExport } from '../../../../models/server';
import { useSelector } from 'umi';
const { Option } = Select;
const ResultTable = ({ Ref }) => {
  const { queryDataReportCompre } = useSelector((state: any) => state.reportMag);
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const dialogRef = useRef();
  useImperativeHandle(Ref, () => ({
    show: () => {
      getReportComQueryList();
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const getReportComQueryList = () => {
    reportComQueryList().then((res: any) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const onOk = () => {
    let params = {
      ...queryDataReportCompre,
      ...form.getFieldsValue(),
    };
    reportCompQueryExport(params).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '结果表');
    });
    dialogRef.current && dialogRef.current.hide();
  };
  return (
    <Dialog
      ref={dialogRef}
      title={'表格式模版'}
      onOk={onOk}
      onCancel={() => dialogRef.current && dialogRef.current.hide()}
    >
      <Form layout="inline" form={form} style={{ padding: '60px' }}>
        <Form.Item name="moduleId" label="结果表格式模版">
          <Select style={{ width: 200 }}>
            {list.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default ResultTable;
