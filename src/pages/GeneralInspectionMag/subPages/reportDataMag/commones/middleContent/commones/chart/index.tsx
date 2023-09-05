import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Dialog } from '@components';
import { chartData } from '../../../../../../models/server';
import { useSelector } from 'umi';
import { Chart } from '@antv/g2';
const ChartData = ({ Ref }) => {
  const dialogRef = useRef();
  const [test, setTest] = useState(false);
  const currentItem = useRef();
  const [list, setList] = useState([]);
  const { instrAndRecordId, reportLeftVal } = useSelector(
    (state: any) => state.generalInspectionMag,
  );

  useImperativeHandle(Ref, () => ({
    show: (val) => {
      dialogRef.current && dialogRef.current.show();
      setTest(true);
      currentItem.current = val;
    },
  }));
  useEffect(() => {
    if (test) {
      console.log(reportLeftVal);
      console.log(instrAndRecordId);

      getChartData();
    }
  }, [test]);
  const getChartData = () => {
    let params = {
      hospitalId: reportLeftVal.hospitalId,
      instrId: currentItem.current?.instrId,
      itemId: currentItem.current?.itemId,
      patientNo: reportLeftVal.patientNo,
      reportUnitCode: reportLeftVal.reportUnitCode,
    };
    chartData(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { genre: item.labDate, sold: item.result };
        });

        const chart = new Chart({
          container: 'content',
          height: 300,
          forceFit: true,
          padding: 'auto',
        });

        chart.source(result);

        chart.line().position('genre*sold');
        chart.axis('sold', { title: {} });
        chart.scale('sold', { alias: '检验结果' });
        chart.axis('genre', { title: {} });
        chart.scale('genre', { alias: '检验日期' });

        chart.render();
      }
    });
  };

  return (
    <Dialog
      ref={dialogRef}
      width={840}
      title={'趋势图'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>病人检验结果变化图</div>
      <div id="content"></div>
    </Dialog>
  );
};
export default ChartData;
