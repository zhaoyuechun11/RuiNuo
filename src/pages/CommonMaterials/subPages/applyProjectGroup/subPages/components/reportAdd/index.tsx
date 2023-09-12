import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Transfer, Select, Table, Form } from 'antd';
import { Dialog } from '@/components';
import style from '../index.less';
const defaultValData = [
  { id: 'P', name: '阳性' },
  { id: 'NP', name: '弱阳性' },
  { id: 'N', name: '阴性' },
  { id: 'H', name: '偏高' },
  { id: 'L', name: '偏低' },
  { id: 'NOR ', name: '正常' },
];
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const ReportAdd = ({ Ref, refresh, title, parent, bindsListUrl, add, leftList }) => {
  const dialogRef = useRef();
  const [leftListData, setLeftListData] = useState([]);
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [oldMockData, setOldMockData] = useState([]);
  const [defaultVal, setDefaultVal] = useState();
  const [form] = Form.useForm();
  useImperativeHandle(Ref, () => ({
    show: (val:any) => {
      dialogRef.current && dialogRef.current.show();
      getList();
      getLeftList();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }

      console.log('data', data);
      mockData.push(data);
      console.log('mockData', mockData);
    }
    console.log('targetKeys', targetKeys);
    setOldMockData(mockData);
    setMockData(mockData);
    setTargetKeys(targetKeys);
  };
  const getList = () => {
    bindsListUrl({ labClassId: parent.labClassId }).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { ...item, key: item.id };
        });
        setLeftListData(result);
      }
    });
  };
  const getLeftList = () => {
    leftList({ reqItemId: parent?.id }).then((res: { code: number }) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };
  const filterOption = (inputValue, option) => option.itemName.indexOf(inputValue) > -1;
  const handleChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  };
  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  const onOk = () => {
    const result = targetKeys.map((item) => {
      return { labItemId: item, defaultValue: defaultVal };
    });
    add({ labItems: result, reqItemId: parent.id }).then((res) => {
      if (res.code === 200) {
        message.success('绑定成功');
        refresh();
        dialogRef.current && dialogRef.current.hide();
      }
    });
  };

  const handleChangeSelect = (value, option) => {
    setDefaultVal(value);
    // let arrayData = [];
    // leftListData.map((item) => {
    //   targetKeys.map((targetItem) => {
    //     if (item.key === targetItem) {
    //       arrayData.push({ ...item, itemName: item.itemName + value });
    //     }
    //   });
    // });
    // let result = removeDuplicateObj(arrayData.concat(leftListData));
    // setLeftListData(result);
  };
  const removeDuplicateObj = (arr) => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next.key] ? '' : (obj[next.key] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr;
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
  return (
    <Dialog
      ref={dialogRef}
      width={664}
      title={title}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Table
        columns={columns}
        rowKey="id"
        dataSource={[parent]}
        pagination={false}
        className={style.table_box} 
        size='small'
      />
      <Form form={form} {...layout} style={{ marginTop: '20px' }}>
        <Form.Item label="默认值">
          <Select placeholder="请选择默认值" allowClear onChange={handleChangeSelect}>
            {defaultValData.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="同专业内的报告项目">
          <Transfer
            dataSource={leftListData}
            showSearch
            filterOption={filterOption}
            targetKeys={targetKeys}
            onChange={handleChange}
            onSearch={handleSearch}
            render={(item) => item.itemName}
            listStyle={{
              width: 250,
            }}
          />
        </Form.Item>
      </Form>
    </Dialog>
  );
};
export default ReportAdd;
