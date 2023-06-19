import React, { Component } from 'react';
import moment from 'moment';

import s from './index.less';
const person = require('./src/1.png');
const title = require('./src/2.png');
const num = require('./src/3.png');
const day = require('./src/4.png');
export default class index extends Component {
  constructor() {
    super();
    this.state = {
      timer: 5000,
      flag: true,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        flag: false,
      });
    }, this.state.timer);
  }
  render() {
    return (
      <div>
        <div style={{ display: this.state.flag ? 'block' : 'none' }}>
          <div className={s.testLoading}>
            <div className={s.content}>
              <img src={person} className={s.person} />
              <div className={s.word}>
                <img src={title} className={s.title} />
                <div className={s.dayContent}>
                  <img src={num} className={s.num} />
                  <div className={s.dayNum}>
                    {moment().diff('2020-10-13', 'day')}
                  </div>
                  <img src={day} className={s.day} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
