import { useRef } from 'react';
import { Link, history, connect } from 'umi';

import s from './index.less';
import axios from 'axios';
import { Icon } from '@components';

const LinkCard = ({ global, icon, title, path, classNames, setLoading }) => {
  const setInfo_modal = useRef();
  const newFeatureList = ['工作通知', '招聘自动化', '候选人通知', '抄送人管理'];
  const styles = {
    borderBlue: s.borderBlue,
    borderOrange: s.borderOrange,
    borderBluess: s.borderBluess,
    borderNews: s.borderNews,
    borderTemplate: s.borderTemplate,
    borderApproval: s.borderApproval,
    borderTag: s.borderTag,
    borderPurple: s.borderPurple,
    borderYellow: s.borderYellow,
    borderCyan: s.borderCyan,
    borderGreen: s.borderGreen,
  };
  const cardStyle = {
    width: '330px',
    nav: 0,
    style: {
      padding: '19px 20px',
    },
  };

  const clickLink = (e) => {
    if (title == '内推设置' || title == '猎头设置') {
      //内推是否需要去配置
      let data = {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      };
      setLoading(true);
      axios.post('/apiweb/recommend/checkEnterpriseInfo', data).then((res) => {
        setLoading(false);
        if (res.data.status_code == 200) {
          history.push(path);
        } else {
          setInfo_modal.current.show();
        }
      });
    } else {
      history.push(path);
    }
  };

  return (
    <div onClick={clickLink} className={s.modalLink}>
      <div className={`${s.card} ${styles[classNames]}`}>
        <div className={`${s.wrap} flex_start`}>
          <div className={s.icon}>
            {/* <img src={require(`@assets/images/setting/${icon}`)} /> */}
            <Icon name={icon} classStyle={s.ico} />
          </div>
          <p className={s.title}>
            {title}
            {/* {newFeatureList.includes(title) && (
              <img
                className={s.newImg}
                src={require('@assets/images/commom/new.png')}
                alt="新增功能图标"
              />
            )} */}
          </p>
        </div>
      </div>
      {/* <SetInfoModal rules_modal={setInfo_modal} /> */}
    </div>
  );
};

export default connect(({ global }) => ({
  global,
}))(LinkCard);
