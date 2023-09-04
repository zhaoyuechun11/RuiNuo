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
        getImages();
      }
    });
  };
  return (
    <div>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
        {list?.map((item) => {
          return (
            <Col className="gutter-row" span={6}>
              <Row>
                <Checkbox onChange={(e) => onChange(e, item)} checked={item.isRptUse}>
                  报告
                </Checkbox>
              </Row>
              <Row>
                <Image src={item.imgPath} style={{ width: 200, height: 200 }} />
              </Row>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default GraphicData;
