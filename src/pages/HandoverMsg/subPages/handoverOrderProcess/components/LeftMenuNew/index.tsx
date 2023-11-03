import React, { useState } from 'react';
import { useSelector } from 'umi';
import SideMenu from './SideMenu';
const authDepartment = [
  {
    id: 306,
    enterprise_id: 80,
    name: '\u5c0f\u660e\u8d38\u6613\u516c\u53f8',
    title: '\u5c0f\u660e\u8d38\u6613\u516c\u53f8',
    dept_id: '1',
    dept_pid: '',
    type: 1,
    meta_status: 1,
    created_at: '2022-08-03 16:40:14',
    updated_at: '2022-08-03 16:40:14',
    use_name: null,
    children: [
      {
        id: 179,
        key: 179,
        enterprise_id: 80,
        name: '\u884c\u653f\u90e8',
        title: '\u884c\u653f\u90e8',
        dept_id: '145811946',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:05',
        use_name: null,
      },
      {
        id: 181,
        enterprise_id: 80,
        name: '\u5e02\u573a\u90e8',
        title: '\u5e02\u573a\u90e8',
        dept_id: '145857604',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:05',
        use_name: null,
        key: '0-0-1',
      },
      {
        id: 183,
        enterprise_id: 80,
        name: '\u6280\u672f\u90e8',
        title: '\u6280\u672f\u90e8',
        dept_id: '145872428',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:05',
        use_name: null,
        children: [
          {
            id: 187,
            enterprise_id: 80,
            name: '\u6d4b\u8bd5\u90e8\u95e8',
            title: '\u6d4b\u8bd5\u90e8\u95e8',
            dept_id: '145973137',
            dept_pid: '145872428',
            type: 1,
            meta_status: 2,
            created_at: '2022-08-03 16:40:14',
            updated_at: '2023-07-22 15:55:06',
            use_name: null,
            key: '0-0-2-0',
          },
        ],
        key: '0-0-2',
      },
      {
        id: 211,
        enterprise_id: 80,
        name: '\u552e\u540e\u90e8\u95e8',
        title: '\u552e\u540e\u90e8\u95e8',
        dept_id: '367873427',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:06',
        use_name: null,
        key: '0-0-3',
      },
      {
        id: 214,
        enterprise_id: 80,
        name: '\u603b\u7ecf\u529e',
        title: '\u603b\u7ecf\u529e',
        dept_id: '368215533',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:06',
        use_name: null,
        key: '0-0-4',
      },
      {
        id: 341,
        enterprise_id: 80,
        name: '\u5ba2\u670d\u90e8',
        title: '\u5ba2\u670d\u90e8',
        dept_id: '411530470',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:06',
        use_name: null,
        key: '0-0-5',
      },
      {
        id: 342,
        enterprise_id: 80,
        name: '\u516c\u5171\u670d\u52a1\u7ec4',
        title: '\u516c\u5171\u670d\u52a1\u7ec4',
        dept_id: '411639542',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:06',
        use_name: null,
        key: '0-0-6',
      },
      {
        id: 222213,
        enterprise_id: 80,
        name: 'GMD_\u62db\u8058\u90e8',
        title: 'GMD_\u62db\u8058\u90e8',
        dept_id: '587480849',
        dept_pid: '1',
        type: 1,
        meta_status: 2,
        created_at: '2022-08-03 16:40:14',
        updated_at: '2023-07-22 15:55:06',
        use_name: null,
        children: [
          {
            id: 222212,
            enterprise_id: 80,
            name: 'Joy\u7ec4',
            title: 'Joy\u7ec4',
            dept_id: '587443837',
            dept_pid: '587480849',
            type: 1,
            meta_status: 2,
            created_at: '2022-08-03 16:40:14',
            updated_at: '2023-07-22 15:55:06',
            use_name: null,
            key: '0-0-7-0',
          },
          {
            id: 222214,
            enterprise_id: 80,
            name: '\u6e20\u9053\u7ec4',
            title: '\u6e20\u9053\u7ec4',
            dept_id: '587738688',
            dept_pid: '587480849',
            type: 1,
            meta_status: 2,
            created_at: '2022-08-03 16:40:14',
            updated_at: '2023-07-22 15:55:06',
            use_name: null,
            key: '0-0-7-1',
          },
          {
            id: 222215,
            enterprise_id: 80,
            name: '\u7ea2\u831c\u7ec4',
            title: '\u7ea2\u831c\u7ec4',
            dept_id: '587816840',
            dept_pid: '587480849',
            type: 1,
            meta_status: 2,
            created_at: '2022-08-03 16:40:14',
            updated_at: '2023-07-22 15:55:06',
            use_name: null,
            key: '0-0-7-2',
          },
          {
            id: 222216,
            enterprise_id: 80,
            name: '\u51af\u5c9a\u7ec4',
            title: '\u51af\u5c9a\u7ec4',
            dept_id: '588072167',
            dept_pid: '587480849',
            type: 1,
            meta_status: 2,
            created_at: '2022-08-03 16:40:14',
            updated_at: '2023-07-22 15:55:06',
            use_name: null,
            key: '0-0-7-3',
          },
        ],
        key: '0-0-7',
      },
    ],
    key: '0-0',
  },
];
const LeftMenu = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const loading = useSelector((state: any) => state.loading.global);
  const onSelect = (item: any) => {
    setSelectedKeys(item);
    debugger;
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
