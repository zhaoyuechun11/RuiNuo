/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from 'react';
import style1 from './index.less';
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

        <Fragment>{this.props.children}</Fragment>
      </div>
    );
  }
}

export default Card;
