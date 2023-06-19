import { useState, useEffect } from 'react';
import s from './index.less';
/**
 * tabbar
 * @param  {Array} tabarList tabar列表
 * @param  {Function} selectFun 返回选中的id
 */
export default ({ currentId, tabarList, selectFun }) => {
  const [chioceId, setChioceId] = useState(0);

  useEffect(() => {
    setChioceId(currentId || 0);
  }, [currentId]);

  const changeBar = (index, d) => {
    setChioceId(index);
    return selectFun(index, d);
  };
  return (
    <div className={s.taberContent}>
      {tabarList.map((d, index) => (
        <div
          className={`${s.taberItem} ${index == chioceId ? s.actived : ''} `}
          key={index}
          onClick={() => changeBar(index, d)}
        >
          {d}
        </div>
      ))}
    </div>
  );
};
