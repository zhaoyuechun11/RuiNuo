import s from './index.less';
export default ({ titleName }) => {
  return (
    <div className={s.titleContent}>
      <div className={s.titleName}>{titleName}</div>
      <div className={s.line}></div>
    </div>
  );
};
