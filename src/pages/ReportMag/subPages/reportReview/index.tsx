import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Select, Input, Row, Col, Button, Popover, Table } from 'antd';
import { useSelector } from 'umi';
import {
  getHospitalList,
  dictList,
  getDoctorList,
  reportUnitReqItem,
  reportUnitList,
  reportUnitInstr,
  listByReportUnit,
} from '@/models/server';
import styles from './index.less';
import RightContent from './commones/rightContent';

const { Option } = Select;
const ReportReview = () => {
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();
  const [hospitalList, setHospitalList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [reportUnit, setReportUnit] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  useEffect(() => {
    hospital();
    getDictList({ type: 'DP' });
    getReportUnitList();
  }, []);
  const columns = [
    {
      title: '样本条码',
      dataIndex: 'name',
    },
    {
      title: '报告单元',
      dataIndex: 'age',
    },
    {
      title: '检验仪器',
      dataIndex: 'address',
    },
    {
      title: '检验日期',
      dataIndex: 'address',
    },
    {
      title: '样本号',
      dataIndex: 'address',
    },
    {
      title: '姓名',
      dataIndex: 'address',
    },
    {
      title: '性别',
      dataIndex: 'address',
    },
    {
      title: '年龄',
      dataIndex: 'address',
    },
  ];
  const searchHandle = () => {};
  const seach = () => {};
  const reset = () => {
    form.resetFields();
  };
  const extend = () => {};
  const getDoctorListData = (id) => {
    getDoctorList({ hospitalId: id }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setDoctorList(res.data);
        }
      },
    );
  };
  const hospital = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospitalList(res.data);
        getDoctorListData(res.data[0].id);
      }
    });
  };
  const getDictList = (type) => {
    dictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'DP') {
          setDepartment(res.data);
        }
      }
    });
  };
  const getReportUnitList = () => {
    reportUnitList({ userId: useDetail.id }).then((res) => {
      if (res.code === 200) {
        setReportUnit(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form form={form} layout="inline" onValuesChange={searchHandle}>
        <Form.Item name="labDate">
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="请选择检验日期"
            style={{ width: 120, marginBottom: '15px' }}
          />
        </Form.Item>
        <Form.Item name="execBy">
          <Select allowClear placeholder="检验技师" style={{ width: 120 }}>
            {/* {personList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>

        <Form.Item name="reportUnitCode">
          <Select
            allowClear
            // onChange={reportUnitChange}
            placeholder="报告单元"
            style={{ width: 120 }}
          >
            {reportUnit?.map((item) => {
              return (
                <Option value={item.reportUnitCode} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="reqItemIds">
          <Select
            allowClear
            // onChange={checkChange}
            placeholder="审核状态"
            mode="multiple"
            style={{ width: 120 }}
          >
            {/* {reportUnitReqItemList?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reqItemName}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  const hospitalChange = (e: any) => {
    if (e) {
      getDoctorListData(e);
    }
  };
  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const popover_content = () => {
    return (
      <div className={styles.popover_content}>
        <div className={styles.popover_form}>
          <Form form={extendForm} layout="vertical">
            <Row>
              <Col span={7}>
                <Form.Item name="hospitalId" label="送检单位">
                  <Select placeholder="请选择送检单位" allowClear onChange={hospitalChange}>
                    {hospitalList?.map(
                      (
                        item: {
                          id: any;
                          hospitalName:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <Option value={item.id} key={index}>
                          {item.hospitalName}
                        </Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item name="sendDeptId" label="送检科室">
                  <Select placeholder="请选择送检科室" allowClear>
                    {department.map(
                      (item: {
                        id: React.Key | null | undefined;
                        dictValue:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                      }) => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.dictValue}
                          </Option>
                        );
                      },
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item name="sendDoctorId" label="送检医生">
                  <Select placeholder="请选择送检医生" allowClear>
                    {doctorList?.map(
                      (
                        item: {
                          id: any;
                          name:any
                           
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Form.Item name="sampleBarcode" label="样本条码号">
                  <Input placeholder="请输入样本条码号" />
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item name="sampleBarcode" label="样本编码">
                  <Input placeholder="请输入样本编码" />
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item name="patientName" label="病人姓名">
                  <Input placeholder="请输入病人姓名" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            <Button
              type="primary"
              style={{ marginRight: 12 }}
              onClick={() => {
                // tapClear();
              }}
            >
              清空
            </Button>
            <Button
              type="primary"
              onClick={() => {
                // setPopoverVisible(false);
                // handleQuery();
              }}
            >
              查询
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Row>
        <Col span={12} className={styles.col_01}>
          <Row>
            <Col span={12}>{renderForm()}</Col>
            <Col span={1}>
              <Button type="primary" onClick={seach} size="small">
                查询
              </Button>
              <Button type="primary" onClick={reset} size="small" style={{ margin: '5px 0' }}>
                重置
              </Button>
              <Popover
                content={popover_content}
                placement="bottomRight"
                trigger="click"
                open={popoverVisible}
                onOpenChange={(val) => setPopoverVisible(val)}
              >
                <Button type="primary" onClick={extend} size="small">
                  扩展
                </Button>
              </Popover>
            </Col>
          </Row>
          <Button type="primary" size="small">
            初审
          </Button>
          <Button type="primary" size="small" style={{ margin: '5px' }}>
            解除初审
          </Button>

          <Button type="primary" onClick={extend} size="small">
            终审
          </Button>
          <Button type="primary" size="small" style={{ margin: '5px' }}>
            解除终审
          </Button>
          <Table rowSelection={rowSelection} columns={columns} dataSource={[]} size="small" />
        </Col>
        <Col span={12} className={styles.col_02}>
          <RightContent />
        </Col>
      </Row>
    </>
  );
};
export default ReportReview;
