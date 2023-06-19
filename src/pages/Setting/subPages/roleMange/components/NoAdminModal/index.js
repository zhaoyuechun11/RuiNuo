import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import styles from './index.less';
class AdminModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        visible: false
      };
  }
  handleOk = () => {
      this.setState({
        visible: true
      })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    let {description} = this.props;
    return <div>
        <Modal
          visible={this.state.visible}
          footer={null}
          centered
          className={styles.adminModal}
          closable= {false}
          width= {700}
        >
         <div className={styles.top}>
           <span>温馨提示</span>
         </div>
         <div className={styles.middle}>
           <div className={styles.tip}>管理员角色不存在</div>
           <div className={styles.description}>
              <p>尊敬的用户：</p>
              <p className={styles.title}>你的易招聘系统内不存在管理员角色，请联系钉钉主管理员登录易招聘系统重新分配角色账号。</p>
             </div>
         </div>
         <div className={styles.bottom}>
         <Button type="primary" onClick={() => this.handleCancel()} className={styles.btn}>我知道了</Button>
         </div>
        </Modal>
    </div>
  }
}

export default AdminModal;
