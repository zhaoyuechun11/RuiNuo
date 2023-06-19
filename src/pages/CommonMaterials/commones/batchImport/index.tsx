import { Upload, message, Spin, Progress } from 'antd';
import React, { useRef, useState, Fragment, useImperativeHandle } from 'react';
import { Dialog } from '@components';
import styles from './index.less';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
let length = 1;
//let current = 0;
const BatchImport = ({ cRef, actionUrl, title, refresh, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [successNum, setSuccessNum] = useState(0);
  const [errorNum, setErrorNum] = useState(0);
  const [errorMsg, setErrorMsg] = useState([]);
  const [fileName, setFileName] = useState('');
  const numRef = useRef(0);
  const [per, setPer] = useState(0);
  const modalRef = useRef(); //excle导入弹框
  function handleClear() {
    setSuccessNum(0);
    setErrorNum(0);
    setErrorMsg([]);
    setFileName('');
    setPer(0);
  }
  useImperativeHandle(cRef, () => ({
    show: () => {
      handleClear();
      modalRef.current.show();
    },
  }));

  const uploadProps = {
    showUploadList: false,
    accept: '.xls,.xlsx',
    method: 'post',
    action: actionUrl,
    data: {},
    headers: {
      Authorization: `${localStorage.getItem('access_token')}`,
      'X-Requested-With': null,
    },
    beforeUpload: (file) => {
      //   return new Promise((resolve, reject) => {
      //     const isLt10M = file.size <= 50 * 1024 * 1024;
      //     if (!isLt10M) {
      //       message.warning('文件不能大于50M');
      //       return reject(false);
      //     }
      //     return resolve(true);
      //   });
      //length++;
    },
    onChange(info) {
      const { status, name } = info.file;
      let fielArr = ['xls', 'xlsx'];
      let type = name.substr(name.lastIndexOf('.') + 1);
      // if (fielArr.indexOf(type) == -1) {
      //   message.warning('不支持文件类型');
      //   return;
      // }
      if (status === 'uploading') {
        setLoading(true);
        numRef.current = 0;
        setPercent();
      }
      if (status === 'done') {
        let res = info.file.response;
        if (res.code === 200) {
          numRef.current = 1;
          setPercent();
          refresh();
          message.success('上传成功');
          setLoading(false);
          setSuccessNum(info.file.response.data.success);
          setErrorNum(info.file.response.data.failed);
          setErrorMsg(info.file.response.data.failed_array);
          setFileName(info.file.name);
        } else {
          numRef.current = 0;
          setPercent();
          setLoading(false);
          message.warning(`${res.msg}.`);
        }
      } else if (status === 'error') {
        setLoading(false);
        message.warning('无效的文件');
      }
    },
  };

  const setPercent = () => {
    setPer(numRef.current / length);
  };
  let total = successNum + errorNum;
  return (
    <Fragment>
      <Dialog
        title={`批量导入${title}`}
        width={864}
        ref={modalRef}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.contentBox}>
          {/* <Spin> */}
          <div className={styles.content}>
            <div className={styles.tip}>
              <span></span>
              <span>上传附件</span>
            </div>
            <div className={styles.template_content}>
              <div className={styles.template_left}>
                {/* <img
                    src={require(fileName
                      ? './img/template1.png'
                      : './img/template.png')}
                  /> */}
                <img src={require('./img/template2.png')} />
                <span
                  className={styles.template_left_text}
                  style={{ color: fileName ? '#909399' : '' }}
                >
                  批量导入{title}模版
                </span>
              </div>
            </div>
            <div className={styles.uploadBox} style={{ display: fileName ? 'none' : 'flex' }}>
              <Dragger {...uploadProps} className={styles.upload}>
                <div className={styles.list}>
                  <div className={styles.addFile}>
                    <div className={styles.addIcon}>
                      <PlusOutlined style={{ color: '#007BFF' }} />
                    </div>
                    <div className={styles.click_tips} style={{ color: '#0E1114' }}>
                      拖拽至此或点击上传附件
                    </div>
                  </div>
                </div>
              </Dragger>
            </div>
            <div className={styles.import_file} style={{ display: fileName ? 'flex' : 'none' }}>
              <div className={styles.file_content}>
                <img className={styles.excel_icon} src={require('./img/excel.png')} />
                <div className={styles.import_file_info}>
                  <div className={styles.file_title}>{fileName}</div>
                  {/* <div className={styles.file_status}>
                    <span>
                      共读取 <i style={{ color: total > 0 ? '' : '#FF3B30' }}>{total}</i> 条职位信息
                    </span>
                    <span>
                      有效{' '}
                      <i style={{ color: successNum > 0 ? '#0C7BD7' : '#FF3B30' }}>{successNum}</i>{' '}
                      个
                    </span>
                    {errorMsg.length > 0 ? (
                      <div
                        style={{
                          width: '150px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'inline-block',
                        }}
                      >
                        <Popover
                          placement="rightTop"
                          title="格式错误"
                          content={
                            <div className={styles.pop}>
                              {errorMsg.map((item, index) => {
                                return <div key={index}>{item}</div>;
                              })}
                            </div>
                          }
                          trigger="click"
                        >
                          <div>
                            格式错误 <i style={{ color: '#FF3B30' }}>{errorNum}</i> 个{' '}
                            <a style={{ color: '#0C7BD7' }}>查看</a>
                          </div>
                        </Popover>
                      </div>
                    ) : (
                      <span>
                        格式错误 <i style={{ color: '#FF3B30' }}>{errorNum}</i> 个
                      </span>
                    )}
                  </div> */}
                </div>
              </div>
              <div className={styles.import_right}>
                <Dragger {...uploadProps}>
                  <img src={require('./img/shangchuan_1.png')} style={{ width: 14, height: 14 }} />
                  <span className={styles.import_right_text}>重新上传</span>
                </Dragger>
              </div>
            </div>
            {loading ? (
              <Spin
                spinning={loading}
                indicator={
                  <div className={styles.progress_div}>
                    <Progress
                      type="circle"
                      percent={per * 100}
                      format={(percent) => `${numRef.current} / ${length}`}
                      //   style={{ background: '#fff', color: '#007BFF' }}
                    />
                    <div style={{ marginTop: 20 }}>{title}上传中...</div>
                  </div>
                }
              />
            ) : null}
          </div>
          {/* </Spin> */}
        </div>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = ({ global }) => {
  return {
    global,
  };
};

export default connect(mapStateToProps)(BatchImport);
