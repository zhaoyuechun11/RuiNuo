import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import SideMenu from './SideMenu';
import { getInstrByClassName } from '../../../../models/server';
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
        type: 'leftMenuParamsRules',
        dataSource: option.selectedNodes[0],
      },
    });
  };
  const onExpandChange = (item) => {
    let { expandedKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(expandedKeys));
  };
  //  递归函数
  const Fn = (data) => {
    // 使用forEach遍历，添加新的属性
    // data.forEach((item, i) => {
    //     if (item.children) {
    //         // 调用递归函数
    //         Fn(item.children)
    //     }
    //     data[i].key = `${i}`
    // })

    // 使用map遍历,生成新的数组
    data = data.map((item, index) => {
      if (item.children) {
        let t = item.children.map((child, cIndex) => {
          return {
            ...child,
            key: `${index}-${cIndex}`,
          };
        });
        return {
          ...item, // 如果想在原数组添加属性
          key: `${index}`,
          children: t,
        };
      }
    });
    return data;
  };
  const getList = () => {
    getInstrByClassName().then((res) => {
      if (res.code === 200) {
        const result = Fn(res.data);

        const keys = [result[0].key, result[0].children[0].key];
        const leftMenuParamsRules = {
          labClassId: result[0].children[0].labClassId,
          instrId: result[0].children[0].id,
          instrCode: result[0].children[0].instrCode,
        };
        setDefaultOpenKeys(keys);
        setSelectedKeys(result[0].children[0].key);
        setList(result);
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'leftMenuParamsRules',
            dataSource: leftMenuParamsRules,
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
