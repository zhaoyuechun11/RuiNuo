import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
const DetailsModal = ({ Ref }) => {
  const dialogRef = useRef();
  const [currentItem, setCurrentItem] = useState();
  useImperativeHandle(Ref, () => ({
    show: (item: React.SetStateAction<undefined>) => {
      dialogRef.current && dialogRef.current.show();
      setCurrentItem(item);
    },
  }));
  const onOk = () => {};
  return (
    <Dialog
      ref={dialogRef}
      width={640}
      title={'临床意义'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    ></Dialog>
  );
};
export default DetailsModal;
