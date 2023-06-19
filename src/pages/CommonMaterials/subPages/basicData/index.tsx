import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { Button, Icon, Table } from '@/components';
import styles from './index.less';
import { useDispatch, useSelector, history } from 'umi';


const FormItem = Form.Item;
const BasicData = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('account_integral');
  const [order, setOrder] = useState('asc');
  const loading = useSelector((state: any) => state.loading.global);

  const [list, setList] = useState([]);
  const Columns = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典类别',
      dataIndex: 'dictType',
      sorter: true,
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
      sorter: true,
      align: 'center',
      // sorter: (a, b) => a.dictValue - b.dictValue,
    },
    {
      title: '英文',
      dataIndex: 'engValue',
      align: 'center',
    },
    {
      title: '对接编码',
      dataIndex: 'interfaceCode',
      align: 'center',
    },
    {
      title: '实验室ID',
      dataIndex: 'labId',
      align: 'center',
    },
    {
      title: '是否禁用',
      dataIndex: 'isDisable',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '是否可以编辑',
      dataIndex: 'iseditable',
      align: 'center',
      render: (text: any) => {
        return <span>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '顺序',
      align: 'center',
      dataIndex: 'seq',
    },

    {
      title: '操作',
      align: 'center',
      render: (record: { id: any }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                history.push(`/commonMaterials/specimen/${record.id}`);
              }}
            >
              明细
            </Button>
          </div>
        );
      },
    },
  ];

  const getList = useCallback(
    (params) => {
      dispatch({
        type: 'commonMaterials/fetchFirstPage',
        payload: {
          ...params,
          callback: (res: ResponseData<{ list: RewardItem[]; count: number }>) => {
            if (res.code === 200) {
              setList(res.data.records);
              setTotal(res.data.total);
            }
          },
        },
      });
    },
    [dispatch, sort, order],
  );
  useEffect(() => {
    getList({ pageNum, pageSize });
  }, [pageNum, pageSize]);

  const onTableChange = (
    pagination: Record<string, unknown>,
    filters: Record<string, unknown>,
    sorter: Record<string, string>,
  ) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    // setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    // setSort(sorter.field);
  };
  const pageChange = (page: React.SetStateAction<number>, size: React.SetStateAction<number>) => {
    setPageNum(page);
    setPageSize(size);
  };
  const handleSearch = (changedValues, allValues) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    getList(values);
  };
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" className={styles.search_box}>
        <FormItem name="code">
          <Input
            placeholder="请输入字典编码"
            autoComplete="off"
            suffix={<Icon name="icongongzuotai-sousuo" />}
            allowClear
          />
        </FormItem>
        <FormItem name="value">
          <Input
            placeholder="请输入字典值"
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
  
      {renderForm()}
      <Table
        columns={Columns}
        rowKey="id"
        // onSelectCount={(count, keys) => {
        //   setSelectedCount(count);
        //   setSelectedKeys(keys);
        // }}
        handleTableChange={onTableChange}
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
        dataSource={list}
      />
    </>
  );
};
export default BasicData;
// import { Space, Switch, Table, Tag, Transfer } from 'antd';
// import difference from 'lodash/difference';
// import React, { useState } from 'react';
// // Customize Table Transfer
// const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
//   <Transfer {...restProps}>
//     {({
//       direction,
//       filteredItems,
//       onItemSelectAll,
//       onItemSelect,
//       selectedKeys: listSelectedKeys,
//       disabled: listDisabled,
//     }) => {
//       const columns = direction === 'left' ? leftColumns : rightColumns;
//       const rowSelection = {
//         getCheckboxProps: (item) => ({
//           disabled: listDisabled || item.disabled,
//         }),
//         onSelectAll(selected, selectedRows) {
//           const treeSelectedKeys = selectedRows
//             .filter((item) => !item.disabled)
//             .map(({ key }) => key);
//           const diffKeys = selected
//             ? difference(treeSelectedKeys, listSelectedKeys)
//             : difference(listSelectedKeys, treeSelectedKeys);
//           onItemSelectAll(diffKeys, selected);
//         },
//         onSelect({ key }, selected) {
//           onItemSelect(key, selected);
//         },
//         selectedRowKeys: listSelectedKeys,
//       };
//       return (
//         <Table
//           rowSelection={rowSelection}
//           columns={columns}
//           dataSource={filteredItems}
//           size="small"
//           style={{
//             pointerEvents: listDisabled ? 'none' : undefined,
//           }}
//           onRow={({ key, disabled: itemDisabled }) => ({
//             onClick: () => {
//               if (itemDisabled || listDisabled) return;
//               onItemSelect(key, !listSelectedKeys.includes(key));
//             },
//           })}
//         />
//       );
//     }}
//   </Transfer>
// );
// const mockTags = ['cat', 'dog', 'bird'];
// const mockData = Array.from({
//   length: 10,
// }).map((_, i) => ({
//   key: i.toString(),
//   title: `content${i + 1}`,
//   description: `description of content${i + 1}`,
//   disabled: i % 4 === 0,
//   tag: mockTags[i % 3],
// }));
// const originTargetKeys = mockData
//   .filter((item) => Number(item.key) % 3 > 1)
//   .map((item) => item.key);
// const leftTableColumns = [
//   {
//     dataIndex: 'title',
//     title: 'Name',
//   },
//   {
//     dataIndex: 'tag',
//     title: 'Tag',
//     render: (tag) => <Tag>{tag}</Tag>,
//   },
//   {
//     dataIndex: 'description',
//     title: 'Description',
//   },
// ];
// const rightTableColumns = [
//   {
//     dataIndex: 'title',
//     title: 'Name',
//   },
// ];
// const BasicData = () => {
//   const [targetKeys, setTargetKeys] = useState(originTargetKeys);
//   const [disabled, setDisabled] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const onChange = (nextTargetKeys) => {
//     setTargetKeys(nextTargetKeys);
//   };
//   const triggerDisable = (checked) => {
//     setDisabled(checked);
//   };
//   const triggerShowSearch = (checked) => {
//     setShowSearch(checked);
//   };
//   return (
//     <>
//       <TableTransfer
//         dataSource={mockData}
//         targetKeys={targetKeys}
//         disabled={disabled}
//         showSearch={showSearch}
//         onChange={onChange}
//         filterOption={(inputValue, item) =>
//           item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
//         }
//         leftColumns={leftTableColumns}
//         rightColumns={rightTableColumns}
//       />
//       <Space
//         style={{
//           marginTop: 16,
//         }}
//       >
//         <Switch
//           unCheckedChildren="disabled"
//           checkedChildren="disabled"
//           checked={disabled}
//           onChange={triggerDisable}
//         />
//         <Switch
//           unCheckedChildren="showSearch"
//           checkedChildren="showSearch"
//           checked={showSearch}
//           onChange={triggerShowSearch}
//         />
//       </Space>
//     </>
//   );
// };
// export default BasicData;
