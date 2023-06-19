import React, { useImperativeHandle, useRef, useState } from 'react';
import { message, Checkbox, Row, Col } from 'antd';
import { Dialog } from '@components';
import { getBinds, getBindsList, addBind } from '../../../../models/server';
const BindModal = ({ Ref, refresh }) => {
  const dialogRef = useRef();
  const [list, setList] = useState([]);
  const selectedVal = useRef();
  const taskId = useRef();
  const [bindedVal, setBindedVal] = useState([]);
  useImperativeHandle(Ref, () => ({
    show: (val) => {
      dialogRef.current && dialogRef.current.show();
      taskId.current = val;

      List();
      getBindsData(val);
    },
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));
  const getBindsData = (id) => {
    getBinds({ taskId: id }).then((res) => {
      if (res.code === 200) {
        setBindedVal(res.data);
      }
    });
  };
  const List = () => {
    getBindsList().then((res) => {
      if (res.code) {
        setList(res.data);
      }
    });
  };
  const onOk = () => {
    let newVal = selectedVal.current.map((item) => {
      return { reqItemId: item };
    });
    let params = { reqItems: newVal, taskId: taskId.current };
    addBind(params).then((res) => {
      if (res.code === 200) {
        message.success('绑定成功');
        dialogRef.current && dialogRef.current.hide();
        refresh();
      }
    });
  };
  const onChange = (checkedValues) => {
    selectedVal.current = checkedValues;
    setBindedVal(checkedValues);
  };

  return (
    <Dialog
      ref={dialogRef}
      width={864}
      title={`绑定`}
      onCancel={() => {
        dialogRef.current && dialogRef.current.hide();
      }}
      onOk={onOk}
      //   confirmLoading={submitLoading}
    >
      <Checkbox.Group
        style={{
          maxHeight: '500px',
          overflowY: 'scroll',
          margin: '20px 10px',
          minHeight: '300px',
          width: '98%',
        }}
        onChange={onChange}
        value={bindedVal}
      >
        <Row>
          {list.map((item) => {
            return (
              <Col span={8} key={item.id}>
                <Checkbox value={item.id}>{item.reqItemName}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </Dialog>
  );
};
export default BindModal;
