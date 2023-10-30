import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Popover } from 'antd';
import style from './index.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, history } from 'umi';
import UpdatePassword from './components/UpdatePassword';

const HeaderContent = () => {
  const [userData, setUserData] = useState();
  const updatePwd = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = useCallback(() => {
    dispatch({
      type: 'global/fetchUserDetail',
      payload: {
        callback: (res) => {
          setUserData(res);
          if (res.departmentType === '前处理组' || res.departmentType === '专业组') {
            history.push('/experTaskNavigation/task');
          }
        },
      },
    });
  }, [dispatch]);
  const logOut = () => {
    localStorage.setItem('access_token', '');
    history.push('/login');
  };
  const infoMenu = (
    <div>
      <p className={style.showContent}>
        <span>姓名:</span>
        {userData?.name}
      </p>
      <p className={style.showContent}>
        <span>帐号:</span>
        {userData?.account}
      </p>
      <div
        onClick={() => {
          updatePwd.current.show();
        }}
        className={style.showContent}
      >
        修改密码
      </div>
      <div onClick={logOut}>退出系统</div>
    </div>
  );
  return (
    <>
      <Popover content={infoMenu} trigger="click" placement="bottomRight">
        <div className={style.header}>
          <div className={style.headerPic}>
            <img
              src={
                localStorage.getItem('operator_pic') ||
                require('@assets/images/commom/header_unknow.png')
              }
            />
          </div>
          <span style={{ whiteSpace: 'nowrap' }}>{userData?.name || ''}</span>
          <CaretDownOutlined
            style={{ fontSize: '10px', marginLeft: 8, color: '#AEB2BB' }}
          ></CaretDownOutlined>
        </div>
      </Popover>
      <UpdatePassword cRef={updatePwd}></UpdatePassword>
    </>
  );
};
export default HeaderContent;
