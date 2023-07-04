import { connect } from 'umi';
import { Dialog, Button } from '@/components';
import { useRef, useImperativeHandle, Fragment, useState } from 'react';
import { Form, Input, Select, Cascader, DatePicker, Tooltip } from 'antd';
const { RangePicker } = DatePicker;
import CumtomSearchModal from '../cumtomSearchModal';
import styles from './index.less';
import { WORK_NUM_LIST } from '@utils/constant';

const Index = ({ channelsList, educationList, operatorList, searchRef, tapQuery }) => {
  const [ageNum, setAgeNum] = useState(['', '']);
  const [provinceList, setProvinceList] = useState([]);
  const [driveType, setDriveType] = useState([]);
  const [driveNum, setDriveNum] = useState([]);
  const [sourceInfo, setSourceInfo] = useState([]);
  const dialogRef = useRef();
  const cumtomRef = useRef();

  useImperativeHandle(searchRef, () => ({
    show: () => {
      dialogRef.current.show();
    },
    hide: () => {
      dialogRef.current.show();
    },
  }));

  const handleChange = (value) => {
    setExpand(value);
  };

  return (
    <Dialog ref={dialogRef} footer={null}>
      <div>
        <Fragment>
          <Form.Item name="recruitment_channels_id" label="招聘渠道">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择招聘渠道"
              showSearch
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onBlur={tapQuery}
              onDeselect={tapQuery}
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
          <Form.Item name="recruitment_director_id" label="职位负责人">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择职位负责人"
              showSearch
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onBlur={tapQuery}
              onDeselect={tapQuery}
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
          <Form.Item name="sex" label="性别">
            <Select
              mode="multiple"
              placeholder="请选择性别"
              allowClear={true}
              style={{ width: 254 }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
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
          <Form.Item label="年龄">
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
          <Form.Item name="work_num" label="工作经验">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择工作经验"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {WORK_NUM_LIST.map((item, index) => {
                return (
                  <Option key={item} value={index}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="education" label="学历">
            <Select
              style={{ width: 254 }}
              allowClear={true}
              placeholder="请选择学历"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              mode="multiple"
              onDropdownVisibleChange={(e) => {
                // let temp = form.getFieldsValue().education;
                //
                setExpand(e);
              }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
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
          <Form.Item name="graduate" label="毕业院校">
            <Input
              placeholder="请输入毕业院校"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item name="major" label="专业">
            <Input placeholder="请输入专业" style={{ width: 254 }} allowClear autoComplete="off" />
          </Form.Item>
          <Form.Item name="work_place" label="工作单位">
            <Input
              placeholder="请输入工作单位"
              style={{ width: 254 }}
              allowClear
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item name="is_investigation" label="背景调查">
            <Select
              mode="multiple"
              placeholder="请选择背景调查"
              allowClear={true}
              style={{ width: 254 }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
            >
              <Option value={1} key={1}>
                已背调
              </Option>
              <Option value={2} key={2}>
                未背调
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="is_send_registration" label="应聘登记表">
            <Select
              mode="multiple"
              placeholder="请选择应聘登记表"
              allowClear={true}
              style={{ width: 254 }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
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

          <Form.Item name="interview_mode" label="面试方式">
            <Select
              mode="multiple"
              placeholder="请选择面试方式"
              allowClear={true}
              style={{ width: 254 }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
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

          <Form.Item name="work_address" label="工作地点">
            <Cascader
              style={{ width: 254 }}
              className={styles.companyAdress}
              options={provinceList}
              placeholder="请选择地址"
              fieldNames={{ label: 'name', value: 'id', children: 'child' }}
            />
          </Form.Item>

          <Form.Item name="drive_type" label="驾照类型">
            <Select placeholder="请选择驾照类型" allowClear={true} style={{ width: 254 }}>
              {driveType.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="drive_num" label="驾龄">
            <Select placeholder="请选择驾龄" allowClear={true} style={{ width: 254 }}>
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
          <Form.Item name="current_status_time" label="变更时间">
            <RangePicker style={{ width: 254 }} />
          </Form.Item>
          <Form.Item name="terminal" label="来源列表">
            <Select
              mode="multiple"
              style={{ width: 254 }}
              placeholder="请选择来源列表"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onDropdownVisibleChange={handleChange}
              onBlur={tapQuery}
              onDeselect={tapQuery}
            >
              {sourceInfo.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.description}
                </option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="create_time" label="添加时间">
            <RangePicker style={{ width: 254 }} />
          </Form.Item>
          <Form.Item name="access_status" label="测评">
            <Select
              mode="multiple"
              placeholder="请选择测评"
              allowClear={true}
              style={{ width: 254 }}
              onBlur={tapQuery}
              onDeselect={tapQuery}
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
        </Fragment>
      </div>
      <CumtomSearchModal ref={cumtomRef} />
    </Dialog>
  );
};

const mapStateToProps = ({
  Candidate: { queryData },
  global: {
    positionList,
    departmentList,
    channelsList,
    educationList,
    tagList,
    operatorList,
    interviewerList,
  },
}) => {
  return {
    queryData,
    positionList,
    departmentList,
    channelsList,
    educationList,
    tagList,
    operatorList,
    interviewerList,
  };
};

export default connect(mapStateToProps)(Index);
