/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import style1 from './index.less';
import { NavSwiper } from '@/components';
import { RightCircleOutlined } from '@ant-design/icons';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    //
  }
  render() {
    const {
      width,
      title,
      showMore,
      onMore,
      nav,
      navId,
      handleChangeNav,
      classNames,
      isTalenter = true,
      isShowNum = true, // 用来控制是否显示数量的,默认为显示,不需要显示则传false,比如人才市场的
      isShowIon, // 是否显示标题后的图标,默认不显示
      ...restProps
    } = this.props;
    const more = (
      <span>
        更多 <RightCircleOutlined style={{ fontSize: '10px' }} />
      </span>
    );
    return (
      <div
        className={`${style1.cardWrap} ${classNames}`}
        style={{
          width: width ? width : '100%',
          padding: nav ? 0 : '35px 40px',
          ...restProps.style,
        }}
      >
        {/*标题*/}
        {title ? (
          <div className={style1.cardTitle}>
            <div className={style1.title}>{title}</div>

            <div className={style1.cardMore} onClick={onMore}>
              {showMore ? more : ''}
            </div>
          </div>
        ) : null}
        {/*切换*/}
        {/* {nav && nav.length > 0 ? (
          isTalenter ? (
            <Nav
              nav={nav}
              navId={navId}
              isShowNum={isShowNum}
              isShowIon={isShowIon}
              handleChangeNav={handleChangeNav}
            />
          ) : (
            <NavSwiper nav={nav} navId={navId} handleChangeNav={handleChangeNav} />
          )
        ) : null} */}
        {/* <NavSwiper nav={nav} navId={navId} handleChangeNav={handleChangeNav} /> */}
        <Fragment>{this.props.children}</Fragment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(Card);
