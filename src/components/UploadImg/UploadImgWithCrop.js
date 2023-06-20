import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload,message } from 'antd';
import style from './index.less';

const UploadImgWithCrop = ({ disabled, imgURL, onChange }) => {
  const [uploadedImage, setUploadedImage] = useState({});

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const uploadHTML = (isIcon = false) => {
    const uploadProps = {
      method: 'post',
      accept: '.png, .jpeg, jpg, .JPG',
      action: `${process.env.baseURL}/file/upload`,
      showUploadList: false,
      headers: {
        Authorization: `${localStorage.getItem('access_token')}`,
        'X-Requested-With': null,
      },
      onChange(info) {
        const { status, response } = info.file;

        if (status === 'done') {
          const { fileServerUrl, fileServerName } = response.data;
          setUploadedImage({
            fileServerUrl,
            fileServerName,
          });
          triggerChange(fileServerUrl);
        } else if (status === 'error') {
          message.error('图片上传失败');
        }
      },
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片不能大于2M');
        }
        return isLt2M;
      },
    };

    const propsImgCrop = {
      aspect: 1 / 1,
      // width: 1920,  //裁剪宽度
      // height: 532, //裁剪高度
      // zoom: false, // 图片缩放
      quality: 1, // 图片质量
      resize: false, // 裁剪是否可以调整大小
      resizeAndDrag: true, // 裁剪是否可以调整大小、可拖动
      modalTitle: '图片剪裁', // 弹窗标题
      modalWidth: 900, // 弹窗宽度
    };
    return (
      <ImgCrop {...propsImgCrop}>
        <Upload {...uploadProps}>
          {!isIcon ? (
            <div className={`${style.uploadText}`}>
              <span>上传图片</span>
            </div>
          ) : (
            <Icon classStyle={style.rejectIcon} name="iconanniu-zhongxinfasong" />
          )}
        </Upload>
      </ImgCrop>
    );
  };

  return (
    <div className={style.uploadContent}>
      {disabled ? (
        <img
          src={
            uploadedImage.fileServerUrl || imgURL || require('@assets/images/setting/companyinfo.png')
          }
        />
      ) : (
        <div className={style.picList}>
          <img
            className={style.picImg}
            src={
              uploadedImage.fileServerUrl || imgURL || require('@assets/images/setting/companyinfo.png')
            }
            alt=""
          />
          {uploadHTML()}
        </div>
      )}
    </div>
  );
};

export default UploadImgWithCrop;
