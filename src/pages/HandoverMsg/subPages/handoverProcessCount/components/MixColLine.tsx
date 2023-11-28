import React from 'react';
import { DualAxes } from '@ant-design/charts';
import style from './mixColLine.less';
const color = ['#00B4FF', '#FFA533', '#00B852'];

const MixColLine = ({ lineData = [], columnData = [] }) => {

  const customConfig = {
    xField: 'name',
    yField: ['count', 'value'],
  };
  let legendItem = [];
  columnData.forEach((item, index) => {
    legendItem.push({
      name: item.type,
      marker: {
        symbol: 'square',
        style: {
          fill: color[index],
        },
      },
    });
  });
  const getTooltips = (items = [], title = '', person = '') => {
    return `
    <div class="g2-tooltip-title" style="margin-bottom: 12px; margin-top: 12px;">${person} ${title}</div>
    <ul>
      ${items
        .map((item) => {
          const { color } = item;
          // const suffix = item.name.endsWith('率') ? '%' : '';
          // return `<li class="g2-tooltip-list-item" data-index="" style="list-style-type: none; padding: 0px; margin: 12px 0px;">
          //         <span class="g2-tooltip-marker" style="background: ${color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
          //         <span class="g2-tooltip-name">${item.name}</span>:
          //         <span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">${item.value}${suffix}</span>
          //       </li>`;
          return item.name.endsWith('率')
            ? ''
            : `<li class="g2-tooltip-list-item" data-index="" style="list-style-type: none; padding: 0px; margin: 12px 0px;">
                   <span class="g2-tooltip-marker" style="background: ${color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
                   <span class="g2-tooltip-name">${item.name}</span>:
                  <span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">${item.value}</span>
                 </li>`;
        })
        .join('')}
    </ul>
    `;
  };

  const getTargetPercent = (targetNum = 10) => {
    const groupItems = 3;
    if (columnData.length <= groupItems * targetNum) {
      return 1;
    }

    const totalGroup = columnData.length / 3;
    return targetNum / totalGroup;
  };

  const config = {
    height: 500,
    data: [lineData, columnData],
    yAxis: {
      count: {
        title: { text: '单位:%', position: 'end' },
        grid: {
          line: {
            style: {
              lineWidth: 1,
              lineDash: [4, 4],
            },
          },
        },
      },
      value: {
        title: { text: '单位:人数', position: 'end' },
        grid: {
          line: {
            style: {
              lineWidth: 1,
            },
          },
        },
      },
    },
    limitInPlot: false,
    padding: [20, 30, 80, 30],
    slider: {
      start: 0,
      end: getTargetPercent(),
    },
    // 设置横轴不同步
    meta: { name: { sync: false } },
    legend: {
      layout: 'horizontal',
      position: 'bottom',
      flipPage: true,
      // 两行分页
      maxRow: 4,
      custom: true,
      items: legendItem,
    },
    tooltip: {
      /*       formatter: (datum) => {
        console.log(datum);
        const obj = {};

        if (datum.hasOwnProperty('rateName')) {
          obj.name = datum.rateName;
          obj.value = `${datum.count}%`;
        } else if (datum.hasOwnProperty('type')) {
          obj.name = datum.type;
          obj.value = datum.value;
        }
        return obj;
      }, */
      customContent: (value, items) => {
        if (items.length === 0) return `<div>${value}</div>`;
        const xField = items[0]?.title || '';
        let person = '';

        const regExp = /^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
        // 根据X轴是否日期格式来判断是否是个人
        if (regExp.test(xField)) {
          items.forEach((item) => {
            if (item.data.hasOwnProperty('rateName')) {
              person = item.data.person || '';
            }
          });
          return getTooltips(items, value, person);
        }

        return getTooltips(items, value);
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        seriesField: 'rateName',
        color: ['#007BFF', '#FFCC02'],
        lineStyle: function lineStyle(_ref) {
          // console.log('lineRef', _ref);

          return { lineWidth: 0 };
        },
      },
      {
        geometry: 'column',
        seriesField: 'type',
        isGroup: 'true',
        colorField: 'type',
        color: ['#00B4FF', '#FFA533', '#00B852'],
        columnStyle: {
          radius: [4, 4, 0, 0],
        },
      },
    ],
  };
  const isEmptyData = lineData.length === 0 && columnData.length === 0;
  return (
    <div className={style.mixColLineChart}>
      {isEmptyData ? (
        <div className={style.emptyData}>
          <img src={require(`../img/emptyData.png`)} alt="暂无数据图片" />
          暂无数据
        </div>
      ) : (
        <DualAxes {...config} {...customConfig} />
      )}
    </div>
  );
};

export default MixColLine;
