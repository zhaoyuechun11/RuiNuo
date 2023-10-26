import React from 'react';
import { Table } from 'antd';
const SampleView = (data: any) => {
  return (
    <div>
      <Table
        size={'small'}
        scroll={{ x: 'max-content' }}
        rowKey={'id'}
        columns={data.columns}
        dataSource={data?.data.list}
        pagination={{
          showQuickJumper: true,
          total: data.data.count,
          pageSize: data.data.pageSize,
          current: data.data.pageNum,
          onChange: data.onChangePage,
        }}
      />
    </div>
  );
};

export default SampleView;
