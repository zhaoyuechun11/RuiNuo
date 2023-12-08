import React, { useEffect, useRef, useState } from 'react';
import { Radio, Checkbox, Table } from 'antd';
import { Line } from '@ant-design/charts';
import ReactToPrint from 'react-to-print';
import { Button } from '@/components';
import { useSelector } from 'umi';

// const rule = {
//   qcRuleId: 19,
//   instrId: 17,
//   instrName: '迈瑞bc-7500c',
//   qcRuleType: 1,
//   qcRuleName: 'Westgard',
//   qcRule: '1_2S,7T,4_1S',
// };

// const qcData = [
//   {
//     qcId: 8,
//     qcName: 'asdf',
//     batchNo: 'dddff',
//     qcLevelName: '水平3',
//     exprieDt: '2023-11-30',
//     x: 6.0,
//     sd: 3.0,
//     cv: 6.0,
//     thisX: 25.604,
//     thisSd: 18.827,
//     thisCv: 73.531,
//     detail: {
//       '11-25': [
//         {
//           id: 4,
//           qcDate: '11-25',
//           qcDateDetail: '2023-11-25',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 4,
//           calculateSd: -0.48,
//           calculateCv: -24.0,
//           inuseFlag: false,
//           outControlTips: '1_2s',
//         },
//       ],
//       '11-30': [
//         {
//           id: 2,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 5,
//           calculateSd: -3.2,
//           calculateCv: 737.5,
//           outControlTips: '1_2s',
//           inuseFlag: true,
//         },
//         {
//           id: 3,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 22.0,
//           calculateSd: -5.33,
//           calculateCv: 266.5,
//           inuseFlag: false,
//         },
//         {
//           id: 3,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 28.0,
//           calculateSd: -5.33,
//           calculateCv: 266.5,
//           inuseFlag: false,
//         },

//         {
//           id: 3,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: null,
//           calculateSd:null,
//           calculateCv: 266.5,
//           inuseFlag: true,
//           outControlTips: '1_2s',
//         },
//         {
//           id: 3,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平3',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 60.0,
//           calculateSd: -5.33,
//           calculateCv: 266.5,
//           inuseFlag: true,
//           outControlTips: '1_2s',
//         },
//       ],
//     },
//   },
//   {
//     qcId: 8,
//     qcName: 'asdf',
//     batchNo: 'dddff',
//     qcLevelName: '水平4',
//     exprieDt: '2023-11-30',
//     x: 6.0,
//     sd: 3.0,
//     cv: 6.0,
//     thisX: 25.604,
//     thisSd: 18.827,
//     thisCv: 73.531,
//     detail: {
//       '11-25': [
//         {
//           id: 4,
//           qcDate: '11-25',
//           qcDateDetail: '2023-11-25',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平4',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 4,
//           calculateSd: -0.48,
//           calculateCv: -24.0,
//           inuseFlag: true,
//           // outControlTips: '1_2s',
//         },
//         {
//           id: 4,
//           qcDate: '11-25',
//           qcDateDetail: '2023-11-25',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平4',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 4.56,
//           calculateSd: -0.48,
//           calculateCv: -24.0,
//           inuseFlag: false,
//         },
//       ],
//       '11-30': [
//         {
//           id: 2,
//           qcDate: '11-30',
//           qcDateDetail: '2023-11-30',
//           qcId: 8,
//           batchNo: 'dddff',
//           qcLevelName: '水平4',
//           x: 6.0,
//           sd: 3.0,
//           cv: 6.0,
//           calculateValue: 50.252,
//           calculateSd: 14.75,
//           calculateCv: 737.5,
//           inuseFlag: true,
//         },
//       ],
//     },
//   },
//   // {
//   //   qcId: 8,
//   //   qcName: 'asdf',
//   //   batchNo: 'dddff',
//   //   qcLevelName: '水平5',
//   //   exprieDt: '2023-11-30',
//   //   x: 6.0,
//   //   sd: 3.0,
//   //   cv: 6.0,
//   //   thisX: 25.604,
//   //   thisSd: 18.827,
//   //   thisCv: 73.531,
//   //   detail: {
//   //     '11-25': [
//   //       {
//   //         id: 4,
//   //         qcDate: '11-25',
//   //         qcDateDetail: '2023-11-25',
//   //         qcId: 8,
//   //         batchNo: 'dddff',
//   //         qcLevelName: '水平5',
//   //         x: 6.0,
//   //         sd: 3.0,
//   //         cv: 6.0,
//   //         calculateValue: 4.56,
//   //         calculateSd: -0.48,
//   //         calculateCv: -24.0,
//   //         inuseFlag: false,
//   //       },
//   //     ],
//   //     '11-30': [
//   //       {
//   //         id: 2,
//   //         qcDate: '11-30',
//   //         qcDateDetail: '2023-11-30',
//   //         qcId: 8,
//   //         batchNo: 'dddff',
//   //         qcLevelName: '水平5',
//   //         x: 6.0,
//   //         sd: 3.0,
//   //         cv: 6.0,
//   //         calculateValue: 50.252,
//   //         calculateSd: 14.75,
//   //         calculateCv: 737.5,
//   //         inuseFlag: true,
//   //       },
//   //     ],
//   //   },
//   // },
// ];

const QCGraphics = () => {
  const { AWGraphicalData, AWItem, AWFormData } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );

  const [qcDetailList, setQcDetailList] = useState([]);
  const [qcDetailTableHeader, setQcDetailTableHeader] = useState([]);
  const [graphicsData, setGraphicsData] = useState([]);
  const [radioActiveVal, setRadioActiveVal] = useState(1);
  const [isShowAccrue, setIsShowAccrue] = useState(false);
  const [multiGraphDataArray, setMultiGraphDataArray] = useState([]);
  const [isMultiGraph, setIsMultiGraph] = useState(false);
   const [rule, setRule] = useState();
   const [qcData, setQcData] = useState([]);

  useEffect(() => {
    if (AWGraphicalData.qcData?.length > 0) {
      const { qcData, rule } = AWGraphicalData;
    handleTableHeader(qcData);
    handleDetail(qcData);
    handelGraphics(qcData);
    setRule(rule);
    setQcData(qcData);
    }
  }, [AWGraphicalData]);

  const componentRef = useRef(null);
  const getTooltips = (value = '', items = []) => {
    return `
    <div class="g2-tooltip-title" style="margin-bottom: 12px; margin-top: 12px;"> ${value}</div>
    <ul>
      ${items
        .map((item) => {
          const { color } = item;
          return `<li class="g2-tooltip-list-item" data-index="" style="list-style-type: none; padding: 0px; margin: 12px 0px;">
          <span class="g2-tooltip-marker" style="background: ${color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
                   <span class="g2-tooltip-name">水平:${item.name}</span>,
                  <span class="g2-tooltip-name"> 批号:${item.data.batchNo}</span>,
                  <span class="g2-tooltip-name"> 靶值:${item.data.x}</span>,
                  <span class="g2-tooltip-name"> 标准差:${item.data.sd}</span>,
                  <span class="g2-tooltip-name"> 变异系数:${item.data.cv}</span>,
                  <span class="g2-tooltip-name"> 是否存在失控:${
                    item.data.outControlTips ? '存在' : '不存在'
                  }</span>
                 </li>
             
                 `;
        })
        .join('')}
    </ul>
    `;
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
      title: '靶值(当前数据)',
      dataIndex: 'thisX',
    },
    {
      title: '标准差(当前数据)',
      dataIndex: 'thisSd',
    },
    {
      title: '变异系数(当前数据)',
      dataIndex: 'thisCv',
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

    setQcDetailList(afterData);
  };

  const handleTableHeader = (qcData) => {
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
    setQcDetailTableHeader(mergedArray);
  };
  const handelGraphics = (qcData) => {
    let dateDetail = [];
    for (let i = 0, len = qcData.length; i < len; i++) {
      Object.entries(qcData[i].detail).forEach(([key, value]) => {
        value.forEach((val, index1) => {
          let num = index1 + 1;
          val.qcDate = val.qcDate + '(' + num + ')';
        });
      });
    }
    for (let i = 0, len = qcData.length; i < len; i++) {
      Object.entries(qcData[i].detail).forEach(([key, value]) => {
        dateDetail.push(...value);
      });
    }
    debugger;
    setGraphicsData(dateDetail);
  };
  const radioChange = (e: any) => {
    setRadioActiveVal(e.target.value);
    let dateDetail = [];
    let multiGraphData = [];
    //let chartConfig = {};
    if (e.target.value === 1) {
      for (let i = 0, len = qcData.length; i < len; i++) {
        let detailAarray = [];
        Object.entries(qcData[i].detail).forEach(([key, value]) => {
          if (!isMultiGraph) {
            dateDetail.push(...value);
          } else {
            detailAarray.push(...value);
          }
        });
        let chartConfig = getConfig(detailAarray);
        multiGraphData.push({ configData: chartConfig });
      }
    }
    if (e.target.value === 2 || e.target.value === 3) {
      if (isShowAccrue) {
        for (let i = 0, len = qcData.length; i < len; i++) {
          let detailAarray = [];
          Object.entries(qcData[i].detail).forEach(([key, value]) => {
            let result = value.map((valItem) => {
              if (!valItem.inuseFlag) {
                return {
                  ...valItem,
                  calculateSd: (valItem.calculateValue - valItem.x) / valItem.sd,
                  qcLevelName: valItem.qcLevelName + '离散点',
                };
              } else {
                return { ...valItem };
              }
            });
            let ls = [];
            let noLs = [];
            if (result.length > 0) {
              if (result.length === 1) {
                if (!isMultiGraph) {
                  dateDetail.push(...result);
                } else {
                  detailAarray.push(...result);
                }
              } else {
                result.forEach((item) => {
                  if (item.inuseFlag) {
                    noLs.push(item);
                  } else {
                    ls.push(item);
                  }
                });
                if (noLs.length > 0) {
                  if (noLs.length === 1) {
                    if (!isMultiGraph) {
                      dateDetail.push(...noLs);
                    } else {
                      detailAarray.push(...noLs);
                    }
                  } else {
                    if (e.target.value === 2) {
                      if (!isMultiGraph) {
                        dateDetail.push(noLs[noLs.length - 1]);
                      } else {
                        detailAarray.push(noLs[noLs.length - 1]);
                      }
                    }
                    if (e.target.value === 3) {
                      let minField = getMinField(noLs);
                      if (!isMultiGraph) {
                        dateDetail.push(minField);
                      } else {
                        detailAarray.push(minField);
                      }
                    }
                  }
                }
                if (ls.length > 0) {
                  if (ls.length === 1) {
                    if (!isMultiGraph) {
                      dateDetail.push(...ls);
                    } else {
                      detailAarray.push(...ls);
                    }
                  } else {
                    if (e.target.value === 2) {
                      if (!isMultiGraph) {
                        dateDetail.push(ls[ls.length - 1]);
                      } else {
                        detailAarray.push(ls[ls.length - 1]);
                      }
                    }
                    if (e.target.value === 3) {
                      let minField = getMinField(ls);
                      if (!isMultiGraph) {
                        dateDetail.push(minField);
                      } else {
                        detailAarray.push(minField);
                      }
                    }
                  }
                }
              }
            }
          });
        let  chartConfig = getConfig(detailAarray);
        multiGraphData.push({ configData: chartConfig });
        }
      } else {
        for (let i = 0, len = qcData.length; i < len; i++) {
          let detailAarray = [];
          Object.entries(qcData[i].detail).forEach(([key, value]) => {
            let result = value.filter((item) => item.inuseFlag === true);
            if (result.length > 0) {
              if (result.length === 1) {
                if (!isMultiGraph) {
                  dateDetail.push(...result);
                } else {
                  detailAarray.push(...result);
                }
              } else {
                if (e.target.value === 2) {
                  if (!isMultiGraph) {
                    dateDetail.push(result[result.length - 1]);
                  } else {
                    detailAarray.push(result[result.length - 1]);
                  }
                }
                if (e.target.value === 3) {
                  let minField = getMinField(result);
                  if (!isMultiGraph) {
                    dateDetail.push(minField);
                  } else {
                    detailAarray.push(minField);
                  }
                }
              }
            }
          });
         let chartConfig = getConfig(detailAarray);
         multiGraphData.push({ configData: chartConfig });
        }
      }
    }
    
    setMultiGraphDataArray(multiGraphData);
    setGraphicsData(dateDetail);
  };
  const accrueChange = (e: any) => {
    setIsShowAccrue(e.target.checked);
    let dateDetail = [];
    let multiGraphData = [];
  
    if (e.target.checked && (radioActiveVal === 2 || radioActiveVal === 3)) {
      for (let i = 0, len = qcData.length; i < len; i++) {
        let detailAarray = [];
        Object.entries(qcData[i].detail).forEach(([key, value]) => {
          let result = value.map((valItem) => {
            if (!valItem.inuseFlag) {
              return {
                ...valItem,
                calculateSd: (valItem.calculateValue - valItem.x) / valItem.sd,
                qcLevelName: valItem.qcLevelName + '离散点',
              };
            } else {
              return { ...valItem };
            }
          });
          let ls = [];
          let noLs = [];
          if (result.length > 0) {
            if (result.length === 1) {
              if (!isMultiGraph) {
                dateDetail.push(...result);
              } else {
                detailAarray.push(...result);
              }
            } else {
              result.forEach((item) => {
                if (item.inuseFlag) {
                  noLs.push(item);
                } else {
                  ls.push(item);
                }
              });
              if (noLs.length > 0) {
                if (noLs.length === 1) {
                  if (!isMultiGraph) {
                    dateDetail.push(...noLs);
                  } else {
                    detailAarray.push(...noLs);
                  }
                } else {
                  if (radioActiveVal === 2) {
                    if (!isMultiGraph) {
                      dateDetail.push(noLs[noLs.length - 1]);
                    } else {
                      detailAarray.push(noLs[noLs.length - 1]);
                    }
                  }
                  if (radioActiveVal === 3) {
                    let minField = getMinField(noLs);
                    if (!isMultiGraph) {
                      dateDetail.push(minField);
                    } else {
                      detailAarray.push(minField);
                    }
                  }
                }
              }
              if (ls.length > 0) {
                if (ls.length === 1) {
                  if (!isMultiGraph) {
                    dateDetail.push(...ls);
                  } else {
                    detailAarray.push(...ls);
                  }
                } else {
                  if (radioActiveVal === 2) {
                    if (!isMultiGraph) {
                      dateDetail.push(ls[ls.length - 1]);
                    } else {
                      detailAarray.push(ls[ls.length - 1]);
                    }
                  }
                  if (radioActiveVal === 3) {
                    let minField = getMinField(ls);
                    if (!isMultiGraph) {
                      dateDetail.push(minField);
                    } else {
                      detailAarray.push(minField);
                    }
                  }
                }
              }
            }
          }
        });
       let chartConfig = getConfig(detailAarray);
       multiGraphData.push({ configData: chartConfig });
      }
    }
    if (!e.target.checked && (radioActiveVal === 2 || radioActiveVal === 3)) {
      for (let i = 0, len = qcData.length; i < len; i++) {
        let detailAarray = [];
        Object.entries(qcData[i].detail).forEach(([key, value]) => {
          let result = value.filter((item) => item.inuseFlag === true);
          if (result.length > 0) {
            if (result.length === 1) {
              if (!isMultiGraph) {
                dateDetail.push(...result);
              } else {
                detailAarray.push(...result);
              }
            } else {
              if (radioActiveVal === 2) {
                if (!isMultiGraph) {
                  dateDetail.push(result[result.length - 1]);
                } else {
                  detailAarray.push(result[result.length - 1]);
                }
              }
              if (radioActiveVal === 3) {
                let minField = getMinField(result);
                if (!isMultiGraph) {
                  dateDetail.push(minField);
                } else {
                  detailAarray.push(minField);
                }
              }
            }
          }
        });
       let chartConfig = getConfig(detailAarray);
        multiGraphData.push({ configData: chartConfig });
      }
    }
    if (radioActiveVal === 1) {
      for (let i = 0, len = qcData.length; i < len; i++) {
        let detailAarray = [];
        Object.entries(qcData[i].detail).forEach(([key, value]) => {
          if (!isMultiGraph) {
            dateDetail.push(...value);
          } else {
            detailAarray.push(...value);
          }
        });
       let chartConfig = getConfig(detailAarray);
       multiGraphData.push({ configData: chartConfig });
      }
    }
   
    setMultiGraphDataArray(multiGraphData);
    setGraphicsData(dateDetail);
  };
  const getMinField = (result: any) => {
    // 初始化最小值和最小值对应的字段
    var minValue = Math.abs(result[0]?.calculateSd);
    var minField = result[0];

    // 遍历数组对象，比较值的绝对值
    for (var i = 1; i < result.length; i++) {
      var absValue = Math.abs(result[i].calculateSd);
      if (absValue < minValue) {
        minValue = absValue;
        minField = result[i];
      }
    }
    return minField;
  };
  const getConfig = (data: any) => {
    const config = {
      data,
      xField: 'qcDate',
      yField: 'calculateSd',

      // range:[0,3],
      connectNulls: false,
      seriesField: 'qcLevelName',
      meta: {
        value: {
          max: 3,
          min: -3,
        },
      },
      tooltip: {
        customContent: (value, items) => {
          return getTooltips(value, items);
        },
      },
      xAxis: {
        // type: 'time',
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
          formatter: (v, index) => {
            console.log('v', v, index);

            if (v == 0) {
              return 'x';
            } else {
              return v + 'SD';
            }
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
          let result = graphicsData.filter(
            (item) => item.qcDate === year.qcDate && item.qcLevelName === year.qcLevelName,
          );
          if (result[0]?.outControlTips) {
            return { fill: 'red', fillOpacity: 1 };
          } else {
            if (rule.qcRule.split(',').includes('1_2S') && Math.abs(result[0]?.calculateSd) >= 2) {
              return { fill: '#FFC0CB', fillOpacity: 1 };
            }
          }
        },
        size: 12,
      },
    };
    return config;
  };
  const multiGraphChange = (e: any) => {
    setIsMultiGraph(e.target.checked);

    if (e.target.checked && radioActiveVal === 1) {
      let multiGraphData = [];
      for (let j = 0, len = qcData.length; j < len; j++) {
        let detailAarray = [];
        Object.entries(qcData[j].detail).forEach(([key, value]) => {
          detailAarray.push(...value);
        });
        let reuslt = getConfig(detailAarray);
        multiGraphData.push({ configData: reuslt });
      }
      setMultiGraphDataArray(multiGraphData);
    }
    if (!e.target.checked && (radioActiveVal === 2 || radioActiveVal === 3)) {
      let dateDetail = [];
      for (let j = 0, len = qcData.length; j < len; j++) {
        Object.entries(qcData[j].detail).forEach(([key, value]) => {
          if (isShowAccrue) {
            let result = value.map((valItem) => {
              if (!valItem.inuseFlag) {
                return {
                  ...valItem,
                  calculateSd: (valItem.calculateValue - valItem.x) / valItem.sd,
                  qcLevelName: valItem.qcLevelName + '离散点',
                };
              } else {
                return { ...valItem };
              }
            });
            let ls = [];
            let noLs = [];
            if (result.length === 1) {
              dateDetail.push(...result);
            } else {
              result.forEach((item) => {
                if (item.inuseFlag) {
                  noLs.push(item);
                } else {
                  ls.push(item);
                }
              });
              if (noLs.length === 1) {
                dateDetail.push(...noLs);
              } else {
                if (radioActiveVal === 2) {
                  dateDetail.push(noLs[noLs.length - 1]);
                }
                if (radioActiveVal === 3) {
                  let minField = getMinField(noLs);
                  dateDetail.push(minField);
                }
              }
              if (ls.length === 1) {
                dateDetail.push(...ls);
              } else {
                if (radioActiveVal === 2) {
                  dateDetail.push(ls[ls.length - 1]);
                }
                if (radioActiveVal === 3) {
                  let minField = getMinField(ls);
                  dateDetail.push(minField);
                }
              }
            }
          } else {
            let result = value.filter((item) => item.inuseFlag === true);
            if (result.length > 0) {
              if (result.length === 1) {
                dateDetail.push(...result);
              } else {
                if (radioActiveVal === 2) {
                  dateDetail.push(result[result.length - 1]);
                }
                if (radioActiveVal === 3) {
                  let minField = getMinField(result);
                  dateDetail.push(minField);
                }
              }
            }
          }
        });
      }
      setGraphicsData(dateDetail);
    }
    if (e.target.checked && (radioActiveVal === 2 || radioActiveVal === 3)) {
      let multiGraphData = [];
      for (let j = 0, len = qcData.length; j < len; j++) {
        let detailAarray = [];
        Object.entries(qcData[j].detail).forEach(([key, value]) => {
          if (isShowAccrue) {
            let result = value.map((valItem) => {
              if (!valItem.inuseFlag) {
                return {
                  ...valItem,
                  calculateSd: (valItem.calculateValue - valItem.x) / valItem.sd,
                  qcLevelName: valItem.qcLevelName + '离散点',
                };
              } else {
                return { ...valItem };
              }
            });
            let ls = [];
            let noLs = [];
            if (result.length > 0) {
              if (result.length === 1) {
                detailAarray.push(...result);
              } else {
                result.forEach((item) => {
                  if (item.inuseFlag) {
                    noLs.push(item);
                  } else {
                    ls.push(item);
                  }
                });
                if (noLs.length === 1) {
                  detailAarray.push(...noLs);
                } else {
                  if (radioActiveVal === 2) {
                    detailAarray.push(noLs[noLs.length - 1]);
                  }
                  if (radioActiveVal === 3) {
                    let minField = getMinField(noLs);
                    detailAarray.push(minField);
                  }
                }
                if (ls.length === 1) {
                  detailAarray.push(...ls);
                } else {
                  if (radioActiveVal === 2) {
                    detailAarray.push(ls[ls.length - 1]);
                  }
                  if (radioActiveVal === 3) {
                    let minField = getMinField(ls);
                    detailAarray.push(minField);
                  }
                }
              }
            }
          } else {
            let result = value.filter((item) => item.inuseFlag === true);
            if (result.length > 0) {
              if (result.length === 1) {
                detailAarray.push(...result);
              } else {
                if (radioActiveVal === 2) {
                  detailAarray.push(result[result.length - 1]);
                }
                if (radioActiveVal === 3) {
                  let minField = getMinField(result);
                  detailAarray.push(minField);
                }
              }
            }
          }
        });

        let reuslt = getConfig(detailAarray);
        multiGraphData.push({ configData: reuslt });
      }
      setMultiGraphDataArray(multiGraphData);
    }
    if (!e.target.checked && radioActiveVal === 1) {
      let dateDetail = [];
      qcData?.forEach((item) => {
        Object.entries(item.detail).forEach(([key, value]) => {
          dateDetail.push(...value);
        });
      });

      setGraphicsData(dateDetail);
    }
  };
  return (
    <>
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <Radio.Group value={radioActiveVal} onChange={radioChange}>
          <Radio value={1}>所有点</Radio>
          <Radio value={2}>最后点</Radio>
          <Radio value={3}>最好点</Radio>
        </Radio.Group>
        <Checkbox onChange={multiGraphChange}>多图</Checkbox>
        <Checkbox onChange={accrueChange}>显示非累积点</Checkbox>
        <ReactToPrint
          trigger={() => <Button btnType="primary">打印</Button>}
          content={() => componentRef.current}
        />
      </div>
      {!isMultiGraph && graphicsData.length > 0 ? (
        <>
          <div>
            {rule?.instrName}
            <span>质控项目:{AWItem?.itemName}</span>
            <span>
              区间:{AWFormData.startDate ? AWFormData.startDate[0].format('YYYY-MM-DD') : ''}-
              {AWFormData.startDate ? AWFormData.startDate[1].format('YYYY-MM-DD') : ''}
            </span>
            <span>质控规则:{rule?.qcRule}</span>
          </div>
          <div ref={componentRef}>
            <Line {...getConfig(graphicsData)} />
          </div>
        </>
      ) : multiGraphDataArray.length > 0 && isMultiGraph ? (
        <div ref={componentRef}>
          {multiGraphDataArray.map((item) => {
            return (
              <>
                <div>
                  {rule?.instrName}
                  <span>质控项目:{AWItem?.itemName}</span>
                  <span>
                    区间:{AWFormData.startDate ? AWFormData.startDate[0].format('YYYY-MM-DD') : ''}-
                    {AWFormData.startDate ? AWFormData.startDate[1].format('YYYY-MM-DD') : ''}
                  </span>
                  <span>质控规则:{rule?.qcRule}</span>
                </div>
                <Line {...item.configData} />
              </>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '100px 0 130px',
            color: '#8e8e93',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          <img
            src={require('@assets/images/empty/chart_empty.png')}
            alt="暂无数据图片"
            style={{ display: 'block', width: '100px', height: '100px', margin: '0 auto' }}
          />
          暂无数据
        </div>
      )}

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
