import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Table, DatePicker, Select, Button } from 'antd';
import { instrListForThisUser, getQcListForInstr } from '@/models/server';
import moment from 'moment';
import { useDispatch, useSelector } from 'umi';
import { graphicalData } from '../../models/server';

import s from './index.less';
import LeftContent from './components/leftContent';
import RightContent from './components/rightContent';

const { RangePicker } = DatePicker;
const { Option } = Select;
const QCAnalysisWestguard = () => {
  const { AWQcList, AWSelectedQcIds, AWItem, AWFormData } = useSelector(
    (state: any) => state.IndoorQualityControMsg,
  );
  const [form] = Form.useForm();
  const [instr, setInstr] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({
      startDate: [
        moment(moment().startOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
        moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
      ],
    });
    getInstrList();
  }, []);
  const getInstrList = () => {
    instrListForThisUser().then((res) => {
      if (res.code === 200) {
        form.setFieldsValue({ instrId: res.data[0]?.id });
        setInstr(res.data);
        debugger;
        getQcList({
          instrId: res.data[0].id,
          startDate: form.getFieldsValue().startDate
            ? form.getFieldsValue().startDate[0].format('YYYY-MM-DD')
            : '',
          endDate: form.getFieldsValue().startDate
            ? form.getFieldsValue().startDate[1].format('YYYY-MM-DD')
            : '',
        });
      }
    });
  };
  const getQcList = (params: any) => {
    getQcListForInstr(params).then((res) => {
      if (res.code === 200) {
        const result = res.data.map((item) => {
          return {
            key: item.id,
            ...item,
          };
        });
        dispatch({
          type: 'IndoorQualityControMsg/save',
          payload: {
            type: 'AWQcList',
            dataSource: result,
          },
        });
      }
    });
  };
  const seach = () => {
    if (
      AWSelectedQcIds.length > 0 &&
      AWItem !== '' &&
      AWFormData.instrId !== '' &&
      AWFormData.instrId !== undefined &&
      AWFormData.startDate !== null
    ) {
      graphicalData({
        instrId: AWFormData.instrId,
        qcDateStart: AWFormData.startDate[0].format('YYYY-MM-DD'),
        qcDateEnd: AWFormData.startDate[1].format('YYYY-MM-DD'),
        itemId: AWItem.id,
        qcIds: AWSelectedQcIds,
      }).then((res) => {
        if (res.code === 200) {
          dispatch({
            type: 'IndoorQualityControMsg/save',
            payload: {
              type: 'AWGraphicalData',
              dataSource: res.data,
            },
          });
        }
      });
    }
  };
  const instrChange = (e: any) => {
    if (e) {
      let pararm = {
        ...form.getFieldsValue(),
        startDate: form.getFieldsValue().startDate
          ? form.getFieldsValue().startDate[0].format('YYYY-MM-DD')
          : '',
        endDate: form.getFieldsValue().startDate
          ? form.getFieldsValue().startDate[1].format('YYYY-MM-DD')
          : '',
      };
      getQcList(pararm);
    } else {
      dispatch({
        type: 'IndoorQualityControMsg/save',
        payload: {
          type: 'AWQcList',
          dataSource: [],
        },
      });
    }
  };

  const handleSearch = (changedValues, allValues) => {
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWFormData',
        dataSource: allValues,
      },
    });
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWItem',
        dataSource: '',
      },
    });
    dispatch({
      type: 'IndoorQualityControMsg/save',
      payload: {
        type: 'AWSelectedQcIds',
        dataSource: [],
      },
    });
  };
  const renderForm = () => {
    return (
      <Form form={form} className={s.form_box} onValuesChange={handleSearch}>
        <Form.Item name="startDate" label="质控日期">
          <RangePicker
            showTime={{ format: 'YYYY-MM-DD' }}
            format="YYYY-MM-DD"
            placeholder={['质控开始时间', '质控结束时间']}
          />
        </Form.Item>
        <Form.Item label="仪器" name="instrId">
          <Select placeholder="请选择仪器" allowClear onChange={instrChange}>
            {instr.map((item) => {
              return (
                <Option value={item.id} key={item.id} labClassId={item.labClassId}>
                  {item.instrName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    );
  };
  // const clear = () => {};
  return (
    <>
      <div className={s.search_box}>
        {renderForm()}
        <Button type="primary" onClick={seach}>
          查询
        </Button>
        {/* <Button type="primary" onClick={clear}>
          清空
        </Button> */}
      </div>
      <div className={s.content_box}>
        <LeftContent qcList={AWQcList} />
        <RightContent />
      </div>
    </>
  );
};

export default QCAnalysisWestguard;
