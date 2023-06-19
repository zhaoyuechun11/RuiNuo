import React, { Component } from 'react';
import { connect } from 'umi';
import { Icon } from "@components"
import style from './index.less';

class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
        };
      }
    render() {
        const { content, onClose, show, ...restProps } = this.props;
        return (
            show ? 
                <div className={style.noticeWarp}>
                <div className='flex_start' style={{ width: 'calc(100% - 26px)' }}>
                  <span  className={style.icon1}><Icon name="iconhouxuanren-xiaoxi" style={{ fontSize: '20px' }}/></span>
                  <div className={style.noticeContent}>
                    <div className={style.scrollContent}>
                        <div>{content || ''}</div>
                        <div>{content || ''}</div>
                    </div>
                  </div>
                </div>
                <span className={style.icon2}><Icon name="icongongzuotai-shurukuangguanbi"  onClick={onClose} /></span>
            </div>: ''  
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(
    mapStateToProps,
)(Alert);