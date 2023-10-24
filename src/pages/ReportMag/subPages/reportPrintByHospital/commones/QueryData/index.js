/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, DatePicker, Popover, Row, Col, Checkbox } from 'antd';
import { Button } from '@/components';
import { useDispatch, useSelector } from 'umi';
import style from './index.less';

import {
  getHospitalList,
  getDoctorList,
  reportUnitList,
  reportUnitReqItem,
  getUserList,
  instrList,
} from '@/models/server';
import { reportMainHospitalQuery } from '../../../../models/server';
import CumtomSearchModal from './components/cumtomSearchModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const InputGroup = Input.Group;
const markData = [
  {
    id: 0,
    name: '否',
  },
  {
    id: 1,
    name: '是',
  },
];
const reportStatusData = [
  {
    id: 0,
    name: '已审核',
  },
  {
    id: 1,
    name: '已发布',
  },
];
const auditStatusData = [
  {
    id: 0,
    name: '未审核',
  },
  {
    id: 1,
    name: '初审',
  },
  {
    id: 2,
    name: '终审',
  },
];
const QueryData = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const cumtomRef = useRef();
  const [searchList2, setSearchList2] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [leftCheckList, setLeftCheckList] = useState([]);
  const [sex, setSex] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [sampleSource, setSampleSource] = useState([]);
  const [nation, setNation] = useState([]);
  const [ageUnit, setAgeUnit] = useState([]);
  const [department, setDepartment] = useState([]);
  const [reportUnit, setReportUnit] = useState([]);
  const [reportUnitReqItemList, setReportUnitReqItemList] = useState([]);
  const [userList, setUserList] = useState([]);
  const { useDetail } = useSelector((state) => state.global);
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [sampleState, setSampleState] = useState([]);
  const [instrListData, setInstrListData] = useState([]);
  useEffect(() => {
    getCustomSearch();
    dicVal({ type: 'SX' });
    dicVal({ type: 'FT' });
    dicVal({ type: 'NATION' });
    dicVal({ type: 'AU' });
    dicVal({ type: 'DP' });
    dicVal({ type: 'BT' });
    dicVal({ type: 'XZ' });
    hospitalList();
    getReportUnitList();
    getUserListData();
    getInstrList();
  }, []);

  const dicVal = (params) => {
    dispatch({
      type: 'commonMaterials/fetchOneLevelTypeModalSel',
      payload: {
        ...params,
        callback: (res) => {
          if (res.code === 200) {
            if (params.type === 'SX') {
              setSex(res.data);
            }
            if (params.type === 'FT') {
              setSampleSource(res.data);
            }
            if (params.type === 'NATION') {
              setNation(res.data);
            }
            if (params.type === 'AU') {
              setAgeUnit(res.data);
            }
            if (params.type === 'DP') {
              setDepartment(res.data);
            }
            if (params.type === 'BT') {
              setSampleTypeList(res.data);
            }
            if (params.type === 'XZ') {
              setSampleState(res.data);
            }
          }
        },
      },
    });
  };
  const getUserListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const getInstrList = () => {
    instrList().then((res) => {
      if (res.code === 200) {
        setInstrListData(res.data);
      }
    });
  };
  const getReportUnitList = () => {
    reportUnitList({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnit(res.data);
        if (res.data.length > 0) {
          getReportUnitReqItem(res.data[0].id);
        }
      }
    });
  };
  const getReportUnitReqItem = (reportUnitId) => {
    reportUnitReqItem({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setReportUnitReqItemList(res.data);
      }
    });
  };
  const reportUnitChange = (e) => {
    if (e) {
      getReportUnitReqItem(e);
    }
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
        getDoctorListData(res.data[0].id);
      }
    });
  };
  const getDoctorListData = (id) => {
    getDoctorList({ hospitalId: id }).then((res) => {
      if (res.code === 200) {
        setDoctorList(res.data);
      }
    });
  };
  const onChangeTypeThree = (e, key) => {
    if (e && key === 'hospitalId') {
      getDoctorListData(e);
    }
  };
  const getCustomSearch = () => {
    reportMainHospitalQuery()
      .then((res) => {
        const list =
          res.data && res.data.assemblyInfo.json ? JSON.parse(res.data.assemblyInfo.json) : [];

        const result = list.map((item) => {
          return { value: item.key, label: item.name, type: item.type };
        });

        const result2 = list.map((item) => {
          return `${item.key},${item.name},${item.type}`;
        });
        setLeftCheckList(result2);
        setCheckedList(result);
        setSearchList2(list);

        dispatch({
          type: 'preProcessingMag/save',
          payload: {
            type: 'search',
            dataSource: list,
          },
        });
      })
      .catch(() => {});
  };

  // 改变保存在model里面的数据
  const changeModelData = (type, value) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'reportMag/save',
        payload: {
          type,
          dataSource: value,
        },
      });
    });
  };

  // 点击清空
  const tapClear = () => {
    changeModelData('pageNum', 1);
    changeModelData('queryDataByHosPrint', {});
    form.resetFields();
  };
  const seach = () => {
    handleQuery();
  };
  const reset = () => {
    form.resetFields();
    changeModelData('queryDataByHosPrint', {});
  };
  const handleQuery = () => {
    const formValues = form.getFieldsValue();
    console.log(formValues);

    changeModelData('pageNum', 1);
    const params = {
      ...formValues,
      collectDateStart:
        formValues.collectDateStart && formValues.collectDateStart[0]
          ? formValues.collectDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      collectDateEnd:
        formValues.collectDateStart && formValues.collectDateStart[1]
          ? formValues.collectDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      applyDateStart:
        formValues.applyDateStart && formValues.applyDateStart[0]
          ? formValues.applyDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      applyDateEnd:
        formValues.applyDateStart && formValues.applyDateStart[1]
          ? formValues.applyDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      preReceiveDateStart:
        formValues.preReceiveDateStart && formValues.preReceiveDateStart[0]
          ? formValues.preReceiveDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      preReceiveDateEnd:
        formValues.preReceiveDateStart && formValues.preReceiveDateStart[1]
          ? formValues.preReceiveDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateStart:
        formValues.createDateStart && formValues.createDateStart[0]
          ? formValues.createDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateEnd:
        formValues.createDateStart && formValues.createDateStart[1]
          ? formValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      lastAuditDateStart:
        formValues.lastAuditDateStart && formValues.lastAuditDateStart[0]
          ? formValues.lastAuditDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      lastAuditDateEnd:
        formValues.lastAuditDateEnd && formValues.lastAuditDateEnd[1]
          ? formValues.lastAuditDateEnd[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      lastPrintDateStart:
        formValues.lastPrintDateStart && formValues.lastPrintDateStart[0]
          ? formValues.lastPrintDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      lastPrintDateEnd:
        formValues.lastPrintDateEnd && formValues.lastPrintDateEnd[1]
          ? formValues.lastPrintDateEnd[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      labDateStart:
        formValues.labDateStart && formValues.labDateStart[0]
          ? formValues.labDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      labDateEnd:
        formValues.labDateEnd && formValues.labDateEnd[1]
          ? formValues.labDateEnd[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      firstAuditDateStart:
        formValues.firstAuditDateStart && formValues.firstAuditDateStart[0]
          ? formValues.firstAuditDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      firstAuditDateEnd:
        formValues.firstAuditDateEnd && formValues.firstAuditDateEnd[1]
          ? formValues.firstAuditDateEnd[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    };

    changeModelData('queryDataByHosPrint', params);
  };

  const dataType3Form = (stru) => {
    return (
      <Select
        showSearch
        placeholder={`请输入${stru.name}`}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        onChange={(val) => onChangeTypeThree(val, stru.key)}
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{ width: 254 }}
      >
        {stru.key === 'sex'
          ? sex?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'hospitalId'
          ? hospital?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.hospitalName}
              </Option>
            ))
          : stru.key === 'ageUnit'
          ? ageUnit?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'source'
          ? sampleSource?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'sendDoctorId'
          ? doctorList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))
          : stru.key === 'nation'
          ? nation.map((item, index) => {
              return (
                <Option key={item.id} value={index}>
                  {item.dictValue}
                </Option>
              );
            })
          : stru.key === 'sendDeptId'
          ? department?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'sampleTypeId'
          ? sampleTypeList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'sampleStateId'
          ? sampleState.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'printFlag' ||
            stru.key === 'publishFlag' ||
            stru.key === 'resultModifyFlag' ||
            stru.key === 'reportDelayFlag' ||
            stru.key === 'isPaymentReceived'
          ? markData?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))
          : stru.key === 'instrId'
          ? instrListData.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.instrName}
              </Option>
            ))
          : stru.key === 'auditStatus'
          ? auditStatusData.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))
          : stru.key === 'lastAuditBy'
          ? userList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))
          : null}
      </Select>
    );
  };
  const getSearchContent = (item) => {
    switch (item.type) {
      case '1':
        return (
          <Form.Item key={item.key} name={item.key} label={item.name}>
            <Input
              placeholder={`请输入${item.name}`}
              style={{ width: 254 }}
              type={item.key === 'age' ? 'number' : 'text'}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case '3':
        return (
          <Form.Item key={item.key} name={item.key} label={item.name}>
            {dataType3Form(item)}
          </Form.Item>
        );
      case '4':
        return (
          <Form.Item
            key={item.key}
            name={
              item.key === 'collectDate'
                ? 'collectDateStart'
                : item.key === 'applyDate'
                ? 'applyDateStart'
                : item.key === 'createDate'
                ? 'createDateStart'
                : item.key === 'lastAuditDate'
                ? 'lastAuditDateStart'
                : item.key === 'lastPrintDate'
                ? 'lastPrintDateStart'
                : item.key
            }
            label={item.name}
          >
            <RangePicker
              showTime
              placeholder={[
                `${item.name.slice(0, -2)}开始日期`,
                `${item.name.slice(0, -2)}结束日期`,
              ]}
              style={{ width: 340 }}
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  const popover_content = () => {
    return (
      <div className={style.popover_content}>
        <div className={style.popover_form}>
          {searchList2.map((item) => {
            return getSearchContent(item);
          })}
        </div>
        <div className={style.footer}>
          <div style={{ display: 'flex' }}>
            <Button
              btnType="clear"
              style={{ marginRight: 12 }}
              onClick={() => {
                setVisible(false);
                tapClear();
              }}
            >
              清空
            </Button>
            <Button
              btnType="primary"
              onClick={() => {
                setVisible(false);
                handleQuery();
              }}
            >
              查询
            </Button>
          </div>
          <div
            className={style.set_condition}
            onClick={() => cumtomRef.current.onShowExportModal()}
          >
            <img src={require('./img/settings.png')} style={{ width: 18, marginRight: 7 }} />
            设置筛选条件
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Form form={form}>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item name="preReceiveDateStart">
              <RangePicker
                // showTime={{ format: 'HH:mm' }}
                showTime
                // format="YYYY-MM-DD HH:mm"
                placeholder={['前处理接收开始时间', '前处理接收结束时间']}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="reportUnitCode">
              <Select allowClear onChange={reportUnitChange} placeholder="报告单元">
                {reportUnit?.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.reportUnitName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <InputGroup>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="patientName">
                    <Input placeholder="请输入姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="sex">
                    <Select placeholder="请选择性别" allowClear>
                      {sex.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.dictValue}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </InputGroup>
          </Col>
          <Col span={6}>
            <Form.Item name="reqItemIds">
              <Select
                allowClear
                // onChange={checkChange}
                placeholder="检验目的"
                mode="multiple"
              >
                {reportUnitReqItemList?.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.reqItemName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item name="labDateStart">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['检验日期开始时间', '检验日期结束时间']}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sampleBarcode">
              <Input placeholder="请输入样本条码" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="hospitalId">
              <Select placeholder="请选择送检单位" allowClear>
                {hospital?.map((item, index) => {
                  return (
                    <Option value={item.id} key={index}>
                      {item.hospitalName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Row gutter={8}>
              <Col span={24}>
                <InputGroup>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="createBy">
                        <Select placeholder="请选择检验人" allowClear>
                          {userList?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="firstAuditBy">
                        <Select placeholder="请选择审核人" allowClear>
                          {userList?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item name="firstAuditDateStart">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['审核开始时间', '审核结束时间']}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sampleNo">
              <Input placeholder="请输入样本编号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Row gutter={8}>
              <Col span={12}>
                {' '}
                <Form.Item name="sendDeptId">
                  <Select placeholder="请选择送检科室" allowClear>
                    {department.map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.dictValue}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sendDoctorId">
                  <Select placeholder="请选择送检医生" allowClear>
                    {doctorList?.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={8}>
              <Col span={24}>
                <InputGroup>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="source">
                        <Select placeholder="请选择病人类型人" allowClear>
                          {sampleSource?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.dictValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="reportStatus">
                        <Select placeholder="请选择报告状态" allowClear>
                          {reportStatusData.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Row gutter={8}>
              <Col span={24}>
                <InputGroup>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="isEmer">
                        <Select placeholder="是否急诊" allowClear>
                          {markData?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="overdueFlag">
                        <Select placeholder="是否超周期" allowClear>
                          {markData?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={8}>
              <Col span={24}>
                <InputGroup>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="retestFlag">
                        <Select placeholder="是否复查" allowClear>
                          {markData?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.dictValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="isPositive">
                        <Select placeholder="是否阳性" allowClear>
                          {markData?.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Form.Item name="criticalFlag">
              <Select allowClear placeholder="是否存在危机值">
                {markData?.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', height: '30px' }}>
            <Button type="primary" onClick={seach} size="small">
              查询
            </Button>
            <Button type="primary" onClick={reset} size="small" style={{ margin: '0 5px' }}>
              重置
            </Button>

            {searchList2.length > 0 && (
              <Popover
                content={popover_content}
                placement="bottomRight"
                trigger="click"
                visible={visible}
                onVisibleChange={(visible) => setVisible(visible)}
              >
                <div style={{ color: '#808695', cursor: 'pointer', width: 200 }}>
                  <img
                    src={require('./img/filter_icon.png')}
                    style={{ width: 15, marginRight: 8 }}
                  />
                  更多筛选
                </div>
              </Popover>
            )}
            {searchList2.length == 0 && (
              <div
                onClick={() => cumtomRef.current.onShowExportModal()}
                style={{ cursor: 'pointer' }}
              >
                <img src={require('./img/settings.png')} style={{ width: 15, marginRight: 8 }} />
                设置筛选条件
              </div>
            )}
          </Col>
        </Row>
      </Form>
      <CumtomSearchModal
        ref={cumtomRef}
        refresh={getCustomSearch}
        checkedList={checkedList}
        leftCheckList={leftCheckList}
      />
    </>
  );
};
export default QueryData;
