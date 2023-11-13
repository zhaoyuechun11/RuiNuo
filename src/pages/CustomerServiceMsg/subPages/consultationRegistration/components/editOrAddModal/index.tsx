import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, Select, DatePicker, TreeSelect, message } from 'antd';
import { deptList, dictList, getUserList, getHospitalList } from '@/models/server';
import { consultRegisterAdd, consultRegisterUpdate } from '../../../../models/server';
import s from '../../../index.less';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const consultationType = [
  {
    name: '电话咨询',
    id: 1,
  },
  {
    name: '微信QQ咨询',
    id: 2,
  },
  {
    name: '邮件咨询',
    id: 3,
  },
];
const completionStatus = [
  {
    name: '是',
    id: 1,
  },
  {
    name: '否',
    id: 0,
  },
];
const EditOrAddModal = ({ Ref, from = '', refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [deptListData, setDeptListData] = useState([]);
  const [pid, setPid] = useState();
  const [eventTypeList, setEventTypeList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: (record) => {
      dialogRef.current && dialogRef.current.show();
      getDeptList();
      getDictList();
      userListData();
      hospital();
      form && form.resetFields();

      if (record) {
        form.setFieldsValue({
          ...record,
          finishTime: record.finishTime ? moment(record.finishTime) : '',
          consultTime: moment(record.consultTime),
          isFinished: record.isFinished ? 1 : 0,
        });
        setId(record.id);
      } else {
        setId(null);
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        consultRegisterUpdate({
          id: id,
          ...value,
          consultTime: value.consultTime ? value.consultTime.format('YYYY-MM-DD HH:mm:ss') : '',
          finishTime: value.finishTime ? value.finishTime.format('YYYY-MM-DD HH:mm:ss') : '',
        }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        consultRegisterAdd({
          ...value,
          consultTime: value.consultTime?.format('YYYY-MM-DD HH:mm:ss'),
          finishTime: value.finishTime?.format('YYYY-MM-DD HH:mm:ss'),
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

  const departmentChange = (e: any) => {
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
    dictList({ type: 'EVENTTYPE' }).then((res) => {
      if (res.code === 200) {
        setEventTypeList(res.data);
      }
    });
  };

  const userListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const hospital = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
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
        <Input.Group compact>
          <Form.Item
            name="consultType"
            label="咨询类型"
            rules={[{ required: true, message: '请选择咨询类型' }]}
            className={s.compact_left}
          >
            <Select placeholder="请选择咨询类型" allowClear>
              {consultationType.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="来电时间"
            name="consultTime"
            rules={[{ required: true, message: '请选择来电时间' }]}
            className={s.compact_rignt}
          >
            <DatePicker showTime />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item label="来电号码" name="callNumber" className={s.compact_left}>
            <Input placeholder="请输入来电号码" />
          </Form.Item>
          <Form.Item
            label="来电人"
            name="callEr"
            rules={[{ required: true, message: '请输入来电人' }]}
            className={s.compact_rignt}
          >
            <Input placeholder="请输入来电人" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item name="area" label="所属地区" className={s.compact_left}>
            <Input placeholder="请输入所属地区" />
          </Form.Item>
          <Form.Item
            label="接电人"
            name="telRecipient"
            rules={[{ required: true, message: '请选择接电人' }]}
            className={s.compact_rignt}
          >
            <Select placeholder="请选择接电人" allowClear>
              {userList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item
            name="consultHospital"
            label="咨询单位"
            className={s.compact_left}
            rules={[{ required: true, message: '请选择咨询单位' }]}
          >
            <Select placeholder="请选择咨询单位" allowClear>
              {hospitalList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.hospitalName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="eventType"
            label="事项类型"
            className={s.compact_rignt}
            rules={[{ required: true, message: '请选择事项类型' }]}
          >
            <Select placeholder="请选择事项类型" allowClear>
              {eventTypeList.length > 0 &&
                eventTypeList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.dictValue}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Input.Group>
        <Form.Item
          label="咨询内容"
          name="consultContent"
          rules={[{ required: true, message: '请输入咨询内容' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label="咨询结果" name="consultResult">
          <TextArea />
        </Form.Item>
        <Input.Group compact>
          <Form.Item name="respondent" label="被咨询者" className={s.compact_left}>
            <Select placeholder="请选择被咨询者" allowClear>
              {userList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="belongDept" label="所属部门" className={s.compact_rignt}>
            <TreeSelect
              allowClear
              placeholder="请选择所属部门"
              value={pid}
              showSearch
              treeNodeFilterProp="title"
              onChange={(e) => departmentChange(e)}
            >
              {renderUserTreeNodes(deptListData)}
            </TreeSelect>
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item
            name="isFinished"
            label="是否完成"
            className={s.compact_left}
            rules={[{ required: true, message: '请选择是否完成' }]}
          >
            <Select placeholder="请选择是否完成" allowClear>
              {completionStatus.length > 0 &&
                completionStatus.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="处理完成时间" name="finishTime" className={s.compact_rignt}>
            <DatePicker showTime />
          </Form.Item>
        </Input.Group>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
