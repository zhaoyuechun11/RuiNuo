import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table, Form, Input } from 'antd';
import { Dialog } from '@components';
import { getReportByReportUnit, getListByItems } from '../../../../../../models/server';
import { useSelector, useDispatch } from 'umi';
const CheckItem = ({ Ref }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [reportList, setReportList] = useState([]);
  const { reportResultList, instrAndRecordId, resultListCheckItemUsed } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const [form] = Form.useForm();
  const reportUnit = sessionStorage.getItem('reportUnit');
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
      getReportList();
      let ids = reportResultList.map((item) => item.itemId);
      setSelectedKeys(ids);
    },
  }));
  const getReportList = () => {
    if (reportUnit) {
      const newReportUnit = JSON.parse(reportUnit);
      getReportByReportUnit({ reportUnitId: newReportUnit.key }).then((res) => {
        if (res.code === 200) {
          let result = res.data?.map((item) => {
            return {
              key: item.id,
              itemId: item.id,
              itemCode: item.itemCode,
              itemName: item.itemName,
              dataType: item.dataType,
            };
          });
          setReportList(result);
        }
      });
    }
  };
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'itemCode',
      key: 'itemCode',
      render: (text) => <a>{text}</a>,
      width: 150,
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 80,
    },
  ];

  const onOk = () => {
    let filterResult = reportList?.filter((item) =>
      selectedKeys.some((data) => data === item.itemId),
    );
    let someResult = filterResult.filter(
      (item) => !resultListCheckItemUsed.some((data) => data.itemId === item.itemId),
    );
    debugger;
    // let noSomeResult = filterResult.filter(
    //   (item) => !someResult.some((data) => data.itemId === item.itemId),
    // );
    //debugger;
    // const mergedArray = [someResult, noSomeResult].reduce((acc, val) => acc.concat(val), []);

    getListByItems({
      instrId: instrAndRecordId.instrId,
      reportId: instrAndRecordId.id,
      labItemIds: someResult.map((item) => item.itemId),
    }).then((res) => {
      if (res.code === 200) {
        const mergedArray = [resultListCheckItemUsed, res.data].reduce(
          (acc, val) => acc.concat(val),
          [],
        );
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportResultList',
            dataSource: mergedArray,
          },
        });
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'isChangeReportResult',
            dataSource: true,
          },
        });
      }
    });

    dialogRef.current && dialogRef.current.hide();
  };
  const onChangeSelected = (selectedRowKeys: any) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
    getCheckboxProps: (record) => ({
      disabled: resultListCheckItemUsed.map((item) => item.itemId).includes(record.itemId), // Column configuration not to be checked
    }),
  };
  const handleSearch = (changedValues, allValues) => {
    const newReportUnit = JSON.parse(reportUnit);
    let param = {
      ...allValues,
      reportUnitId: newReportUnit.key,
    };
    getReportByReportUnit(param).then((res) => {
      if (res.code === 200) {
        let result = res.data?.map((item) => {
          return {
            key: item.id,
            itemId: item.id,
            itemCode: item.itemCode,
            itemName: item.itemName,
            dataType: item.dataType,
          };
        });
        setReportList(result);
      }
    });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'检查项目'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form layout="inline" form={form} onValuesChange={handleSearch} style={{ padding: '20px' }}>
        <Form.Item name="key">
          <Input placeholder="请输入关键字" allowClear />
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={reportList} rowSelection={rowSelection} />
    </Dialog>
  );
};
export default CheckItem;
