import React from 'react';
import Icon from '@components/Icon';
import style from './index.less';

const LeftContent = () => {
  return (
    <div className={style.wrap}>
      <div className={style.title}>报告单元</div>
      <div>
        血常规
        <Icon
          name="iconanniu-bianji"
          classStyle={style.editIcon}
          onClick={(e) => {
            //target.changePosition && target.changePosition(e, record, 1);
          }}
        />
      </div>
    </div>
  );
};
export default LeftContent;
