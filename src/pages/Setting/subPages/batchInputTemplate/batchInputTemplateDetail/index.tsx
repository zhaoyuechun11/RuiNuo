import React, { useEffect, useRef, useState } from 'react';
import { Spin, Form, Input, message } from 'antd';
import { useDispatch, useSelector, useParams } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Icon, BackButton } from '@/components';
import { Table } from '@/common';
import { downLoad, transformTree, main } from '@/utils';
import { inputTemplateDetailDelete } from '../../../models/server';
import styles from './index.less';
import EditOrAddModal from './components/editOrAddModal';

const FormItem = Form.Item;

export type RewardItem = {};
const BatchInputTemplateDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const loading = useSelector((state: any) => state.loading.global);
  const { useDetail } = useSelector((state: any) => state.global);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [statisticsList, setStatisticsList] = useState([]);

  const searchVal = useRef();
  const importRef = useRef();
  const [btnPermissions, setBtnPermissions] = useState([]);

  useEffect(() => {
    getList({ pageNum, pageSize, mainId: Number(params.id) });
  }, [pageNum, pageSize, params]);
  useEffect(() => {
    const { btn } = main(transformTree(useDetail.permissions), '/commonMaterials/basicData');
    setBtnPermissions(btn);
  }, [useDetail]);
  const getList = (param: any) => {
    dispatch({
      type: 'Setting/fetchInputTemplateDetail',
      payload: {
        ...param,
        callback: (res: {
          code: number;
          data: {
            records: React.SetStateAction<RewardItem[]>;
            total: React.SetStateAction<number>;
          };
        }) => {
          if (res.code === 200) {
            setStatisticsList(res.data.records);
            setTotal(res.data.total);
          }
        },
      },
    });
  };
  const Columns = [
    {
      title: '报告项目名称',
      dataIndex: 'itemName',
      sorter: true,
      align: 'center',
    },

    {
      title: '默认的输入值',
      dataIndex: 'defaultValue',
      sorter: true,
      align: 'center',
    },
    {
      title: '输入序号',
      align: 'center',
      dataIndex: 'orderNo',
    },
    {
      title: '操作',
      align: 'center',
      render: (record: RewardItem) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                deleteBasicData(record);
              }}
            >
              删除
            </Button>

            <Button
              onClick={() => {
                modalRef.current && modalRef.current.show(record, Number(params.id));
              }}
            >
              修改
            </Button>
          </div>
        );
      },
    },
  ];

  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };

  const add = () => {
    modalRef.current && modalRef.current.show(null, Number(params.id));
  };
  const deleteBasicData = (record: { id?: any }) => {
    inputTemplateDetailDelete({ ids: [record.id] }).then((res: { code: number }) => {
      if (res.code === 200) {
        message.success('删除成功');
        getList({ pageNum, pageSize, mainId: Number(params.id) });
      }
    });
  };
  const importData = () => {
    importRef.current.show();
  };
  const exportData = () => {
    // const download_url = `${env.apiurl_web}/basic/dict/export?${stringify({
    //   parentId: Number(params.id),
    //   ...searchVal.current,
    // })}`;
    // window.open(download_url);
    `    // basicDataExport({ ...searchVal.current, parentId: Number(params.id) }).then((res) => {
    //   const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' });
    //   const href = URL.createObjectURL(blob);
    //   downLoad(href, '基础数据');
    // });`;
  };

  const handleSearch = (changedValues, allValues) => {
    searchVal.current = allValues;
    const values = {
      pageNum,
      pageSize,
      mainId: Number(params.id),
      ...allValues,
    };
    getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline">
        <FormItem name="itemName">
          <Input
            placeholder="请输入报告项目名称"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
      </Form>
    );
  };
  return (
    <>
      <BackButton />
      <div className={styles.search_box}>
        {renderForm()}
        <div className={styles.operateBtns}>
          <Button btnType="primary" onClick={add}>
            <PlusOutlined style={{ marginRight: 4 }} />
            新增
          </Button>

          <Button btnType="primary" onClick={importData}>
            导入
          </Button>

          <Button btnType="primary" onClick={exportData}>
            导出
          </Button>
        </div>
      </div>
      <Table
        columns={Columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={statisticsList}
      ></Table>

      <EditOrAddModal
        Ref={modalRef}
        refresh={() => getList({ pageNum, pageSize, mainId: Number(params.id) })}
      ></EditOrAddModal>
    </>
  );
};

export default BatchInputTemplateDetail;
