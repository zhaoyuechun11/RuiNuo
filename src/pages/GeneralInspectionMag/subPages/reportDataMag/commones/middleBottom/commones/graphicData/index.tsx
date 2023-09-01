import React, { useEffect, useState } from 'react';
import { Row, Col, Image, Checkbox, message } from 'antd';
import { reportResultImages, reportResultImagesChange } from '../../../../../../models/server';
import { useSelector, useDispatch } from 'umi';

const GraphicData = () => {
  const { instrAndRecordId } = useSelector((state: any) => state.generalInspectionMag);
  const dispatch = useDispatch();
  const [list, setList] = useState();
  useEffect(() => {
    if (instrAndRecordId.id) {
      getImages();
    }
  }, [instrAndRecordId]);
  const getImages = () => {
    reportResultImages({ reportId: instrAndRecordId.id }).then((res) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  };
  const onChange = (e, val) => {
    reportResultImagesChange({ id: val.id }).then((res) => {
      if (res.code === 200) {
        message.success('报告状态修改成功!');
        dispatch({
          type: 'generalInspectionMag/save',
          payload: {
            type: 'reportMiddleUpdate',
            dataSource: true,
          },
        });
      }
    });
  };
  return (
    <div>
      <Row gutter={16}>
        {list?.map((item) => {
          return (
            <Col className="gutter-row" span={4}>
              <Row>
                <Checkbox onChange={(e) => onChange(e, item)} checked={item.isRptUse}>
                  是否用于修改
                </Checkbox>
              </Row>
              <Row>
                <Image src={item.imgPath} style={{ width: 100, height: 100 }} />
              </Row>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default GraphicData;
