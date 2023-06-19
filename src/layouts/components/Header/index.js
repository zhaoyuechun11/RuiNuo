import React, { useEffect, useRef, useState } from 'react';
import { Popover, Button } from 'antd';
import style from './index.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { detail } from './server';
import UpdatePassword from './components/UpdatePassword';

const HeaderContent = () => {
  const [userData, setUserData] = useState();
  const updatePwd = useRef();
  useEffect(() => {
    getUserDetail();
  }, []);
  const getUserDetail = () => {
    detail().then((res) => {
      if (res.code === 200) {
        setUserData(res.data);
      }
    });
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
      >
        修改密码
      </div>
    </div>
  );
  return (
    // <Popover
    //   placement="bottomRight"
    //   content={infoMenu}
    //   overlayClassName={style.headPop}
    //   trigger="click"
    //   getPopupContainer={() => document.getElementById('contentHeader')}
    // >
    //   <div className={style.header}>
    //     <div className={style.headerPic}>
    //       <img
    //         src={
    //           localStorage.getItem('operator_pic') ||
    //           require('@assets/images/commom/header_unknow.png')
    //         }
    //       />
    //     </div>
    //     <span style={{ whiteSpace: 'nowrap' }}>{localStorage.getItem('operator_name') || ''}</span>
    //     <CaretDownOutlined style={{ fontSize: '10px', marginLeft: 8, color: '#AEB2BB' }} />
    //   </div>
    // </Popover>
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
