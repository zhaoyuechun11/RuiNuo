import style from './index.less';
import React, { Component, Fragment } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import { Link, history } from 'umi';
import { Button, Icon } from '@components';

import { connect } from 'react-redux';

@connect(({ Increment, loading, global }) => ({
  Increment,
  global,
}))
class leftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: '',
      navList: [
        // {
        //   key: 'home',
        //   path: '/workPlatform/index',
        //   title: '工作台',
        //   icon: 'iconT1-gongzuotai-weixuanzhong',
        //   selIcon: 'iconT1-gongzuotai-xuanzhong',
        // },
        // {
        //   key: 'candidate',
        //   path: '/candidate/index',
        //   title: '候选人',
        //   icon: 'iconT2-houxuanren-weixuanzhong',
        //   selIcon: 'iconT2-houxuanren-xuanzhong',
        // },
        // {
        //   key: 'recruitment',
        //   path: '/recruitment/index',
        //   title: '职位管理',
        //   icon: 'iconT3-zhiweiguanli-weixuanzhong',
        //   selIcon: 'iconT3-zhiweiguanli-xuanzhong',
        // },
        // // {
        // //   key: 'talentMarket',
        // //   path: '/talentMarket/index',
        // //   title: '人才市场',
        // //   icon: 'iconT5-rencaiku-weixuanzhong',
        // //   selIcon: 'iconT5-rencaiku-xuanzhong',
        // // },
        // {
        //   key: 'talenter',
        //   path: '/talenter/index',
        //   title: '人才库',
        //   icon: 'iconT5-rencaiku-weixuanzhong',
        //   selIcon: 'iconT5-rencaiku-xuanzhong',
        // },
        // {
        //   key: 'increment',
        //   path: '/increment/index',
        //   title: '增值服务',
        //   icon: 'iconT7-zengzhifuwu-weixuanzhong',
        //   selIcon: 'iconT7-zengzhifuwu-xuanzhong',
        // },
        // {
        //   key: 'journaling',
        //   path: '/journaling/index',
        //   title: '统计报表',
        //   icon: 'iconT6-tongjibaobiao-weixuanzhong',
        //   selIcon: 'iconT6-tongjibaobiao-xuanzhong',
        // },
        // {
        //   key: 'calendar',
        //   path: '/calendar/index',
        //   title: '招聘日历',
        //   icon: 'iconT4-mianshirili-weixuanzhong',
        //   selIcon: 'iconT4-mianshirili-xuanzhong',
        // },
        // {
        //   key: 'interview',
        //   path: '/interview/index',
        //   title: '面试安排',
        //   icon: 'iconT9-mianshianpai-weixuanzhong',
        //   selIcon: 'iconT9-mianshianpai-xuanzhong',
        // },
        // {
        //   key: 'resume',
        //   path: '/resume/index',
        //   title: '简历分享',
        //   icon: 'iconT10-jianlifenxiang-weixuanzhong',
        //   selIcon: 'iconT10-jianlifenxiang-xuanzhong',
        // },
        // {
        //   key: 'setting',
        //   path: '/setting/index',
        //   title: '设置',
        //   icon: 'iconT8-shezhi-weixuanzhong',
        //   selIcon: 'iconT8-shezhi-xuanzhong',
        // },
        // { key: 'commonCP', path: '/commonCP/index', title: '公共组件' },
      ],
      menus: [
        {
          title: '首页',
          icon: 'page',
          key: '/',
        },
        {
          title: '设置',
          icon: 'bulb',
          key: '/page/Other',
          subs: [
            {
              key: '/page/AlertDemo',
              title: '弹出框',
              icon: '',
              subs: [{ key: '/page/AlertDemo', title: '弹出框', icon: '' }],
            },
          ],
        },
      ],
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'Increment/payResult',
      payload: {
        corp_id: localStorage.getItem('corpId'),
        callback: (res) => {
          let data = res.data;
        },
      },
    });
    this.handleAuth(false);
  }

  componentDidMount() {
    const { navList } = this.state;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const pathname = history.location.pathname;
    const nowpath =
      pathname.split('/')[1] == 'workPlatform' || pathname.split('/')[1] == ''
        ? 'home'
        : pathname.split('/')[1];
    // 未完成
    this.setState({
      currentKey: nowpath,
    });
    this.props.dispatch({
      type: 'global/save',
      payload: {
        type: 'navCurrentKey',
        dataSource: nowpath,
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    // personnelPayResult 判断是否购买了人才市场
    const { Increment = {} } = nextProps;
    let roleType = localStorage.getItem('role_type_arr');
    let roleTypeArr = roleType && roleType.split(',');
    const { personnelPayResult = 0 } = Increment;
    // // 如果为1则表示购买人才市场 如果是面试官则不需要进入
    if (roleTypeArr?.length == 1 && roleTypeArr[0] == 3) {
      return;
    }
    if (personnelPayResult === 1) {
      this.handleAuth(true);
    }
    // const { navList } = this.state;
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
    // const pathname = history.location.pathname;
    // const nowpath =
    //   pathname.split('/')[1] == 'workPlatform' || pathname.split('/')[1] == ''
    //     ? 'home'
    //     : pathname.split('/')[1];
    // // 未完成
    //
    // this.setState({
    //   currentKey: nowpath,
    // });
    // this.props.dispatch({
    //   type: 'global/save',
    //   payload: {
    //     type: 'navCurrentKey',
    //     dataSource: nowpath,
    //   },
    // })
  }
  // 设置权限
  handleAuth = (personnelPayResult) => {
    let interviewModal = [
      // {
      //   key: 'resume',
      //   path: '/resume/index',
      //   title: '简历筛选',
      //   icon: 'iconT10-jianlifenxiang-weixuanzhong',
      //   selIcon: 'iconT10-jianlifenxiang-xuanzhong',
      // },
      // {
      //   key: 'interview',
      //   path: '/interview/index',
      //   title: '面试安排',
      //   icon: 'iconT9-mianshianpai-weixuanzhong',
      //   selIcon: 'iconT9-mianshianpai-xuanzhong',
      // },
    ];
    let hrModal = [
      // {
      //   key: 'home',
      //   path: '/workPlatform/index',
      //   title: '工作台',
      //   icon: 'iconT1-gongzuotai-weixuanzhong',
      //   selIcon: 'iconT1-gongzuotai-xuanzhong',
      // },
      // {
      //   key: 'candidate',
      //   path: '/candidate/index',
      //   title: '候选人',
      //   icon: 'iconT2-houxuanren-weixuanzhong',
      //   selIcon: 'iconT2-houxuanren-xuanzhong',
      // },
      // {
      //   key: 'recruitment',
      //   path: '/recruitment/index',
      //   title: '职位管理',
      //   icon: 'iconT3-zhiweiguanli-weixuanzhong',
      //   selIcon: 'iconT3-zhiweiguanli-xuanzhong',
      // },
      // {
      //   key: 'talenter',
      //   path: '/talenter/index',
      //   title: '人才库',
      //   icon: 'iconT5-rencaiku-weixuanzhong',
      //   selIcon: 'iconT5-rencaiku-xuanzhong',
      // },
      // {
      //   key: 'talentMarket',
      //   path: '/talentMarket/index',
      //   title: '人才市场',
      //   icon: 'iconT11-gongzuotai-rencaishichang-weixuanzhong',
      //   selIcon: 'iconT11-gongzuotai-rencaishichang-xuanzhong',
      // },
      // {
      //   key: 'foreignTrade',
      //   path: '/foreignTrade/tradeFind/index',
      //   title: '贸易找人',
      //   icon: 'iconwaimaozhipin',
      //   selIcon: 'iconwaimaozhipin_xuanzhong',
      // },
      // {
      //   key: 'increment',
      //   path: '/increment/index',
      //   title: '增值服务',
      //   icon: 'iconT7-zengzhifuwu-weixuanzhong',
      //   selIcon: 'iconT7-zengzhifuwu-xuanzhong',
      // },
      // {
      //   key: 'journaling',
      //   path: '/journaling/index',
      //   title: '统计报表',
      //   icon: 'iconT6-tongjibaobiao-weixuanzhong',
      //   selIcon: 'iconT6-tongjibaobiao-xuanzhong',
      // },
      // {
      //   key: 'calendar',
      //   path: '/calendar/index',
      //   title: '招聘日历',
      //   icon: 'iconT4-mianshirili-weixuanzhong',
      //   selIcon: 'iconT4-mianshirili-xuanzhong',
      // },
    ];
    let setNav = {
      key: 'setting',
      path: '/setting/index',
      title: '设置',
      icon: 'iconT8-shezhi-weixuanzhong',
      selIcon: 'iconT8-shezhi-xuanzhong',
    };
    if (!personnelPayResult) {
      hrModal = hrModal.filter((item) => item.title !== '人才市场');
    }
    if (localStorage.getItem('show_algj') != 1 && localStorage.getItem('show_nmyc') != 1) {
      hrModal = hrModal.filter((item) => item.title !== '贸易找人');
    }
    let role =
      localStorage.getItem('role_type_arr') &&
      localStorage
        .getItem('role_type_arr')
        .split(',')
        .sort((a, b) => {
          return a - b;
        });
    let navList = [];
    for (let i = 0, len = role?.length; i < len; i++) {
      if (role[i].includes('1') || role[i].includes('2')) {
        navList = [...hrModal];
      }
      if (role[i].includes('3')) {
        navList = [...navList, ...interviewModal];
      }
    }
    if (role?.length == 1 && role.includes('3')) {
    } else {
      navList.push(setNav);
    }
    this.setState(
      {
        navList,
      },
      () => {
        //
        this.props.renderSuccess && this.props.renderSuccess(false);
        role?.length == 1 && role.includes('3') && history.push('/resume/index');
      },
    );
  };
  handleClick = (val) => {
    this.setState(
      {
        currentKey: val,
      },
      () => {
        this.props.dispatch({
          type: 'global/save',
          payload: {
            type: 'navCurrentKey',
            dataSource: val,
          },
        });
      },
    );
  };

  // 改变保存在model里面的数据
  changeModelData(type, value) {
    this.props.dispatch({
      type: 'global/save',
      payload: {
        type: type,
        dataSource: value,
      },
    });
  }

  renderSubMenu = ({ key, icon, title, subs }) => {
    return (
      <Menu.SubMenu
        key={key}
        title={
          <span>
            {icon && <Icon type={icon} />}
            <span>{title}</span>
          </span>
        }
      >
        {subs &&
          subs.map((item) => {
            return item.subs && item.subs.length > 0
              ? this.renderSubMenu(item)
              : this.renderMenuItem(item);
          })}
      </Menu.SubMenu>
    );
  };
  renderMenuItem = ({ key, icon, title }) => {
    return (
      <Menu.Item key={key}>
        <Link to={key}>
          {icon && <Icon type={icon} />}
          <span>{title}</span>
        </Link>
      </Menu.Item>
    );
  };

  render() {
    const { navList, currentKey } = this.state;
    const { global } = this.props;
    return (
      <Fragment>
        <div
          className={`${style.contentLeft} ${global.showNav ? '' : style.hideNav}`}
          onMouseEnter={() => this.changeModelData('showNav', true)}
          onMouseLeave={() => this.changeModelData('showNav', false)}
        >
          <ul className={style.contentNav}>
            {navList.map((route) => (
              <li
                key={route.key}
                className={`${route.key === global.navCurrentKey ? style.isActive : ''} ${
                  route.key === 'setting' ? style.isSetting : ''
                }`}
                onClick={() => this.handleClick(route.key)}
              >
                <Link key={route.key} to={route.path}>
                  <Icon
                    style={{
                      marginRight: '15px',
                      color: route.key === global.navCurrentKey ? route.selIcon : route.icon,
                    }}
                    name={route.icon}
                  ></Icon>
                  {global.showNav && <span className={style.navTitle}>{route.title}</span>}
                </Link>

              </li>

            ))}
          </ul>
        </div>
      </Fragment>
      // <Sider
      //   collapsible
      //   collapsed={this.state.collapsed}
      //   onCollapse={this.onCollapse}
      //   trigger={null}
      // >
      // {
        /* <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <Link key="setting" to={'/setting/index'}>
              {' '}
              <span>Option 1</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span onClick={() => this.handleClick('setting')}>Option 2</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="user" />
                    <span>User1</span>
                  </span>
                }
              >
                <Menu.Item key="31">Bsf</Menu.Item>
                <Menu.Item key="36">Bsf22</Menu.Item>
              </SubMenu>
            </Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu> */
      // }
      //   <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="dark"  style={{ height: '100%' }}>
      //     {this.state.menus.map((item) => {
      //       return item.subs && item.subs.length > 0
      //         ? this.renderSubMenu(item)
      //         : this.renderMenuItem(item);
      //     })}
      //   </Menu>
      // </Sider>
    );
  }
}

export default leftNav;
