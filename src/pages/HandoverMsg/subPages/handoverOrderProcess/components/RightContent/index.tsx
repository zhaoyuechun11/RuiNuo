import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useLocation, useSelector } from 'umi';
import { Button, Icon } from '@/components';
import styles from './index.less';
import {
  Form,
  Input,
  Table,
  DatePicker,
  Badge,
  Popconfirm,
  message,
} from 'antd';
import {
  deliveryReceiptList,
  updateDeliveryStatus,
  deliveryReceiptExport,
} from '../../../../models/server';
import { downLoad } from '@/utils';
import ReverseHandoverModal from './components/reverseHandoverModal';
import moment from 'moment';
const { RangePicker } = DatePicker;

const RightContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.loading.global);
  const { leftMenuParams } = useSelector((state: any) => state.HandoverMsg);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const reverseHandoverModalRef = useRef();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const searchVal = useRef();
  // const [time, setTime] = useState([
  //   moment().day(moment().day() - 6), // 当前时间往前推一周的时间
  //   moment(),
  // ]);

  const { useDetail } = useSelector((state: any) => state.global);
  useEffect(() => {
    form.setFieldsValue({
      deliveryStartTime: [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')],
    });
    getDeliveryReceiptList({
      pageNum,
      pageSize,
      [sort]: order,
      ...leftMenuParams,
      deliveryStartTime: form.getFieldsValue().deliveryStartTime
        ? form.getFieldsValue().deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: form.getFieldsValue().deliveryStartTime
        ? form.getFieldsValue().deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
      barcodeContent: form.getFieldsValue().barcodeContent,
    });
  }, [pageNum, pageSize, leftMenuParams, sort, order]);
  useEffect(() => {
    dispatch({
      type: 'HandoverMsg/save',
      payload: {
        type: 'leftMenuParams',
        dataSource: {},
      },
    });
  }, [location.pathname]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      render: (text) => {
        return (
          <span>
            {text === 0 ? (
              <Badge status="default" text="未处理" />
            ) : text === 1 ? (
              <Badge status="processing" text="处理中" />
            ) : text === 2 ? (
              <Badge status="success" text="已完成" />
            ) : (
              <Badge status="warning" text="已确认" />
            )}
          </span>
        );
      },
    },
    {
      title: '提交人',
      dataIndex: 'submitByName',
    },
    {
      title: '提交部门',
      dataIndex: 'submitDeptName',
    },
    {
      title: '处理类型',
      dataIndex: 'problemTypeName',
    },
    {
      title: '处理部门',
      dataIndex: 'solveDeptName',
    },
    {
      title: '条码',
      dataIndex: 'receiveBarcode',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '送检单位',
      dataIndex: 'hospitalName',
    },
    {
      title: '交接内容',
      dataIndex: 'submitContent',
    },
    {
      title: '反馈内容',
      dataIndex: 'solveContent',
    },
    {
      title: '追加内容',
      dataIndex: 'appendContent',
    },
    {
      title: '处理人',
      dataIndex: 'solveByName',
    },
    {
      title: '处理开始时间',
      dataIndex: 'solveTime',
      sorter: true,
      key: 'solveTime',
    },
    {
      title: '处理结束时间',
      dataIndex: 'doneTime',
      sorter: true,
    },
    {
      title: '抄送部门1',
      dataIndex: 'copyTo1Name',
    },
    {
      title: '抄送部门2',
      dataIndex: 'copyTo2Name',
    },
    {
      title: '抄送部门3',
      dataIndex: 'copyTo3Name',
    },
    {
      title: '紧急',
      dataIndex: 'isEmer',
      render: (text: any) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '追加人',
      dataIndex: 'appendByName',
    },
    {
      title: '确认人',
      dataIndex: 'confirmByName',
    },
    {
      title: '确认时间',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      sorter: true,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      sorter: true,
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      sorter: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        return (
          <div className={styles.tabale_operate_box}>
            {record.status == 0 ? (
              <>
                <Popconfirm
                  title="确认要进行处理么?"
                  onConfirm={() => confirmHandle(record)}
                  okText="接收"
                  cancelText="取消"
                >
                  <Button>接收</Button>
                </Popconfirm>
                <Button
                  onClick={() => {
                    reverseHandoverModalRef.current.show(record, null);
                  }}
                >
                  反交接
                </Button>
              </>
            ) : record.status == 1 ? (
              <>
                <Button
                  onClick={() => {
                    reverseHandoverModalRef.current.show(record, 1);
                  }}
                >
                  继续处理
                </Button>
                <Button
                  onClick={() => {
                    reverseHandoverModalRef.current.show(record, 2);
                  }}
                >
                  处理完成
                </Button>
              </>
            ) : record.status == 2 ? (
              <>
                <Popconfirm
                  title="确认完成该次处理么?"
                  onConfirm={() => sureHandle(record)}
                  okText="接收"
                  cancelText="取消"
                >
                  <Button>确认完成</Button>
                </Popconfirm>
              </>
            ) : null}
          </div>
        );
      },
    },
  ];
  const sureHandle = (record: any) => {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    updateDeliveryStatus({
      id: record.id,
      status: 3,
      confirmBy: useDetail.id,
      confirmTime: now,
      finishTime: now,
    }).then((res) => {
      if (res.code === 200) {
        message.success('接收处理成功!');
        getDeliveryReceiptList({
          pageNum,
          pageSize,
          [sort]: order,
          ...leftMenuParams,
          deliveryStartTime: form.getFieldsValue().deliveryStartTime
            ? form.getFieldsValue().deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
            : '',
          deliveryEndTime: form.getFieldsValue().deliveryStartTime
            ? form.getFieldsValue().deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
            : '',
          barcodeContent: form.getFieldsValue().barcodeContent,
        });
      }
    });
  };
  const confirmHandle = (record: any) => {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    updateDeliveryStatus({
      id: record.id,
      status: 1,
      solveTime: now,
      solveBy: useDetail.id,
    }).then((res) => {
      if (res.code === 200) {
        message.success('接收处理成功!');
        getDeliveryReceiptList({
          pageNum,
          pageSize,
          [sort]: order,
          ...leftMenuParams,
          deliveryStartTime: form.getFieldsValue().deliveryStartTime
            ? form.getFieldsValue().deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
            : '',
          deliveryEndTime: form.getFieldsValue().deliveryStartTime
            ? form.getFieldsValue().deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
            : '',
          barcodeContent: form.getFieldsValue().barcodeContent,
        });
      }
    });
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    searchVal.current = {
      ...allValues,
      deliveryStartTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    const values = {
      pageNum,
      pageSize,
      [sort]: order,
      ...leftMenuParams,
      ...allValues,
      deliveryStartTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
        : '',
      deliveryEndTime: allValues?.deliveryStartTime
        ? allValues.deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
        : '',
    };
    getDeliveryReceiptList(values);
  };
  const getDeliveryReceiptList = (params: any) => {
    deliveryReceiptList(params).then((res: any) => {
      if (res.code == 200) {
        let result = res.data.records.map((item: any, index: any) => {
          return {
            index: index + 1,
            ...item,
          };
        });
        setList(result);
        setTotal(res.data.total);
      }
    });
  };

  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" form={form}>
        <Form.Item name="deliveryStartTime">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['完成开始时间', '完成结束时间']}
          />
        </Form.Item>
        <Form.Item name="barcodeContent">
          <Input
            placeholder="请输入条码或内容"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    setPageSize(pageSize);
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    setSort(sorter.field + 'Desc');
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  const exportData = () => {
    deliveryReceiptExport({
      ...searchVal.current,
      pageNum,
      pageSize,
      [sort]: order,
      ...leftMenuParams,
    }).then((res) => {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      downLoad(href, '交接单处理');
    });
  };
  return (
    <>
      <div className={styles.search_bth}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={exportData}>
            导出
          </Button>
        </div>
      </div>
      <Table
        loading={loading}
        className={styles.tablePadding}
        rowClassName={styles.rowStyle}
        columns={columns}
        dataSource={list}
        size="small"
        scroll={{ x: 'max-content' }}
        onChange={onTableChange}
        pagination={{
          pageSize,
          current: pageNum,
          total,
          onChange: pageChange,
          showTotal: (total, range) => `共 ${total} 条`,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true,
        }}
      ></Table>
      <ReverseHandoverModal
        Ref={reverseHandoverModalRef}
        refresh={() =>
          getDeliveryReceiptList({
            pageNum,
            pageSize,
            ...leftMenuParams,
            [sort]: order,
            deliveryStartTime: form.getFieldsValue().deliveryStartTime
              ? form.getFieldsValue().deliveryStartTime[0].format('YYYY-MM-DD HH:mm:ss')
              : '',
            deliveryEndTime: form.getFieldsValue().deliveryStartTime
              ? form.getFieldsValue().deliveryStartTime[1].format('YYYY-MM-DD HH:mm:ss')
              : '',
            barcodeContent: form.getFieldsValue().barcodeContent,
          })
        }
      />
    </>
  );
};

export default RightContent;
