import React, { useCallback, useEffect, useRef, useState } from 'react';
import { history, useDispatch } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Icon, Button } from '@/components';
import { Tooltip, message, Spin } from 'antd';
import SetHeaderModal from './components/SetHeaderModal';
import QueryData from './components/QueryData';
import SampleView from './sampleView';
let passProps = {};
const SampleRegistration = () => {
  const setRef = useRef();
  const dispatch = useDispatch();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [tableColumns, setTableColumns] = useState();
  const [data, setData] = useState({ count: 0, list: [] });
  const [page, setPage] = useState(1);
  useEffect(() => {
    getCustomHeader();
  }, []);

  useEffect(() => {
    let listSeqs = selectedColumns.map((item) => {
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

    const newSelectedColumns = tableFieldResult.map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    passProps = {
      columns: [
        ...newSelectedColumns,
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: 100,
          render: (text: string, record: Record<string, any>) => (
            <span>
              <Button>编辑</Button>
            </span>
          ),
        },
      ],
      data,
      page,
      onChangePage,
    };
  }, [selectedColumns]);

  const getCustomHeader = () => {
    dispatch({
      type: 'preProcessingMag/getCustomHeader',
      payload: {
        callback: (res: { code: number; data: any[] }) => {
          if (res.code === 200) {
            // setList(res.data.records);
            // setTotal(res.data.total);
            const selectedFields = res.data.filter(
              (item: Record<string, any>) => item?.isListDisplay == true,
            );
            console.log(selectedFields);
            setSelectedColumns(selectedFields);
            setColumnOptionsList(res.data);
          }
        },
      },
    });
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
  const onChangePage = (pageNum: number) => {
    setPage(pageNum);
    // setParams({ ...params, page: pageNum });
  };

  return (
    <div
    // onClick={() => {
    //   history.push('/preProcessingMag/sampleRegistration/addOrEdit');
    // }}
    >
      <Button
        btnType="primary"
        onClick={() => {
          history.push('/preProcessingMag/sampleRegistration/addOrEdit');
        }}
      >
        <PlusOutlined style={{ marginRight: 4 }} />
        新增
      </Button>
      <QueryData />
      <Tooltip placement="top" arrowPointAtCenter title="自定义表头">
        <span
          //   className={styles.settings}
          onClick={() => {
            setRef.current && setRef.current?.show();
          }}
        >
          <Icon name="iconhouxuanren-shezhi" style={{ fontSize: 20 }} />
        </span>
      </Tooltip>
      <SampleView {...passProps} />
      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
    </div>
  );
};
export default SampleRegistration;
