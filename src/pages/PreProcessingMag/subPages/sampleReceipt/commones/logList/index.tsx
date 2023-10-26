import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { mainLogList } from '../../../../models/server';
const LogList = ({ mainId }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (mainId) {
      logList(mainId);
    }
  }, [mainId]);
  const logList = (mainId: any) => {
    mainLogList({ mainId }).then((res: any) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const columns = [
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
      align: 'center',
    },
    {
      title: '节点代码',
      dataIndex: 'nodeCode',
      key: 'nodeCode',
      align: 'center',
    },
    {
      title: '延迟标志',
      dataIndex: 'delayFlag',
      key: 'delayFlag',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '延迟时间',
      key: 'delayTime',
      dataIndex: 'delayTime',
      align: 'center',
    },
    {
      title: '操作人',
      key: 'operatorName',
      dataIndex: 'operatorName',
      align: 'center',
    },
    {
      title: '操作时间',
      key: 'operateTime',
      dataIndex: 'operateTime',
      align: 'center',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      align: 'center',
    },
  ];

  return <Table columns={columns} dataSource={list} scroll={{ x: 'max-content' }} size="small" />;
};
export default LogList;
