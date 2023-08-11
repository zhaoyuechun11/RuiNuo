import React, { useState, useEffect } from 'react';
// import { Button } from '@/components';
import { Table, Form, DatePicker, Select, Input, Row, Col, Tabs, Button } from 'antd';
import { useDispatch, useSelector } from 'umi';
import moment from 'moment';
import styles from '../index.less';
const { Option } = Select;
const { TabPane } = Tabs;
const RightContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tableHeaderCoumn, setTableHeaderCoumn] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [form] = Form.useForm();
  const { useDetail } = useSelector((state: any) => state.global);
  const [clickRow, setClickRow] = useState();
  var now1 = moment().format('YYYY-MM-DD');

  useEffect(() => {
    form.setFieldsValue({ labDate: moment(now1, 'YYYY-MM-DD') });
    getList({ reportUnitName: 'gg' });
  }, []);
  useEffect(() => {
    if (list.length > 0) {
      // const firstColumm = list.splice(0, 1).map((column) => {
      //   return {
      //     title: column.name,
      //     dataIndex: column.key,
      //     responsive: ['xl', 'xxl'],
      //     align: 'center',
      //     fixed: 'left',
      //     width: 60,
      //     ellipsis: true,
      //     render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      //   };
      // });

      const middleColumns = list.map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          width: 60,
          ellipsis: true,
          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      });
      const lastColumns = {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 90,
        render: (text: string, record: Record<string, any>) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <Button
              onClick={() => {
                // history.push(
                //   '/preProcessingMag/sampleRegistration/addOrEdit/' + record.id + '/' + 'edit',
                // );
              }}
            >
              编辑
            </Button>
            <Button
              onClick={() => {
                // deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button> */}
          </div>
        ),
      };
      const coumns = [...middleColumns];
      setTableHeaderCoumn(coumns);
    }
  }, [list]);

  const getList = (params) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportListTableHeader',
      payload: {
        ...params,
        callback: (res: { code: number; data: React.SetStateAction<never[]> }) => {
          if (res.code === 200) {
            setList(res.data);
          }
        },
      },
    });
  };
  const checkChange = (e) => {};
  const renderForm = () => {
    return (
      <Form form={form} layout="inline">
        <Form.Item name="labDate" rules={[{ required: true, message: '请选择检验日期' }]}>
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="请选择检验日期"
            style={{ width: 120 }}
            // onChange={labDateChange}
          />
        </Form.Item>
        <Form.Item name="reportUnitId">
          <Select allowClear onChange={checkChange} placeholder="请选择检验技师">
            {/* {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>
        <Form.Item name="reportUnitId">
          <Select allowClear onChange={checkChange} placeholder="请选择检验目的">
            {/* {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>
        <Form.Item name="reportUnitId">
          <Select allowClear onChange={checkChange} placeholder="请选择报告单元">
            {/* {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>
        <Form.Item name="reportUnitId">
          <Select allowClear onChange={checkChange} placeholder="请选择检验仪器">
            {/* {reportUnitList.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.reportUnitName}
                </Option>
              );
            })} */}
          </Select>
        </Form.Item>
        <Form.Item name="sampleBarcode">
          <Input placeholder="请输入项目编号名称" style={{ width: 140 }} />
        </Form.Item>
      </Form>
    );
  };
  const seach = () => {};
  const reset = () => {};
  const extend = () => {};
  const data = [
    {
      key: 1,
      sampleBarcode: 'John Brown',
      reportUnitName: 32,
      labDate: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      instrName: ['nice'],
      sampleNo: 'lll',
    },
    {
      key: 2,
      sampleBarcode: 'John Brown',
      reportUnitName: 32,
      labDate: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      instrName: ['nice'],
      sampleNo: 'lll',
    },
  ];
  const onChangeSelected = (selectedRowKeys, selectedRows) => {
    setSelectedKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onChangeSelected,
  };
  const getRowClassName = (record, index) => {
    //const clickRow = this.state.clickRow;
    let className = 'normal';
    if (index === clickRow) {
      className = styles.blue;
    }
    return className;
  };
  // const onRow = (record, index) => {
  //   debugger;
  //   setClickRow(index);
  // };
  return (
    <div className={styles.right_content}>
      <Row>
        <Col span={18}>{renderForm()}</Col>
        <Col span={6}>
          {' '}
          <Button type="primary" onClick={seach}>
            查询
          </Button>
          <Button type="primary" onClick={reset}>
            重置
          </Button>
          <Button type="primary" onClick={extend}>
            扩展
          </Button>
        </Col>
      </Row>
      <Tabs defaultActiveKey="10" size="small">
        <TabPane tab="全部" key="1"></TabPane>
        <TabPane tab="已初审" key="2"></TabPane>
        <TabPane tab="已终审" key="3"></TabPane>
        <TabPane tab="未审核" key="4"></TabPane>
        <TabPane tab="复查" key="5"></TabPane>
        <TabPane tab="超期" key="6"></TabPane>
        <TabPane tab="已打印" key="7"></TabPane>
        <TabPane tab="未打印" key="8"></TabPane>
        <TabPane tab="急诊" key="9"></TabPane>
      </Tabs>

      <Button type="primary" size="small">
        刷新
      </Button>
      <Button type="primary" size="small">
        报告初审
      </Button>
      <Button type="primary" size="small">
        报告终审
      </Button>
      <Button type="primary" size="small">
        解初审
      </Button>
      <Button type="primary" size="small">
        解终审
      </Button>
      <Button type="primary" size="small">
        结果导出
      </Button>
      <Button type="primary" size="small">
        报告删除
      </Button>
      <Button type="primary" size="small">
        报告打印
      </Button>
      <Button type="primary" size="small">
        复查
      </Button>
      <Button type="primary" size="small">
        阳性
      </Button>
      <Button type="primary" size="small">
        拒检
      </Button>
      <Table
        dataSource={data}
        columns={tableHeaderCoumn}
        scroll={{ x: 500 }}
        size="small"
        rowSelection={rowSelection}
        rowClassName={getRowClassName}
        rowKey={(record) => record.key}
        onRow={(record, index) => {
          return {
            onClick: (event) => {
              setClickRow(index);
            },
          };
        }}
      />
    </div>
  );
};
export default RightContent;
