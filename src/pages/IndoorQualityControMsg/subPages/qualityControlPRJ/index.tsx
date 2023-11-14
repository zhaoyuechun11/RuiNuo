import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Table, Row, Col, message } from 'antd';
import { Icon, Button, Confirm } from '@/components';
import { majorGroup } from '@/models/server';
import { getInstrByLabClassName, getInstrItemList, instrReqItemDelete } from '../../models/server';
import styles from './index.less';
import Bind from './components/bind';
import Update from './components/update';
const { Option } = Select;
const QualityControlPRJ = () => {
  const [majorGroupData, setMajorGroupData] = useState([]);
  const [instrList, setInstrList] = useState([]);
  const [selectIndex, setSelectIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const bindModalRef = useRef();
  const updateModalRef = useRef();
  const [form1] = Form.useForm();
  const confirmModalRef = useRef();
  const idRef = useRef();
  useEffect(() => {
    majorGroupList();
    getInstrList({});
  }, []);
  useEffect(() => {
    if (currentItem?.id) {
      console.log(form1.getFieldValue('name'));
      getList({ pageNum, pageSize, name: form1.getFieldValue('name'), instrId: currentItem?.id });
    }
  }, [pageNum, pageSize, currentItem]);
  const columns = [
    {
      title: '仪器代号',
      dataIndex: 'instrCode',
      align: 'center',
    },
    {
      title: '仪器名字',
      dataIndex: 'instrName',
      align: 'center',
    },
  ];
  const QCColumns = [
    {
      title: '质控项目ID',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '项目代码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '是否在用',
      dataIndex: 'qcInuse',
      align: 'center',
      render: (text: any) => {
        return text ? '是' : '否';
      },
    },
    {
      title: '上报代码',
      dataIndex: 'uploadCode',
      align: 'center',
    },
    {
      title: '允许最大CV%',
      dataIndex: 'maxCv',
      align: 'center',
    },
    {
      title: '仪器代号',
      dataIndex: 'instrCode',
      align: 'center',
    },
    {
      title: '录入人',
      dataIndex: 'createName',
      align: 'center',
    },
    {
      title: '录入日期',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',

      render: (record: { id: any }) => {
        return (
          <div className={styles.action_btn}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updateModalRef.current.show(record);
              }}
            >
              修改
            </Button>

            <Button
              style={{ margin: '0 4px' }}
              onClick={() => {
                deleteCurrentItem(record.id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  const deleteCurrentItem = (id: any) => {
    confirmModalRef.current.show();
    idRef.current = id;
  };
  const handleConfirmOk = () => {
    instrReqItemDelete({ ids: [idRef.current] }).then((res: { code: number }) => {
      if (res.code === 200) {
        getList({ pageNum, pageSize, name: form1.getFieldsValue().name, instrId: currentItem?.id });
        confirmModalRef.current.hide();
        message.success('删除成功');
      }
    });
  };
  const getList = (params: any) => {
    getInstrItemList(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.records.map((item: any, index: any) => {
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
  const getInstrList = (params: any) => {
    getInstrByLabClassName(params).then((res: any) => {
      if (res.code === 200) {
        setCurrentItem(res.data[0]);
        setInstrList(res.data);
      }
    });
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.form_box}>
        <Form.Item name="labClassId">
          <Select placeholder="请选择项目类别" allowClear>
            {majorGroupData.length > 0 &&
              majorGroupData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.className}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="instrIdName">
          <Input
            placeholder="请输入仪器代号/名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const renderForm1 = () => {
    return (
      <Form onValuesChange={handleSearch1} layout="inline" className={styles.form_box} form={form1}>
        <Form.Item name="name">
          <Input
            placeholder="请输入项目名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };
  const majorGroupList = () => {
    majorGroup().then((res: any) => {
      if (res.code === 200) {
        setMajorGroupData(res.data);
      }
    });
  };
  const handleSearch = (changedValues: any, allValues: undefined) => {
    getInstrList({ ...allValues });
  };
  const handleSearch1 = (changedValues: any, allValues: undefined) => {
    const params = {
      pageNum,
      pageSize,
      instrId: currentItem.id,
      ...allValues,
    };
    getList(params);
  };
  const add = () => {
    bindModalRef.current.show(currentItem);
  };
  const getRowClassName = (record: any, index: any) => {
    let className = '';
    className = index === selectIndex ? styles.selectedRow : '';
    return className;
  };
  const getCurrentItem = (val: React.SetStateAction<undefined>) => {
    setCurrentItem(val);
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  return (
    <>
      {' '}
      <Row>
        <Col span={8}>
          <div className={styles.search_bth}>{renderForm()}</div>
          <Table
            dataSource={instrList}
            columns={columns}
            size="small"
            rowClassName={getRowClassName}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  // 设置选中的index
                  setSelectIndex(index);
                  getCurrentItem(record);
                },
              };
            }}
            pagination={false}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={15}>
          <div className={styles.search_bth}>
            {renderForm1()}
            <div className={styles.operateBtns}>
              <Button btnType="primary" onClick={add}>
                绑定
              </Button>
            </div>
          </div>
          <Table
            scroll={{ x: 'max-content' }}
            dataSource={list}
            columns={QCColumns}
            size="small"
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              total,
              onChange: pageChange,
              showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
            }}
          />
        </Col>
      </Row>
      <Bind
        Ref={bindModalRef}
        refresh={() =>
          getList({
            pageNum,
            pageSize,
            name: form1.getFieldsValue().name,
            instrId: currentItem?.id,
          })
        }
      ></Bind>
      <Update
        Ref={updateModalRef}
        refresh={() =>
          getList({
            pageNum,
            pageSize,
            name: form1.getFieldsValue().name,
            instrId: currentItem?.id,
          })
        }
      />
      <Confirm
        confirmRef={confirmModalRef}
        img="commom/remind.png"
        imgStyle={{ width: 73 }}
        title="是否确认删除?"
        content="你正在删除该条数据, 删除后不能恢复"
        width={640}
        onOk={handleConfirmOk}
      />
    </>
  );
};
export default QualityControlPRJ;
