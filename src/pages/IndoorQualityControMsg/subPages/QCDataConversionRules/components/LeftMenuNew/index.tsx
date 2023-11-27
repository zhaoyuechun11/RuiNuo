import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import SideMenu from './SideMenu';
import { Fn } from '@utils';
import { listWithInstr } from '../../../../models/server';
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
    setSelectedKeys(selectedKeys);
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'leftMenuParamsDCRules',
        dataSource: option.selectedNodes[0],
      },
    });
  };
  const onExpandChange = (item) => {
    let { expandedKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(expandedKeys));
  };

  const getList = () => {
    listWithInstr().then((res) => {
      if (res.code === 200) {
        const result = Fn(res.data);
        const keys = [result[0].key, result[0].children[0].key];
        const leftMenuParamsDCRules = {
          labClassId: result[0].labClassId,
          instrId: result[0].children[0].id,
          instrCode: result[0].children[0].instrCode,
        };
        setDefaultOpenKeys(keys);
        setSelectedKeys(result[0].children[0].key);
        setList(result);
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'leftMenuParamsDCRules',
            dataSource: leftMenuParamsDCRules,
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
