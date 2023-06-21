import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select } from 'antd';
import Edit from 'wangeditor';
import { wangEditorUploadImage } from '@/utils';
import {
  reportProjectUpdate,
  oneLevelTypeModalSel,
  reportProjectAdd,
} from '../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const dataType = [
  { id: 1, name: '数字' },
  { id: 2, name: '文字' },
  { id: 3, name: '数值文字混合型' },
];
const decimalPlacesData = [
  { id: 0, name: '保留小数位' },
  { id: 1, name: 1 },
  { id: 2, name: 2 },
  { id: 3, name: 3 },
  { id: 4, name: 4 },
  { id: 5, name: 5 },
];
let editor;
const EditOrAddModal = ({ Ref, refresh, majorGroupData }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [testMethod, setTestMethod] = useState([]);
  const [id, setId] = useState();
  const editorRef = useRef();
  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      getList({ type: 'FF' });
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      initEditor(record);
      if (record) {
        form.setFieldsValue({
          ...record,
        });
        setId(record.id);
      } else {
        setId(null);
        form.setFieldsValue({ labClassId: majorGroupData[0]?.id });
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        reportProjectUpdate({
          id: id,
          ...value,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        reportProjectAdd({ ...value }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const getList = (type: string) => {
    oneLevelTypeModalSel(type).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setTestMethod(res.data);
        }
      },
    );
  };

  const onInputKeyDownPosition = (e) => {
    form.setFieldsValue({
      method: e.target.value,
    });
  };
  const checkVal = (str) => {
    // true 说明都是空格
    let num = 0;
    const reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g;
    while (num < str.length && str != '') {
      num++;
      const k = str.match(reg);
      if (k) {
        str = str.replace(k[0], '');
      }
    }
    return str == '';
  };
  const initEditor = (record) => {
    setTimeout(() => {
      const elem = editorRef.current;
      //const form = this.formRef.current;
      editor = new Edit(elem);
      editor.customConfig.zIndex = 100;
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      editor.customConfig.onchange = (html) => {
        if (html === '<p><br></p>') {
          form.setFieldsValue({ significance: undefined });
          form.validateFields(['significance']);
          return false;
        }
        if (checkVal(html)) {
          form.setFieldsValue({ significance: undefined });
          form.validateFields(['significance']);
          return false;
        }
        // if (record) {
        //   form.setFieldsValue({ significance: record.significance });
        // } else {
        form.setFieldsValue({ significance: html });
        // }
      };
      wangEditorUploadImage(editor);
      editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'undo', // 撤销
        'redo', // 重复
        'image', // 图片
      ];
      editor.create();
      if (record) {
        editor?.txt.html(record?.significance);
      }
    }, 500);
  };

  const projectCategoryChange = (val: any) => {};

  return (
    <Dialog
      ref={dialogRef}
      width={864}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="项目类别"
          name="labClassId"
          rules={[{ required: true, message: '请选择项目类别' }]}
        >
          <Select
            placeholder="请选择项目类别"
            autoComplete="off"
            allowClear
            onChange={projectCategoryChange}
            value={majorGroupData[0]?.id}
            defaultValue={majorGroupData[0]?.id}
          >
            {majorGroupData.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="项目编码"
          name="itemCode"
          rules={[{ required: true, message: '请输入项目编码' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入项目编码"
          />
        </Form.Item>
        <Form.Item
          label="中文名称"
          name="itemName"
          rules={[{ required: true, message: '请输入项目中文名称' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入项目中文名称"
          />
        </Form.Item>
        <Form.Item
          label="英文名称"
          name="enName"
          rules={[{ required: true, message: '请输入项目英文名称' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入项目英文名称"
          />
        </Form.Item>
        <Form.Item label="缩写代号" name="shortName">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入缩写代号"
          />
        </Form.Item>
        <Form.Item label="单位" name="unit">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入单位" />
        </Form.Item>
        <div id="dataType">
          <Form.Item
            name="dataType"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select
              placeholder="请选择数据类型"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('dataType')}
            >
              {dataType.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <div id="decimalPlaces">
          <Form.Item
            name="decimalPlaces"
            label="小数位"
            rules={[{ required: true, message: '请选择小数位' }]}
          >
            <Select
              placeholder="请选择小数位"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('decimalPlaces')}
            >
              {decimalPlacesData.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="method" label="检测方法">
          <Select
            placeholder="请选择检测方法"
            // showSearch
            allowClear
            // showArrow={false}
            onInputKeyDown={onInputKeyDownPosition}
            autoComplete="off"
            // defaultActiveFirstOption={false}
          >
            {testMethod.map((item) => {
              return (
                <Option value={item.dictValue} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="其他编码1" name="extCode1">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入其他编码1"
          />
        </Form.Item>
        <Form.Item label="其他编码2" name="extCode2">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入其他编码2"
          />
        </Form.Item>
        <Form.Item
          label="采样标准临床意义"
          name="significance"
          // rules={[
          //   {
          //     required: true,
          //     validator: (_, value) => {
          //       if (!value) {
          //         return Promise.reject('请填写职位描述');
          //       }
          //       if (checkVal(value)) {
          //         return Promise.reject('请填写职位描述');
          //       }
          //       return Promise.resolve();
          //     },
          //   },
          // ]}
        >
          <React.Fragment>
            <div ref={editorRef} />
          </React.Fragment>
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
