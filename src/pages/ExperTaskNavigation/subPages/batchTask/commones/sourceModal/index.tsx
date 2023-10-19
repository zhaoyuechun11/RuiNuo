import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import SampleTraceability from '@/pages/GeneralInspectionMag/subPages/reportDataMag/commones/sampleTraceability';
const SourceModal = ({ Ref }) => {
  const dialogRef = useRef();
  const [barcode, setBarcode] = useState('');
  useImperativeHandle(Ref, () => ({
    show: (record: any) => {
      setBarcode(record.sampleBarcode);
      dialogRef.current && dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    setBarcode('');
    dialogRef.current && dialogRef.current.hide();
  };
  return (
    <Dialog ref={dialogRef} width={864} title="溯源" onOk={onOk}>
      <SampleTraceability from="batchTask" sampleBarcode={barcode}></SampleTraceability>
    </Dialog>
  );
};
export default SourceModal;
