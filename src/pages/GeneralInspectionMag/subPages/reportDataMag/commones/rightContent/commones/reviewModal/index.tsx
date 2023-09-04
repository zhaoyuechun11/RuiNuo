import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, Input, Table, message } from 'antd';
import { Dialog, Button } from '@components';
import { useSelector, useDispatch } from 'umi';
import styles from '../../index.less';
import { getReexamineItems, applyReview } from '../../../../../../models/server';
const { TextArea } = Input;
const ReviewModal = ({ Ref }) => {
  const { reviewList } = useSelector((state: any) => state.generalInspectionMag);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [reasonReviewForm] = Form.useForm();
  const reportIds = useRef();
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      getList({ reportIds: val });
      reportIds.current = val;
      dialogRef.current && dialogRef.current.show();
    },
  }));
  const getList = (reportIds: any) => {
    getReexamineItems(reportIds).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item: any) => {
          return {
            ...item,
            key: item.itemId,
          };
        });
        setList(result);
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reviewList',
            dataSource: result,
          },
        });
      }
    });
  };
  const search = () => {
    const { key } = form.getFieldsValue();
    let searchResult = [];

    if (key) {
      reviewList.map((item) => {
        Object.values(item).forEach((val) => {
          if (val === key) {
            searchResult.push(item);
          }
        });
      });
    } else {
      if (key === '' || key == undefined) {
        searchResult = list;
      }
    }

    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'reviewList',
        dataSource: searchResult,
      },
    });
  };
  const renderForm = () => {
    return (
      <Form layout="inline" form={form}>
        <Form.Item name="key">
          <Input placeholder="请输入编号或名称" style={{ width: 130 }} allowClear />
        </Form.Item>
      </Form>
    );
  };
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'itemCode',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedKeys(selectedRowKeys);
    },
  };
  const review = () => {
    if (selectedKeys.length === 0) {
      message.warning('请选择需要复查的项目!');
      return;
    }
    if (!reasonReviewForm.getFieldsValue().reexamineReason) {
      message.warning('请输入复查原因!');
      return;
    }
    let params = {
      itemIds: selectedKeys,
      reexamineReason: reasonReviewForm.getFieldsValue().reexamineReason,
      reportIds: reportIds.current,
    };
    applyReview(params).then((res) => {
      if (res.code === 200) {
        message.success('复查成功!');
        dialogRef.current.hide();
      }
    });
  };
  return (
    <>
      <Dialog ref={dialogRef} width={640} title={'申请复查'} onOk={review}>
        <div className={styles.search_box}>
          {renderForm()}
          <Button btnType="primary" size="small" onClick={search}>
            查询
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={reviewList}
          pagination={false}
        />
        <Form layout="inline" form={reasonReviewForm} className={styles.reasonReview}>
          <Form.Item name="reexamineReason" label="复查原因">
            <TextArea placeholder="请输入复查原因" autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
      </Dialog>
    </>
  );
};
export default ReviewModal;
