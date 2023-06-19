import React, { useImperativeHandle, useRef } from 'react';
import Dialog from '../Dialog/index';
import style from './index.less';

const Index = ({ confirmRef, img, imgStyle, title, content, ...props }) => {
  const dialogRef = useRef();

  useImperativeHandle(confirmRef, () => ({
    show: show,
    hide: hide,
    confirm: confirm,
  }));
  const show = () => {
    dialogRef.current && dialogRef.current.show();
  };
  const hide = () => {
    dialogRef.current && dialogRef.current.hide();
  };

  return (
    <Dialog ref={dialogRef} {...props}>
      <div className={style.container}>
        <img
          style={imgStyle}
          className={img===undefined?`${style.img}`:`${style.imginto}`}
          src={require(`@assets/images/${img || 'commom/del_icon.png'}`)}
          alt=""
        />
        <div className={style.title}>{title || '确认删除吗'}</div>
        {
         content &&  <div className={style.content}>{content || '确认删除该条记录吗'}</div>

        }
       
      </div>
    </Dialog>
  );
};

export default Index;
