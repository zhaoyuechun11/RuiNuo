import React, { useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import SideMenu from './SideMenu';

const authDepartment = [
  {
    name: '全部交接单',
    title: '全部交接单',
    children: [
      {
        key: '0-0-0',
        name: '待本部门处理',
        title: '待本部分处理',
        type: 1,
        children: [
          {
            title: '未处理',
            type: 1,
            status: 0,
            key: '0-0-0-0',
          },
          {
            title: '处理中',
            type: 1,
            status: 1,
            key: '0-0-0-1',
          },
          {
            title: '处理完成',
            type: 1,
            status: 2,
            key: '0-0-0-2',
          },
          {
            title: '确认完成',
            type: 1,
            status: 3,
            key: '0-0-0-3',
          },
        ],
      },
      {
        key: '0-0-1',
        title: '抄送本部门的',
        type: 2,
        children: [
          {
            title: '未处理',
            type: 2,
            status: 0,
            key: '0-0-1-0',
          },
          {
            title: '处理中',
            type: 2,
            status: 1,
            key: '0-0-2-1',
          },
          {
            title: '处理完成',
            type: 2,
            status: 2,
            key: '0-0-3-2',
          },
          {
            title: '确认完成',
            type: 2,
            status: 3,
            key: '0-0-4-3',
          },
        ],
      },
      {
        key: 0 - 0 - 2,
        title: '本部门发起的',
        type: 3,
        children: [
          {
            title: '未处理',
            type: 3,
            status: 0,
            key: '0-0-2-0',
          },
          {
            title: '处理中',
            type: 3,
            status: 1,
            key: '0-0-2-1',
          },
          {
            title: '处理完成',
            type: 3,
            status: 2,
            key: '0-0-2-2',
          },
          {
            title: '确认完成',
            type: 3,
            status: 3,
            key: '0-0-2-3',
          },
        ],
      },
    ],
    key: '0-0',
  },
];
const LeftMenu = () => {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const onSelect = (item: any, option: any) => {
    setSelectedKeys(item.selectedKeys);
    let params = {};
    if (item.option.selectedNodes[0].type === 1) {
      params = {
        solveDept: useDetail.departmentId,
        status: item.option.selectedNodes[0].status,
      };
    }
    if (item.option.selectedNodes[0].type === 2) {
      debugger;
      params = {
        copyTo: useDetail.departmentId,
        status: item.option.selectedNodes[0].status,
      };
    }
    if (item.option.selectedNodes[0].type === 3) {
      params = {
        submitDept: useDetail.departmentId,
        status: item.option.selectedNodes[0].status,
      };
    }

    dispatch({
      type: 'HandoverMsg/save',
      payload: {
        type: 'leftMenuParams',
        dataSource: params,
      },
    });
  };
  const onExpandChange = (item) => {
    let { expandedKeys = [] } = item;
    localStorage.setItem('defaultOpenKeys', JSON.stringify(expandedKeys));
  };

  return (
    <SideMenu
      menuData={authDepartment}
      defaultOpenKeys={['0-0']}
      defaultSelectedKeys={selectedKeys}
      authDepartmentLoading={loading}
      onSelect={onSelect}
      onExpand={onExpandChange}
    />
  );
};

export default LeftMenu;
