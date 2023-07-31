import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, Input } from 'antd';
import ImageGallery from '../ImageGallery';
import { Dialog } from '@components';
import { useDispatch, useSelector } from 'umi';

const AddMaterial = ({ refs }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { information, profilePicture } = useSelector((state: any) => state.preProcessingMag);

  const dialog = useRef();
  useImperativeHandle(refs, () => ({
    show: () => {
      dialog.current && dialog.current.show();
      form.resetFields();
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'profilePicture',
          dataSource: [],
        },
      });
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  const onUpload = (item, isICon, index) => {
    if (isICon) {
      profilePicture.splice(index, 1, item);
    } else {
      profilePicture.push(item);
    }
    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'profilePicture',
        dataSource: profilePicture,
      },
    });
  };

  const onDelete = (index) => {
    profilePicture.splice(index, 1);

    dispatch({
      type: 'preProcessingMag/save',
      payload: {
        type: 'profilePicture',
        dataSource: profilePicture,
      },
    });
  };
  const onOk = () => {
    form.validateFields().then((value) => {
      let informationData = [];
      if (information.length > 0) {
        informationData = profilePicture.map((item) => {
          return {
            filePath: item.fileServerUrl,
            typeName: item.fileServerName,
            ...value,
          };
        });
        informationData.push(...information);
      } else {
        informationData = profilePicture.map((item) => {
          return {
            filePath: item.fileServerUrl,
            typeName: item.fileServerName,
            ...value,
          };
        });
      }
      dispatch({
        type: 'preProcessingMag/save',
        payload: {
          type: 'information',
          dataSource: informationData,
        },
      });
      dialog.current.hide();
    });
  };
  return (
    <div>
      <Dialog ref={dialog} onOk={onOk}>
        <Form form={form} layout="vertical" style={{ padding: '20px' }}>
          <Form.Item label="备注" name="remark" rules={[{ required: true, message: '请输入备注' }]}>
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
        <ImageGallery
          imageList={profilePicture}
          selectedImgURL={''}
          onUpload={onUpload}
          onDelete={onDelete}
        />
      </Dialog>
    </div>
  );
};
export default AddMaterial;
