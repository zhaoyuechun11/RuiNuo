import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { reportProjectDetail } from '../../../../../../models/server';
const DetailsModal = ({ Ref }) => {
  const dialogRef = useRef();
  const [significance, setSignificance] = useState();
  useImperativeHandle(Ref, () => ({
    show: (item: React.SetStateAction<undefined>) => {
      dialogRef.current && dialogRef.current.show();
      getReportProjectDetail(item.itemId);
    },
  }));

  const getReportProjectDetail = (id) => {
    reportProjectDetail({ id }).then((res) => {
      if (res.code === 200) {
        setSignificance(res.data.significance);
      }
    });
  };
  return (
    <Dialog ref={dialogRef} width={640} title={'临床意义'}>
      <div
        style={{ padding: '20px' }}
        dangerouslySetInnerHTML={{
          __html: significance,
        }}
      ></div>
    </Dialog>
  );
};
export default DetailsModal;
