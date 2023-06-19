import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import Card from '../../../components/Card/index';
import style from '../style/menu.less';
import { Link, history } from 'umi';

class SettingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {}
  render() {
    const { dataSource } = this.props;
    return dataSource.map((item, index) => (
      <div>
        <div className={style.menuTitle}>
          <div className={style.line}></div>
          <div className={style.name}>{item.title}</div>
        </div>
        <div className={style.items}>
          {item.children.map((v, k) => (
            <Link key={k} to={v.path}>
              <Card width={330} style={{ marginRight: '20px', marginBottom: '30px' }}>
                <div className="flex_center flex_c">
                  <div className={style.round}></div>
                  <div>{v.title}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    ));
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SettingMenu);
