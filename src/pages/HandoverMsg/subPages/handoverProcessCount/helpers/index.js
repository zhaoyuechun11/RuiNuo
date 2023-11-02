import React from 'react';

const chartsColumnKeyMap = {
  // 面试官报表柱状图组
  resumeColumnKeyMap: {
    shared_count: '被推荐人数',
    feedback_count: '反馈人数',
    pass_count: '通过人数',
  },
};

const chartsLineKeyMap = {
  resumeLineKeyMap: {
    feedback_rate: '反馈率',
    pass_rate: '通过率',
  },
};

const interviewReportFormatter = (data = [], keys = []) => {
  const result = data.map((item) => {
    // console.log('item================================================================', item);
    const { count } = item;
    const obj = {};
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        obj[key] = count[key];
      });
      obj.name = item.x_field;
    }
    return obj;
  });
  // console.log('interviewReportData', result);
  return result;
};

const getGroupedData = (data, primaryKey = 'name', keyMap) => {
  const result = data
    .map((item) => {
      const newItem = { ...item };
      const name = newItem[primaryKey];
      delete newItem[primaryKey];
      delete newItem.finish_rate;

      const typeList = Object.keys(newItem).map((key) => {
        return {
          [primaryKey]: name,
          type: keyMap[key],
          value: item[key],
        };
      });
      return typeList;
    })
    .flat();

  return result;
};

const getKeyMap = (chartName, type = 'column') => {
  if (type === 'column') {
    return chartsColumnKeyMap[`${chartName}ColumnKeyMap`];
  }
  return chartsLineKeyMap[`${chartName}LineKeyMap`];
};

export const getData = (
  data = [],
  chartType = 'column',
  chartName,
  primaryKey = 'name',
  lineKeys = [],
) => {
  // console.log('chartName===========', chartName);
  let result = [];

  // console.log('interviewReport============', data);
  if (chartType === 'column') {
    const colunmsKeyMap = getKeyMap(chartName, 'column');
    const keys = Object.keys(colunmsKeyMap);
    const formattedData = interviewReportFormatter(data, keys);
    const groupedData = getGroupedData(formattedData, primaryKey, colunmsKeyMap);
    result = groupedData;
  } else if (chartType === 'line') {
    const linesKeyMap = getKeyMap(chartName, 'line');
    result = data
      .map((item) => {
        const lineObj = lineKeys.map((key) => {
          return {
            rateName: linesKeyMap[key], // 通过率 or 反馈率
            count: item.count[key], // 30%
            name: item.x_field,
            person: item.count.interviewer_name || item.count.operator_name,
          };
        });

        return lineObj;
      })
      .flat();
  }
  // console.log('lineData', result);
  return result;
};

export const columnRender = (text) => {
  let content = '-';
  // 数组换行显示内容
  if (Array.isArray(text)) {
    content = text.length === 0 ? '-' : text.join('\r\n');
  } else {
    content = text === 0 ? 0 : text || '-';
  }
  return <span style={{ whiteSpace: 'pre-line' }}>{content}</span>;
};
