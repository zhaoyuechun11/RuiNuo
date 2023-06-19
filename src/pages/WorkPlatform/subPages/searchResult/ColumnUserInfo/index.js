import React, { Fragment, useRef } from 'react';
import style from './index.less';
import { SEX_LIST } from '@utils/constant';
import { Avatar, Tooltip, message, Row, Col } from 'antd';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { HeadPhoto, Icon } from '@components';
import moment from 'moment';
// import { AddTags } from '../../subPages/detail/components';
import { connect } from 'umi';

const Index = ({ userInfo, refresh, operator_id, hideTag }) => {
  const addTagsRef = useRef();
  const styles = {
    display: 'inline-block',
    // maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const neiTui = (
    <div>
      <p>
        推荐人：
        {userInfo.recommend_user && userInfo.recommend_user.length > 0
          ? userInfo.recommend_user[0].name
          : ''}
      </p>
      {userInfo.protect_day !== 0 && (
        <p>内推保护期剩余：{userInfo.protect_day}天</p>
      )}
    </div>
  );
  const lieTou = (
    <div>
      <p>
        {userInfo.headhunter_corp && userInfo.headhunter_corp.length > 0
          ? userInfo.headhunter_corp[0].corp_name
          : ''}
      </p>
      {userInfo.headhunter_account && userInfo.headhunter_account.length > 0 ? (
        <p>顾问：{userInfo.headhunter_account[0].name}</p>
      ) : (
        ''
      )}
    </div>
  );
  const icons = {
    waimaozhipin: {
      font: '外',
      tip: '外贸直聘',
      styleName: style.sign_wai,
    },
    neimaoyingcai: {
      font: '内',
      tip: '内贸英才',
      styleName: style.sign_nei,
    },
    zhangjiagang: {
      font: '张',
      tip: '张家港人才市场',
      styleName: style.sign_zhang,
    },
    chajiandaoru: {
      font: '插',
      tip: '插件导入',
      styleName: style.sign_cha,
    },
    zizhushangchuan: {
      font: '自',
      tip: '自主上传',
      styleName: style.sign_zi,
    },
    youxiangtongbu: {
      font: '邮',
      tip: '邮箱同步',
      styleName: style.sign_you,
    },
    menhufangan: {
      font: '门',
      tip: '门户方案',
      styleName: style.sign_men,
    },
    neibutuijian: {
      font: '推',
      tip: '内部推荐',
      styleName: style.sign_tui,
    },
    lietou: {
      font: '猎',
      tip: '猎头',
      styleName: style.sign_lie,
    },
  };
  // // 取消绑定
  // const _unbindTag = id => {
  //   unbindTag({ id }).then(res => {
  //     if (res.status_code === 200) {
  //       message.success('删除成功');
  //       refresh && refresh()
  //     } else {
  //       message.warn(res.message);
  //     }
  //   });
  // };

  return (
    <Fragment>
      <div className={style.card}>
        <Row>
          <Col style={{ display: 'flex' }} span={8}>
            <HeadPhoto
              is_mask={userInfo.is_mask}
              src={userInfo.avatar_url}
              sex={userInfo.sex}
              style={{
                width: 60,
                height: 60,
                marginRight: 20,
                backgroundColor: '#eee',
              }}
            />
            <div>
              <div className={style.card_title}>
                {userInfo.is_mask === 1 && (
                  <img
                    style={{ width: 56, height: 24 }}
                    src={require('@/assets/images/commom/name_vague.png')}
                    alt=""
                  />
                )}
                {/* <Tooltip placement="top" title={neiTui}>
              <span className={`${style.sign} ${style.sign_tui}`}>推</span>
            </Tooltip> */}
                {userInfo.terminal ? (
                  <Tooltip
                    placement="top"
                    title={
                      userInfo.terminal.id == 8
                        ? neiTui
                        : userInfo.terminal.id == 9
                        ? lieTou
                        : icons[userInfo.terminal.name].tip
                    }
                  >
                    <span
                      className={`${style.sign} ${
                        icons[userInfo.terminal.name].styleName
                      }`}
                    >
                      {icons[userInfo.terminal.name].font}
                    </span>
                  </Tooltip>
                ) : (
                  ''
                )}
                {userInfo.is_mask !== 1 &&
                  (userInfo.name.length > 5 ? (
                    <Tooltip placement="top" title={userInfo.name}>
                      <div style={{ cursor: 'pointer' }} className={style.name}>
                        {userInfo.name.substr(0, 5) + '...'}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className={style.name} style={styles}>
                      {userInfo.name}
                    </div>
                  ))}
                {userInfo.is_mask !== 1 &&
                  (userInfo.position.name.length > 5 ? (
                    <Tooltip placement="top" title={userInfo.position.name}>
                      <div
                        style={{ cursor: 'pointer', marginLeft: 10 }}
                        className={style.name}
                      >
                        {userInfo.position.name.substr(0, 5) + '...'}
                       
                      </div>
                    </Tooltip>
                  ) : (
                    <div style={{ marginLeft: 10 }}  className={style.name}>
                      {userInfo.position.name}
                    </div>
                  ))}

                <Tooltip
                  placement="topRight"
                  title={userInfo.channels_name}
                  overlayClassName={style.tooltip}
                >
                  <div className={style.time}>
                    {moment(userInfo.created_at).format('YYYY-MM-DD')} 申请·
                    <span style={styles}>{userInfo.channels_name}</span>
                  </div>
                </Tooltip>

                {userInfo.is_suspicious === 1 && (
                  <Tooltip placement="top" title="系统中存在疑似简历">
                    <Avatar
                      className={style.tip}
                      style={{
                        color: '#ff7078',
                        background: '#ffdcd9',
                        border: '1px solid #ff7078',
                        marginLeft: 4,
                      }}
                    >
                      疑
                    </Avatar>
                  </Tooltip>
                )}
                {userInfo.delivery_count > 0 && (
                  <Tooltip
                    placement="top"
                    title={`候选人在其他${userInfo.delivery_count}个职位下有应聘记录。`}
                  >
                    <Avatar
                      className={style.tip}
                      style={{
                        color: '#5389f5',
                        background: '#d2eafb',
                        border: '1px solid #5389f5',
                        marginLeft: 4,
                      }}
                    >
                      {userInfo.delivery_count}
                    </Avatar>
                  </Tooltip>
                )}
              </div>
              <ul>
                {(userInfo.sex || userInfo.age_num || userInfo.work_num) && (
                  <li>
                    {/* <span className={style.icon}>
              <Icon name="iconhouxuanren-jibenxinxi" />
            </span> */}
                    {(userInfo.sex == 1 || userInfo.sex == 2) && (
                      <span>{SEX_LIST[userInfo.sex]}</span>
                    )}
                    {userInfo.age_num != 0 && (
                      <span>
                        <span className={style.line} />
                        {userInfo.age_num}岁
                      </span>
                    )}
                    {userInfo.work_num != 0 && (
                      <span>
                        <span className={style.line} />
                        {userInfo.work_num}年以上
                      </span>
                    )}
                  </li>
                )}
                {(userInfo.work_place ||
                  userInfo.work_position ||
                  userInfo.work_start_time ||
                  userInfo.work_end_time) && (
                  <li>
                    {/* <span className={style.icon}>
              <Icon name="iconhouxuanren-gongsi" />
            </span> */}
                    {userInfo.work_place && (
                      <Tooltip
                        placement="top"
                        title={userInfo.work_place}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>{userInfo.work_place}</span>
                      </Tooltip>
                    )}
                    {userInfo.work_position && (
                      <Tooltip
                        placement="top"
                        title={userInfo.work_position}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>
                          <span className={style.line} style={styles} />
                          {userInfo.work_position}
                        </span>
                      </Tooltip>
                    )}
                    {(userInfo.work_start_time || userInfo.work_end_time) && (
                      <Tooltip
                        placement="top"
                        title={`${userInfo.work_start_time || '-'} 至 ${
                          userInfo.work_end_time || '-'
                        }`}
                        overlayClassName={style.tooltip}
                      >
                        <span>
                          <span className={style.line} style={styles} />
                          {userInfo.work_start_time || '-'}
                          &nbsp;&nbsp;至&nbsp;&nbsp;
                          {userInfo.work_end_time || '-'}
                        </span>
                      </Tooltip>
                    )}
                  </li>
                )}
                {(userInfo.graduate ||
                  userInfo.major ||
                  userInfo.education ||
                  userInfo.education_start_time ||
                  userInfo.education_end_time) && (
                  <li>
                    {/* <span className={style.icon}>
              <Icon name="iconhouxuanren-xuexiao" />
            </span> */}
                    {userInfo.graduate && (
                      <Tooltip
                        placement="top"
                        title={userInfo.graduate || '暂无'}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>
                          {userInfo.graduate || '暂无'}
                        </span>
                      </Tooltip>
                    )}
                    {userInfo.major && (
                      <Tooltip
                        placement="top"
                        title={userInfo.major || '暂无'}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>
                          {userInfo.graduate && <span className={style.line} />}
                          {userInfo.major || '暂无'}
                        </span>
                      </Tooltip>
                    )}
                    {userInfo.education && (
                      <Tooltip
                        placement="top"
                        title={userInfo.education || '暂无'}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>
                          {(userInfo.graduate || userInfo.major) && (
                            <span className={style.line} />
                          )}
                          {userInfo.education || '暂无'}
                        </span>
                      </Tooltip>
                    )}
                    {(userInfo.education_start_time ||
                      userInfo.education_end_time) && (
                      <Tooltip
                        placement="top"
                        title={`${userInfo.education_start_time || '-'} 至 
                      ${userInfo.education_end_time || '-'}`}
                        overlayClassName={style.tooltip}
                      >
                        <span style={styles}>
                          {(userInfo.graduate ||
                            userInfo.major ||
                            userInfo.education) && (
                            <span className={style.line} />
                          )}
                          {userInfo.education_start_time || '-'}
                          &nbsp;&nbsp;至&nbsp;&nbsp;
                          {userInfo.education_end_time || '-'}
                        </span>
                      </Tooltip>
                    )}
                  </li>
                )}
                <div
                  className={`${style.tagList} ${
                    userInfo.tag_list.length > 3 ? style.more : ''
                  }`}
                >
                  {userInfo.tag_list
                    ? userInfo.tag_list.map((item, index) => {
                        return (
                          <Tooltip
                            placement="top"
                            title={item.label_name}
                            overlayClassName={style.tooltip}
                            key={index}
                          >
                            <span
                              className={`${style.tag} ${
                                item.style || 'tag_0'
                              }`}
                            >
                              <span className={style.text}>
                                {item.label_name}
                              </span>
                            </span>
                          </Tooltip>
                        );
                      })
                    : null}
                </div>
              </ul>
            </div>
          </Col>
          <Col span={8} offset={4}>
            <div>手机号:{userInfo.phone?userInfo.phone:'未填写手机号'}</div>
            <div>邮箱:{userInfo.email?userInfo.email:'未填写邮箱'}</div>

          </Col>
          <Col span={4}>
            当前阶段：
            {userInfo.talent_pool_name
              ? userInfo.talent_pool_name
              : userInfo.status_name}
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ global: { operator_id } }) => {
  return {
    operator_id,
  };
};

export default connect(mapStateToProps)(Index);
