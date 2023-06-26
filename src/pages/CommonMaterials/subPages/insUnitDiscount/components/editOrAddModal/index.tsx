import React, { useImperativeHandle, useRef, useState } from 'react';
import { Dialog } from '@components';
import {
  Form,
  Input,
  message,
  Select,
  InputNumber,
  Tooltip,
  Switch,
  Transfer,
  Row,
  Col,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  oneLevelTypeModalSel,
  majorGroup,
  getBindsList,
  insUnitDiscountAdd,
  insUnitDiscountUpdate,
} from '../../../../models/server';
const layout = {
  labelCol: { span: 8 },
};
const { Option } = Select;

const EditOrAddModal = ({ Ref, refresh, hospitalList }) => {
  const dialogRef = useRef();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [bindList, setBindList] = useState([]);
  const [dictList, setDictList] = useState([]);
  const [majorGroupList, setMajorGroupList] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [isDisableVal, setDisableVal] = useState(false);
  const [hospitalName, setHospitalName] = useState([]);

  useImperativeHandle(Ref, () => ({
    show: async (record: { id: React.SetStateAction<undefined> }) => {
      dialogRef.current && dialogRef.current.show();
      dictDataList();
      getMajorGroup();
      getBindsDataList('');
      form && form.resetFields();
      setDisableVal(false);
      if (record) {
        form.setFieldsValue({
          ...record,
          hospitalIds: record.hospitalId,
        });

        setId(record.id);
        setDisableVal(record.isDisable);
        setHospitalName(record.hospitalId);
      } else {
        setId(null);
        setHospitalName([]);
        form.setFieldsValue({
          hospitalIds: [],
        });
      }
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const onOk = () => {
    form.validateFields().then((value) => {
      if (id) {
        const { isDisable, returnTypeId, saleCosts, seq, salePrice, contractPrice } = value;
        insUnitDiscountUpdate({
          id,
          isDisable,
          returnTypeId,
          saleCosts,
          seq,
          salePrice,
          contractPrice,
        }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('修改成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      } else {
        insUnitDiscountAdd({ ...value, reqItemIds: targetKeys }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('添加成功');
            dialogRef.current && dialogRef.current.hide();
            refresh();
          }
        });
      }
    });
  };

  const dictDataList = () => {
    oneLevelTypeModalSel({ type: 'PM' }).then((res) => {
      if (res.code === 200) {
        setDictList(res.data);
      }
    });
  };
  const getMajorGroup = () => {
    majorGroup().then((res) => {
      if (res.code === 200) {
        setMajorGroupList(res.data);
      }
    });
  };
  const getBindsDataList = (val) => {
    getBindsList({ labClassId: val }).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return { ...item, key: item.id };
        });
        setBindList(result);
      }
    });
  };
  const majorGroupChange = (e) => {
    getBindsDataList(e);
  };
  const hospitalChange = (e, option) => {
    if (e.length === 1 && Object.keys(option[0]).length !== 0) {
      const { priceRate } = option[0].searchData;
      form.setFieldsValue({ contractRate: priceRate });
    } else {
      form.setFieldsValue({ contractRate: '' });
    }
  };
  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };
  const handleChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  };
  const isDisableChange = (e) => {
    setDisableVal(e);
  };
  const filterOption = (inputValue, option) => option.reqItemName.indexOf(inputValue) > -1;
  // const onInputKeyDownPosition = (e) => {
  //   form.setFieldsValue({
  //     position_name: e.target.value,
  //   });
  // };
  const contractRriceChange = (e) => {
    const result = e / form.getFieldValue('salePrice');
    const netAmount = e - form.getFieldValue('saleCosts');
    form.setFieldsValue({ contractRate: result, netAmount });
  };
  const salesQuotationChange = (e) => {
    const result = e / form.getFieldValue('standardPrice');

    form.setFieldsValue({ saleRate: result });
  };
  return (
    <Dialog
      ref={dialogRef}
      width={740}
      title={id ? '编辑' : '新增'}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      className={styles.dialogWap}
      //   confirmLoading={submitLoading}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label={<div>单位名称</div>}
          name="hospitalIds"
          rules={[{ required: true, message: '请选择单位名称' }]}
          labelCol={{ span: 3 }}
        >
          <Select
            placeholder="请选择单位名称"
            allowClear
            mode="multiple"
            defaultValue={hospitalName}
            disabled={id ? true : false}
            showSearch
            // onInputKeyDown={onInputKeyDownPosition}
            optionFilterProp="searchData"
            filterOption={(input, option) =>
              option.searchData?.hospitalName.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            // filterSort={(optionA, optionB) =>
            //   optionA.searchData?.toLowerCase().localeCompare(optionB.searchData.toLowerCase())
            // }
            onChange={hospitalChange}
          >
            {hospitalList.map((item) => {
              return (
                <Option value={item.id} key={item.id} searchData={item}>
                  {item.hospitalName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {id && (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="contractPrice" label="合同价格" labelCol={{ span: 7 }}>
                  <InputNumber
                    className={styles.number}
                    onChange={contractRriceChange}
                    precision={2}
                  ></InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="salePrice" label="销售报价">
                  <InputNumber
                    className={styles.number}
                    onChange={salesQuotationChange}
                    precision={2}
                  ></InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="contractRate" label="合同价扣率" labelCol={{ span: 7 }}>
              <InputNumber className={styles.number} disabled={id ? true : false}></InputNumber>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="saleRate"
              label={
                <>
                  销售报价扣率
                  <Tooltip title="标准价折数" placement="top" arrowPointAtCenter={true}>
                    <ExclamationCircleOutlined
                      style={{
                        color: '#007BFF',
                        marginLeft: 5,
                        fontSize: '13px',
                        cursor: 'pointer',
                        lineHeight: '35px',
                      }}
                    />
                  </Tooltip>
                </>
              }
            >
              <InputNumber
                className={styles.number}
                disabled={id ? true : false}
                defaultValue={1}
              ></InputNumber>
            </Form.Item>
          </Col>
        </Row>
        {id && (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="reqItemCode" label="申请项目编码" labelCol={{ span: 7 }}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="standardPrice" label="标准价格">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="reqItemName" label="申请项目名称" labelCol={{ span: 7 }}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="netAmount" label="净额">
                  <InputNumber className={styles.number} disabled></InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="启用" name="isDisable" labelCol={{ span: 7 }}>
              <Switch checked={isDisableVal} onChange={isDisableChange}></Switch>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="saleCosts" label="销售成本">
              <InputNumber className={styles.number}></InputNumber>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="回款类别"
          name="returnTypeId"
          rules={[{ required: true, message: '请选择回款类别' }]}
          labelCol={{ span: 3 }}
        >
          <Select placeholder="请选择回款类别" autoComplete="off" allowClear>
            {dictList?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.dictValue}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        {!id && (
          <Form.Item label="项目类别" name="reqItemIds" labelCol={{ span: 3 }}>
            <Select
              placeholder="请选择项目类别"
              autoComplete="off"
              allowClear
              onChange={majorGroupChange}
            >
              {majorGroupList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.className}
                  </Option>
                );
              })}
            </Select>
            <Transfer
              style={{ marginTop: '10px' }}
              dataSource={bindList}
              onSearch={handleSearch}
              showSearch
              onChange={handleChange}
              filterOption={filterOption}
              targetKeys={targetKeys}
              render={(item) => item.reqItemName}
              listStyle={{
                width: 250,
                height: 300,
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Dialog>
  );
};
export default EditOrAddModal;
