import React, { Component } from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import style from './index.less';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // 显示回退UI
    this.setState({ hasError: true }, () => {});
    // 你也可以把错误信息上报给错误上报服务器
    //logErrorToMyService(error, info);
  }
  goBack = () => {
    history.push('/');
    this.setState({ hasError: false });
  };
  refresh = () => {
    let pathname = history.location.pathname;
    history.push(pathname);
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={style.errorBox}>
          <img src={require('./src/img/netWorkError.png')} alt="" />
          <div className={style.text}>页面出现错误</div>
          <div className={style.btnBox}>
            <div className={`${style.back} ${style.btn}`} onClick={this.goBack.bind(this)}>
              返回首页
            </div>
            <div className={`${style.refresh} ${style.btn}`} onClick={this.refresh.bind(this)}>
              刷新
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
