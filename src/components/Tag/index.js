import React, { Component, Fragment } from 'react';
import style from './index.less';

class tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagInfo: {
        info: {
          fontColor: '#0072EA',
          backgroundColor: '#EBF3FE',
        },
        warning: {
          fontColor: '#FFBE4B',
          backgroundColor: '#FDF8EE',
        },
        error: {
          fontColor: '#FF7C88',
          backgroundColor: '#FFF2F3',
        },
        gary: {
          ontColor: '#909399',
          backgroundColor: '#F6F6F6',
        },
      },
    };
  }
  componentDidMount() {}
  render() {
    const { content, type, customStyle } = this.props;
    const { tagInfo } = this.state;
    //
    return (
      <Fragment>
        <span
          className={style.tag}
          style={{
            color: tagInfo[type].fontColor,
            backgroundColor: tagInfo[type].backgroundColor,
            ...customStyle,
          }}
        >
          {content}
        </span>
      </Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {};
}
export default tag;
