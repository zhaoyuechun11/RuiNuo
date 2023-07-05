import React, { useImperativeHandle, useRef, useState } from 'react';
import ImageGallery from '../ImageGallery';
import { Dialog } from '@components';
import { useDispatch } from 'umi';

const AddMaterial = ({ refs }) => {
  const dispatch = useDispatch();
  const [imagesList, setImagesList] = useState([]);
  const dialog = useRef();
  useImperativeHandle(refs, () => ({
    show: () => {
      dialog.current && dialog.current.show();
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
    debugger
    setImagesList(newList);
  };

  const onDelete = (index) => {
    debugger
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
  return (
    <div>
      <Dialog ref={dialog}>
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
