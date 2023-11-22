import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import SideMenu from './SideMenu';
import { listByUserForItemTgValue } from '../../../../models/server';
const LeftMenu = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const loading = useSelector((state: any) => state.loading.global);
  useEffect(() => {
    getList();
  }, []);
  const onSelect = ({ selectedKeys, option }) => {
    debugger;
    setSelectedKeys(selectedKeys);
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'dataMaintenance',
        dataSource: option.selectedNodes[0],
      },
    });
  };
  const onExpandChange = (item) => {
    let { expandedKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(expandedKeys));
  };
  const getList = () => {
    listByUserForItemTgValue().then((res) => {
      if (res.code === 200) {
        const result = res.data;
        const keys = [result[0]?.key, result[0].children[0]?.key];
        const leftMenuParams = {
          labClassId: result[0]?.key,
          qcId: result[0].children[0]?.key,
          batchNo: result[0].children[0]?.batchNo,
          qcLevelName: result[0].children[0]?.qcLevelName,
        };
        setDefaultOpenKeys(keys);
        setSelectedKeys(String(result[0].children[0].key));
        setList(result);
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'dataMaintenance',
            dataSource: leftMenuParams,
          },
        });
      }
    });
  };

  return (
    <SideMenu
      menuData={list}
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={selectedKeys}
      authDepartmentLoading={loading}
      onSelect={onSelect}
      onExpand={onExpandChange}
    />
  );
};

export default LeftMenu;
