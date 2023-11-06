import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Transfer, Table } from 'antd';
import { Dialog } from '@/components';
import style from '../index.less';
const Add = ({ Ref, refresh, title, parent, bindsListUrl, add, leftList, type }) => {
  const dialogRef = useRef();
  const [leftListData, setLeftListData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

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
    setTargetKeys(targetKeys);
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
    >
   
      <div className={style.tabsTitle}>
        <span>项目编码:</span>
        {parent?.reqItemCode}
        <span style={{ marginLeft: '20px' }}>项目名称:</span>
        {parent?.reqItemName}
      </div>
      <Transfer
        dataSource={leftListData}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={(item) => (type === 1 ? item.hospitalName : type === 3 ? item.instrName : null)}
        className={style.transfer}
        listStyle={{ height: '400px' }}
      />
    </Dialog>
  );
};
export default Add;
