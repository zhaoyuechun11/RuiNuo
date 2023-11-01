import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useDispatch, history } from 'umi';
import { Button, Icon } from '@/components';
import SingleReceipt from './commones/singleReceipt';
import BatchReceipt from './commones/batchReceipt';
import { useLocation } from 'umi';
import SetHeaderModal from './commones/SetHeaderModal';
import { singleReceiptTabHeader } from '../../models/server';
const { TabPane } = Tabs;
const SampleReceipt = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState('1');
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [receiptTableHeader, setReceiptTableHeader] = useState([]);
  const setRef = useRef();
  const onChange = (e: any) => {
    setActiveKey(e);
  };
  useEffect(() => {
    getSingleReceiptTabHeader();
  }, []);
  const tabBar = (
    // 时间段筛选
    <div>
      <Button
        btnType="primary"
        onClick={() => {
          setRef.current && setRef.current?.show();
        }}
      >
        <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20, marginRight: 6 }} />
        自定义签收表头
      </Button>
    </div>
  );
  const getSingleReceiptTabHeader = () => {
    singleReceiptTabHeader().then((res: any) => {
      console.log('res', res);
      if (res.code === 200) {
        const selectedFields = res.data.filter(
          (item: Record<string, any>) => item?.isListDisplay == true,
        );
        setColumnOptionsList(res.data);
        setSelectedColumns(selectedFields);
        setTableHeader(selectedFields);
      }
    });
  };
  const setTableHeader = (selectedColumns: any) => {
    let listSeqs = selectedColumns.map((item: any) => {
      return item.listSeq;
    });

    let sortResult = listSeqs
      .sort(function (a, b) {
        return a - b;
      })
      .filter((item) => item !== undefined);
    let noSeq = [];
    noSeq = selectedColumns.filter((item) => item.listSeq == undefined);
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });
    if (noSeq.length > 0) {
      tableFieldResult.push(...noSeq);
    }
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        sorter: true,
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    const Columns = tableFieldResult.map((column: any) => {
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        align: 'center',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    const lastColumn = {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render: (text: string, record: Record<string, any>) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              history.push(
                '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
              );
            }}
          >
            编辑
          </Button>
        </div>
      ),
    };
    const allColumn = [...firstColumm, ...Columns, lastColumn];
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'receiptTableHeader',
        dataSource: allColumn,
      },
    });
    setReceiptTableHeader(allColumn);
  };
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          getSingleReceiptTabHeader();
        },
      },
    });
  };
  return (
    <>
      <Tabs activeKey={activeKey} onChange={onChange} tabBarExtraContent={tabBar}>
        <TabPane tab="样本单个签收(未)" key="1">
          <SingleReceipt receiptTableHeader={receiptTableHeader} />
        </TabPane>
        <TabPane tab="样本批量签收(未)" key="2">
          <BatchReceipt receiptTableHeader={receiptTableHeader}/>
        </TabPane>
      </Tabs>
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
    </>
  );
};
export default SampleReceipt;
