import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Select,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import { useDispatch, useSelector } from 'umi';
import Icon from '@components/Icon';
import styles from '../index.less';
import './index.css';
import CheckItem from './commones/checkItem';
import DetailsModal from './commones/detailsModal';
import BatchAdd from './commones/batchAdd';

import {
  reportResult,
  reportResultSave,
  reportResultUpdate,
  reportResultDelete,
  addCommonDelete,
  addCommonUpdate,
} from '../../../../models/server';
import FlagModal from './commones/flagModal';
import ChartData from './commones/chart';
const { Option } = Select;
const defaultValData = [
  { id: 'P', name: '阳性' },
  { id: 'NP', name: '弱阳性' },
  { id: 'N', name: '阴性' },
  { id: 'H', name: '偏高' },
  { id: 'L', name: '偏低' },
  { id: 'NOR', name: '正常' },
];
import { Resizable } from 'react-resizable';
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
const MiddleContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tableHeaderCoumn, setTableHeaderCoumn] = useState([]);
  const [form] = Form.useForm();
  const checkItemRef = useRef();
  const editModalRef = useRef();
  const detailRef = useRef();
  const batchAddRef = useRef();
  const chartRef = useRef();
  const [resultList, setResultList] = useState([]);
  const { instrAndRecordId, reportResultList, isChangeReportResult, batchAdd } = useSelector(
    (state: any) => state.generalInspectionMag,
  );
  const updateInfoData = useRef();
  const reportUnit = sessionStorage.getItem('reportUnit');
  useEffect(() => {
    var str = 'Result11';
    var reg = /result/;
    //var reg = /^abc\d$/; //只能匹配abc
    var result = reg.test(str);
    console.log(result);

    if (reportUnit) {
      const newReportUnit = JSON.parse(reportUnit);

      getList({ reportUnitName: newReportUnit.children });
    } else {
      getList({ reportUnitName: '' });
    }
  }, []);
  useEffect(() => {
    if (instrAndRecordId.id && !instrAndRecordId.instrId) {
      message.warning('请先选择仪器!');
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'reportResultList',
          dataSource: [],
        },
      });
      return;
    }
    if (instrAndRecordId.id || instrAndRecordId.instrId) {
      getReportResult(instrAndRecordId);
    }
  }, [instrAndRecordId]);
  useEffect(() => {
    if (reportUnit) {
      const newReportUnit = JSON.parse(reportUnit);

      getList({ reportUnitName: newReportUnit.children });
    } else {
      getList({ reportUnitName: '' });
    }
  }, [isChangeReportResult]);

  useEffect(() => {
    var reg = /result/;
    const firstColumm = list?.slice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        width: 80,
        ellipsis: true,
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });

    const middleColumns = list?.slice(1).map((column) => {
      let result = reg.test(column.key);
      return {
        title: column.name,
        dataIndex: column.key,
        responsive: ['xl', 'xxl'],
        align: 'center',
        width: result ? 100 : 70,
        ellipsis: true,
        render: (text: string | number, record: any) => {
          return (
            <div className="edit_icon">
              {column.key === 'displayRef' ? record.ref?.displayRef : text}
              {result && record.dataType === 1 ? (
                <Icon name="iconanniu-bianji" onClick={() => resultEdit(record, column.key, 1)} />
              ) : record.dataType === 3 && result ? (
                <Button size="small" onClick={() => resultEdit(record, column.key, 2)}>
                  选
                </Button>
              ) : result && record.dataType === 2 ? (
                <div className="button_icon">
                  <Icon name="iconanniu-bianji" onClick={() => resultEdit(record, column.key, 1)} />{' '}
                  <Button size="small" onClick={() => resultEdit(record, column.key, 2)}>
                    选
                  </Button>
                </div>
              ) : null}
            </div>
          );
        },
      };
    });
    const lastColumns = {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (text: string, record: Record<string, any>) => (
        <Dropdown
          arrow
          overlay={() => menu(record)}
          trigger={['click']}
          placement="bottomCenter"
          overlayClassName="dropdownWrap"
        >
          <div className="flex_center w100" style={{ height: '40px', cursor: 'pointer' }}>
            <div className="flex_between" style={{ width: 22 }}>
              <div
                style={{
                  width: 4,
                  height: 4,
                  background: '#007bff',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  width: 4,
                  height: 4,
                  background: '#007bff',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  width: 4,
                  height: 4,
                  background: '#007bff',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        </Dropdown>
      ),
    };
    const coumns = [...firstColumm, ...middleColumns, lastColumns];
    setTableHeaderCoumn(coumns);
  }, [list, instrAndRecordId]);
  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...tableHeaderCoumn];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setTableHeaderCoumn(newColumns);
    };
  const mergeColumns = tableHeaderCoumn.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));
  const menu = (item) => {
    return (
      <Menu>
        <Menu.Item>
          <Popconfirm
            title="确定要删除么?"
            onConfirm={() => delCurrentItem(item)}
            okText="确定"
            cancelText="取消"
          >
            {' '}
            删除
          </Popconfirm>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            chartRef.current.show(item);
          }}
        >
          趋势图
        </Menu.Item>
        <Menu.Item onClick={() => detail(item)}>详情</Menu.Item>
      </Menu>
    );
  };

  const getList = (params: { reportUnitName: string }) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportDetaiTableHeader',
      payload: {
        ...params,
        callback: (res: { code: number; data: React.SetStateAction<never[]> }) => {
          if (res.code === 200) {
            setList(res.data);
          }
        },
      },
    });
  };
  const seach = () => {
    const { itemCode, resultFlag } = form.getFieldsValue();
    let searchResult = [];
    if (itemCode && resultFlag) {
      resultList.map((item) => {
        let flag = true;
        // 遍历每个条件，如果selectedOption有一个条件没有被满足就返回 false
        for (let key in form.getFieldsValue()) {
          if (item[key] !== form.getFieldsValue()[key]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          searchResult.push(item);
        }
      });
    } else {
      let filterFlag = resultList.filter((item) => item.resultFlag.indexOf(resultFlag) !== -1);
      let filterCode = [];
      if (itemCode) {
        filterCode = resultList.filter((item) => item.itemCode.indexOf(itemCode) !== -1);
      }
      searchResult = [filterFlag, filterCode].reduce((acc, val) => acc.concat(val), []);
      if (resultFlag === undefined && (itemCode === '' || itemCode == undefined)) {
        searchResult = resultList;
      }
    }
    dispatch({
      type: 'generalInspectionMag/save',
      payload: {
        type: 'reportResultList',
        dataSource: searchResult,
      },
    });
  };

  const renderForm = () => {
    return (
      <Form layout="inline" form={form}>
        <Form.Item name="itemCode">
          <Input placeholder="请输入项目编号名称" style={{ width: 130 }} allowClear />
        </Form.Item>
        <div id="flag" className={styles.flag}>
          <Form.Item name="resultFlag">
            <Select
              placeholder="请选择标志"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('flag')}
              style={{ width: 130 }}
            >
              {defaultValData?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    );
  };
  const delCurrentItem = (item: any) => {
    if ('id' in item) {
      reportResultDelete({ ids: [item.id] }).then((res) => {
        if (res.code === 200) {
          message.success('删除成功');
          addCommonDeleteInfo(item);
          getReportResult(instrAndRecordId);
        }
      });
    } else {
      let result = reportResultList.filter((val) => val.itemId !== item.itemId);
      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'reportResultList',
          dataSource: result,
        },
      });
    }
  };
  const addCommonDeleteInfo = (val) => {
    let params = {
      beforeChange: { itemId: [val.itemId] },
      objectId: instrAndRecordId.id,
      winName: '普检数据报告管理',
    };
    addCommonDelete(params).then((res) => {
      if (res.code === 200) {
        message.success('添加日志成功');
      }
    });
  };
  const detail = (item: any) => {
    detailRef.current.show(item);
  };
  const add = () => {
    checkItemRef.current.show();
  };
  const addCommonUpdateInfo = () => {
    console.log(reportResultList);
    let updateInfo = [];
    var reg = /result/;
    reportResult({ reportId: instrAndRecordId.id, instrId: instrAndRecordId.instrId }).then(
      (res: any) => {
        if (res.code === 200) {
          let hasIdReportData = reportResultList.filter((item) => {
            if ('id' in item) {
              return item;
            }
          });
          console.log(hasIdReportData);
          hasIdReportData.map((el, index) => {
            Object.keys(el).forEach(function (key) {
              console.log(res.data[index][key], el[key]);
              if (reg.test(key) && key !== 'resultFlag' && res.data[index][key] !== el[key]) {
                updateInfo.push({ itemId: el.itemId, [key]: res.data[index][key] + '|' + el[key] });
              }
            });
          });
          updateInfoData.current = updateInfo.reduce(function (acc, curr) {
            let findIndex = acc.findIndex(function (item) {
              return item.itemId === curr.itemId;
            });

            if (findIndex === -1) {
              acc.push(curr);
            } else {
              acc[findIndex] = Object.assign({}, acc[findIndex], curr);
            }

            return acc;
          }, []);
        }
      },
    );
  };

  const save = () => {
    let hasIdReportData = reportResultList.filter((item) => {
      if ('id' in item) {
        return item;
      }
    });
    let noIdReportData = reportResultList
      ?.filter((item: any) => !hasIdReportData.some((data) => data.id === item.id))
      .map((item: any) => {
        return {
          reportId: instrAndRecordId.id,
          instrId: instrAndRecordId.instrId,
          colonyCount: item?.colonyCount,
          itemId: item.itemId,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item.result,
          result1: item.result1,
          result2: item.result2,
          result3: item.result3,
          result4: item.result4,
          resultFlag: item.resultFlag,
        };
      });
    if (isChangeReportResult) {
      addCommonUpdateInfo();

      dispatch({
        type: 'generalInspectionMag/save',
        payload: {
          type: 'isChangeReportResult',
          dataSource: false,
        },
      });

      let params = hasIdReportData.map((item) => {
        return {
          id: item.id,
          colonyCount: item?.colonyCount,
          ct: item.ct,
          cutoff: item.cutoff,
          germId: item.germId,
          hasGerm: item.hasGerm,
          od: item.od,
          referenceRange: item.ref?.displayRef,
          result: item.result,
          result1: item.result1,
          result2: item.result2,
          result3: item.result3,
          result4: item.result4,
          resultFlag: item.resultFlag,
        };
      });

      reportResultUpdate(params).then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          let param = {
            data: updateInfoData.current,
          };
          addCommonUpdate({
            beforeChange: param,
            objectId: instrAndRecordId.id,
            winName: '普检数据报告管理',
          }).then((res) => {
            if (res.code === 200) {
              message.success('添加修改日志成功');
            }
          });
        }
      });
    }
    if (noIdReportData.length > 0 && batchAdd) {
      reportResultSave(noIdReportData).then((res) => {
        if (res.code === 200) {
          message.success('添加成功');
        }
      });
    }
  };
  const batchAddShow = () => {
    batchAddRef.current.show();
  };
  const reset = () => {
    form.resetFields();
  };
  const resultEdit = (record: any, fieldName: any, type: any) => {
    editModalRef.current.showModal(record, fieldName, type);
  };
  const getReportResult = (params: any) => {
    reportResult({ reportId: params.id, instrId: params.instrId }).then((res: any) => {
      if (res.code === 200) {
        setResultList(res.data);
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportResultList',
            dataSource: res.data,
          },
        });
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'resultListCheckItemUsed',
            dataSource: res.data,
          },
        });
      } else {
        setResultList([]);
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportResultList',
            dataSource: [],
          },
        });
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'resultListCheckItemUsed',
            dataSource: [],
          },
        });
      }
    });
  };
  return (
    <div className={styles.middle_content}>
      <div className={styles.search_box}>
        {renderForm()}

        <Row>
          <Col>
            <Button type="primary" size="small" onClick={seach}>
              查询
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="small" onClick={add}>
              添加
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="small" onClick={reset}>
              重置
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="small" onClick={batchAddShow}>
              批量录入
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="small" onClick={save}>
              保存
            </Button>
          </Col>
        </Row>
      </div>
      <Table
        dataSource={reportResultList}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={mergeColumns}
        scroll={{ x: 500 }}
        size="small"
        bordered
        pagination={false}
      />
      <CheckItem Ref={checkItemRef} />
      <FlagModal Ref={editModalRef} />
      <DetailsModal Ref={detailRef} />
      <BatchAdd Ref={batchAddRef} />
      <ChartData Ref={chartRef} />
    </div>
  );
};
export default MiddleContent;
