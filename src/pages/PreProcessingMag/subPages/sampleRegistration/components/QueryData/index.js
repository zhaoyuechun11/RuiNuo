/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Cascader, TreeSelect, Tooltip, DatePicker, Popover } from 'antd';
import { Card, Button } from '@/components';
import { connect } from 'umi';
import style from './index.less';
import { debounce } from 'lodash';
// import {  CHECKED_LIST_FOR_SEARCH } from '@utils/constant';
// import { PositionSelectMultiple } from '@common';
// import styles from '../../../Recruitment/subPages/Addposition/components/PositionForm/index.less';
// import { getProvince, getDriveType, getSourceData, getCustomSelect } from '../../models/server';
import CumtomSearchModal from './components/cumtomSearchModal';

const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;
const { Option } = Select;

const QueryData = ({
  queryData,
  positionList,
  departmentList,
  channelsList,
  educationList,
  tagList,
  operatorList,
  refresh,
  dispatch,
  interviewerList,
}) => {
  const defaultValues = {
    search_word: '',
    recruitment_position_id: undefined,
    recruitment_department_id: undefined,
    label_name: undefined,
    recruitment_channels_id: undefined,
    recruitment_director_id: undefined,
    sex: undefined,
    age_num: '',
    work_num: undefined,
    education: undefined,
    graduate: '',
    major: '',
    work_place: '',
    is_investigation: undefined,
    is_send_registration: undefined,
    interview_mode: undefined,
    interviewer_id: undefined,
    work_address: [],
    drive_type: undefined,
    drive_num: undefined,
    terminal: undefined,
    current_status_time: undefined,
    create_time: undefined,
    access_status: undefined,
  };
  const [ageNum, setAgeNum] = useState(['', '']);
  const [provinceList, setProvinceList] = useState([]);
  const [driveType, setDriveType] = useState([]);
  const [driveNum, setDriveNum] = useState([]);
  const [sourceInfo, setSourceInfo] = useState([]);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const cumtomRef = useRef();

  const [searchList, setSearchList] = useState([]);
  const [searchList1, setSearchList1] = useState([]);
  const [searchList2, setSearchList2] = useState([]);

  useEffect(() => {
    getCustomSearch();
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

  const getCustomSearch = () => {
    // getCustomSelect({
    //   type: 1, //1:候选人2:待入职3:已入职4:放弃入职5:人才库
    //   candidate_type: 9,
    // })
    //   .then((res) => {
    //     debugger
    //     const list =
    //       res.data && res.data.json ? JSON.parse(res.data.json) : CHECKED_LIST_FOR_SEARCH;
    //     let list1 = [],
    //       list2 = [];
    //     if (list.length > 5) {
    //       list1 = list.slice(0, 5);
    //       list2 = list.slice(5);
    //     } else {
    //       list1 = list;
    //     }
    //     setSearchList(list);
    //     setSearchList1(list1);
    //     setSearchList2(list2);
    //     queryData && form.setFieldsValue(queryData);
    //   })
    //   .catch(() => {});
  };

  useEffect(() => {
    queryData && form.setFieldsValue(queryData);
    !queryData && form.setFieldsValue(defaultValues);
  }, [queryData]);

  // 改变保存在model里面的数据
  const changeModelData = (type, value) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'Candidate/save',
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

  const onChangeAge = (val, index) => {
    const age_num = JSON.parse(JSON.stringify(ageNum));
    age_num[index] = val;
    setAgeNum(age_num);
  };

  // 点击清空
  const tapClear = () => {
    changeModelData('page', 1);
    changeModelData('queryData', {
      ...defaultValues,
      age_num: '',
    });
    setAgeNum(['', '']);
    form.setFieldsValue(defaultValues);
    // refresh(defaultValues)
  };
  const handleChange = (value) => {
    setExpand(value);
  };

  const handleQuery = () => {
    const formValues = form.getFieldsValue();
    changeModelData('page', 1);
    const params = {
      ...formValues,
      province:
        formValues.work_address && formValues.work_address[0] ? formValues.work_address[0] : 0,
      city: formValues.work_address && formValues.work_address[1] ? formValues.work_address[1] : 0,
      area: formValues.work_address && formValues.work_address[2] ? formValues.work_address[2] : 0,
      age_num: ageNum.join('-') !== '-' ? ageNum.join('-') : '',
    };
    // console.log('queryParams', params);
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
      case '候选人姓名或手机':
        return (
          <Form.Item key={name} name="search_word">
            <Input
              placeholder="候选人姓名或手机号"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case '招聘职位':
        return (
          <Form.Item key={name} name="recruitment_position_id">
            {/* <PositionSelectMultiple
              showAdd={false}
              style={{ width: 254 }}
              placeholder="请选择招聘职位"
              showStop={true}
            /> */}
          </Form.Item>
        );
      case '招聘部门':
        return (
          <Form.Item key={name} name="recruitment_department_id" label={show ? '招聘部门' : ''}>
            <TreeSelect
              allowClear
              showSearch
              multiple
              showArrow
              treeNodeFilterProp="title"
              placeholder="请选择招聘部门"
              style={{ width: 254 }}
            >
              {renderUserTreeNodes(departmentList)}
            </TreeSelect>
          </Form.Item>
        );
      case '面试官':
        return (
          <Form.Item key={name} name="interviewer_id" label={show ? '面试官' : ''}>
            <Select
              mode="multiple"
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择面试官"
              showSearch
              showArrow
              optionFilterProp="children"
            >
              {interviewerList.map((item) => {
                return (
                  <Option key={item.interviewer_id} value={item.interviewer_id}>
                    {item.interviewer_name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '标签':
        return (
          <Form.Item key={name} name="label_name" label={show ? '标签' : ''}>
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择标签"
              showSearch
              showArrow
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {tagList.map((item) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '招聘渠道':
        return (
          <Form.Item key={name} name="recruitment_channels_id" label={show ? '招聘渠道' : ''}>
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择招聘渠道"
              showSearch
              showArrow
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {channelsList.map((item) => {
                return (
                  <Option key={item.recruitment_channels_id} value={item.recruitment_channels_id}>
                    <Tooltip placement="left" title={item.channels_name}>
                      {item.channels_name}
                    </Tooltip>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '职位负责人':
        return (
          <Form.Item key={name} name="recruitment_director_id" label={show ? '职位负责人' : ''}>
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择职位负责人"
              showSearch
              showArrow
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operatorList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '性别':
        return (
          <Form.Item key={name} name="sex" label={show ? '性别' : ''}>
            <Select
              mode="multiple"
              placeholder="请选择性别"
              allowClear={true}
              showArrow
              style={{ width: 254 }}
            >
              <Option value={1} key={1}>
                男
              </Option>
              <Option value={2} key={2}>
                女
              </Option>
              <Option value={3} key={3}>
                未知
              </Option>
            </Select>
          </Form.Item>
        );
      case '年龄':
        return (
          <Form.Item key={name} label={show ? '年龄' : ''}>
            <div className="flex_between" style={{ width: 254 }}>
              <Input
                placeholder="请输入年龄"
                type="number"
                style={{ width: 'auto' }}
                min={0}
                value={ageNum[0]}
                onChange={(e) => {
                  onChangeAge(e.target.value, 0);
                }}
                autoComplete="off"
                allowClear
              />
              <span style={{ margin: '0 5px' }}>-</span>
              <Input
                placeholder="请输入年龄"
                type="number"
                allowClear
                autoComplete="off"
                style={{ width: 'auto' }}
                min={ageNum[0] || 0}
                value={ageNum[1]}
                onChange={(e) => {
                  onChangeAge(e.target.value, 1);
                }}
              />
            </div>
          </Form.Item>
        );
      case '工作经验':
        return (
          <Form.Item key={name} name="work_num" label={show ? '工作经验' : ''}>
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
              {/* {WORK_NUM_LIST.map((item, index) => {
                return (
                  <Option key={item} value={index}>
                    {item}
                  </Option>
                );
              })} */}
            </Select>
          </Form.Item>
        );
      case '学历':
        return (
          <Form.Item key={name} name="education" label={show ? '学历' : ''}>
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择学历"
              showSearch
              showArrow
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              mode="multiple"
              onDropdownVisibleChange={(e) => {
                setExpand(e);
              }}
            >
              {educationList.map((item) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '毕业院校':
        return (
          <Form.Item key={name} name="graduate" label={show ? '毕业院校' : ''}>
            <Input
              placeholder="请输入毕业院校"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case '毕业专业':
        return (
          <Form.Item key={name} name="major" label={show ? '毕业专业' : ''}>
            <Input placeholder="请输入专业" style={{ width: 254 }} allowClear autoComplete="off" />
          </Form.Item>
        );
      case '工作单位':
        return (
          <Form.Item key={name} name="work_place" label={show ? '工作单位' : ''}>
            <Input
              placeholder="请输入工作单位"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
        );
      case '背景调查':
        return (
          <Form.Item key={name} name="is_investigation" label={show ? '背景调查' : ''}>
            <Select
              mode="multiple"
              placeholder="请选择背景调查"
              allowClear={true}
              style={{ width: 254 }}
              showArrow
            >
              <Option value={1} key={1}>
                已背调
              </Option>
              <Option value={2} key={2}>
                未背调
              </Option>
            </Select>
          </Form.Item>
        );
      case '应聘登记表':
        return (
          <Form.Item key={name} name="is_send_registration" label={show ? '应聘登记表' : ''}>
            <Select
              mode="multiple"
              placeholder="请选择应聘登记表"
              allowClear={true}
              showArrow
              style={{ width: 254 }}
            >
              <Option value={1} key={1}>
                已发送
              </Option>
              <Option value={2} key={2}>
                未发送
              </Option>
              <Option value={3} key={3}>
                已填写
              </Option>
            </Select>
          </Form.Item>
        );
      case '面试方式':
        return (
          <Form.Item key={name} name="interview_mode" label={show ? '面试方式' : ''}>
            <Select
              mode="multiple"
              placeholder="请选择面试方式"
              allowClear={true}
              showArrow
              style={{ width: 254 }}
            >
              <Option value={1} key={1}>
                现场面试
              </Option>
              <Option value={2} key={2}>
                电话面试
              </Option>
              <Option value={3} key={3}>
                视频面试
              </Option>
            </Select>
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
      case '驾照类型':
        return (
          <Form.Item key={name} name="drive_type" label={show ? '驾照类型' : ''}>
            <Select placeholder="请选择驾照类型" allowClear={true} style={{ width: 254 }} showArrow>
              {driveType.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '驾龄':
        return (
          <Form.Item key={name} name="drive_num" label={show ? '驾龄' : ''}>
            <Select placeholder="请选择驾龄" allowClear={true} showArrow style={{ width: 254 }}>
              <option value={0} key={0}>
                全部
              </option>
              {driveNum.map((item) => {
                return (
                  <option value={Object.keys(item)[0]} key={Object.keys(item)[0]}>
                    {item[Object.keys(item)[0]]}
                  </option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case '变更时间':
        return (
          <Form.Item key={name} name="current_status_time" label={show ? '变更时间' : ''}>
            <RangePicker style={{ width: 254 }} />
          </Form.Item>
        );
      case '来源列表':
        return (
          <Form.Item key={name} name="terminal" label={show ? '来源列表' : ''}>
            <Select
              mode="multiple"
              style={{ width: 254 }}
              placeholder="请选择来源列表"
              allowClear
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onDropdownVisibleChange={handleChange}
            >
              {sourceInfo.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.description}
                </option>
              ))}
            </Select>
          </Form.Item>
        );
      case '添加时间':
        return (
          <Form.Item key={name} name="create_time" label={show ? '添加时间' : ''}>
            <RangePicker style={{ width: 254 }} />
          </Form.Item>
        );
      case '测评':
        return (
          <Form.Item key={name} name="access_status" label={show ? '测评' : ''}>
            <Select
              mode="multiple"
              placeholder="请选择测评"
              allowClear={true}
              showArrow
              style={{ width: 254 }}
            >
              <Option value={1} key={1}>
                未测评
              </Option>
              <Option value={2} key={2}>
                待授权
              </Option>
              <Option value={3} key={3}>
                测评中
              </Option>
              <Option value={4} key={4}>
                已完成
              </Option>
            </Select>
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
            const arr = item.indexOf(',') > -1 && item.split(',');
            return getSearchContent(arr[1], true);
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
          colon={false}
          values={queryData}
          onValuesChange={onValuesChangeHandler}
        >
          <div className={style.queryContainer}>
            {searchList1.map((item) => {
              const arr = item.indexOf(',') > -1 && item.split(',');
              return getSearchContent(arr[1]);
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
          <CumtomSearchModal ref={cumtomRef} refresh={getCustomSearch} checkedList={searchList} />
        </Form>
      </div>
    </Card>
  );
};

// const mapStateToProps = ({
//   Candidate: { queryData },
//   global: {
//     positionList,
//     departmentList,
//     channelsList,
//     educationList,
//     tagList,
//     operatorList,
//     interviewerList,
//   },
// }) => {
//   return {
//     queryData,
//     positionList,
//     departmentList,
//     channelsList,
//     educationList,
//     tagList,
//     operatorList,
//     interviewerList,
//   };
// };

export default QueryData;
