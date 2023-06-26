import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Transfer, Table } from 'antd';
import { Dialog } from '@/components';
import style from '../index.less'
const Add = ({ Ref, refresh, title, parent, bindsListUrl, add, leftList, type }) => {
  const dialogRef = useRef();
  const [leftListData, setLeftListData] = useState([]);
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [oldMockData, setOldMockData] = useState([]);


  useImperativeHandle(Ref, () => ({
    show: (val) => {
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
    let param = { reqItemId: parent?.id };

    bindsListUrl(param).then((res) => {
      if (res.code === 200) {
        setTargetKeys(res.data);
      }
    });
  };
  const getLeftList = () => {
    leftList().then((res: { code: number }) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { ...item, key: item.id };
        });
        setLeftListData(result);
      }
    });
  };
  const filterOption = (inputValue, option) => option.hospitalName.indexOf(inputValue) > -1;
  const handleChange = (targetKeys) => {
    // this.setState({ targetKeys });
    console.log('targetKeys', targetKeys);
    setTargetKeys(targetKeys);
    // let arrayData = [];
    // oldMockData.map((item) => {
    //   targetKeys.map((targetItem) => {
    //     if (item.key === targetItem) {
    //       arrayData.push({ ...item, title: item.title + defaultVal });
    //     }
    //   });
    // });
    // let result = removeDuplicateObj(arrayData.concat(mockData));
    // setMockData(result);
  };
  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  const onOk = () => {
    const result = targetKeys.map((item) => {
      if (type === 1) {
        return { hospitalId: item };
      }
      if (type === 3) {
        return { instrId: item };
      }
    });
    const params = {
      reqItemId: parent.id,
    };
    let concatParams = {};
    if (type === 1) {
      concatParams = {
        ...params,
        hospitals: result,
      };
    }
    if (type === 3) {
      concatParams = {
        ...params,
        instr: result,
      };
    }

    add(concatParams).then((res) => {
      if (res.code === 200) {
        message.success('绑定成功');
        refresh();
        dialogRef.current && dialogRef.current.hide();
      }
    });
  };
  // const onChange = (checkedValues) => {
  //   selectedVal.current = checkedValues;
  //   setBindedVal(checkedValues);
  // };
  const handleChangeSelect = (value) => {
    setDefaultVal(value);
    let arrayData = [];
    oldMockData.map((item) => {
      targetKeys.map((targetItem) => {
        if (item.key === targetItem) {
          arrayData.push({ ...item, title: item.title + value });
        }
      });
    });
    let result = removeDuplicateObj(arrayData.concat(mockData));
    setMockData(result);
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
      width={564}
      title={title}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Table columns={columns} rowKey="id" dataSource={[parent]} pagination={false} />
      <Transfer
        dataSource={leftListData}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={(item) => (type === 1 ? item.hospitalName : type === 3 ? item.instrName : null)}
        className={style.transfer}
      />
    </Dialog>
  );
};
export default Add;
