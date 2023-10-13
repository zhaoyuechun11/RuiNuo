import React from 'react';
import Pretreatment from './commones/pretreatment';
import Immunity from './commones/immunity';
import { useSelector } from 'umi';

const Task = () => {
  const { useDetail } = useSelector((state: any) => state.global);
  return <div>{useDetail.departmentType === '前处理组' ? <Pretreatment /> : <Immunity />}</div>;
};
export default Task;
