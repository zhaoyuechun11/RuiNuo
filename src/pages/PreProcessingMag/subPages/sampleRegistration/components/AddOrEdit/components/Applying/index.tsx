import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useSelector, useDispatch } from 'umi';

const Applying = ({ type, applyListData, setApplyList, deleteSampleResult }) => {
  const [list, setList] = useState([]);
  const { information, sampleList, applyList } = useSelector(
    (state: any) => state.preProcessingMag,
  );

  const [sampleListData, setSampleListData] = useState([]);
  const [informationList, setInformationList] = useState([]);
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
    // const result = list?.map((item) => {
    //   return { itemId: item.id, ...item };
    // });
    // dispatch({
    //   type: 'preProcessingMag/save',
    //   payload: {
    //     type: 'applyList',
    //     dataSource: result,
    //   },
    // });
  }, [list]);
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
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      key: 'reqItemName',
    },
    {
      title: '样本类型',
      key: 'defaultSampleTypeName',
      dataIndex: 'defaultSampleTypeName',
    },
    {
      title: '专业类别',
      key: 'labClassName',
      dataIndex: 'labClassName',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <Button
          onClick={() => {
            deleteCurrentItem(record.id, 1);
          }}
        >
          删除
        </Button>
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
    },
    {
      title: '样本性状',
      dataIndex: 'sampleStateName',
      key: 'sampleStateName',
    },
    {
      title: '检验目的',
      key: 'labPurpose',
      dataIndex: 'labPurpose',
    },
    {
      title: '原病理号',
      key: 'pathologyNo',
      dataIndex: 'pathologyNo',
    },
    {
      title: '原蜡块序号',
      key: 'lkNo',
      dataIndex: 'lkNo',
    },
    {
      title: '病理样本序号',
      key: 'pathologySampleSeqNo',
      dataIndex: 'pathologySampleSeqNo',
    },
    {
      title: '样本描述',
      key: 'sampleDesc',
      dataIndex: 'sampleDesc',
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
    },

    {
      title: '图片地址',
      key: 'filePath',
      dataIndex: 'filePath',
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
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'applyList',
          dataSource: result,
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
    <Table
      columns={type === 1 ? applyColumns : type === 2 ? inspectionColumns : informationColumns}
      dataSource={type === 1 ? list : type === 2 ? sampleListData : informationList}
    />
  );
};
export default Applying;
