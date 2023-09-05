import { Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Resizable } from 'react-resizable';
import './index.less';
type TResizableTable = {
  column: ColumnsType<any>;
  data: TableProps<any>['dataSource'];
};
/**
 * 可伸缩列
 * @param props
 * @returns
 */
const ResizableTable = (props: TResizableTable) => {
  const [column, setcolumn] = useState<ColumnsType<any>>([]);
  useEffect(() => {
    if (props.column) {
      setcolumn(props.column);
    }
  }, [props.column]);

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...column];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setcolumn(newColumns);
    };
  const mergeColumns = column.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));
  return (
    <Table
      bordered
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      size="small"
      columns={mergeColumns}
      dataSource={props.data}
      pagination={false}
    />
  );
};
export default ResizableTable;

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
