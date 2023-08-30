import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Switch } from 'antd';
import { useDispatch } from 'umi';
import Edit from 'wangeditor';
import { wangEditorUploadImage } from '@/utils';
import { dictList } from '@/models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const [isDisable, setIsDisable] = useState(false);
  const [entryTypeList, setEntryTypeList] = useState([]);
  const editorRef = useRef();
  useImperativeHandle(Ref, () => ({
    show: (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      getDictList();
      initEditor(record);
      if (record) {
        form.setFieldsValue({ ...record });
        setIsDisable(record.isDisable);
        setId(record.id);
      } else {
        setId(null);
        form && form.resetFields();
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
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
      let editor = new Edit(elem);
      editor.customConfig.zIndex = 100;
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      editor.customConfig.onchange = (html) => {
        if (html === '<p><br></p>') {
          form.setFieldsValue({ wordContent: undefined });
          form.validateFields(['wordContent']);
          return false;
        }
        if (checkVal(html)) {
          form.setFieldsValue({ wordContent: undefined });
          form.validateFields(['wordContent']);
          return false;
        }
        form.setFieldsValue({ wordContent: html });
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
        editor?.txt.html(record?.wordContent);
      }
    }, 500);
  };
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        dispatch({
          type: 'Setting/fetchWordEntryUpdate',
          payload: {
            ...value,
            id,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('修改成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
        });
      } else {
        dispatch({
          type: 'Setting/fetchWordEntryAdd',
          payload: {
            ...value,
            callback: (res: {
              code: number;
              data: { records: React.SetStateAction<never[]>; total: React.SetStateAction<number> };
            }) => {
              if (res.code === 200) {
                message.success('添加成功');
                dialogRef.current && dialogRef.current.hide();
                refresh();
              }
            },
          },
        });
      }
    });
  };
  const getDictList = () => {
    dictList({ type: 'SE' }).then((res) => {
      if (res.code === 200) {
        setEntryTypeList(res.data);
      }
    });
  };
  const onChange = (e) => {
    setIsDisable(e);
  };
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
      <Form form={form} {...layout} style={{ paddingTop: '20px' }}>
        <Form.Item label="词条编码" name="entryId">
          <Input placeholder="请输入词条编码" />
        </Form.Item>
        <Form.Item name="entryType" label="词条类别">
          <Select placeholder="请选择词条类别" allowClear>
            {entryTypeList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="自动输入标志" name="isDisable">
          <Switch checked={isDisable} onChange={onChange} />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="顺序" name="seq">
          <Input placeholder="请输入顺序" type="number" />
        </Form.Item>
        <Form.Item
          label="词条内容"
          name="wordContent"

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
