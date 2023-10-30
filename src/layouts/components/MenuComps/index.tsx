import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { menu } from '@/utils/constant';
import { transformTree } from '@/utils';
const { Sider } = Layout;
const { SubMenu } = Menu;
import { Link, useSelector } from 'umi';
interface IMenu {
  title: string;
  children: Array<IMenu>;
  path: string;
  icon?: string;
  key: string;
}

const MenuComps: React.FC = (props) => {
  const { renderSuccess } = props;
  const { useDetail } = useSelector((state: any) => state.global);
  const [menuData, setMenuData] = useState<Array<IMenu>>();
  const [collapsed, setCollapsed] = useState(false);
  const handleClick = (e: any) => {};
  useEffect(() => {
    renderSuccess(false);
    setMenuData(menu);
    //setMenuData(transformTree(useDetail.permissions));
  }, [useDetail]);
  const onCollapse = (val) => {
    setCollapsed(val);
  };
  // 渲染不含children的目录
  const renderNoChildMenu = (item: IMenu) => {
    return (
      <Menu.Item key={item.title}>
        {' '}
        <Link key={item.key} to={item.url}>
          {item.name}
        </Link>
      </Menu.Item>
    );
  };
  // 渲染含有children的目录
  const renderChildMenu = (item: IMenu) => {
    return (
      <SubMenu key={item.name} title={item.name}>
        {item.children.map((child) => {
          return renderMenu(child);
        })}
      </SubMenu>
    );
  };
  // 渲染菜单
  const renderMenu = (item: IMenu) => {
    return item.children?.length ? renderChildMenu(item) : renderNoChildMenu(item);
  };
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <Menu
        onClick={handleClick}
        style={{ width: '100%', marginTop: '2px' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={[]}
        mode="inline"
        theme="dark"
      >
        {menuData?.map((item: any) => renderMenu(item))}
      </Menu>
    </Sider>
  );
};

export default MenuComps;
