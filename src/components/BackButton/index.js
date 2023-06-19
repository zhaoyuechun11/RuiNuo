import { history } from 'umi';
import { LeftOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Icon } from '@components';
import { Tooltip } from 'antd';
import style from './index.less';
const BtnStyle = {
  btnType: 'primary',
};
/**
 * 返回按钮
 * @param  {String} title 返回按钮title
 * @param  {Object} styleObject 覆盖原有样式
 * @param  {String} path 自定义返回的地址
 */
const BackButton = ({
  title,
  path,
  styleObject,
  children,
  onChangeBtn,
  childrenStyle,
  isShowTooltip,
  tooltipTitle,
  syncWordDesc,
  syncWordDescFun,
  offerApprover,
  backBtnClassName,
  btnType = 'primary',
}) => {
  const goBack = () => {
    if (onChangeBtn) {
      onChangeBtn();
    } else {
      if (path) {
        history.push(path);
      } else {
        history.goBack();
      }
    }
  };
  const syncWordDescModel = () => {
    syncWordDescFun();
  };
  return (
    <div
      className={style.backBtnContent}
      style={{ ...styleObject, padding: offerApprover ? '20px' : '' }}
    >
      <div className={style.backBtn}>
        <Button
          btnType={btnType}
          className={backBtnClassName}
          style={{ fontWeight: '400' }}
          onClick={goBack}
        >
          {/* <LeftOutlined style={{ marginRight: 5 }} /> */}
          <span className={style.backIcon}>
            <Icon name="iconanniu-jinruxiayijieduan" />
          </span>
          <span>返回</span>
        </Button>
        <span className={style.title}>{title}</span>{' '}
        {isShowTooltip ? (
          <Tooltip title={tooltipTitle} placement="top" arrowPointAtCenter={true}>
            <ExclamationCircleOutlined
              style={{
                color: '#007BFF',
                marginLeft: 5,
                fontSize: '13px',
                cursor: 'pointer',
                lineHeight: '35px',
              }}
            />
          </Tooltip>
        ) : (
          ''
        )}
        {syncWordDesc ? (
          <span
            style={{ marginLeft: '40px', color: '#007BFF', lineHeight: '32px' }}
            onClick={syncWordDescModel}
          >
            <QuestionCircleOutlined
              style={{
                color: '#007BFF',
                marginLeft: 5,
                fontSize: '13px',
                cursor: 'pointer',
                lineHeight: '32px',
              }}
            />
            如何同步招聘需求字段
          </span>
        ) : (
          ''
        )}
      </div>
      <div style={{ ...childrenStyle }}>{children}</div>
    </div>
  );
};

export default BackButton;
