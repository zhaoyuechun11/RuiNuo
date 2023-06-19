import React, { Component, Fragment } from 'react';
import { Modal, message } from 'antd';
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载

import PDFView from './pdf';

class index extends Component {
  constructor() {
    super();
    this.state = {
      pdfUrl: '', // pdf链接
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  //如果是PDF就 调用组件的方法 显示弹窗
  isShowHide = () => {
    this.pdfView.isShowHide();
  };

  initShowPdfImg = () => {
    const { url } = this.props;
    const link = url ? url.split('?')[0] : '';
    const type = link ? link.substr(link.lastIndexOf('.') + 1) : '';
    if (type.toLowerCase() !== 'pdf') {
      if (dd.env.platform !== 'notInDingTalk') {
        dd.biz.util.previewImage({
          urls: [url], //图片地址列表
          current: url, //当前显示的图片链接
          onSuccess: function(result) {},
          onFail: function(err) {},
        });
      } else {
        message.warning('请在钉钉环境打开内购页面');
      }
    } else {
      this.setState(
        {
          pdfUrl: url,
        },
        () => {
          this.isShowHide();
        },
      );
    }
  };
  render() {
    const { pdfUrl } = this.state;
    const { title } = this.props;
    return (
      <Fragment>
        <PDFView
          onRef={ref => (this.pdfView = ref)}
          url={pdfUrl}
          title={title ? title : '预览简历'}
        ></PDFView>
      </Fragment>
    );
  }
}

export default index;
