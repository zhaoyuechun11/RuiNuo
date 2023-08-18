import React, { useImperativeHandle, useRef, useState } from 'react';
import { Table } from 'antd';
import { Dialog } from '@components';
import { getReportByReportUnit } from '../../../../../../models/server';
import { useSelector, useDispatch } from 'umi';
const CheckItem = ({ Ref }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [reportList, setReportList] = useState([]);
  const { reportResultList } = useSelector((state: any) => state.generalInspectionMag);
  useImperativeHandle(Ref, () => ({
    show: () => {
      dialogRef.current && dialogRef.current.show();
      getReportList();
      let ids = reportResultList.map((item) => item.itemId);
      setSelectedKeys(ids);
    },
  }));
  const getReportList = () => {
    const reportUnit = sessionStorage.getItem('reportUnit');

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
              // ...item,
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
    let someResult = reportResultList.filter((item) =>
      filterResult.some((data) => data.itemId === item.itemId),
    );
    let noSomeResult = filterResult.filter(
      (item) => !someResult.some((data) => data.itemId === item.itemId),
    );
    //debugger;
    const mergedArray = [someResult, noSomeResult].reduce((acc, val) => acc.concat(val), []);

    debugger;
    /**去重 */
    // let map = new Map();
    // for (let item of mergedArray) {
    //   map.set(item.itemId, item);
    // }
    // const result = [...map.values()];

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

    dialogRef.current && dialogRef.current.hide();
  };
  const onChangeSelected = (selectedRowKeys: any) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
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
      <Table columns={columns} dataSource={reportList} rowSelection={rowSelection} />
    </Dialog>
  );
};
export default CheckItem;
