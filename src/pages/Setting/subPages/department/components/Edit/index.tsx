import React, { useRef, useImperativeHandle, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, TreeSelect, Switch, Select } from 'antd';
import { deptList, deptAdd, deptUpdate } from '../../models/server';
import { getUserList } from '@/models/server';
const { TreeNode } = TreeSelect;
const { Option } = Select;
const Edit = ({ cRef, refresh }) => {
  const [form] = Form.useForm();
  const modalRef = useRef();
  const [id, setId] = useState();
  const [departParentList, setDepartParentList] = useState([]);
  const [pid, setPid] = useState();
  const [disable, setDisable] = useState(false);
  const [userList, setUserList] = useState([]);

  useImperativeHandle(cRef, () => ({
    show: (val) => {
      getList();
      getUser();

      if (val) {
        form.setFieldsValue({ ...val });
        setId(val.id);
        setDisable(val.isDisable);
      } else {
        form.resetFields();
        setId(null);
        setDisable(false);
      }

      modalRef.current.show();
    },
  }));

  const onFinish = (values) => {
    let params = {
      ...values,
    };
    if (id) {
      deptUpdate({ ...params, id }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功!');
          refresh();
        }
      });
    } else {
      deptAdd(params).then((res) => {
        if (res.code === 200) {
          message.success('添加成功!');
          refresh();
        }
      });
    }
    modalRef.current.hide();
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
  const getList = () => {
    deptList().then((res: any) => {
      if (res.code === 200) {
        setDepartParentList(res.data);
      }
    });
  };
  const onChange = (val) => {
    setPid(val);
  };
  const isDisableChange = (e: any) => {
    setDisable(e);
  };
  const handleChange = (e) => {};
  const getUser = () => {
    getUserList().then((res: any) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  return (
    <Dialog
      title={`${id ? '编辑' : '新增'}`}
      width={640}
      ref={modalRef}
      onCancel={() => modalRef.current.hide()}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: '10px' }}>
        <Form.Item label="名称" name="deptName" rules={[{ required: true, message: '请输入别名' }]}>
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item name="parentId" label="部门上级">
          <TreeSelect
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择上部门上级"
            value={pid}
            showSearch
            treeNodeFilterProp="title"
            onChange={onChange}
          >
            {renderUserTreeNodes(departParentList)}
          </TreeSelect>
        </Form.Item>
        <Form.Item name="isDisable" label="是否禁用">
          <Switch onChange={isDisableChange} checked={disable} />
        </Form.Item>
        <Form.Item label="层级" name="level" rules={[{ required: true, message: '请输入层级' }]}>
          <Input placeholder="请输入层级" type="number" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="联系电话" name="tel">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item label="部门负责人" name="deptMaster">
          <Select onChange={handleChange}>
            {userList?.map((item) => {
              return <Option value={item.id}>{item.name}</Option>;
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default Edit;
