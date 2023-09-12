import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Transfer, Table, Form, Input, Radio } from 'antd';
import { Dialog } from '@/components';

import {
  applyProjectItemByCompBindAdd,
  applyProjectItemByCompGetBinds,
  getSameProfessionList,
  getBindsList,
} from '../../../../../models/server';
import style from '../index.less';
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const ComDetailsAdd = ({ Ref, refresh, title, parent }) => {
  const dialogRef = useRef();
  const [comTransferTitle, setComTransferTitle] = useState(0);
  const [combinationDefault, setCombinationDefault] = useState(0);
  const [form] = Form.useForm();
  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: (val:any) => {
      dialogRef.current && dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const filterOption = (inputValue, option) => option.reqItemName.indexOf(inputValue) > -1;
  const handleChange = (targetKeys) => {
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

  const onOk = () => {
    form.validateFields().then((value) => {
      const result = value?.group?.map((item: any) => {
        return { compositionItemId: item };
      });
      applyProjectItemByCompBindAdd({ ...value, group: result, id: parent.id }).then((res) => {
        if (res.code === 200) {
          message.success('绑定成功');
          refresh();
          dialogRef.current && dialogRef.current.hide();
        }
      });
    });
  };
  const columns = [
    {
      title: '项目编码',
      dataIndex: 'reqItemCode',
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '项目名称',
      dataIndex: 'reqItemName',
      align: 'center',
      width: 150,
    },
  ];
  const combinationChange = (e: { target: { value: React.SetStateAction<never[]> } }) => {
    setComTransferTitle(e.target.value);
    setCombinationDefault(e.target.value);
    setTargetKeys([]);
    if (e.target.value === 1) {
      sameProfessionList();
    }
    if (e.target.value === 2) {
      DifProfessionList();
    }
  };
  const sameProfessionList = () => {
    getSameProfessionList({ labClassId: parent?.labClassId }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          let result = res.data
            .map((item) => ({ ...item, key: item.id }))
            .filter((item) => item.id !== parent.id);
          setTransferData(result);
        }
      },
    );
    GetBinds();
  };
  const DifProfessionList = () => {
    getBindsList().then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          let result = res.data
            .map((item) => ({ ...item, key: item.id }))
            .filter((item) => item.id !== parent.id);
          setTransferData(result);
        }
      },
    );
    GetBinds();
  };
  const GetBinds = () => {
    applyProjectItemByCompGetBinds({ reqItemId: parent?.id }).then((res) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={564}
      title={title}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Table columns={columns} rowKey="id" dataSource={[parent]} pagination={false}  className={style.table_box} size='small'/>
      <Form form={form} {...layout} style={{ marginTop: '20px' }}>
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
export default ComDetailsAdd;
