/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Cascader, TreeSelect, DatePicker, Popover } from 'antd';
import { Card, Button } from '@/components';
import { useDispatch } from 'umi';
import style from './index.less';
import { debounce } from 'lodash';
import { getQueryData, getHospitalList, getDoctorList } from '../../../../models/server';
import CumtomSearchModal from './components/cumtomSearchModal';

const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;
const { Option } = Select;

const QueryData = ({ queryData }) => {
  const dispatch = useDispatch();
  const [provinceList, setProvinceList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const cumtomRef = useRef();

  const [searchList, setSearchList] = useState([]);
  const [searchList1, setSearchList1] = useState([]);
  const [searchList2, setSearchList2] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [leftCheckList, setLeftCheckList] = useState([]);
  const [sex, setSex] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [sampleSource, setSampleSource] = useState([]);
  const [nation, setNation] = useState([]);

  useEffect(() => {
    getCustomSearch();
    dicVal({ type: 'SX' });
    dicVal({ type: 'FT' });
    dicVal({ type: 'NATION' });
    hospitalList();
    // getProvince().then((res) => {
    //   res.data.map((item) => {
    //     if (item.child && item.child.length > 0) {
    //       item.child.unshift({
    //         id: 0,
    //         name: '不限',
    //       });
    //       item.child.map((item2) => {
    //         if (item2.child && item2.child.length > 0) {
    //           item2.child &&
    //             item2.child.unshift({
    //               id: 0,
    //               name: '不限',
    //             });
    //         }
    //       });
    //     }
    //   });
    //   setProvinceList(res.data);
    // });

    // getDriveType({ type: 'drive' }).then((res) => {
    //   setDriveType(res.data);
    // });
    // getDriveType({ type: 'drive_num' }).then((res) => {
    //   setDriveNum(res.data);
    // });
    // getSourceData().then((res) => {
    //   setSourceInfo(res.data);
    // });
    // dispatch({
    //   type: 'global/_getChannels',
    //   payload: {
    //     clicks_order: 1,
    //   },
    // });
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
          }
        },
      },
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
  const onChangeHospital = (e) => {
    if (e) {
      getDoctorListData(e);
    }
  };
  const getCustomSearch = () => {
    getQueryData()
      .then((res) => {
        const list =
          res.data && res.data.assemblyInfo.json
            ? JSON.parse(res.data.assemblyInfo.json)
            : CHECKED_LIST_FOR_SEARCH;
        let list1 = [],
          list2 = [];
        if (list.length > 5) {
          list1 = list.slice(0, 5);
          list2 = list.slice(5);
        } else {
          list1 = list;
        }
        const result = list.map((item) => {
          return { value: item.key, label: item.name };
        });
        const result2 = list.map((item) => {
          return `${item.key},${item.name}`;
        });
        setLeftCheckList(result2);
        setCheckedList(result);
        setSearchList(list);
        setSearchList1(list1);
        setSearchList2(list2);
        queryData && form.setFieldsValue(queryData);
      })
      .catch(() => {});
  };

  useEffect(() => {
    queryData && form.setFieldsValue(queryData);
    !queryData && form.setFieldsValue({});
  }, [queryData]);

  // 改变保存在model里面的数据
  const changeModelData = (type, value) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type,
          dataSource: value,
        },
      });
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  // 点击清空
  const tapClear = () => {
    changeModelData('pageNum', 1);
    changeModelData('queryData', {});
    form.resetFields();
  };
  const handleChange = (value) => {
    setExpand(value);
  };

  const handleQuery = () => {
    const formValues = form.getFieldsValue();

    changeModelData('pageNum', 1);
    const params = {
      ...formValues,
      birthdateStart:
        formValues.birthdateStart && formValues.birthdateStart[0]
          ? formValues.birthdateStart[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      birthdateEnd:
        formValues.birthdateStart && formValues.birthdateStart[1]
          ? formValues.birthdateStart[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
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
      // province:
      //   formValues.work_address && formValues.work_address[0] ? formValues.work_address[0] : 0,
      // city: formValues.work_address && formValues.work_address[1] ? formValues.work_address[1] : 0,
      // area: formValues.work_address && formValues.work_address[2] ? formValues.work_address[2] : 0,
      // age_num: ageNum.join('-') !== '-' ? ageNum.join('-') : '',
    };

    changeModelData('queryData', params);
  };

  const onValuesChangeHandler = debounce((changedValues, allValues) => {
    // console.log('changedValues', changedValues);
    // console.log('allValues', allValues);
    // 更多筛选弹窗显示时停止自动查询
    if (visible) return;
    handleQuery();
  }, 1500);

  const renderUserTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode checkable dataRef={item} title={item.name} key={item.id + ''} value={item.id}>
            {renderUserTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode checkable dataRef={item} key={item.id + ''} title={item.name} value={item.id} />
      );
    });

  const getSearchContent = (name, show) => {
    switch (name) {
      case 'patientName':
        return (
          <Form.Item key={name} name="patientName" label="姓名">
            <Input placeholder="请输入姓名" style={{ width: 254 }} allowClear autoComplete="off" />
          </Form.Item>
        );
      case 'age':
        return (
          <Form.Item key={name} name={name} label={'年龄'}>
            <Input
              placeholder="请输入年龄"
              type="number"
              style={{ width: 'auto' }}
              min={0}
              autoComplete="off"
              allowClear
            />
          </Form.Item>
        );
      case 'receiveBarcode':
        return (
          <Form.Item key={name} name={name} label="收样条码">
            <Input
              placeholder="请输入收样条码"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case 'createBy':
        return (
          <Form.Item key={name} name={name} label="创建人员">
            <Input
              placeholder="请输入创建人员"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case 'bedNo':
        return (
          <Form.Item key={name} name={name} label="床号">
            <Input
              placeholder="请输入创建人员"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case 'sex':
        return (
          <Form.Item key={name} name={name} label="性别">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择性别"
              showSearch
              showArrow
            >
              {sex.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.dictValue}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case 'hospitalId':
        return (
          <Form.Item key={name} name={name} label="送检单位">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择送检单位"
              showSearch
              showArrow
              onChange={onChangeHospital}
            >
              {hospital?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.hospitalName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'sendDoctorId':
        return (
          <Form.Item key={name} name={name} label="送检医生">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择送检医生"
              showSearch
              showArrow
            >
              {doctorList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'source':
        return (
          <Form.Item key={name} name={name} label="样本来源">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择样本来源"
              showSearch
              showArrow
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {sampleSource?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.dictValue}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'nation':
        return (
          <Form.Item key={name} name={name} label="民族">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择工作经验"
              showSearch
              showArrow
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {nation.map((item, index) => {
                return (
                  <Option key={item.id} value={index}>
                    {item.dictValue}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case 'idCardNo':
        return (
          <Form.Item key={name} name={name} label="身份证号">
            <Input
              placeholder="请输入收样条码"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case 'diagnosis':
        return (
          <Form.Item key={name} name={name} label="临床诊断">
            <Input
              placeholder="请输入临床诊断"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case 'birthdate':
        return (
          <Form.Item key={name} name={'birthdateStart'} label="出生日期">
            <RangePicker showTime placeholder={['出生开始日期', '出生日期结束日期']} />
          </Form.Item>
        );
      case 'collectDate':
        return (
          <Form.Item key={name} name={'collectDateStart'} label="采样日期">
            <RangePicker showTime placeholder={['采样开始日期', '采样结束日期']} />
          </Form.Item>
        );
      case 'applyDate':
        return (
          <Form.Item key={name} name={'applyDateStart'} label="申请日期">
            <RangePicker showTime placeholder={['申请开始日期', '申请结束日期']} />
          </Form.Item>
        );
      case 'receiveDate':
        return (
          <Form.Item key={name} name={'receiveDateStart'} label="物流接收日期">
            <RangePicker showTime placeholder={['物流接收开始日期', '物流接收结束日期']} />
          </Form.Item>
        );
      case 'preReceiveDate':
        return (
          <Form.Item key={name} name="preReceiveDateStart" label="前处理接收日期">
            <RangePicker showTime placeholder={['前处理接收开始日期', '前处理接收结束日期']} />
          </Form.Item>
        );
      case 'createDate':
        return (
          <Form.Item key={name} name="createDateStart" label="登记日期">
            <RangePicker
              showTime
              placeholder={['登记开始日期', '登记结束日期']}
              style={{ width: 254 }}
            />
          </Form.Item>
        );
      case '工作地点':
        return (
          <Form.Item key={name} name="work_address" label={show ? '工作地点' : ''}>
            <Cascader
              style={{ width: 254 }}
              className={styles.companyAdress}
              options={provinceList}
              placeholder="请选择地址"
              fieldNames={{ label: 'name', value: 'id', children: 'child' }}
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
            return getSearchContent(item.key, true);
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
    <Card style={{ padding: '24px 20px 24px' }}>
      <div className={style.queryData}>
        <Form
          form={form}
          labelAlign="right"
          layout="vertical"
          values={queryData}
          onValuesChange={onValuesChangeHandler}
        >
          <div className={style.queryContainer}>
            {searchList1.map((item) => {
              return getSearchContent(item.key);
            })}
          </div>
          {searchList2.length > 0 && (
            <Popover
              content={popover_content}
              placement="bottomRight"
              trigger="click"
              visible={visible}
              onVisibleChange={(visible) => setVisible(visible)}
            >
              <div className="flex_end" style={{ color: '#808695', cursor: 'pointer', width: 200 }}>
                <img src={require('./img/filter_icon.png')} style={{ width: 15, marginRight: 8 }} />
                更多筛选
              </div>
            </Popover>
          )}
          {searchList2.length == 0 && (
            <div
              className="flex_end"
              onClick={() => cumtomRef.current.onShowExportModal()}
              style={{ cursor: 'pointer' }}
            >
              <img src={require('./img/settings.png')} style={{ width: 15, marginRight: 8 }} />
              设置筛选条件
            </div>
          )}
          <CumtomSearchModal
            ref={cumtomRef}
            refresh={getCustomSearch}
            checkedList={checkedList}
            leftCheckList={leftCheckList}
          />
        </Form>
      </div>
    </Card>
  );
};
export default QueryData;
