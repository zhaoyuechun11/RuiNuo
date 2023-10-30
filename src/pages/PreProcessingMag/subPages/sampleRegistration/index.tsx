import React, { useEffect, useRef, useState } from 'react';
import { history, useDispatch, useSelector } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Icon, Button } from '@/components';
import { message } from 'antd';
import SetHeaderModal from './components/SetHeaderModal';
import QueryData from './components/QueryData';
import SampleView from './sampleView';
import { reqMainOrderDelete, reqMainOrderExport } from '../../models/server';
import BatchImport from '@/pages/CommonMaterials/commones/batchImport';
import { downLoad } from '@/utils';
let passProps = {};
const SampleRegistration = () => {
  const { queryData, pageNum } = useSelector((state: any) => state.preProcessingMag);
  const setRef = useRef();
  const dispatch = useDispatch();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [data, setData] = useState({ count: 0, list: [], pageNum: 1, pageSize: 10 });
  const [pageSize, setPageSize] = useState(10);
  const importRef = useRef();
  const searchVal = useRef();
  useEffect(() => {
    getCustomHeader();
  }, []);
  useEffect(() => {
    reqMainOrderList();
  }, [pageNum, queryData]);

  useEffect(() => {}, [selectedColumns]);
  const deleteCurrentItem = (ids: any) => {
    reqMainOrderDelete({ ids: [ids] }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        reqMainOrderList();
      }
    });
  };

  const getCustomHeader = () => {
    dispatch({
      type: 'preProcessingMag/getCustomHeader',
      payload: {
        callback: (res: { code: number; data: any[] }) => {
          if (res.code === 200) {
            const selectedFields = res.data.filter(
              (item: Record<string, any>) => item?.isListDisplay == true,
            );
            setSelectedColumns(selectedFields);
            setColumnOptionsList(res.data);
            selectedColummHandle(selectedFields);
          }
        },
      },
    });
  };
  const selectedColummHandle = (selectedColumns: any) => {
    let listSeqs = selectedColumns.map((item: any) => {
      return item.listSeq;
    });

    let sortResult = listSeqs.sort(function (a, b) {
      return a - b;
    });
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: selectedField(column.key),
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    const midColumns = tableFieldResult.map((column) => {
      return {
        title: column.name,
        dataIndex: selectedField(column.key),
        responsive: ['xl', 'xxl'],
        align: 'center',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    passProps = {
      columns: [
        ...firstColumm,
        ...midColumns,
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: 180,
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
              <Button
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  deleteCurrentItem(record.id);
                }}
              >
                删除
              </Button>
            </div>
          ),
        },
      ],
      onChangePage,
    };
  };

  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          getCustomHeader();
        },
      },
    });
  };
  const reqMainOrderList = () => {
    dispatch({
      type: 'preProcessingMag/getReqMainOrder',
      payload: {
        pageNum,
        pageSize,
        ...queryData,
        callback: (res) => {
          setData({ list: res.data.records, count: res.data.total, pageNum, pageSize });
        },
      },
    });
  };
  const onChangePage = (pageNum: number, size: React.SetStateAction<number>) => {
    changeModelData('pageNum', pageNum);
    setPageSize(size);
  };

  const selectedField = (val) => {
    switch (val) {
      case 'sex':
        return 'sexName';
      case 'sendDeptId':
        return 'sendDeptName';
      case 'sendDoctorId':
        return 'sendDoctorName';
      case 'hospitalId':
        return 'hospitalName';
      case 'nation':
        return 'nationName';
      case 'nationality':
        return 'nationalityName';
      default:
        return val;
    }
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    reqMainOrderExport({ ...searchVal.current }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '样本登记');
    });
  };
  const changeModelData = (type, value) => {
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type,
        dataSource: value,
      },
    });
  };
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <Button
          style={{ padding: '6px 10px' }}
          btnType="primary"
          onClick={() => {
            history.push('/preProcessingMag/sampleRegistration/addOrEdit/' + 0 + '/' + 'add');
          }}
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
        <Button btnType="primary" style={{ margin: '0 10px' }} onClick={importData}>
          导入
        </Button>
        <Button btnType="primary" onClick={exportData}>
          导出
        </Button>
      </div>
      <QueryData />
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
        }}
      >
        <span
          onClick={() => {
            setRef.current && setRef.current?.show();
          }}
        >
          <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20, textAlign: 'right' }} />
        </span>
        自定义表头
      </div>

      <SampleView {...passProps} data={data} />
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
      <BatchImport
        cRef={importRef}
        actionUrl={`${process.env.baseURL}/lab/reqMainOrder/importReqMain`}
        title={'导入申请单'}
        refresh={() => reqMainOrderList()}
      ></BatchImport>
    </div>
  );
};
export default SampleRegistration;
