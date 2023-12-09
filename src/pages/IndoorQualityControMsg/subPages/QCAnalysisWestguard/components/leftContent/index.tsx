import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { getReqItemListByQcs } from '@/models/server';
import styles from '../../index.less';
const LeftContent = ({ ...props }) => {
  const dispatch = useDispatch();
  const { qcList } = props;
  const [reqItemList, setReqItemList] = useState([]);
  const [selectIndex, setSelectIndex] = useState(0);
  const { AWSelectedQcIds } = useSelector((state: any) => state.IndoorQualityControMsg);
  const onSelectChange = (newSelectedRowKeys: any) => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWSelectedQcIds',
        dataSource: newSelectedRowKeys,
      },
    });
    if (newSelectedRowKeys.length > 0) {
      getReqItemList({ qcIds: newSelectedRowKeys });
    } else {
      setReqItemList([]);
      dispatch({
        type: 'IndoorQualityControMsg/save',
        payload: {
          type: 'AWItem',
          dataSource: '',
        },
      });
    }
  };
  useEffect(() => {
    setReqItemList([]);
  }, [qcList]);
  useEffect(() => {

    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWSelectedQcIds',
        dataSource: [],
      },
    });
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWItem',
        dataSource: '',
      },
    });
  
  }, []);
  const rowSelection = {
    selectedRowKeys: AWSelectedQcIds,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: '质控品',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '质控品水平',
      dataIndex: 'qcLevelName',
      align: 'center',
    },
    {
      title: '质控品批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '启用日期',
      dataIndex: 'startDt',
      align: 'center',
    },
  ];
  const columns1 = [
    {
      title: '项目代号',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
  ];
  const getReqItemList = (params: any) => {
    getReqItemListByQcs(params).then((res) => {
      if (res.code === 200) {
        setReqItemList(res.data);
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'AWItem',
            dataSource: res.data[0],
          },
        });
      }
    });
  };
  const getCurrentItem = (val: any) => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWItem',
        dataSource: val,
      },
    });
  };
  const getRowClassName = (record: any, index: any) => {
    let className = '';
    className = index === selectIndex ? styles.selectedRow : '';
    return className;
  };
  return (
    <div style={{marginTop:'10px'}}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={qcList}
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <Table
        columns={columns1}
        dataSource={reqItemList}
        size="small"
        pagination={false}
        rowClassName={getRowClassName}
        onRow={(record, index) => {
          return {
            onClick: () => {
              // 设置选中的index
              setSelectIndex(index);
              getCurrentItem(record);
            },
          };
        }}
      />
    </div>
  );
};
export default LeftContent;
