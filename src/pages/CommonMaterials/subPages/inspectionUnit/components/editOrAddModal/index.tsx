import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import { Form, Input, message, Select, Cascader, Row, Col } from 'antd';
import {
  addHospital,
  updateHospital,
  oneLevelTypeModalSel,
  getUserList,
  getArea,
} from '../../../../models/server';
const { Option } = Select;
const EditOrAddModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [hospitalLevelList, setHospitalLevelList] = useState();
  const [returnTypeList, setReturnTypeList] = useState([]);
  const [id, setId] = useState();
  const [provinceList, setProvinceList] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: async (record) => {
      await List('JZJLB');
      await List('YYLB');
      await List('PM');
      userListData();
      getAreaList();

      dialogRef.current && dialogRef.current.show();
      if (record) {
        let area;
        if (record.provinceId && record.cityId && record.areaId) {
          area = [record?.provinceId, record?.cityId, record?.areaId];
        } else if (record.provinceId && record.cityId) {
          area = [record.provinceId, record.cityId];
        } else if (record.provinceId) {
          area = [record.provinceId];
        }
        form.setFieldsValue({ ...record, areaId: area });
        setId(record.id);
      } else {
        setId(null);
        form && form.resetFields();
      }
    },

    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      debugger;
      if (id) {
        updateHospital({
          id: id,
          ...value,
          provinceId: value.areaId ? value.areaId[0] : value.areaId,
          cityId: value.areaId ? value.areaId[1] : value.areaId,
          areaId: value.areaId ? value.areaId[2] : value.areaId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        addHospital({
          ...value,
          provinceId: value.areaId ? value.areaId[0] : value.areaId,
          cityId: value.areaId ? value.areaId[1] : value.areaId,
          areaId: value.areaId ? value.areaId[2] : value.areaId,
        }).then((res) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const List = (type) => {
    oneLevelTypeModalSel({ type }).then((res) => {
      if (res.code === 200) {
        if (type === 'JZJLB') {
          setList(res.data);
        } else if (type === 'YYLB') {
          setHospitalLevelList(res.data);
        } else if (type === 'PM') {
          setReturnTypeList(res.data);
        }
      }
    });
  };
  const userListData = () => {
    getUserList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data);
      }
    });
  };
  const getAreaList = () => {
    getArea().then((res) => {
      if (res.code === 200) {
        setProvinceList(res.data);
      }
    });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={864}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
    >
      <Form form={form} layout={'vertical'} style={{ padding: '20px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="hospitalType" label="送检单位类别">
              <Select placeholder="请选择送检单位类别" allowClear>
                <Option value={`1`} key={1}>
                  送检单位
                </Option>
                <Option value={`2`} key={2}>
                  委托检验单位
                </Option>
                <Option value={`3`} key={3}>
                  诊断单位
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="hospitalCode" label="送检单位编码">
              <Input placeholder="请输入送检单位编码" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="hospitalName" label="送检单位名称">
              <Input placeholder="请输入送检单位名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="barcodePreCode" label="收样条码打印前缀">
              <Input placeholder="请输入收样条码打印前缀" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="shortName" label="简称">
              <Input placeholder="请输入简称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="hospitalLevelId" label="医院级别">
              <Select placeholder="请选择医院级别" allowClear>
                {hospitalLevelList?.map((item) => {
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
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="feeTypeId" label="价格类别">
              <Select placeholder="请选择价格类别" allowClear>
                {list.map((item) => {
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
            <Form.Item name="saleManId" label="销售员">
              <Select placeholder="请选择销售员" allowClear>
                {userList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="returnTypeId" label="回款类型">
              <Select placeholder="请选择回款类型" allowClear>
                {returnTypeList.map((item) => {
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
            <Form.Item name="invoiceHead" label="发票抬头">
              <Input placeholder="请输入发票抬头" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="开户行" name="bankName">
              <Input placeholder="请输入开户行" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开户行帐号" name="bankAccount">
              <Input placeholder="请输入开户行帐号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="taxNo" label="税号">
              <Input placeholder="请输入税号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contractMan" label="联系人">
              <Input maxLength={10} placeholder="请输入联系人" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="telPhoneNo" label="电话">
              <Input maxLength={11} placeholder="请输入电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系地址" name="address">
              <Input placeholder="请输入联系地址" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="areaId" label="地区名称">
              <Cascader
                changeOnSelect
                options={provinceList}
                placeholder="请选择工作地点"
                fieldNames={{ label: 'name', value: 'id', children: 'child' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账期(天为单位)" name="accountPeriod">
              <Input maxLength={10} placeholder="请输入账期(天为单位)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="isDisable" label="是否禁用">
              <Select placeholder="请选择是否禁用" allowClear>
                <Option value={`true`} key={1}>
                  是
                </Option>
                <Option value={`false`} key={2}>
                  否
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="priceRate" label="价格默认扣率">
              <Input placeholder="请输入价格默认扣率" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="interfaceCode" label="接口编码">
              <Input placeholder="请输入接口编码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="financeCode" label="财务系统编码">
              <Input placeholder="请输入财务系统编码" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="条形码长度" name="barcodeLen">
              <Input placeholder="请输入条形码长度" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="barcodeMax" label="条形码最大值">
              <Input placeholder="请输入条形码长度" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
