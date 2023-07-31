import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import { Button } from '@/components';
import { useSelector, useDispatch } from 'umi';
import ReportItems from '../ReportItems';

const Applying = ({ type }) => {
  const [list, setList] = useState([]);
  const { information, sampleList, applyList } = useSelector(
    (state: any) => state.preProcessingMag,
  );

  const [sampleListData, setSampleListData] = useState([]);
  const [informationList, setInformationList] = useState([]);
  const reportItemsRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(applyList);
    //debugger
    // const result = applyList?.map((item) => {
    //   return { sampleTypeName: item.defaultSampleTypeName, itemName: item.reqItemName, ...item };
    // });
    //console.log('result', result);

    setList(applyList);
  }, [applyList]);
  useEffect(() => {
    if (type === 2 && sampleList?.length === 0) {
      setSampleListData([]);
    } else {
      setSampleListData(sampleList);
    }
  }, [sampleList]);
  useEffect(() => {
    if (type === 3) {
      setInformationList(information);
    }
  }, [information]);

  const applyColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '项目编号',
      dataIndex: 'reqItemCode',
      key: 'reqItemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      key: 'reqItemName',
      align: 'center',
    },
    {
      title: '样本类型',
      key: 'defaultSampleTypeName',
      dataIndex: 'defaultSampleTypeName',
      align: 'center',
    },
    {
      title: '专业类别',
      key: 'labClassName',
      dataIndex: 'labClassName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (text, record) => (
        <div style={{display:'flex',justifyContent:'center'}}>
          <Button
            onClick={() => {
              deleteCurrentItem(record.id, 1);
            }}
          >
            删除
          </Button>
          <Button
            onClick={() => {
              reportItemsRef.current.show(record.id);
            }}
          >
            明细
          </Button>
        </div>
      ),
    },
  ];
  const inspectionColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '样本类型',
      dataIndex: 'sampleTypeName',
      key: 'sampleTypeName',
      align: 'center',
    },
    {
      title: '样本性状',
      dataIndex: 'sampleStateName',
      key: 'sampleStateName',
      align: 'center',
    },
    {
      title: '检验目的',
      key: 'labPurpose',
      dataIndex: 'labPurpose',
      align: 'center',
    },
    {
      title: '原病理号',
      key: 'pathologyNo',
      dataIndex: 'pathologyNo',
      align: 'center',
    },
    {
      title: '原蜡块序号',
      key: 'lkNo',
      dataIndex: 'lkNo',
      align: 'center',
    },
    {
      title: '病理样本序号',
      key: 'pathologySampleSeqNo',
      dataIndex: 'pathologySampleSeqNo',
      align: 'center',
    },
    {
      title: '样本描述',
      key: 'sampleDesc',
      dataIndex: 'sampleDesc',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <Button
          onClick={() => {
            deleteCurrentItem(index, 2);
          }}
        >
          删除
        </Button>
      ),
    },
  ];
  const informationColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <a>{index}</a>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '图片名称',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
    },

    {
      title: '图片地址',
      key: 'filePath',
      dataIndex: 'filePath',
      align: 'center',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <Button
          onClick={() => {
            deleteCurrentItem(index, 3);
          }}
        >
          删除
        </Button>
      ),
    },
  ];
  const deleteCurrentItem = (index, type) => {
    if (type === 1) {
      let result = list.filter((item) => item.id != index);
      const sampleResult = result.map((item) => {
        return {
          sampleTypeName: item.defaultSampleTypeName,
          sampleTypeId: item.defaultSampleTypeId,
          sampleStateName: '正常',
          sampleStateId: 1130,
        };
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'applyList',
          dataSource: result,
        },
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'sampleList',
          dataSource: sampleResult,
        },
      });
    }
    if (type === 2) {
      let result = sampleListData.filter((item, itemIndex) => itemIndex != index);
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'sampleList',
          dataSource: result,
        },
      });
    }
    if (type === 3) {
      let result = informationList.filter((item, infoIndex) => infoIndex != index);
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'information',
          dataSource: result,
        },
      });
    }
  };
  return (
    <>
      <Table
        columns={type === 1 ? applyColumns : type === 2 ? inspectionColumns : informationColumns}
        dataSource={type === 1 ? list : type === 2 ? sampleListData : informationList}
      />
      <ReportItems refs={reportItemsRef} />
    </>
  );
};
export default Applying;
