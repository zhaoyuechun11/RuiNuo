import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import s from './index.less';
const AuditWarning = ({ Ref }) => {
  const [warnVal, setWarnVal] = useState();
  const dialogRef = useRef();
  useImperativeHandle(Ref, () => ({
    show: (val: any) => {
      setWarnVal(val);
      dialogRef.current && dialogRef.current.show();
    },
  }));
  return (
    <Dialog ref={dialogRef} width={460} title={'未通过审核的错误记录'} className={s.warn_box}>
      {warnVal?.map((item) => {
        return <div>{item}</div>;
      })}
    </Dialog>
  );
};
export default AuditWarning;
