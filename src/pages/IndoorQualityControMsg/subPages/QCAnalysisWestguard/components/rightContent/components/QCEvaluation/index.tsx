import React, { useEffect, useRef, useState } from 'react';
import { Table, message, Popconfirm } from 'antd';
import { Button } from '@/components';
import AddOrEdit from './components/addOrEdit';
import { useSelector } from 'umi';
import { appraiseList, appraiseDelete } from '../../../../../../models/server';
const QCEvaluation = () => {
  const { AWQcList, AWItem, AWSelectedQcIds } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [list, setList] = useState([]);
  const modalRef = useRef(null);
  useEffect(() => {
    if (AWItem !== '' && AWSelectedQcIds.length > 0) {
      getAppraiseList({ pageNum, pageSize, itemId: AWItem.id, qcIds: AWSelectedQcIds });
    }
  }, [pageNum, pageSize, AWItem, AWSelectedQcIds]);
  const columns = [
    {
      title: '评价日期',
      dataIndex: 'qcDate',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '质控品',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '评价内容',
      dataIndex: 'appraiseText',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'appraiseTime',
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'appraiseUserName',
      align: 'center',
    },
    {
      title: '质控评价ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '报告项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              onClick={() => {
                modalRef.current.show(record);
              }}
              style={{ marginRight: '10px' }}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否确认要删除么?"
              onConfirm={() => confirmRefuse(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const confirmRefuse = (id: any) => {
    appraiseDelete({ ids: [id] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功!');
        getAppraiseList({ pageNum, pageSize, itemId: AWItem.id, qcIds: AWSelectedQcIds });
      }
    });
  };
  const pageChange = (page: any, size: any) => {
    setPageNum(page);
    setPageSize(size);
  };
  const add = () => {
    if (AWQcList.length === 0 || AWItem == '') {
      message.warning('质控品列表和项目列表都不能为空哦!');
      return;
    }
    modalRef.current.show();
  };
  const getAppraiseList = (params: any) => {
    appraiseList(params).then((res) => {
      if (res.code === 200) {
        setList(res.data.records);
        setTotal(res.data.Total);
      }
    });
  };
  return (
    <>
      <Button btnType="primary" onClick={add} style={{ margin: '10px' }}>
        新增
      </Button>
      <Table
        scroll={{ x: 'max-content' }}
        size="small"
        dataSource={list}
        columns={columns}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      ></Table>
      <AddOrEdit
        Ref={modalRef}
        refresh={() => {
          getAppraiseList({ pageNum, pageSize, itemId: AWItem.id, qcIds: AWSelectedQcIds });
        }}
      />
    </>
  );
};
export default QCEvaluation;
