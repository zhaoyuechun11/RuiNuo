import React, { useState, useEffect, useRef } from 'react';
import { Table, Form, Input, Select, Button, Dropdown, Menu } from 'antd';
import { useDispatch } from 'umi';
import Icon from '@components/Icon';
import styles from '../index.less';
import CheckItem from './commones/checkItem';
import EditModal from '../editModal';
import DetailsModal from './commones/detailsModal';
const { Option } = Select;
const MiddleContent = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tableHeaderCoumn, setTableHeaderCoumn] = useState([]);
  const [form] = Form.useForm();
  const checkItemRef = useRef();
  const editModalRef = useRef();
  const detailRef = useRef();
  useEffect(() => {
    var str = 'Result11';
    var reg = /result/;
    //var reg = /^abc\d$/; //只能匹配abc

    var result = reg.test(str);

    console.log(result);
    getList({ reportUnitName: 'gg' });
  }, []);
  useEffect(() => {
    if (list.length > 0) {
      var reg = /result/;
      const firstColumm = list.splice(0, 1).map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          fixed: 'left',
          width: 80,
          ellipsis: true,
          render: (text: string | number) => <span>{text === 0 ? 0 : text || '-'}</span>,
        };
      });

      const middleColumns = list.map((column) => {
        return {
          title: column.name,
          dataIndex: column.key,
          responsive: ['xl', 'xxl'],
          align: 'center',
          width: 70,
          ellipsis: true,
          render: (text: string | number, record: any) => {
            let result = reg.test(column.key);
            return (
              <span>
                {' '}
                {text}{' '}
                {result ? <Icon name="iconanniu-bianji" onClick={() => resultEdit(record)} /> : ''}
              </span>
            );
          },
        };
      });
      const lastColumns = {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (text: string, record: Record<string, any>) => (
          <Dropdown
            arrow
            overlay={() => menu(record)}
            trigger={['click']}
            placement="bottomCenter"
            overlayClassName="dropdownWrap"
          >
            <div className="flex_center w100" style={{ height: '40px', cursor: 'pointer' }}>
              <div className="flex_between" style={{ width: 22 }}>
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 4,
                    background: '#007bff',
                    borderRadius: '50%',
                  }}
                />
              </div>
            </div>
          </Dropdown>
        ),
      };
      const coumns = [...firstColumm, ...middleColumns, lastColumns];
      setTableHeaderCoumn(coumns);
    }
  }, [list]);
  const data = [
    {
      key: 1,
      itemCode: 'John Brown',
      itemName: 32,
      originalResult: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      result: ['nice'],
      result2: 'lll',
    },
  ];
  const menu = (item) => {
    return (
      <Menu>
        <Menu.Item onClick={() => delCurrentItem(item)}>删除</Menu.Item>
        <Menu.Item>趋势图</Menu.Item>
        <Menu.Item onClick={() => detail(item)}>详情</Menu.Item>
      </Menu>
    );
  };

  const getList = (params: { reportUnitName: string }) => {
    dispatch({
      type: 'generalInspectionMag/fetchReportDetaiTableHeader',
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
  const searchHandle = (changedValues: any, allValues: undefined) => {
    // if (!allValues?.sampleBarcode) {
    //   return;
    // }
    // if ('no' in changedValues) {
    //   return;
    // }
    // if (!scanForm.getFieldValue('no')) {
    //   message.warning('请先输入样本号!');
    //   scanForm.resetFields();
    //   return;
    // }
    // const params = {
    //   sampleBarcode: allValues?.sampleBarcode,
    //   instrId: form.getFieldValue('instrId'),
    //   reportUnitId: form.getFieldValue('reportUnitId'),
    // };
    // getOneInstrAllocationScan(params);
  };
  const flagChange = (e) => {};
  const renderForm = () => {
    return (
      <Form onValuesChange={searchHandle} layout="inline" form={form}>
        <Form.Item name="sampleBarcode">
          <Input placeholder="请输入项目编号名称" />
        </Form.Item>
        <div id="flag" className={styles.flag}>
          <Form.Item name="instrId">
            <Select
              onChange={flagChange}
              placeholder="请选择检测仪器"
              autoComplete="off"
              allowClear
              getPopupContainer={() => document.getElementById('flag')}
            >
              <Option value={1} key={1}>
                阴
              </Option>
              {/* {reportUnitInstrList?.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.instrName}
                </Option>
              ))} */}
            </Select>
          </Form.Item>
        </div>
      </Form>
    );
  };
  const delCurrentItem = (item: any) => {
    debugger;
  };
  const detail = (item: any) => {
    detailRef.current.show(item);
  };
  const add = () => {
    checkItemRef.current.show();
  };
  const reset = () => {
    form.resetFields();
  };
  const resultEdit = (record: any) => {
    editModalRef.current.showModal(record);
  };
  return (
    <>
      <div className={styles.search_box}>
        {renderForm()}

        <Button type="primary" size="small" onClick={add}>
          添加
        </Button>
        <Button type="primary" size="small" onClick={reset}>
          重置
        </Button>
        <Button type="primary" size="small" onClick={add}>
          批量录入
        </Button>
        <Button type="primary" size="small" onClick={add}>
          保存
        </Button>
      </div>
      <Table
        dataSource={data}
        columns={tableHeaderCoumn}
        scroll={{ x: 500 }}
        size="small"
        bordered
      />
      <CheckItem Ref={checkItemRef} />
      <EditModal Ref={editModalRef} />
      <DetailsModal Ref={detailRef} />
    </>
  );
};
export default MiddleContent;
