import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Table, Form, Select } from 'antd';
import { templateList, templateDetailList } from '../../../../../../models/server';
const { Option } = Select;
const BatchAdd = ({ Ref }) => {
  const dialogRef = useRef();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [form] = Form.useForm();
  const [templateData, setTemplateData] = useState([]);
  const [list, setList] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
      const reportUnit = sessionStorage.getItem('reportUnit');
      if (reportUnit) {
        const newReportUnit = JSON.parse(reportUnit);
        getTemplateList(newReportUnit.key);
      }
    },
  }));
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 150,
    },
    {
      title: '结果',
      dataIndex: 'defaultValue',
      key: 'age',
      width: 80,
    },
    {
      title: '模版',
      dataIndex: 'mainName',
      key: 'mainName',
      width: 80,
    },
  ];

  const onOk = () => {};
  const onChangeSelected = (selectedRowKeys) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {};
  const getTemplateList = (val) => {
    templateList({ reportUnitId: val }).then((res) => {
      if (res.code === 200) {
        setTemplateData(res.data);
      }
    });
  };
  const getTemplateDetailList = (id) => {
    templateDetailList({ mainId: id }).then((res) => {
      if (res.code === 200) {
        let result = templateData.filter((item) => item.id === id);
        // let templateList = res.data.map((item) => {
        //   return {
        //     ...item,
        //     templateName: result[0].templateName,
        //     templateId: result[0].id,
        //   };
        // });
        setList(res.data);
      }
    });
  };
  const templateChange = (e) => {
    console.log(e);
    getTemplateDetailList(e);
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
      <Form onValuesChange={searchHandle} layout="inline" form={form}>
        <Select placeholder="请选择录入模版" allowClear onChange={templateChange} mode="multiple">
          {templateData?.map((item, index) => {
            return (
              <Option value={item.id} key={index}>
                {item.templateName}
              </Option>
            );
          })}
        </Select>
      </Form>
      <Table columns={columns} dataSource={list} rowSelection={rowSelection} />
    </Dialog>
  );
};
export default BatchAdd;
