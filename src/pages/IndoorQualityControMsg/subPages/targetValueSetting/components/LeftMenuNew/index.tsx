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
        type: 'leftMenuParams',
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
        const keys = [
          result[0].key,
          result[0].children[0].key,
          result[0].children[0].children[0].key,
        ];
        const leftMenuParams = {
          labClassId: result[0].key,
          qcId: result[0].children[0].key,
          itemId: result[0].children[0].children[0].key,
          title:
            result[0].children[0].children[0].itemCode +
            ' ' +
            result[0].children[0].children[0].itemName,
        };
        setDefaultOpenKeys(keys);
        setSelectedKeys(String(result[0].children[0].children[0].key));
        setList(result);
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'leftMenuParams',
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
