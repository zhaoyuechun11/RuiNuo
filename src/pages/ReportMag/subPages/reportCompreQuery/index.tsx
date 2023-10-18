import React, { useEffect, useRef, useState } from 'react';
import { Form, DatePicker, Select, Input, Row, Col, Button, Popover, Table, Checkbox } from 'antd';
import { useSelector } from 'umi';

const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;
import {
  reportUnitList,
  dictList,
  reportUnitReqItem,
  getHospitalList,
  getDoctorList,
  majorGroup,
} from '@/models/server';
import RightContent from '../reportReview/commones/rightContent';
import s from '../reportReview/index.less';
import ResultTable from './commones/resultTable';
import QueryData from './commones/QueryData';
const ReportCompreQuery = () => {
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();
  const [reportUnit, setReportUnit] = useState([]);
  const { useDetail } = useSelector((state: any) => state.global);
  const [sex, setSex] = useState([]);
  const [reportUnitReqItemList, setReportUnitReqItemList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [sampleSource, setSampleSource] = useState([]);
  const [sampleTypeList, setSampleTypeList] = useState([]);
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [list, setList] = useState([
    {
      id: 1,
      fieldH1: 'A04',
      fieldH3: '002',
      fieldH4: '测试',
      fieldH5: '61183d0:液氨球罐液位、压力是否按时巡检。',
      fieldH6: 'test',
      fieldH7: '危险源002',
      content: [
        {
          id: '016d200dbbf79b',
          name: '环保检查3',
        },
        {
          id: '100c2',
          name: '液氨球罐液位、压力是否按时巡检。',
        },
        {
          id: '27c4668',
          name: '环保检查2',
        },
      ],
    },
    {
      id: 2,
      fieldH1: 'F4',
      fieldH3: '002',
      fieldH4: '测试',
      fieldH5: 'ebec9a743d0:液氨球罐液位、压力是否按时巡检。',
      fieldH6: 'test',
      fieldH7: '危险源002',
      content: [
        {
          id: '016d5af79b',
          name: '环保检查3',
        },
        {
          id: '106c2',
          name: '液氨球罐液位、压力是否按时巡检。',
        },
      ],
    },
  ]);
  const modalResultTable = useRef();
  useEffect(() => {
    getReportUnitList();
    getDictList({ type: 'SX' });
    getDictList({ type: 'DP' });
    getDictList({ type: 'FT' });
    getDictList({ type: 'BT' });
    hospital();
    majorGroupList();
  }, []);
  // const columns = [
  //   {
  //     title: '报告单元',
  //     dataIndex: 'name',
  //     fixed: 'left',
  //   },
  //   {
  //     title: '姓名',
  //     dataIndex: 'age',
  //   },
  //   {
  //     title: '性别',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '年龄',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '报告日期',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '样本号',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '样本条码',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '送检单位',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '送检医生',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '送检科室',
  //     dataIndex: 'address',
  //   },
  //   {
  //     title: '采样时间',
  //     dataIndex: 'address',
  //     width: 200,
  //   },
  //   {
  //     title: '前处理签收时间',
  //     dataIndex: 'address',
  //     width: 200,
  //   },
  //   {
  //     title: '操作',
  //     key: 'operation',
  //     fixed: 'right',
  //     width: 100,
  //     render: () => <a>申请单</a>,
  //   },
  // ];
  const columns = [
    {
      title: '报告单元',
      dataIndex: 'name',
      fixed: 'left',
    },
  ];
  const searchHandle = () => {};

  const labDateChange = (value: any, dateString: any) => {};

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
  const getDictList = (type) => {
    dictList(type).then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        if (type.type === 'SX') {
          setSex(res.data);
        }
        if (type.type === 'DP') {
          setDepartment(res.data);
        }
        if (type.type === 'FT') {
          setSampleSource(res.data);
        }
        if (type.type === 'BT') {
          setSampleTypeList(res.data);
        }
      }
    });
  };
  const getDoctorListData = (id) => {
    getDoctorList({ hospitalId: id }).then(
      (res: { code: number; data: React.SetStateAction<never[]> }) => {
        if (res.code === 200) {
          setDoctorList(res.data);
        }
      },
    );
  };
  const hospitalChange = (e: any) => {
    if (e) {
      getDoctorListData(e);
    }
  };
  const getReportUnitReqItem = (reportUnitId: any) => {
    reportUnitReqItem({ reportUnitId }).then((res) => {
      if (res.code === 200) {
        setReportUnitReqItemList(res.data);
      }
    });
  };
  const reportUnitChange = (e: any, option: any) => {
    if (e) {
      getReportUnitReqItem(option.key);
    }
  };
  const hospital = () => {
    getHospitalList().then((res: { code: number; data: React.SetStateAction<never[]> }) => {
      if (res.code === 200) {
        setHospitalList(res.data);
      }
    });
  };
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const seach = () => {};
  const reset = () => {
    form.resetFields();
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
      <div>
        <div>
          <Form form={extendForm} layout="vertical">
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入收样条码" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入诊断建议" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="source">
                  <Select placeholder="请选择病人类型" allowClear>
                    {sampleSource?.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.dictValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="defaultSampleTypeId">
                  <Select placeholder="请选择样本类型" allowClear>
                    {sampleTypeList.map((item) => {
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
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入病人代号" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入临床诊断" />
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
              <Col span={6}>
                <Form.Item name="labClassId">
                  <Select placeholder="请选择纸张类型" allowClear>
                    {/* {majorGroupData.length > 0 &&
                      majorGroupData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.className}
                        </Option>
                      ))} */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="patientNo">
                  <Input placeholder="请输入门诊/住院号" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入电话号码" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sampleBarcode">
                  <Input placeholder="请输入床号" />
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
  // const renderForm = () => {
  //   return (
  //     <Form form={form} onValuesChange={searchHandle}>
  //       <Row gutter={12}>
  //         <Col span={6}>
  //           <Form.Item name="labDate">
  //             <RangePicker
  //               showTime={{ format: 'HH:mm' }}
  //               format="YYYY-MM-DD HH:mm"
  //               placeholder={['前处理接收开始时间', '前处理接收结束时间']}
  //               onChange={labDateChange}
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item name="reportUnitCode">
  //             <Select allowClear onChange={reportUnitChange} placeholder="报告单元">
  //               {reportUnit?.map((item) => {
  //                 return (
  //                   <Option value={item.reportUnitCode} key={item.id}>
  //                     {item.reportUnitName}
  //                   </Option>
  //                 );
  //               })}
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <InputGroup>
  //             <Row gutter={8}>
  //               <Col span={12}>
  //                 <Form.Item name="sampleBarcode">
  //                   <Input placeholder="请输入姓名" />
  //                 </Form.Item>
  //               </Col>
  //               <Col span={12}>
  //                 <Form.Item name="sex">
  //                   <Select placeholder="请选择性别" allowClear>
  //                     {sex.map((item) => {
  //                       return (
  //                         <Option value={item.id} key={item.id}>
  //                           {item.dictValue}
  //                         </Option>
  //                       );
  //                     })}
  //                   </Select>
  //                 </Form.Item>
  //               </Col>
  //             </Row>
  //           </InputGroup>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item name="reqItemIds">
  //             <Select
  //               allowClear
  //               // onChange={checkChange}
  //               placeholder="检验目的"
  //               mode="multiple"
  //             >
  //               {reportUnitReqItemList?.map((item) => {
  //                 return (
  //                   <Option value={item.id} key={item.id}>
  //                     {item.reqItemName}
  //                   </Option>
  //                 );
  //               })}
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //       <Row gutter={12}>
  //         <Col span={6}>
  //           <Form.Item name="labDate">
  //             <RangePicker
  //               showTime={{ format: 'HH:mm' }}
  //               format="YYYY-MM-DD HH:mm"
  //               placeholder={['检验日期开始时间', '检验日期结束时间']}
  //               onChange={labDateChange}
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item name="sampleBarcode">
  //             <Input placeholder="请输入样本条码" />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item name="hospitalId">
  //             <Select placeholder="请选择送检单位" allowClear onChange={hospitalChange}>
  //               {hospitalList?.map(
  //                 (
  //                   item: {
  //                     id: any;
  //                     hospitalName: any;
  //                   },
  //                   index: React.Key | null | undefined,
  //                 ) => (
  //                   <Option value={item.id} key={index}>
  //                     {item.hospitalName}
  //                   </Option>
  //                 ),
  //               )}
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Row gutter={8}>
  //             <Col span={6}>
  //               <Form.Item name="hospitalId">
  //                 <Select placeholder="请选择报告状态" allowClear>
  //                   {/* {hospitalList?.map(
  //                     (
  //                       item: {
  //                         id: any;
  //                         hospitalName: any;
  //                       },
  //                       index: React.Key | null | undefined,
  //                     ) => (
  //                       <Option value={item.id} key={index}>
  //                         {item.hospitalName}
  //                       </Option>
  //                     ),
  //                   )} */}
  //                 </Select>
  //               </Form.Item>
  //             </Col>
  //             <Col span={18}>
  //               <Checkbox.Group style={{ width: '100%' }}>
  //                 <Row>
  //                   <Col span={7}>
  //                     <Checkbox value="A">急诊</Checkbox>
  //                   </Col>
  //                   <Col span={9}>
  //                     <Checkbox value="B">超周期</Checkbox>
  //                   </Col>
  //                   <Col span={8}>
  //                     <Checkbox value="C">复查</Checkbox>
  //                   </Col>
  //                 </Row>
  //               </Checkbox.Group>
  //             </Col>
  //           </Row>
  //         </Col>
  //       </Row>
  //       <Row gutter={12}>
  //         <Col span={6}>
  //           <Form.Item name="labDate">
  //             <RangePicker
  //               showTime={{ format: 'HH:mm' }}
  //               format="YYYY-MM-DD HH:mm"
  //               placeholder={['审核开始时间', '审核结束时间']}
  //               onChange={labDateChange}
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item name="sampleBarcode">
  //             <Input placeholder="请输入样本编号" />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Row gutter={8}>
  //             <Col span={12}>
  //               {' '}
  //               <Form.Item name="sendDeptId">
  //                 <Select placeholder="请选择送检科室" allowClear>
  //                   {department.map(
  //                     (item: { id: React.Key | null | undefined; dictValue: any }) => {
  //                       return (
  //                         <Option value={item.id} key={item.id}>
  //                           {item.dictValue}
  //                         </Option>
  //                       );
  //                     },
  //                   )}
  //                 </Select>
  //               </Form.Item>
  //             </Col>
  //             <Col span={12}>
  //               <Form.Item name="sendDoctorId">
  //                 <Select placeholder="请选择送检医生" allowClear>
  //                   {doctorList?.map(
  //                     (
  //                       item: {
  //                         id: any;
  //                         name: any;
  //                       },
  //                       index: React.Key | null | undefined,
  //                     ) => (
  //                       <Option value={item.id} key={index}>
  //                         {item.name}
  //                       </Option>
  //                     ),
  //                   )}
  //                 </Select>
  //               </Form.Item>
  //             </Col>
  //           </Row>
  //         </Col>
  //         <Col span={6}>
  //           <Button type="primary" onClick={seach} size="small">
  //             查询
  //           </Button>
  //           <Button type="primary" onClick={reset} size="small" style={{ margin: '0 5px' }}>
  //             重置
  //           </Button>
  //           <QueryData />
  //           {/* <Popover
  //             content={popover_content}
  //             placement="bottomRight"
  //             trigger="click"
  //             open={popoverVisible}
  //             onOpenChange={(val) => setPopoverVisible(val)}
  //           >
  //             <Button type="primary" size="small">
  //               扩展
  //             </Button>
  //           </Popover> */}
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // };
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        colSpan: 0,
        render: () => {
          return { props: { colSpan: 0 } };
        },
      },
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => `${index + 1}`,
      },
      { title: '排查内容', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <div>
            <a>编辑</a>
            <a>删除</a>
          </div>
        ),
      },
    ];

    return <Table columns={columns} dataSource={record.children} />;
  };
  const onExpandedRowsChange = (record) => {
    debugger;
  };
  const onExpand = (expanded, record) => {
    let result = list.map((item) => {
      if (item.id === record.id) {
        return {
          children: [
            {
              id: '016d5af79b',
              name: '环保检查3',
            },
          ],
          ...item,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setList(result);
  };
  return (
    <>
      <QueryData />

      <Row gutter={12}>
        <Col span={12} className={s.col_01}>
          {/* <Button type="primary" size="small">
            打印
          </Button>
          <Button type="primary" size="small" style={{ margin: '5px' }}>
            导出PDF
          </Button> */}

          <Button
            type="primary"
            size="small"
            onClick={() => modalResultTable.current.show()}
            style={{ margin: '0px 0px 5px 0px' }}
          >
            导出结果表
          </Button>
          {/* <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={[]}
            size="small"
            scroll={{ x: 1300 }}
          /> */}
          <Table
            dataSource={list}
            rowKey={(record) => record.id}
            onExpand={(expanded, record) => onExpand(expanded, record)}
            onExpandedRowsChange={(record) => onExpandedRowsChange(record)}
            expandedRowRender={(record) => expandedRowRender(record)}
            columns={[
              { dataIndex: 'id', title: 'id', sorter: true, width: 200, key: 'id' },
              { dataIndex: 'fieldH1', title: '名称1', sorter: true, width: 200, key: 'fieldH1' },
              { dataIndex: 'fieldH2', title: '名称2', sorter: true, width: 200, key: 'fieldH2' },
              { dataIndex: 'fieldH3', title: '名称3', sorter: true, width: 200, key: 'fieldH3' },
              { dataIndex: 'fieldH4', title: '名称4', sorter: true, width: 200, key: 'fieldH4' },
              { dataIndex: 'fieldH7', title: '名称5', sorter: true, width: 200, key: 'fieldH7' },
              {
                title: '操作',
                key: 'operation',
                render: () => (
                  <div>
                    <a>编辑</a>
                    <a>删除</a>
                  </div>
                ),
              },
            ]}
            size="small"
          />
        </Col>
        <Col span={12} className={s.col_02}>
          <RightContent />
        </Col>
      </Row>
      <ResultTable Ref={modalResultTable} />
    </>
  );
};
export default ReportCompreQuery;
