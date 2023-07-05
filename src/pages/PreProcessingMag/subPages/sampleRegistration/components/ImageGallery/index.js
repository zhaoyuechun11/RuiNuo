import React, { useState, useEffect } from 'react';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { CheckOutlined } from '@ant-design/icons';
import { useDispatch, history, useSelector } from 'umi';
import { Icon } from '@components';
import styles from './index.less';

const ImageGallery = ({
  imageList,

  selectedImgURL,
  // value,
  onChange,
  onSelect,
  onUpload,
  onDelete,
}) => {
  const dispatch = useDispatch();
  // const [checkedId, setCheckedId] = useState(selectedImgURL);
  const enterPriseId = localStorage.getItem('enterprise_id');
  const operatorId = localStorage.getItem('operator_id');
  // const companyInfo = JSON.parse(localStorage.getItem('companyDefaultInfo'));
  const { plan_id } = history.location.query;

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  // 统一保存model的值
  const saveValue = (val) => {
    dispatch({
      type: `PreProcessingMag/save`,
      payload: {
        dataSource: val,
      },
    });
  };
  // 保存多个
  const saveMore = (payload) => {
    dispatch({
      type: `PreProcessingMag/saveMore`,
      payload,
    });
  };

  // 删除图片保存空值
  const delImgSaveVal = (index) => {
    const firstImg = imageList.splice(index, 1);
    debugger;
    saveMore({
      pcBannerImgURL: firstImg.full_url,
      pcBanner: {
        full_url: '',
        url: '',
      },
    });

    triggerChange(firstImg.url);
    onDelete?.(index);
  };
  // 删除图片
  const onDeleteImg = (e, index) => {
    e.stopPropagation();
    delImgSaveVal(index);
  };

  // 选择图片
  const onChangeImg = (item) => {
    const { full_url, url } = item;
    if (full_url) {
      saveValue(full_url);
      typeof onSelect === 'function' && onSelect(item);
      triggerChange(url);
    }
  };

  const uploadHTML = (isIcon = false) => {
    const uploadURL = `${process.env.baseURL}/file/upload`;

    const data = {
      // scene: type, // 1=>PC,2=>mobile,3=>公司介绍图片
      //   plan_id,
      //   enterprise_id: enterPriseId,
      //   operator_id: operatorId,
    };

    const uploadProps = {
      name: 'file',
      method: 'post',
      accept: '.png, .jpeg, jpg, .JPG',
      action: uploadURL,
      showUploadList: false,
      headers: {
        Authorization: `${localStorage.getItem('access_token')}`,
        'X-Requested-With': null,
      },
      onChange(info) {
        const { status, response } = info.file;
        if (status === 'done') {
          const { fileServerUrl } = response.data;

          // 公司照片
          saveValue({
            fileServerUrl,
          });

          onChangeImg(response.data);
          onUpload?.(response.data);
          // triggerChange(url);
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

    // 1=>pc,2=>mobile,3=>logo,4=>卡片设置图
    const propsImgCrop = {
      //   aspect: type === 1 ? 3.61 / 1 : type === 2 ? 2.14 / 1 : 2.03 / 1,
      // width: 1920,  //裁剪宽度
      // height: 532, //裁剪高度
      // zoom: false, // 图片缩放
      aspect: 3.61 / 1,
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
            <div className={`${styles.picList} ${styles.uploadWrapper}`}>
              <img
                className={styles.uploadIcon}
                src={require('@assets/images/commom/uploadPic.png')}
                alt=""
              />
              <span>上传图片</span>
            </div>
          ) : (
            <Icon title="重新上传" classStyle={styles.rejectIcon} name="iconanniu-zhongxinfasong" />
          )}
        </Upload>
      </ImgCrop>
    );
  };
  useEffect(() => {
    renderCustomImg();
  }, [imageList]);
  const renderCustomImg = () => {
    if (imageList.length > 0) {
      return imageList.map((item, index) => {
        return (
          <>
            <div
              className={styles.picList}
              onClick={() => {
                //   onChangeImg(customImg);
              }}
            >
              <img className={styles.picImg} src={item.fileServerUrl} alt="" />
              {item.fileServerUrl === selectedImgURL && (
                <div className={styles.triangle}>
                  <CheckOutlined title="重新上传" className={styles.icon} />
                </div>
              )}
              <div className={styles.mask}>
                {uploadHTML(true)}
                {/* <Icon
                classStyle={styles.activeIcon}
                onClick={() => {
                  onChangeImg(newImgId);
                }}
                name="iconanniu-qiyong"
              /> */}
                <Icon
                  title="删除"
                  classStyle={styles.delIcon}
                  onClick={(e) => onDeleteImg(e, index)}
                  name="iconanniu-shanchu"
                />
              </div>
            </div>
            {index === imageList.length - 1 && <div>{uploadHTML()}</div>}
          </>
        );
      });
    }
    return uploadHTML();
  };

  return (
    <div className={styles.uploadPic}>
      <div className={styles.picBox}>
        {/* 默认图片列表 */}
        {/* {imageList.map((item, index) => (
          <div
            className={styles.picList}
            key={item.url}
            onClick={() => {
              onChangeImg(item);
            }}
          >
            {index !== imageList.length - 1 ? (
              <>
                <img className={styles.picImg} src={item.fileServerUrl} alt="" />
                {item.fileServerUrl === selectedImgURL && (
                  <div className={styles.triangle}>
                    <CheckOutlined className={styles.icon} />
                  </div>
                )}
              </>
            ) : (
              renderCustomImg()
            )}
          </div>
        ))} */}
        {renderCustomImg()}
      </div>
    </div>
  );
};

export default ImageGallery;
