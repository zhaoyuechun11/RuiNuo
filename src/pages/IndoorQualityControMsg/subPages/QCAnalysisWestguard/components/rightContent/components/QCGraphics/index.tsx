import React, { useRef } from 'react';
import { Line, G2 } from '@ant-design/charts';
import ReactToPrint from 'react-to-print';

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
const QCGraphics = () => {
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
  return (
    <>
      <ReactToPrint trigger={() => <a href="#">打印</a>} content={() => componentRef.current} />
      <div ref={componentRef}>
        <Line {...config} />
      </div>
    </>
  );
};
export default QCGraphics;
