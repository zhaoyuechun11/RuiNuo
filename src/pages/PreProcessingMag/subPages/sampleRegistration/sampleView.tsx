import React from 'react';
import { Table } from 'antd';

const SampleView = (props) => {
  const {
    columns,
    // data: { list, count },
    page = 1,
    onChangePage,
  } = props;

  return (
    <div>
      <Table
        scroll={{ x: 'max-content' }}
        rowKey={'id'}
        columns={columns}
        dataSource={[]}
        pagination={{
          showQuickJumper: true,
        //   total: count,
          pageSize: 10,
          current: page,
          onChange: onChangePage,
        }}
      />
    </div>
  );
};

export default SampleView;
