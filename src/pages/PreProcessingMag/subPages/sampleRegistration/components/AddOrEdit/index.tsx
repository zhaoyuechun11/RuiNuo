import React, { useRef, useEffect, useState } from 'react';
import { history, useDispatch, useParams } from 'umi';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  DatePicker,
  Divider,
  TreeSelect,
  Tooltip,
  Switch,
  Cascader,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components';
import AddMaterial from '../AddMaterial';
import {
  moduleList,
  getArea,
  getMainOrder,
  getDictList,
  getHospitalList,
  getDoctorList,
} from '../../../../models/server';
import moment from 'moment';
import Applying from './components/Applying';
import styles from './index.less';
const { TextArea } = Input;
const { Option } = Select;
const AddOrEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const materialRef = useRef();
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
  const [isMemory, setIsMemory] = useState(false);
  useEffect(() => {
    getModuleList();
    getAreaList();
    getMainOrderData();
    getList({ type: 'SX' });
    getList({ type: 'AU' });
    getList({ type: 'DP' });
    getList({ type: 'FT' });

    getHospitalListData();
  }, []);
  useEffect(() => {
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
        [res.key]: res.defaultValue,
      });
    });
  }, [fieldList]);
  const getFormField = (id) => {
    dispatch({
      type: 'preProcessingMag/getMainEnterEnterList',
      payload: {
        moduleId: id,
        callback: (res) => {
          setFieldList(res.data);
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
  const onFinish = (value) => {
    console.log('value', value);
  };
  const getMainOrderData = () => {
    getMainOrder({ id: 9 }).then((res) => {
      if (res.code === 200) {
      }
    });
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
  const dataType3Form = (stru) => {
    return (
      <Select
        showSearch
        placeholder={`请输入${stru.name}`}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
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
      <div
        onClick={() => {
          // materialRef.current.show();
          // onFinish()
          form.submit();
        }}
      >
        添加
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
        <Row gutter={24}>
          <Col span={8}>
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
              <Col span={8} key={index}>
                <Form.Item
                  label={
                    <div
                    className={isMemory?`${styles.ii}`:null}
                      onClick={() => {
                        setIsMemory(true)
                        
                      }}
                    
                    >
                      {stru.name}
                    </div>
                  }
                  name={`${stru.key}`}
                  key={`${stru.key}`}
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
                      />
                    ))}
                </Form.Item>
              </Col>
            ) : (
              <Col span={8} key={index}>
                <Form.Item
                  label={stru.name}
                  name={`${stru.key}`}
                  key={`${stru.key}`}
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
        <div className={styles.title}>
          申请项目列表{' '}
          <Button
            btnType="primary"
            onClick={() => {
              // history.push('/preProcessingMag/sampleRegistration/addOrEdit');
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
        <Applying type={1} />
        <div className={`${styles.title} ${styles.topVal}`}>
          送检样本列表
          <Button
            btnType="primary"
            onClick={() => {
              // history.push('/preProcessingMag/sampleRegistration/addOrEdit');
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
        <Applying type={2} />
        <div className={`${styles.title} ${styles.topVal}`}>
          资料列表
          <Button
            btnType="primary"
            onClick={() => {
              // history.push('/preProcessingMag/sampleRegistration/addOrEdit');
            }}
          >
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>
        </div>
        <Applying type={3} />
      </Form>
      {/* <AddMaterial refs={materialRef} /> */}
    </div>
  );
};
export default AddOrEdit;
