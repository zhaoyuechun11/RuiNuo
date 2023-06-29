import React, { Fragment, useState, useEffect, useRef } from 'react';
import Title from './components/title/index';
import LinkCard from './components/LinkCard/index';

import s from './style/index.less';
import Utils from '@utils';
import Card from '@components/Card';
import { connect } from 'umi';
import { Spin } from 'antd';

let tabber = [
  {
    modalTitle: '权限设置',
    auth: true,
    classname: 'borderBlue',
    modalType: [
      {
        icon: 'iconSZ-jiaoseguanli',
        title: '角色管理',
        path: '/setting/organize',
      },
      {
        icon: 'iconSZ-renyuanguanli',
        title: '人员管理',
        path: '/setting/roleMange',
      },
      {
        icon: 'iconSZ-renyuanguanli',
        title: '权限管理',
        path: '/setting/permissionMange',
      },
      {
        icon: 'iconSZ-renyuanguanli',
        title: '系统全局选项设置',
        path: '/setting/globalOptionsSet',
      },
      {
        icon: 'iconSZ-gongsixinxi',
        title: '公司信息',
        path: '/setting/companyInfo',
      },
    ],
  },
];

const Setting = ({ global, ...props }) => {
  const [loading, setLoading] = useState(false);

  // 新手引导
  useEffect(() => {
    let newStep = Utils.getItem();
    props.dispatch({
      type: 'global/setStepNum',
      payload: newStep || global.defaultObj,
    });
    // 配置钉钉鉴权环境
    `   // INIT_SET_CONFIG();`;
  }, []);

  // if (global.is_admin * 1 !== 1 && global.is_hr * 1 !== 1) {
  //   tabber.forEach((item, ind) => {
  //     if (item.auth) {
  //       item.hide = true;
  //       tabber = tabber.filter((i) => {
  //         i.modalType = i.modalType.filter((j) => !j.hide);
  //         return !i.hide;
  //       });
  //     }
  //   });
  // }
  return (
    <Card>
      <Spin spinning={loading}>
        <div className={s.settingContent}>
          {tabber.map((i) => {
            return (
              <div key={i.modalTitle}>
                <Title titleName={i.modalTitle} />
                <div className={s.modalType}>
                  {i.modalType.map((d) => {
                    if (i.modalTitle == '模板设置') {
                      if (global.is_admin * 1 === 2 && global.is_hr * 1 === 2) {
                        if (d.title != '人才库分类管理') {
                          return <LinkCard classNames={i.classname} {...d} key={d.title} />;
                        }
                      } else {
                        return <LinkCard classNames={i.classname} {...d} key={d.title} />;
                      }
                    } else {
                      return (
                        <LinkCard
                          classNames={i.classname}
                          {...d}
                          key={d.title}
                          setLoading={setLoading}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Spin>
    </Card>
  );
};

export default connect(({ global }) => ({
  global,
}))(Setting);
