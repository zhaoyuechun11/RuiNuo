import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, Select, DatePicker, TreeSelect, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deptList, dictList } from '@/models/server';
import s from '../../../index.less';
import { useSelector } from 'umi';
import moment from 'moment';
import { deliveryReceiptAdd, getBarName, deliveryReceiptUpdate } from '../../../../models/server';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const isEmerList = [
  {
    id: 0,
    name: '否',
  },
  {
    id: 1,
    name: '是',
  },
];
const EditOrAddModal = ({ Ref, from = '', refresh }) => {
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [deptListData, setDeptListData] = useState([]);
  const [pid, setPid] = useState();
  const [giveUpCheckList, setGiveUpCheckList] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      dialogRef.current && dialogRef.current.show();
      getDeptList();
      getDictList();
      form && form.resetFields();
      form.setFieldsValue({
        copyTo: [''],
        submitBy: useDetail.name,
        submitDept: useDetail.departmentName,
        submitTime: moment(now1, 'YYYY-MM-DD HH:mm:ss'),
        receiveBarcode: from == 'sampleReceipt' ? record.receiveBarcode : '',
        name: from == 'sampleReceipt' ? record.patientName : '',
      });
      if (record && from !== 'sampleReceipt') {
        form.setFieldsValue({
          ...record,
          submitDept: useDetail.departmentName,
          submitBy: useDetail.name,
          submitTime: record.submitTime ? moment(record.submitTime) : '',
          isEmer: record.isEmer ? 1 : 0,
          copyTo: [
            record.copyTo1 === 0 ? '' : record.copyTo1,
            record.copyTo2 === 0 ? '' : record.copyTo2,
            record.copyTo3 == 0 ? '' : record.copyTo3,
          ],
        });
        setId(record.id);
      } else {
        setId(null);
        setTimeout(() => {
          var testTarget = document.getElementsByClassName('ant-select-selection-item')[0]; // 我们想要取到的第一个
          testTarget.innerHTML = '请选择抄送部门';
          testTarget.className = 'ant-select-selection-placeholder';
        }, 500);
      }
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        deliveryReceiptUpdate({
          id: id,
          ...value,
          submitBy: useDetail.id,
          submitDept: useDetail.departmentId,
          submitTime: value.submitTime?.format('YYYY-MM-DD HH:mm:ss'),
        }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        deliveryReceiptAdd({
          ...value,
          submitBy: useDetail.id,
          submitDept: useDetail.departmentId,
          submitTime: value.submitTime?.format('YYYY-MM-DD HH:mm:ss'),
        }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const departmentChange = (e: any, index: any) => {
    if (index === 0) {
      if (form.getFieldsValue().solveDept) {
        var testTarget = document.getElementsByClassName('ant-select-selection-placeholder')[1]; // 我们想要取到的第一个
        testTarget.className = 'ant-select-selection-item';
        return;
      }
      var testTarget = document.getElementsByClassName('ant-select-selection-placeholder')[2]; // 我们想要取到的第一个
      testTarget.className = 'ant-select-selection-item';
    }
    setPid(e);
  };
  const getDeptList = () => {
    deptList().then((res: any) => {
      if (res.code === 200) {
        setDeptListData(res.data);
      }
    });
  };

  const getDictList = () => {
    dictList({ type: 'ABNORMALID' }).then((res) => {
      if (res.code === 200) {
        setGiveUpCheckList(res.data);
      }
    });
  };
  const getBarNameData = (val) => {
    getBarName({ receiveBarcode: val }).then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ name: res.data });
      }
    });
  };
  const barcodeBlur = (e) => {
    getBarNameData(e.target.value);
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
    <Dialog ref={dialogRef} width={640} title={id ? '编辑' : '新增'} onOk={onOk}>
      <Form layout="vertical" form={form} className={s.form_box}>
        <Form.Item name="solveDept" label="处理部门">
          <TreeSelect
            allowClear
            placeholder="请选择处理部门"
            value={pid}
            showSearch
            treeNodeFilterProp="title"
            onChange={(e) => departmentChange(e, null)}
          >
            {renderUserTreeNodes(deptListData)}
          </TreeSelect>
        </Form.Item>
        <Form.List name="copyTo">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? '抄送部门' : ''}
                  required={false}
                  key={field.key}
                  id="list_form"
                >
                  <Form.Item {...field} noStyle className={`formList${index}`}>
                    <TreeSelect
                      allowClear
                      style={{ width: '92.5%', marginRight: '8px' }}
                      placeholder="请选择抄送部门"
                      value={pid}
                      showSearch
                      treeNodeFilterProp="title"
                      onChange={(e) => departmentChange(e, index)}
                    >
                      {renderUserTreeNodes(deptListData)}
                    </TreeSelect>
                  </Form.Item>

                  <PlusOutlined
                    onClick={() => {
                      if (fields.length === 3) {
                        message.warning('只能增加3个哦!');
                        return;
                      }
                      add();
                    }}
                    style={{ marginRight: '10px' }}
                  />

                  {index === 0 ? null : (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
        <Form.Item name="problemType" label="问题类型">
          <Select placeholder="请选择问题类型" allowClear>
            {giveUpCheckList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Input.Group compact>
          <Form.Item
            label="客户条码"
            name="receiveBarcode"
            rules={[{ required: true, message: '请输入客户条码值' }]}
            className={s.compact_left}
          >
            <Input
              placeholder="请输入客户条码"
              onBlur={barcodeBlur}
              disabled={from == 'sampleReceipt' ? true : false}
            />
          </Form.Item>
          <Form.Item
            className={s.compact_rignt}
            label="客户名称"
            name="name"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入名称" disabled={from == 'sampleReceipt' ? true : false} />
          </Form.Item>
        </Input.Group>
        <Form.Item label="交接内容" name="submitContent">
          <TextArea />
        </Form.Item>
        <Input.Group compact>
          <Form.Item label="操作部门" name="submitDept" className={s.compact_left}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="操作人" name="submitBy" className={s.compact_rignt}>
            <Input disabled />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item name="isEmer" label="是否紧急" className={s.compact_left}>
            <Select placeholder="请选择是否紧急" allowClear>
              {isEmerList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="操作时间" name="submitTime" className={s.compact_rignt}>
            <DatePicker disabled showTime />
          </Form.Item>
        </Input.Group>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
