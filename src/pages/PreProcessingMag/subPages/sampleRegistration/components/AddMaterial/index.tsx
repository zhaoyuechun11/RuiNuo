import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, Input } from 'antd';
import ImageGallery from '../ImageGallery';
import { Dialog } from '@components';
import { useDispatch, useSelector } from 'umi';

const AddMaterial = ({ refs }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { information } = useSelector((state: any) => state.preProcessingMag);
  const [imagesList, setImagesList] = useState([]);
  const dialog = useRef();
  useImperativeHandle(refs, () => ({
    show: () => {
      dialog.current && dialog.current.show();
      setImagesList([]);
    },
    hide: () => {
      dialog.current && dialog.current.hide();
    },
  }));
  const getNewImgListByURL = (list = [], selectedItem) => {
    return list.map((item) => {
      const newItem = { ...item };
      newItem.select = 0;
      if (item.url === selectedItem.url) {
        newItem.select = 1;
      }
      return newItem;
    });
  };
  const onImageSelect = (item) => {
    const newList = getNewImgListByURL(imagesList, item);
    setImagesList(newList);
    dispatch({
      type: 'PreProcessingMag/saveMore',
      payload: {
        companyPic: {
          ...newList.slice(-1)[0],
        },
      },
    });
  };
  const onUpload = (item) => {
    let newList = imagesList.concat([item]);
    // let newList = imagesList;

    setImagesList(newList);
  };

  const onDelete = (index) => {
    const newList = [
      ...imagesList.slice(index, 1),
      {
        full_url: '',
        url: '',
        select: 0, // 1: 选中, 0: 未选中
        type: 2, // 1: 默认图片, 2: 自定义图片
      },
    ];
    newList[0].select = 1;
    setImagesList(newList);
  };
  const onOk = () => {
    form.validateFields().then((value) => {
      debugger;
      if (information.length > 0) {
        imagesList.push(...information);
      }
      const informationData = imagesList.map((item) => {
        return {
          filePath: item.fileServerUrl,
          typeName: item.fileServerName,
          ...value,
        };
      });
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
          imageList={imagesList}
          selectedImgURL={''}
          onSelect={onImageSelect}
          onUpload={onUpload}
          onDelete={onDelete}
        />
      </Dialog>
    </div>
  );
};
export default AddMaterial;
