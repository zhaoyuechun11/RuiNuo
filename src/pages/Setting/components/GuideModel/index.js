import React, { Fragment, Component } from 'react';
import classNames from 'classnames';
import style from './index.less';
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { step } = this.props;
    return (
      <div className={style.indexWrapper}>
        <div
          className={classNames(style.step, style.step1)}
          style={{ display: step === 1 ? 'block' : 'none' }}
        >
          <img
            src={require('@assets/images/guideImg/setting/step1.png')}
            alt=""
          />
          <div className={style.btnBox}>
            <div
              className={style.text}
              onClick={() => {
                this.props.checkStep(0);
              }}
            >
              跳过
            </div>
            <div
              className={style.btn}
              onClick={() => {
                this.props.checkStep(2);
              }}
            >
              下一步(1/5)
            </div>
          </div>
        </div>

        <div
          className={classNames(style.step, style.step2)}
          style={{ display: step === 2 ? 'block' : 'none' }}
        >
          <img
            src={require('@assets/images/guideImg/setting/step2.png')}
            alt=""
          />
          <div className={style.btnBox}>
            <div
              className={style.text}
              onClick={() => {
                this.props.checkStep(1);
              }}
            >
              上一步
            </div>
            <div
              className={style.btn}
              onClick={() => {
                this.props.checkStep(3);
              }}
            >
              下一步(2/5)
            </div>
          </div>
        </div>
        <div
          className={classNames(style.step, style.step3)}
          style={{ display: step === 3 ? 'block' : 'none' }}
        >
          <img
            src={require('@assets/images/guideImg/setting/step3.png')}
            alt=""
          />
          <div className={style.btnBox}>
            <div
              className={style.text}
              onClick={() => {
                this.props.checkStep(2);
              }}
            >
              上一步
            </div>
            <div
              className={style.btn}
              onClick={() => {
                this.props.checkStep(4);
              }}
            >
              下一步(3/5)
            </div>
          </div>
        </div>

        <div
          className={classNames(style.step, style.step4)}
          style={{ display: step === 4 ? 'block' : 'none' }}
        >
          <img
            src={require('@assets/images/guideImg/setting/step4.png')}
            alt=""
          />
          <div className={style.btnBox}>
            <div
              className={style.text}
              onClick={() => {
                this.props.checkStep(3);
              }}
            >
              上一步
            </div>
            <div
              className={style.btn}
              onClick={() => {
                this.props.checkStep(5);
              }}
            >
              下一步(4/5)
            </div>
          </div>
        </div>

        <div
          className={classNames(style.step, style.step5)}
          style={{ display: step === 5 ? 'block' : 'none' }}
        >
          <img
            src={require('@assets/images/guideImg/setting/step5.png')}
            alt=""
          />
          <div className={style.btnBox}>
            <div
              className={style.text}
              onClick={() => {
                this.props.checkStep(4);
              }}
            >
              上一步
            </div>
            <div
              className={style.btn}
              onClick={() => {
                this.props.checkStep(0);
              }}
            >
              我已了解设置
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Index.defaultProps = {};

export default Index;
