import React, { useRef, useEffect, useState } from 'react';
import { history, useDispatch, useParams, useSelector } from 'umi';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  DatePicker,
  Cascader,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components';
import AddMaterial from '../AddMaterial';
import {
  moduleList,
  getArea,
  getDictList,
  getHospitalList,
  getDoctorList,
  enterAdd,
  reqMainOrderUpdate,
} from '../../../../models/server';
import moment from 'moment';
import Applying from './components/Applying';
import styles from './index.less';
import AddApply from './components/AddApply';
import AddSample from './components/AddSample';
const { TextArea } = Input;
const { Option } = Select;
const AddOrEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const materialRef = useRef();
  const addRef = useRef();
  const [enterType, setEnterType] = useState([]);
  const [fieldList, setFieldList] = useState([]);
  const [form] = Form.useForm();
  const [areaList, setAreaList] = useState([]);
  const [sex, setSex] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [ageUnit, setAgeUnit] = useState([]);
  const [department, setDepartment] = useState([]);
  const [sampleSource, setSampleSource] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [applyListData, setApplyListData] = useState([]);
  const [addSample, setAddSample] = useState([]);
  const [deleteSampleResult, setDeleteSampleResult] = useState([]);
  const addSampleRef = useRef();
  const [isMemory, setIsMemory] = useState(false);
  const { sampleList, information, applyList } = useSelector(
    (state: any) => state.preProcessingMag,
  );
  const { useDetail } = useSelector((state: any) => state.global);
  const [enterDetail, setEnterDetail] = useState();
  const [paramVal, setParamVal] = useState({});
  const [nationData, setNationData] = useState([]);
  const [country, setCountry] = useState([]);

  useEffect(() => {
    getModuleList();
    getAreaList();
    getList({ type: 'SX' });
    getList({ type: 'AU' });
    getList({ type: 'DP' });
    getList({ type: 'FT' });
    getList({ type: 'NATION' });
    getList({ type: 'COUNTRY' });
    getHospitalListData();
    var now1 = moment().format('YYYY-MM-DD HH:mm:ss');
    form.setFieldsValue({
      system: { createBy: useDetail?.name, createDate: moment(now1, 'YYYY-MM-DD HH:mm:ss') },
    });
  }, []);

  useEffect(() => {
    if (paramVal.type !== 'edit') {
      fieldList.forEach((res, index) => {
        for (const key in res) {
          if (key === 'dataType' && res[key] === 4 && res['defaultValue']) {
            res['defaultValue'] = moment(res['defaultValue']);
          }
          if (key === 'dataType' && res[key] === 6 && res['defaultValue']) {
            res['defaultValue'] = res['defaultValue'].split(',').map(Number);
          }
        }
        form.setFieldsValue({
          extend: {
            [res.key]: res.defaultValue,
          },
        });
      });

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'sampleList',
          dataSource: [],
        },
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'information',
          dataSource: [],
        },
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'applyList',
          dataSource: [],
        },
      });
    }
  }, [fieldList]);
  useEffect(() => {
    setParamVal(params);
  }, [params.id]);
  useEffect(() => {
    if (enterDetail) {
      var reg = /^[0-9,/:-\s]+$/;
      for (const key in enterDetail) {
        if (
          isNaN(enterDetail[key]) &&
          reg.test(enterDetail[key]) &&
          !Array.isArray(enterDetail[key])
        ) {
          enterDetail[key] = moment(enterDetail[key]);
        }

        form.setFieldsValue({
          system: {
            [key]: enterDetail[key],
          },
        });
      }
      for (const key in enterDetail?.extend?.extendInfo) {
        if (
          isNaN(enterDetail.extend.extendInfo[key]) &&
          reg.test(enterDetail.extend.extendInfo[key]) &&
          !Array.isArray(enterDetail.extend.extendInfo[key])
        ) {
          enterDetail.extend.extendInfo[key] = moment(enterDetail.extend.extendInfo[key]);
        }
        form.setFieldsValue({
          extend: {
            [key]: enterDetail.extend.extendInfo[key],
          },
        });
      }

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'sampleList',
          dataSource: enterDetail?.sendSamples,
        },
      });
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'information',
          dataSource: enterDetail?.materials,
        },
      });
      let reqItemPricesResult = [];
      if (enterDetail?.reqItemPrices.length > 0) {
        reqItemPricesResult = enterDetail?.reqItemPrices.map((item) => {
          return {
            defaultSampleTypeName: item.sampleTypeName,
            reqItemName: item.itemName,
            defaultSampleTypeId: item.sampleTypeId,
            ...item,
          };
        });
      }

      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'applyList',
          dataSource: reqItemPricesResult,
        },
      });
    }
  }, [enterDetail]);
  const getFormField = (id) => {
    dispatch({
      type: 'preProcessingMag/getMainEnterEnterList',
      payload: {
        moduleId: id,
        callback: (res) => {
          setFieldList(res.data);
          getMainOrderDetail(params?.id);
        },
      },
    });
  };
  const getMainOrderDetail = (id) => {
    dispatch({
      type: 'preProcessingMag/getMainOrder',
      payload: {
        id,
        callback: (res) => {
          setEnterDetail(res.data);
        },
      },
    });
  };
  const getModuleList = () => {
    moduleList().then((res) => {
      if (res.code === 200) {
        setEnterType(res.data);
        form.setFieldsValue({ inputType: res.data[0].id });
        getFormField(res.data[0].id);
      }
    });
  };
  const getAreaList = () => {
    getArea().then((res) => {
      if (res.code === 200) {
        setAreaList(res.data);
      }
    });
  };
  const enterTypeChange = (e) => {
    getFormField(e);
  };
  const onFinish = (value: {
    system: { [x: string]: { format: (arg0: string) => any } };
    extend: { [x: string]: { format: (arg0: string) => any } };
    inputType: any;
  }) => {
    console.log('value', value);

    console.log(applyList);
    // debugger;
    //return;
    const reqItemPrices = applyList.map((item) => {
      return {
        isOut: item.isOut,
        itemId: item.itemId,
        itemName: item.itemName,
        outCompanyId: item.outCompanyId,
        sampleTypeId: item.sampleTypeId,
        cnt: 1,
      };
    });

    for (let i in value.system) {
      if (value.system[i]?._isAMomentObject) {
        value.system[i] = value.system[i].format('YYYY-MM-DD HH:mm:ss');
      }
    }
    for (let i in value.extend) {
      if (value.extend[i]?._isAMomentObject) {
        value.extend[i] = value.extend[i].format('YYYY-MM-DD HH:mm:ss');
      }
    }
    console.log('value', value);
    let params = {
      extend: { extendInfo: value.extend },
      sendSamples: sampleList,
      materials: information,
      inputType: value.inputType,
      ...value.system,
      reqItemPrices,
    };
    if (paramVal.type !== 'edit') {
      enterAdd(params).then((res) => {
        if (res.code === 200) {
          history.push('/preProcessingMag/sampleRegistration');
        }
      });
    } else {
      reqMainOrderUpdate({ id: Number(paramVal.id), ...params }).then((res) => {
        if (res.code === 200) {
          message.success('修改成功');
          history.push('/preProcessingMag/sampleRegistration');
        }
      });
    }
  };

  const getList = (type) => {
    getDictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'DP') {
          setDepartment(res.data);
        }
        if (type.type === 'AU') {
          setAgeUnit(res.data);
        }
        if (type.type === 'SX') {
          setSex(res.data);
        }
        if (type.type === 'FT') {
          setSampleSource(res.data);
        }
        if (type.type === 'NATION') {
          setNationData(res.data);
        }
        if (type.type === 'COUNTRY') {
          setCountry(res.data);
        }
      }
    });
  };
  const getHospitalListData = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
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
  const onChangeTypeThree = (val, key) => {
    if (key === 'hospitalId') {
      getDoctorListData(val);
    }
  };
  const dataType3Form = (stru) => {
    return (
      <Select
        showSearch
        placeholder={`请输入${stru.name}`}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        onChange={(val) => onChangeTypeThree(val, stru.key)}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {stru.key === 'sex'
          ? sex?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'hospitalId'
          ? hospitalList?.map((item, index) => (
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
          : stru.key === 'sendDeptId'
          ? department?.map((item, index) => (
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
          ? nationData?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.key === 'nationality'
          ? country?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.dictValue}
              </Option>
            ))
          : stru.dataJson?.map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
      </Select>
    );
  };
  return (
    <div>
      <div className={styles.title}>
        基本信息管理
        <Button btnType="primary" onClick={() => {}}>
          读取身份证信息
        </Button>
        <Button
          btnType="primary"
          onClick={() => {
            form.submit();
          }}
        >
          确认提交基本信息
        </Button>
      </div>
      <Form
        layout="vertical"
        labelAlign="right"
        colon={false}
        form={form}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        // className={s.addSingle}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="录入方式" name="inputType">
              <Select
                showSearch
                placeholder={`请输入录入方式`}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={enterTypeChange}
              >
                {enterType.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {fieldList?.map((stru, index) => {
            return stru.dataType !== 2 ? (
              <Col span={6} key={index}>
                <Form.Item
                  label={
                    <div
                      className={isMemory ? `${styles.ii}` : null}
                      onClick={() => {
                        setIsMemory(true);
                      }}
                    >
                      {stru.name}
                    </div>
                  }
                  name={[stru.isAuth ? 'system' : 'extend', `${stru.key}`]}
                  rules={[
                    {
                      required: stru.isRequired === true,
                      message: `请输入${stru.name}`,
                    },
                  ]}
                >
                  {(stru.dataType === 1 && (
                    <Input type="text" placeholder={`请输入${stru.name}`} autoComplete="off" />
                  )) ||
                    (stru.dataType === 3 && dataType3Form(stru)) ||
                    (stru.dataType === 5 && (
                      <Select
                        showSearch
                        placeholder={`请输入${stru.name}`}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      >
                        {stru.dataJson?.map((item, index) => (
                          <Option value={item} key={index}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    )) ||
                    (stru.dataType && stru.dataType === 7 && (
                      <Select
                        showSearch
                        placeholder={`请输入${stru.name}`}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      >
                        {stru.dataJson?.map((item, index) => (
                          <Option value={item} key={index}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    )) ||
                    (stru.dataType === 6 && (
                      <Cascader
                        // className={styles.companyAdress}
                        options={areaList}
                        placeholder={`请输入${stru.name}`}
                        fieldNames={{
                          label: 'name',
                          value: 'id',
                          children: 'child',
                        }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    )) ||
                    (stru.dataType === 4 && (
                      <DatePicker
                        inputReadOnly
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        style={{ width: '100%' }}
                        showTime
                      />
                    ))}
                </Form.Item>
              </Col>
            ) : (
              <Col span={6} key={index}>
                <Form.Item
                  label={stru.name}
                  name={[stru.isAuth ? 'system' : 'extend', `${stru.key}`]}
                  rules={[
                    {
                      required: stru.isRequired === 1,
                      message: `请输入${stru.name}`,
                    },
                  ]}
                >
                  <TextArea
                    placeholder={`请输入${stru.name}`}
                    // onChange={(e) => {
                    //   onInputer(e, `${stru.key}_${index}`);
                    // }}
                    maxLength={500}
                    autoSize={{ minRows: 1, maxRows: 11 }}
                  />
                </Form.Item>
                {/* <div id={`textarea_length_${stru.key}_${index}`} style={{ textAlign: 'right' }}>
                  0/500
                </div> */}
              </Col>
            );
          })}
        </Row>
      </Form>
      <div className={styles.title}>
        申请项目列表{' '}
        <Button
          onClick={() => {
            addRef.current.show(applyList, paramVal.type);
          }}
          btnType="primary"
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
      </div>
      <Applying type={1} applyListData={applyListData} setApplyList={setApplyListData} />
      <div className={`${styles.title} ${styles.topVal}`}>
        送检样本列表
        <Button
          onClick={() => {
            addSampleRef.current.show();
          }}
          btnType="primary"
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
      </div>
      <Applying type={2} deleteSampleResult={setDeleteSampleResult} />
      <div className={`${styles.title} ${styles.topVal}`}>
        资料列表
        <Button
          btnType="primary"
          onClick={() => {
            materialRef.current.show();
          }}
        >
          <PlusOutlined style={{ marginRight: 4 }} />
          新增
        </Button>
      </div>
      <Applying type={3} />
      <AddApply refs={addRef} applyListData={setApplyListData} />
      <AddSample refs={addSampleRef} getAddSample={setAddSample} />
      <AddMaterial refs={materialRef} />
    </div>
  );
};
export default AddOrEdit;
