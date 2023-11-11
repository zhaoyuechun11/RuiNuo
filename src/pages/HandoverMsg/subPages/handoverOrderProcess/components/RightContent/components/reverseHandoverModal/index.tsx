import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Form, TreeSelect, Input } from 'antd';
import { Dialog } from '@components';
import { updateDeliveryStatus } from '../../../../../../models/server';
import { deptList } from '@/models/server';
import { useSelector } from 'umi';
import moment from 'moment';
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const ReverseHandoverModal = ({ Ref, refresh }) => {
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [deptListData, setDeptListData] = useState([]);
  const [pid, setPid] = useState();
  const [form] = Form.useForm();
  const [record, setRecord] = useState();
  const [operateBtnType, setOperateBtnType] = useState();

  useImperativeHandle(Ref, () => ({
    show: (val: any, type: any) => {
      form.resetFields();
      getDeptList();
      setRecord(val);
      setOperateBtnType(type);
      dialogRef.current && dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));

  const onFinish = (values: any) => {
    let params = { id: record.id, ...values };
    let newParams = {};
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (operateBtnType === 1) {
      newParams = {
        ...params,
        appendBy: useDetail.id,
        appendTime:now,
      };
    }
    if (operateBtnType === 2) {
      newParams = {
        ...params,
        doneTime: now,
        status: 2,
      };
    }
    updateDeliveryStatus(newParams).then((res) => {
      if (res.code === 200) {
        message.success('反交接成功');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const getDeptList = () => {
    deptList().then((res: any) => {
      if (res.code === 200) {
        setDeptListData(res.data);
      }
    });
  };
  const departmentChange = (e: any) => {
    setPid(e);
  };
  const renderUserTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            checkable
            dataRef={item}
            title={item.deptName}
            key={item.id + ''}
            value={item.id}
          >
            {renderUserTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          checkable
          dataRef={item}
          key={item.id + ''}
          title={item.deptName}
          value={item.id}
        />
      );
    });
  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={operateBtnType === 1 ? '继续处理' : operateBtnType === 2 ? '处理完成' : '反交接'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form layout="vertical" form={form} style={{ padding: '20px' }} onFinish={onFinish}>
        <Form.Item
          name={
            operateBtnType === 1
              ? 'appendContent'
              : operateBtnType === 2
              ? 'solveContent'
              : 'solveDept'
          }
          label={operateBtnType === 1 ? '继续处理' : operateBtnType === 2 ? '处理完成' : '反交接'}
          rules={[
            {
              required: true,
              message:
                operateBtnType === 1
                  ? '请输入继续处理反馈内容'
                  : operateBtnType === 2
                  ? '请输入处理完成反馈内容'
                  : '请选择反交接部门',
            },
          ]}
        >
          {operateBtnType === 1 || operateBtnType === 2 ? (
            <TextArea placeholder="请输入反馈内容" autoSize={{ minRows: 3, maxRows: 5 }} />
          ) : (
            <TreeSelect
              allowClear
              placeholder="请选择反交接部门"
              value={pid}
              showSearch
              treeNodeFilterProp="title"
              onChange={(e) => departmentChange(e)}
            >
              {renderUserTreeNodes(deptListData)}
            </TreeSelect>
          )}
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default ReverseHandoverModal;
