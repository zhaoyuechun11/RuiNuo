import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import URL from '../../../../utils/env';
import { platform } from '@/utils/index';
import styles from './index.less';

class index extends Component {
  constructor() {
    super();
    this.state = {
      isShowVisible: false, //控制弹指的显示隐藏
      isModal: false, // 用来判断是弹窗还是,页面展示
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  //控制弹指的显示隐藏
  isShowHide = () => {
    this.setState({
      isShowVisible: !this.state.isShowVisible,
    });
  };

  render() {
    const { isShowVisible, isModal } = this.state;
    const { url, title } = this.props;
    let isWin = ~platform().indexOf('Win');
    let isUrl = isWin
      ? `${URL.api_pdf_windows}?url=${encodeURIComponent(url)}`
      : `${URL.api_pdf}/pdf/web/viewer.html?file=${encodeURIComponent(url)}`;

    let iFrame = <iframe style={{ width: 800, height: 640, margin: '20px' }} src={isUrl}></iframe>;
    return (
      <Fragment>
        {!isModal && (
          <Modal
            maskClosable={false}
            title={title ? title : '预览简历'}
            width={840}
            visible={isShowVisible}
            onCancel={this.isShowHide}
            onOk={this.onTagHandleSure}
            destroyOnClose={true}
            footer={null}
            className={`${styles['ic-dialog-modal']}`}
            closeIcon={<CloseCircleOutlined />}
          >
            {isWin ? (
              <div
                style={{
                  width: '736px',
                  background: 'red',
                  position: 'absolute',
                  height: '684px',
                  zIndex: 1,
                  opacity: 0,
                }}
              ></div>
            ) : (
              ''
            )}
            {iFrame}
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default index;
