import React, { useState, useEffect } from 'react';
import { Input, Table, Menu, Dropdown, Form, message } from 'antd';
import { Button } from '@/components';
import {
  getExplainContent,
  getExplainSuggestions,
  updateExplainContent,
} from '../../../../../../models/server';
import { useSelector } from 'umi';
const { TextArea } = Input;
const ExplainAdvise = () => {
  const [comment, setComment] = useState(0);
  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  const [suggestions, setSuggestions] = useState([]);
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  // 输入框触发
  const onInputer = (e) => {
    let comment = e.target.value;
    setComment(comment);
  };
  useEffect(() => {
    explainContent();
    explainSuggestions({ key: '' });
  }, []);
  const explainContent = () => {
    getExplainContent({ id: instrAndRecordId.id }).then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ suggestions: res.data });
        setComment(res.data);
      }
    });
  };
  const explainSuggestions = (params: any) => {
    getExplainSuggestions(params).then((res) => {
      if (res.code === 200) {
        setSuggestions(res.data);
      }
    });
  };
  const columns = [
    {
      title: '词条代号',
      dataIndex: 'entryId',
      align: 'center',
    },
    {
      title: '建议与解释',
      dataIndex: 'entryTypeValue',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      render: (text, record) => {
        return (
          <Dropdown
            arrow
            overlay={() => menu(record)}
            trigger={['click']}
            placement="bottomCenter"
            overlayClassName="dropdownWrap"
          >
            <div className="flex_center w100" style={{ height: '40px', cursor: 'pointer' }}>
              <div className="flex_between" style={{ width: 22 }}>
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
              </div>
            </div>
          </Dropdown>
        );
      },
    },
  ];
  const menu = (item: any) => {
    return (
      <Menu>
        <Menu.Item onClick={() => addWrap(item)}>换行添加</Menu.Item>
        <Menu.Item onClick={() => add(item)}>增量添加</Menu.Item>
        <Menu.Item onClick={() => cover(item)}>覆盖</Menu.Item>
      </Menu>
    );
  };
  const addWrap = (item: any) => {
    let result = form.getFieldsValue().suggestions;
    form.setFieldsValue({ suggestions: result + '\n' + item.entryTypeValue });
    setComment(result + item.entryTypeValue);
  };
  const add = (item: any) => {
    let result = form.getFieldsValue().suggestions;
    form.setFieldsValue({ suggestions: result + item.entryTypeValue });
    setComment(result + item.entryTypeValue);
  };
  const cover = (item: any) => {
    form.setFieldsValue({ suggestions: item.entryTypeValue });
    setComment(item.entryTypeValue);
  };
  const sure = () => {
    updateExplainContent({
      id: instrAndRecordId.id,
      explainContent: form.getFieldsValue().suggestions,
    }).then((res: any) => {
      if (res.code === 200) {
        message.success('添加成功!');
      }
    });
  };
  const searchHandle = (changedValues: any, allValues: undefined) => {
    explainSuggestions(allValues);
  };
  const renderForm = () => {
    return (
      <Form
        layout="inline"
        form={formSearch}
        style={{ marginBottom: '10px' }}
        onValuesChange={searchHandle}
      >
        <Form.Item name="key" label="词条搜索">
          <Input placeholder="请输入关键字" style={{ width: 240 }} allowClear />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <Form form={form} layout="inline">
        <Form.Item name="suggestions" style={{ width: '100%' }}>
          <TextArea
            maxLength={500}
            placeholder="随手记下你对候选人的评价"
            autoSize={{ minRows: 4, maxRows: 11 }}
            bordered
            onChange={onInputer}
          />
        </Form.Item>
        <div style={{ textAlign: 'right', width: '100%' }}>{comment?.length || 0}/500</div>
      </Form>
      {renderForm()}
      <Table columns={columns} dataSource={suggestions} bordered size="small" pagination={false} />
      <div>
        <Button onClick={sure} style={{ margin: 'auto' }}>
          确定
        </Button>
      </div>
    </>
  );
};
export default ExplainAdvise;
