/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, DatePicker, Popover, Row, Col } from 'antd';
import { Button } from '@/components';
import { useDispatch, useSelector } from 'umi';
import { downLoad } from '@/utils';
import style from './index.less';
import {
  getHospitalList,
  getDoctorList,
  getApplayFormQueryData,
  getNodeList,
  majorGroup,
  getReqItemList,
} from '@/models/server';
import { getOriginOrderExport, professionOrderExport } from '../../../../models/server';
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
  const [nodeList, setNodeList] = useState([]);
  const [reqItemList, setReqItemList] = useState([]);
  const { useDetail } = useSelector((state) => state.global);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const { queryParams, originOrderExoprtColumm, professionExoprtColumm } = useSelector(
    (state) => state.applicationFormMsg,
  );

  useEffect(() => {
    getCustomSearch();
    majorGroupList();
    getReqItem();
    getNodeListData();
    dicVal({ type: 'SX' });
    dicVal({ type: 'FT' });
    dicVal({ type: 'NATION' });
    dicVal({ type: 'AU' });
    dicVal({ type: 'DP' });
    dicVal({ type: 'BT' });
    hospitalList();
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
          }
        },
      },
    });
  };

  const getReqItem = () => {
    getReqItemList().then((res) => {
      if (res.code === 200) {
        setReqItemList(res.data);
      }
    });
  };
  const getNodeListData = () => {
    getNodeList().then((res) => {
      if (res.code === 200) {
        setNodeList(res.data);
      }
    });
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
    getApplayFormQueryData()
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
      })
      .catch(() => {});
  };

  // 改变保存在model里面的数据
  const changeModelData = (type, value) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'applicationFormMsg/save',
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
    changeModelData('queryData', {});
    form.resetFields();
  };
  const seach = () => {
    handleQuery();
  };
  const reset = () => {
    form.resetFields();
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
      receiveDateStart:
        formValues.receiveDateStart && formValues.receiveDateStart[0]
          ? formValues.receiveDateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      receiveDateEnd:
        formValues.receiveDateStart && formValues.receiveDateStart[1]
          ? formValues.receiveDateStart[1].format('YYYY-MM-DD HH:mm:ss')
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
        formValues.createDateStart && formValues.createDateStart[1]
          ? formValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
      createDateEnd:
        formValues.createDateStart && formValues.createDateStart[1]
          ? formValues.createDateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    };

    changeModelData('queryParams', params);
  };
  const exportOriginOrder = () => {
    originOrderExoprtColumm.pop();
    let customExportFields = originOrderExoprtColumm.join(',');
    let params = {
      ...queryParams,
      fields: customExportFields,
    };

    getOriginOrderExport(params).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '原始单');
    });
  };
  const exportProfessionOrder = () => {
    professionExoprtColumm.pop;
    let customExportFields = professionExoprtColumm.join(',');
    let params = {
      ...queryParams,
      fields: customExportFields,
    };
    professionOrderExport(params).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '专业组单');
    });
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
        mode={`${stru.key === 'sampleTypeName' ? 'multiple' : ''}`}
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
          : stru.key === 'sampleTypeName'
          ? sampleTypeList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'currentNode'
          ? nodeList?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))
          : stru.key === 'isEmer' ||
            stru.key === 'giveUpCheckFlag' ||
            stru.key === 'bloodFlag' ||
            stru.key === 'reportDelayFlag' ||
            stru.key === 'isPaymentReceived'
          ? markData?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))
          : null}
      </Select>
    );
  };
  const majorGroupList = () => {
    majorGroup().then((res) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
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
              item.key === 'birthdate'
                ? 'birthdateStart'
                : item.key === 'collectDate'
                ? 'collectDateStart'
                : item.key === 'applyDate'
                ? 'applyDateStart'
                : item.key === 'receiveDate'
                ? 'receiveDateStart'
                : item.key === 'preReceiveDate'
                ? 'preReceiveDateStart'
                : item.key === 'createDate'
                ? 'createDateStart'
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
            <Form.Item name="createDateStart">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['创建开始时间', '创建结束时间']}
              />
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
            <Form.Item name="labClassId">
              <Select placeholder="请选择专业类别" allowClear>
                {majorGroupData.length > 0 &&
                  majorGroupData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.className}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item name="preReceiveDateStart">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['接收开始时间', '接收结束时间']}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="receiveBarcode">
              <Input placeholder="请输入收样条码" />
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
            <Form.Item name="reqItemIds">
              <Select
                allowClear
                // onChange={checkChange}
                placeholder="检验目的"
                mode="multiple"
              >
                {reqItemList?.map((item) => {
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
          <Col span={9} style={{ display: 'flex', height: '30px' }}>
            <Button type="primary" onClick={seach} size="small">
              查询
            </Button>
            <Button type="primary" onClick={reset} size="small" style={{ margin: '0 5px' }}>
              重置
            </Button>
            <Button type="primary" onClick={exportOriginOrder} size="small">
              导出原始单
            </Button>
            <Button
              type="primary"
              onClick={exportProfessionOrder}
              size="small"
              style={{ margin: '0 5px' }}
            >
              导出专业组单
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
