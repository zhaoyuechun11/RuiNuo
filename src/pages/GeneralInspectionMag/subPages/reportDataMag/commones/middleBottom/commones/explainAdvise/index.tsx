import React, { useState } from 'react';
import { Input, Table, Menu, Dropdown } from 'antd';
import { Button } from '@/components';
const { TextArea } = Input;
const ExplainAdvise = () => {
  const [comment, setComment] = useState([]); // 评价草稿
  // 输入框触发
  const onInputer = (e) => {
    let comment = e.target.value;
    setComment(comment);
  };
  const columns = [
    {
      title: '词条代号',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: '建议与解释',
      className: 'column-money',
      dataIndex: 'money',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      render: (record: { id: any }) => {
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
  const menu = (item) => {
    return (
      <Menu>
        <Menu.Item>添加</Menu.Item>
        <Menu.Item>覆盖</Menu.Item>
      </Menu>
    );
  };

  const data = [
    {
      key: '1',
      name: 'John Brown',
      money: '￥300,000.00',
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      money: '￥1,256,000.00',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      money: '￥120,000.00',
      address: 'Sidney No. 1 Lake Park',
    },
  ];
  return (
    <>
      <TextArea
        maxLength={500}
        placeholder="随手记下你对候选人的评价"
        autoSize={{ minRows: 4, maxRows: 11 }}
        bordered
        value={comment}
        onChange={onInputer}
      />
      <div style={{ textAlign: 'right' }}>{comment.length}/500</div>
      <Table columns={columns} dataSource={data} bordered title={() => '词条搜索'} size="small" />,
    </>
  );
};
export default ExplainAdvise;
