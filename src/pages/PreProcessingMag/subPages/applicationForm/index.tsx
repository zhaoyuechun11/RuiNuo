import React, { useEffect } from 'react';
import { Table } from '@common';
import { useDispatch } from 'umi';
const applicationForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getApplicationForm();
  }, []);
  const columns = [
    {
      title: '送检样本码',
      dataIndex: 'receiveBarcode',
      align: 'center',
      width: 150,
      key: 'receiveBarcode',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
      align: 'center',
      width: 150,
      key: 'hospitalName',
    },
    {
      title: '默认样本类型',
      dataIndex: 'defaultSampleTypeId',
      align: 'center',
      width: 150,
      key: 'defaultSampleTypeName',
      render: (text, record) => {
        // return (
        //   <Select
        //     placeholder="请选择默认值"
        //     autoComplete="off"
        //     allowClear
        //     value={text}
        //     onChange={(e) => defaultValChange(e, record)}
        //   >
        //     {sample?.map((item) => {
        //       return (
        //         <Option value={item.id} key={item.id}>
        //           {item.dictValue}
        //         </Option>
        //       );
        //     })}
        //   </Select>
        // );
      },
    },
    {
      title: '项目类别',
      dataIndex: 'labClassName',
      fixed: 'left',
      align: 'center',
      key: 'labClassName',
      width: 150,
    },
    {
      title: '外送',
      dataIndex: 'isOut',
      align: 'center',
      width: 150,
    },
    {
      title: '外送单位',
      dataIndex: 'outCompanyName',
      align: 'center',
      width: 150,
    },
  ];
  const getApplicationForm = () => {
    dispatch({
      type: 'preProcessingMag/feactApplicationForm',
      payload: {
        callback: (res) => {
          //   setFieldList(res.data);
          //   getMainOrderDetail(params?.id);
        },
      },
    });
  };
  return (
    <Table
      unit="个"
      columns={columns}
      // selectedRowKeys={selectedRows.map((i) => i.id)}
      // data={list}
      // pagination={{ current: pageNum, total: total }}
      // onChange={handleStandardTableChange}
      // onSelectRow={handleSelectRows}
      isRowSelection={true}
      rowKey="id"
      locale={{
        emptyText: (
          <div>
            <img
              width="115px"
              height="99px"
              src={require('@assets/images/empty/table_empty.png')}
              alt=""
            />
            <div>暂无数据</div>
          </div>
        ),
      }}
    />
  );
};
export default applicationForm;
