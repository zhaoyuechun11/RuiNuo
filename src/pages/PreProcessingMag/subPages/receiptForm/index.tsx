import React, { useEffect, useRef, useState } from 'react';
import { Form, DatePicker, Select, Input, Table } from 'antd';
import { useDispatch } from 'umi';
import { Icon, Button } from '@/components';
import { signFormCustormHeader, reqMainOrderSignForm } from '../../models/server';
import { recipientList, getHospitalList } from '@/models/server';
import s from './index.less';
import SetHeaderModal from './commones/SetHeaderModal';
import ApplyFormModal from '@/pages/ExperTaskNavigation/subPages/batchTask/commones/applyFormModal';
import DeliveryReceipt from './commones/deliveryReceipt';
const { RangePicker } = DatePicker;
const { Option } = Select;
const ReceiptForm = () => {
  const [form] = Form.useForm();
  const [receiverList, setReceiverList] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [columnOptionsList, setColumnOptionsList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tableHeaderColumn, setTableHeaderColumn] = useState([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const setRef = useRef();
  const dispatch = useDispatch();
  const applyFormRef = useRef();
  const deliveryReceiptRef = useRef();
  useEffect(() => {
    getReceiverList();
    hospitalList();
    getSignFormCustormHeader();
  }, []);
  useEffect(() => {
    getList({
      [sort]: order,
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      preReceiveDateStart:
        form.getFieldValue('preReceiveDateStart') && form.getFieldValue('preReceiveDateStart')[0]
          ? form.getFieldValue('preReceiveDateStart')[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      preReceiveDateEnd:
        form.getFieldValue('preReceiveDateStart') && form.getFieldValue('preReceiveDateStart')[1]
          ? form.getFieldValue('preReceiveDateStart')[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    });
  }, [pageNum, pageSize, sort, order]);
  const getSignFormCustormHeader = () => {
    signFormCustormHeader().then((res: any) => {
      if (res.code === 200) {
        const selectedFields = res.data.filter(
          (item: Record<string, any>) => item?.isListDisplay == true,
        );

        setColumnOptionsList(res.data);
        setSelectedColumns(selectedFields);
        setTableHeader(selectedFields);
      }
    });
  };
  const getList = (params: any) => {
    reqMainOrderSignForm(params).then((res: any) => {
      if (res.code === 200) {
        setList(res.data.records);
      }
    });
  };
  const setTableHeader = (selectedColumns: any) => {
    let listSeqs = selectedColumns.map((item) => {
      return item.listSeq;
    });

    let sortResult = listSeqs
      .sort(function (a, b) {
        return a - b;
      })
      .filter((item) => item !== undefined);
    let noSeq = [];
    noSeq = selectedColumns.filter((item) => item.listSeq == undefined);
    let tableFieldResult = [];
    sortResult.map((item) => {
      selectedColumns.map((checkItem) => {
        if (checkItem.listSeq == item) {
          tableFieldResult.push(checkItem);
        }
      });
    });
    if (noSeq.length > 0) {
      tableFieldResult.push(...noSeq);
    }
    const firstColumm = tableFieldResult.splice(0, 1).map((column) => {
      return {
        title: column.name,
        dataIndex: column.key,
        sorter: true,
        responsive: ['xl', 'xxl'],
        align: 'center',
        fixed: 'left',
        render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
      };
    });
    const Columns = tableFieldResult.map((column: any) => {
      if (column.key !== 'reqItemName' && column.key !== 'sampleType') {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          sorter:
            column.key === 'receiveBarcode' ||
            column.key === 'hospitalName' ||
            column.key === 'sendDeptName' ||
            column.key === 'sendDoctorName' ||
            column.key === 'hospitalBarcode' ||
            column.key === 'patientId' ||
            column.key === 'patientNo' ||
            column.key === 'sourceName' ||
            column.key === 'patientName' ||
            column.key === 'sampleTypeIds' ||
            column.key === 'applyDate' ||
            column.key === 'collectDate' ||
            column.key === 'receiveDate' ||
            column.key === 'createDate'
              ? true
              : false,

          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      } else {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          key: column.key,
          sorter: (a, b) => a.column.key.length - b.column.key.length,
          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      }
    });

    const lastColumn = {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render: (text: string, record: Record<string, any>) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => applyFormRef.current.show(record)}>预览</Button>
          <Button onClick={() => deliveryReceiptRef.current.show(record)}>交接</Button>
        </div>
      ),
    };

    const allColumn = [...firstColumm, ...Columns, , lastColumn];
    setTableHeaderColumn(allColumn);
  };
  const changeColumn = (ids: any) => {
    dispatch({
      type: 'preProcessingMag/saveCustomHeader',
      payload: {
        ids,
        callback: () => {
          getSignFormCustormHeader();
        },
      },
    });
  };
  const getReceiverList = () => {
    recipientList().then((res) => {
      if (res.code === 200) {
        setReceiverList(res.data);
      }
    });
  };
  const hospitalList = () => {
    getHospitalList().then((res) => {
      if (res.code === 200) {
        setHospital(res.data);
      }
    });
  };
  const search = () => {
    getList({
      pageNum,
      pageSize,
      ...form.getFieldsValue(),
      preReceiveDateStart:
        form.getFieldValue('preReceiveDateStart') && form.getFieldValue('preReceiveDateStart')[0]
          ? form.getFieldValue('preReceiveDateStart')[0].format('YYYY-MM-DD HH:mm:ss')
          : '',
      preReceiveDateEnd:
        form.getFieldValue('preReceiveDateStart') && form.getFieldValue('preReceiveDateStart')[1]
          ? form.getFieldValue('preReceiveDateStart')[1].format('YYYY-MM-DD HH:mm:ss')
          : '',
    });
  };
  const clear = () => {
    form.resetFields();
  };
  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    if (sorter.field === 'hospitalName') {
      setSort('hospitalDesc');
    } else if (sorter.field === 'sourceName') {
      setSort('sourceDesc');
    } else if (sorter.field === 'sendDeptName') {
      setSort('sendDeptDesc');
    } else if (sorter.field === 'sendDoctorName') {
      setSort('sendDoctorDesc');
    } else {
      setSort(sorter.field + 'Desc');
    }
    setOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
  };
  const renderForm = () => {
    return (
      <Form layout="inline" form={form}>
        <Form.Item name="preReceiveDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['接收开始时间', '接收结束时间']}
          />
        </Form.Item>
        <Form.Item name="labReceiveBy">
          <Select placeholder="请选择接收人" allowClear>
            {receiverList.length > 0 &&
              receiverList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="hospitalId">
          <Select placeholder="请选择送检单位" allowClear>
            {hospital?.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.hospitalName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="transferBoxCode">
          <Input placeholder="请输入运转箱码" autoComplete="off" allowClear />
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <div className={s.search_box}>
        {renderForm()}{' '}
        <Button btnType="primary" size="small" onClick={search}>
          查询
        </Button>
        <Button btnType="primary" size="small">
          打印签收单
        </Button>
        <Button btnType="primary" size="small" onClick={clear}>
          清空
        </Button>
      </div>
      <Table
        size="small"
        onChange={onTableChange}
        scroll={{ x: 'max-content' }}
        className={s.table_box}
        dataSource={list}
        columns={tableHeaderColumn}
        title={() => (
          <div className={s.header} onClick={() => setRef.current.show()}>
            <Icon name="iconhouxuanren-shezhi" />
            自定义表头
          </div>
        )}
      />

      <SetHeaderModal
        refs={setRef}
        columnOptions={columnOptionsList}
        columnChecked={selectedColumns}
        handleChangeColumn={changeColumn}
      />
      <ApplyFormModal Ref={applyFormRef} from="receiptForm" />
      <DeliveryReceipt refs={deliveryReceiptRef} />
    </>
  );
};
export default ReceiptForm;
