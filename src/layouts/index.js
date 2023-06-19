import React, { Component,  } from 'react';
import MenuComps from './components/MenuComps/index';
import Header from './components/Header/index';
import CatchError from './components/Error/index';
import s from './index.less';
import { connect } from 'react-redux';

import { ConfigProvider, Spin, Layout,} from 'antd';

const { Content } = Layout;
import zhCN from 'antd/es/locale/zh_CN';


@connect(({ global }) => ({
  global,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: true,
    };
  }
  componentWillMount() {
  
  }

  componentDidMount() {}



  _renderSuccess = () => {
    this.setState({
      pageLoading: false,
    });
  };

  render() {
    return (
      <CatchError>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={this.state.pageLoading}>
            <Layout style={{ minHeight: '100vh' }}>
              <MenuComps renderSuccess={this._renderSuccess} />
              <Layout style={{backgroundColor:'#fff'}}>
                <Header />
                <Content style={{ margin: '50px 16px' }}>{this.props.children}</Content>
              </Layout>
            </Layout>
          </Spin>
        </ConfigProvider>
      </CatchError>
    );
  }
}

export default index;
