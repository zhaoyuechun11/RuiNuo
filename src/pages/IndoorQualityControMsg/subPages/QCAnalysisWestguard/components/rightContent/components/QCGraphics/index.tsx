import React, { useEffect, useRef, useState } from 'react';
import { Radio, Checkbox, Table } from 'antd';
import { Line, G2 } from '@ant-design/charts';
import ReactToPrint from 'react-to-print';
import { Button } from '@/components';
import { useSelector } from 'umi';

const data = [
  {
    year: '1850',
    value: 0,
    category: 'Liquid fuel',
  },
  {
    year: '1850',
    value: 54,
    category: 'Solid fuel',
  },
  {
    year: '1850',
    value: -3,
    category: 'Gas fuel',
  },
  {
    year: '1851',
    value: null,
    category: 'Liquid fuel',
  },
  {
    year: '1851',
    value: null,
    category: 'Solid fuel',
  },
  {
    year: '1851',
    value: 15,
    category: 'Gas fuel',
  },
  {
    year: '1852',
    value: 70,
    category: 'Liquid fuel',
  },
  {
    year: '1852',
    value: 60,
    category: 'Solid fuel',
  },
  {
    year: '1852',
    value: 3,
    category: 'Gas fuel',
  },
];
G2.registerShape('point', 'breath-point', {
  draw(cfg, container) {
    const data = cfg.data;
    const point = {
      x: cfg.x,
      y: cfg.y,
    };
    const group = container.addGroup();

    if (data.year === '1852' && data.category === 'Solid fuel') {
      const decorator1 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      const decorator2 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      const decorator3 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      decorator1.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
        },
      );
      decorator2.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
          delay: 600,
        },
      );
      decorator3.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
          delay: 1200,
        },
      );
      group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 6,
          fill: cfg.color,
          opacity: 0.7,
        },
      });
      group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 1.5,
          fill: cfg.color,
        },
      });
    }
    if (
      data.category === 'Gas fuel' ||
      data.category === 'Liquid fuel' ||
      data.category === 'Solid fuel'
    ) {
      group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 3,
          fill: cfg.color,
        },
      });
    }

    return group;
  },
});

const qcData = [
  {
    qcId: 8,
    qcName: 'asdf',
    batchNo: 'dddff',
    qcLevelName: '水平3',
    exprieDt: '2023-11-30',
    x: 6.0,
    sd: 3.0,
    cv: 6.0,
    thisX: 25.604,
    thisSd: 18.827,
    thisCv: 73.531,
    detail: {
      '11-25': [
        {
          id: 4,
          qcDate: '11-25',
          qcDateDetail: '2023-11-25',
          qcId: 8,
          batchNo: 'dddff',
          qcLevelName: '水平3',
          x: 6.0,
          sd: 3.0,
          cv: 6.0,
          calculateValue: 4.56,
          calculateSd: -0.48,
          calculateCv: -24.0,
        },
      ],
      '11-30': [
        {
          id: 2,
          qcDate: '11-30',
          qcDateDetail: '2023-11-30',
          qcId: 8,
          batchNo: 'dddff',
          qcLevelName: '水平3',
          x: 6.0,
          sd: 3.0,
          cv: 6.0,
          calculateValue: 50.252,
          calculateSd: 14.75,
          calculateCv: 737.5,
        },
        {
          id: 3,
          qcDate: '11-30',
          qcDateDetail: '2023-11-30',
          qcId: 8,
          batchNo: 'dddff',
          qcLevelName: '水平3',
          x: 6.0,
          sd: 3.0,
          cv: 6.0,
          calculateValue: 22.0,
          calculateSd: 5.33,
          calculateCv: 266.5,
        },
      ],
    },
  },
  {
    qcId: 8,
    qcName: 'asdf',
    batchNo: 'dddff',
    qcLevelName: '水平4',
    exprieDt: '2023-11-30',
    x: 6.0,
    sd: 3.0,
    cv: 6.0,
    thisX: 25.604,
    thisSd: 18.827,
    thisCv: 73.531,
    detail: {
      '11-25': [
        {
          id: 4,
          qcDate: '11-25',
          qcDateDetail: '2023-11-25',
          qcId: 8,
          batchNo: 'dddff',
          qcLevelName: '水平4',
          x: 6.0,
          sd: 3.0,
          cv: 6.0,
          calculateValue: 4.56,
          calculateSd: -0.48,
          calculateCv: -24.0,
        },
      ],
      '11-30': [
        {
          id: 2,
          qcDate: '11-30',
          qcDateDetail: '2023-11-30',
          qcId: 8,
          batchNo: 'dddff',
          qcLevelName: '水平4',
          x: 6.0,
          sd: 3.0,
          cv: 6.0,
          calculateValue: 50.252,
          calculateSd: 14.75,
          calculateCv: 737.5,
        },
      ],
    },
  },
];
const dataSource = [
  {
    name: '水平3',
    val: 3.44,
    val1: 0.7,
    val2: 1.44,
  },
  {
    name: '水平4',
    val: 5.44,
    val1: 6.7,
    val2: 7.44,
  },
];
const columnsDetal = [
  {
    title: '日期',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '11-25',
    dataIndex: 'val',
    align: 'center',
  },
  {
    title: '11-30',
    dataIndex: 'val1',
    align: 'center',
  },
  {
    title: '11-30',
    dataIndex: 'val2',
    align: 'center',
  },
];
const QCGraphics = () => {
  const { AWGraphicalData } = useSelector((state: any) => state.IndoorQualityControMsg);
  const [qcDetailList, setQcDetailList] = useState([]);
  const [qcDetailTableHeader, setQcDetailTableHeader] = useState([]);
  useEffect(() => {
    // if (AWGraphicalData.qcData?.length > 0) {
    //   const { qcData } = AWGraphicalData;
    handleTableHeader(qcData);
    handleDetail(qcData);
    // }
  }, []);

  const componentRef = useRef(null);
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    // range:[0,3],
    connectNulls: false,
    seriesField: 'category',
    meta: {
      //   value: {
      //     max: 3,
      //     min: -3,
      //   },
    },
    xAxis: {
      type: 'time',
      grid: {
        line: {
          style: {
            stroke: '#ddd',
            lineDash: [1, 2],
          },
        },
      },
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        //formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        formatter: (v, index) => {
          console.log('v', v, index);

          //   if (v == 0) {
          //     return 'x';
          //   } else {
          //     return v + 'SD';
          //   }
        },

        tickLine: {
          style: {
            lineWidth: 2,
            stroke: '#aaa',
          },
          length: 5,
        },
        line: {
          style: {
            stroke: '#aaa',
          },
        },
      },
    },
    point: {
      shape: ({ category }) => {
        console.log(category);
        return category === 'Gas fuel' ? 'square' : 'circle';
      },
      style: (year) => {
        console.log('year', year);
        //   return {
        //     r: Number(year) % 4 ? 0 : 3, // 4 个数据示一个点标记
        //   };
        // if (year.year === '1852' && year.category === 'Solid fuel') {
        //   return { fill: 'red', fillOpacity: 0.5 };
        // }
      },
      size: 16,
    },
    // point: {
    //   shape: 'breath-point',
    // },
  };
  const columns = [
    {
      title: '质控品',
      dataIndex: 'qcName',
      align: 'center',
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'exprieDt',
      align: 'center',
    },
    {
      title: '靶值',
      dataIndex: 'x',
      align: 'center',
    },
    {
      title: '标准差',
      dataIndex: 'sd',
      align: 'center',
    },
    {
      title: '变异系数',
      dataIndex: 'cv',
      align: 'center',
    },
    {
      title: '当前数据',
      children: [
        {
          title: '靶值',
          dataIndex: 'thisX',
        },
        {
          title: '标准差',
          dataIndex: 'thisSd',
        },
        {
          title: '变异系数',
          dataIndex: 'thisCv',
        },
      ],
    },
  ];
  const handleDetail = (qcData) => {
    let rowData = [];
    qcData?.forEach((item, index) => {
      let t = [];
      Object.entries(item.detail).forEach(([key, value]) => {
        value.forEach((val) => {
          t.push(val);
        });
      });
      rowData.push({ ['leve' + index]: t });
    });
    rowData.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        console.log('value', value);
        value.forEach((val, index) => {
          let num = index + 1;
          val['showVal' + [num]] = val.calculateValue;
          //val['qcLevelName' + [num]] = val.qcLevelName;
        });
      });
    });
    let afterData = [];
    rowData.forEach((item) => {
      let obj = {};
      Object.entries(item).forEach(([key, value]) => {
        value.forEach((val, index) => {
          let num = index + 1;
          const prop = 'showVal' + num;

          Object.assign(obj, { [prop]: val[prop], qcLevelName: val.qcLevelName });
        });
      });
      afterData.push(obj);
    });
    console.log(afterData);
    setQcDetailList(afterData);
  };

  const handleTableHeader = (qcData) => {
    /**设置每一周或者每一月对应的字段month和type值 */
    // 使用数组方法
    let list = [
      {
        title: '日期',
        dataIndex: 'qcLevelName',
        align: 'center',
      },
    ];
    qcData?.forEach((item) => {
      Object.entries(item.detail).forEach(([key1, value1]) => {
        value1.forEach((val, index2) => {
          let index = index2 + 1;
          list.push({
            title: key1 + '(' + index + ')',
            serialNum: index2,
            dataIndex: 'showVal' + index,
            align: 'center',
          });
        });
      });
    });

    var mergedArray = list
      .reduce((result, obj) => {
        var target = result.find((item) => {
          return item.serialNum === obj.serialNum && item.title == obj.title;
        });
        if (target) {
          Object.assign(target, obj);
        } else {
          result.push(obj);
        }
        return result;
      }, [])
      .map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            dataIndex: 'qcLevelName',
          };
        } else {
          return {
            ...item,
            dataIndex: 'showVal' + [index],
          };
        }
      });
    debugger;
    setQcDetailTableHeader(mergedArray);
  };
  return (
    <>
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <Radio.Group>
          <Radio value={1}>所有点</Radio>
          <Radio value={2}>最后点</Radio>
          <Radio value={3}>最好点</Radio>
        </Radio.Group>
        <Checkbox>多图</Checkbox>
        <Checkbox>显示非累积点</Checkbox>
        <ReactToPrint
          trigger={() => <Button btnType="primary">打印</Button>}
          content={() => componentRef.current}
        />
      </div>
      <div ref={componentRef}>
        <Line {...config} />
      </div>
      <Table
        scroll={{ x: 'max-content' }}
        size="small"
        dataSource={AWGraphicalData?.qcData}
        columns={columns}
        pagination={false}
        bordered
      ></Table>
      <Table
        style={{ marginTop: '20px' }}
        title={() => '质控数据'}
        scroll={{ x: 'max-content' }}
        size="small"
        dataSource={qcDetailList}
        columns={qcDetailTableHeader}
        pagination={false}
        bordered
      ></Table>
    </>
  );
};
export default QCGraphics;
