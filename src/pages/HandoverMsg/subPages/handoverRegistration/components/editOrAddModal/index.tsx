import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Button, Form, Input, Select, DatePicker, TreeSelect, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deptList, dictList } from '@/models/server';
import s from '../../../index.less';
import { useSelector } from 'umi';
import moment from 'moment';
//import { getManageGroupAdd, updateManageGroup } from '../../../../models/server';
//import ColorPicker from '@/pages/CommonMaterials/commones/colorPicker';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const EditOrAddModal = ({ Ref, refresh }) => {
  var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
  const { useDetail } = useSelector((state: any) => state.global);
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [record, setRecord] = useState({});
  const [names, setNames] = useState(['']);
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
        names: [''],
        operator: useDetail.name,
        departmentName: useDetail.departmentName,
        operatorTime: moment(now1, 'YYYY-MM-DD HH:mm:ss'),
      });
      if (record) {
        form.setFieldsValue({ ...record });
        setId(record.id);
        setRecord(record);
      } else {
        setId(null);
        setRecord({});
        setTimeout(() => {
          var testTarget = document.getElementsByClassName('ant-select-selection-item')[0]; // 我们想要取到的第一个
          testTarget.innerHTML = '请选择抄送部门';
          testTarget.className = 'ant-select-selection-placeholder';
        }, 500);
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      debugger;
      // if (id) {
      //   updateManageGroup({ id: id, ...value }).then((res) => {
      //     if (res.code === 200) {
      //       message.success('修改成功');
      //       dialogRef.current && dialogRef.current.hide();
      //       refresh();
      //     }
      //   });
      // } else {
      //   getManageGroupAdd({ ...value }).then((res) => {
      //     if (res.code === 200) {
      //       message.success('添加成功');
      //       dialogRef.current && dialogRef.current.hide();
      //       refresh();
      //     }
      //   });
      // }
    });
  };
  // const onFinish = (values) => {
  //   console.log('Received values of form:', values);
  // };
  const departmentChange = (e: any, index: any) => {
    if (index === 0) {
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
      width={640}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form layout="vertical" form={form} className={s.form_box}>
        <Form.Item name="labClassId" label="处理部门">
          <TreeSelect
            allowClear
            placeholder="请选择处理部门"
            value={pid}
            showSearch
            treeNodeFilterProp="title"
            onChange={(e) => departmentChange(e, index)}
          >
            {renderUserTreeNodes(deptListData)}
          </TreeSelect>
        </Form.Item>
        <Form.List name="names">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item label={index === 0 ? '抄送部门' : ''} required={false} key={field.key}>
                  <Form.Item {...field} noStyle className={`formList${index}`}>
                    <TreeSelect
                      allowClear
                      style={{ width: '90%', marginRight: '8px' }}
                      placeholder="请选择部门"
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
        <Form.Item name="labClassId" label="问题类型">
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
        <Form.Item
          label="客户条码"
          name="code"
          rules={[{ required: true, message: '请输入code值' }]}
        >
          <Input placeholder="请输入code值" />
        </Form.Item>
        <Form.Item
          label="客户名称"
          name="namerrr"
          rules={[{ required: true, message: '请输入code值' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="交接内容" name="color">
          <TextArea />
        </Form.Item>
        <Input.Group compact>
          <Form.Item name="labClassId" label="是否紧急" className={s.compact_left}>
            <Select placeholder="请选择是否紧急" allowClear>
              {/* {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="操作人" name="operator" className={s.compact_rignt}>
            <Input disabled />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item label="操作部门" name="departmentName" className={s.compact_left}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="操作时间" name="operatorTime" className={s.compact_rignt}>
            <DatePicker disabled showTime />
          </Form.Item>
        </Input.Group>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
