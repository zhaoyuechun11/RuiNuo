import { Table } from 'antd';
import React, { useState } from 'react';
const SampleSorting = () => {
  const [selectedRowKeysVal, setSelectedRowKeysVal] = useState([1]);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeysVal(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: [1, 2],
    onChange: onSelectChange,
  };
  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
   
    />
  );
};
export default SampleSorting;
