import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Switch, Radio, InputNumber, Transfer } from 'antd';
import Edit from 'wangeditor';
import { wangEditorUploadImage } from '@/utils';
import {
  applyProjectAdd,
  applyProjectUpdate,
  oneLevelTypeModalSel,
  hospitalSelectList,
  getSameProfessionList,
  getBindsList,
} from '../../../../models/server';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
const specialCycle = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
let editor;
const EditOrAddModal = ({ Ref, refresh, majorGroupData }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [testMethod, setTestMethod] = useState([]);
  const [cycleType, setCycleType] = useState('hour');
  const [id, setId] = useState();
  const idRef = useRef();
  const editorRef = useRef();
  const [targetKeys, setTargetKeys] = useState([]);
  const [comTransferTitle, setComTransferTitle] = useState(0);
  const [transferData, setTransferData] = useState([]);
  const [sameProfessionList, setSameProfessionList] = useState([]);
  const [differentProfessionList, setDifferentProfessionList] = useState([]);
  const [combinationDefault, setCombinationDefault] = useState(0);
  const [isDisable, setIsDisable] = useState(false);
  const [isOut, setIsOut] = useState(false);
  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      idRef.current = null;
      getList({ type: 'BT' });
      getList({ type: 'FF' });
      getHospitalSelectList();
      dialogRef.current && dialogRef.current.show();
      form && form.resetFields();
      initEditor(record);
      if (record) {
        form.setFieldsValue({
          ...record,
          reportCycle: record?.reportCycle.split(','),
        });
        setId(record.id);
        idRef.current = record.id;

        await getSameProfessionListData(record.labClassId);

        await getDifferentProfessionListData(record.labClassId);

        setComTransferTitle(record.isCombo);
        setCycleType(record.reportCycleType);
        setIsDisable(record.isDisable);
        setIsOut(record.isOut);
      } else {
        setIsOut(false);
        setIsDisable(false);
        setId(null);
        setCombinationDefault(0);
        setComTransferTitle(0);
        setCycleType('hour');
        getSameProfessionListData(majorGroupData[0]?.id);
        getDifferentProfessionListData(majorGroupData[0]?.id);
        form.setFieldsValue({
          labClassId: majorGroupData[0]?.id,
          reportCycleType: 'hour',
          isCombo: 0,
        });
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        const groupData = value.group?.map((item: any) => {
          return { compositionItemId: item };
        });
        let reportCyclezVal;
        if (value.reportCycleType === 'special') {
          reportCyclezVal = value.reportCycle?.join(',');
        } else {
          reportCyclezVal = value.reportCycle;
        }
        applyProjectUpdate({
          id: id,
          ...value,
          group: groupData,
          reportCycle: reportCyclezVal,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
            setCombinationDefault(0);
          }
        });
      } else {
        const groupData = value.group?.map((item: any) => {
          return { compositionItemId: item };
        });
        let reportCyclezVal;
        if (value.reportCycleType === 'special') {
          reportCyclezVal = value.reportCycle?.join(',');
        } else {
          reportCyclezVal = value.reportCycle;
        }
        applyProjectAdd({ ...value, group: groupData, reportCycle: reportCyclezVal }).then(
          (res: { code: number }) => {
            if (res.code === 200) {
              message.success('添加成功');
              dialogRef.current && dialogRef.current.hide();
              refresh();
            }
          },
        );
      }
    });
  };

  const getList = (type: string) => {
    oneLevelTypeModalSel(type).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          if (type.type === 'BT') {
            setSampleTypeList(res.data);
          } else {
            setTestMethod(res.data);
          }
        }
      },
    );
  };
  const getHospitalSelectList = () => {
    hospitalSelectList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
      }
    });
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

  const filterOption = (inputValue, option) => option.reqItemName.indexOf(inputValue) > -1;

  const handleChange = (targetKeys, direction, moveKeys) => {
    setTargetKeys(targetKeys);
    let targetData = [];
    transferData.map((transferItem) => {
      targetKeys.map((targetItem: { id: any }) => {
        if (targetItem === transferItem.id) {
          targetData.push(transferItem.reqItemName);
        }
      });
    });
    form.setFieldsValue({ comboDescribe: targetData.join(',') });
  };

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };
  const projectCategoryChange = (val: any) => {
    setComTransferTitle(0);
    form.setFieldsValue({ isCombo: 0 });
    getSameProfessionListData(val);
    getDifferentProfessionListData(val);
  };
  const getSameProfessionListData = (val) => {
    getSameProfessionList({ labClassId: val }).then((res) => {
      if (res.code === 200) {
        let result = {};
        result = res.data.map((item: { id: any }) => {
          return { ...item, key: item.id };
        });
        if (idRef.current) {
          result = res.data
            .map((item: { id: any }) => ({ ...item, key: item.id }))
            .filter((item) => item.id !== idRef.current);
        }
        setSameProfessionList(result);
      }
    });
  };
  useEffect(() => {
    if (comTransferTitle === 1 && id) {
      setTransferData(sameProfessionList);
    }
    if (comTransferTitle === 2 && id) {
      setTransferData(differentProfessionList);
    }
  }, [id, differentProfessionList, sameProfessionList]);
  const getDifferentProfessionListData = (val: any) => {
    getBindsList({ labClassId: val }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          let result = {};
          result = res.data.map((item: { id: any }) => {
            return { ...item, key: item.id };
          });
          if (idRef.current) {
            result = res.data
              .map((item: { id: any }) => ({ ...item, key: item.id }))
              .filter((item) => item.id !== idRef.current);
          }
          setDifferentProfessionList(result);
        }
      },
    );
  };
  const combinationChange = (e: { target: { value: React.SetStateAction<never[]> } }) => {
    setComTransferTitle(e.target.value);
    setCombinationDefault(e.target.value);
    setTargetKeys([]);
    if (e.target.value === 1) {
      setTransferData(sameProfessionList);
    } else if (e.target.value === 2) {
      setTransferData(differentProfessionList);
    }
  };
  const cycleTypeChange = (e: any) => {
    if (e.target.value !== 'special') {
      form.setFieldsValue({ reportCycle: '' });
    } else {
      form.setFieldsValue({ reportCycle: [] });
    }
    setCycleType(e.target.value);
  };
  const isDisableChange = (e: boolean | ((prevState: boolean) => boolean)) => {
    setIsDisable(e);
  };
  const isOutChange = (e: boolean | ((prevState: boolean) => boolean)) => {
    setIsOut(e);
  };
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
        <Form.Item label="顺序" name="seq" rules={[{ required: true, message: '请输入顺序' }]}>
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入顺序" />
        </Form.Item>
        <Form.Item
          label="项目编码"
          name="reqItemCode"
          rules={[{ required: true, message: '请输入项目编码' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入项目编码"
          />
        </Form.Item>
        <Form.Item
          label="项目名称"
          name="reqItemName"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入项目名称"
          />
        </Form.Item>
        <Form.Item label="缩写" name="shortName">
          <Input style={{ backgroundColor: '#ffffff' }} maxLength={10} placeholder="请输入缩写" />
        </Form.Item>
        <div id="defaultSampleTypeId">
          <Form.Item
            name="defaultSampleTypeId"
            label="默认样本类型"
            rules={[{ required: true, message: '请选择默认样本类型' }]}
          >
            <Select
              placeholder="请选择默认样本类型"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('defaultSampleTypeId')}
            >
              {sampleTypeList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.dictValue}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="isDisable" label="禁用">
          <Switch onChange={isDisableChange} checked={isDisable} />
        </Form.Item>
        <Form.Item name="isOut" label="外送">
          <Switch onChange={isOutChange} checked={isOut} />
        </Form.Item>
        <Form.Item
          name="outCompanyId"
          label="外送单位"
          rules={[{ required: true, message: '请选择外送单位' }]}
        >
          <Select placeholder="请选择外送单位" autoComplete="off" allowClear>
            {hospitalList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.hospitalName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="priceCode" label="物价编码">
          <Input
            style={{ backgroundColor: '#ffffff' }}
            maxLength={10}
            placeholder="请输入物价编码"
          />
        </Form.Item>
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
        <Form.Item name="reportCycleType" label="报告周期" onChange={cycleTypeChange}>
          <Radio.Group defaultValue="hour" buttonStyle="solid" value={`hour`}>
            <Radio.Button value="hour">小时</Radio.Button>
            <Radio.Button value="day">工作日</Radio.Button>
            <Radio.Button value="special">特定周期</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="reportCycle" label="报告周期">
          {cycleType !== 'special' ? (
            <InputNumber precision={0} placeholder="请输入报告周期" min={0} />
          ) : (
            <Select placeholder="请选择报告周期" autoComplete="off" allowClear mode="multiple">
              {specialCycle.map((item) => {
                return (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          )}
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
        <Form.Item name="comboDescribe" label="明细描述">
          <Input style={{ backgroundColor: '#ffffff' }} placeholder="请输入明细描述" />
        </Form.Item>
        <Form.Item name="isCombo" label="是否组合">
          <Radio.Group
            value={combinationDefault}
            buttonStyle="solid"
            onChange={combinationChange}
            defaultValue={combinationDefault}
          >
            <Radio.Button value={0}>非组合</Radio.Button>
            <Radio.Button value={1}>同专业组合</Radio.Button>
            <Radio.Button value={2}>跨专业组合</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {comTransferTitle !== 0 && (
          <Form.Item label={comTransferTitle === 1 ? '同专业组合' : '跨专业组合'} name="group">
            <Transfer
              dataSource={transferData}
              showSearch
              filterOption={filterOption}
              targetKeys={targetKeys}
              onChange={handleChange}
              onSearch={handleSearch}
              render={(item) => item.reqItemName}
            />
          </Form.Item>
        )}
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
