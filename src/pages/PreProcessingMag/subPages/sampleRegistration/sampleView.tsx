import React from 'react';
import { Table } from 'antd';

const SampleView = ( data, props ) => {
  const {
    columns,
    page = 1,
    onChangePage,
  } = props;
  console.log('data', data);
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
          pageSize: 10,
          current: data.data.page,
          onChange: data.onChangePage,
        }}
      />
    </div>
  );
};

export default SampleView;
