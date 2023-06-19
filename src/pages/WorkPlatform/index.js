import React, { Component } from 'react';
import { connect, history } from 'umi';
import { Card } from '@components';
import Tag from './components/tag';
import Canlendar from './components/canlendar';
import TimeList from './components/timeList'; //即将面试
import NoData from './components/noData'; //没有数据
import GuideModel from './components/GuideModel'; // 引导层
import ResumeModel from './components/ResumeModel';
import UpdateModal from './components/UpdateModal'; // 新功能更新弹窗
import Icon from '@components/Icon'; // icon
import style from './style/index.less';
import moment from 'moment';
import Alert from '../../layouts/components/Alert';
import Things from './components/Things';
import { getPending } from './models/server';
import PendingModal from './components/PendingModal'; // 待办事项
import FeedbackModal from './components/FeedbackModal'; //意见反馈
import ServerTip from './components/ServerTip'; // 服务到期弹框
import { getExpireInfo } from './models/server';
// import { DetailModal } from '@common';



const VERSION = '4.4';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: {
        1: '已拒绝',
        2: '已撤销',
        3: '已确认',
        4: '待接受',
      },
      date: '',
      step: 0, // 新手引导
      showNotice: true,
      noticeInfo: {},
      updateVisible: false,
      pendingInfo: {},
      pendVisible: false,
    };
    this.feedbackRef = React.createRef();
    this.serverRef = React.createRef();
    this.detailRef = React.createRef();
  }
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'WorkPlatform/getRemoteList',
    //   payload: {
    //     enterprise_id: global.enterprise_id,
    //     operator_id: global.operator_id,
    //     version: '3.0.5',
    //   },
    // });
    console.log('xml', xmlstr)
    this.init_num();
    this.init_WillInterview();
    this.init_ResumeList();
    this.init_OfferList();
    this.init_EditionList();
    this.init_EntryList();
    this.init_notice();
    this.initPending();
    // 新手引导
    let newStep = Utils.getItem();

    this.props.dispatch({
      type: 'global/setStepNum',
      payload: newStep ? newStep : this.props.global.defaultObj,
    });

    // this.setState({
    //   step: newStep && +newStep.workStep === 0 ? 0 : 1,
    // });

    this.init_showUpdate();
    if (!sessionStorage.getItem('server')) {
      this.initServer();
    }
    //this.initBpmn()
  }
   initBpmn = () => {

   let bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      //添加控制板
      propertiesPanel: {
        parent: '.properties-panel'
      },
      additionalModules: [
        // 左边工具栏以及节点
        //propertiesPanelModule,
        // propertiesProviderModule
      ],
      moddleExtensions: {
        // camunda: camundaModdleDescriptor
       }
    });

   // this.createBpmnDiagram();
   try {
    const result =  bpmnModeler.importXML(xmlstr);
   // console.log(result);
   // console.log('属性面板数据: ', bpmnModeler.get('propertiesPanel'));
 } catch (error) {
   console.error(error)
 }
  }
//  createBpmnDiagram = async (value) => {
//     // 开始绘制出事bpmn的图
//     try {
//        const result = await bpmnModeler.importXML(xmlstr);
//       // console.log(result);
//       // console.log('属性面板数据: ', bpmnModeler.get('propertiesPanel'));
//     } catch (error) {
//       console.error(error)
//     }
//   }
  
  initServer() {
    getExpireInfo().then((res) => {
      if (res.status_code == 200) {
        if (Object.keys(res.data).length > 0) {
          this.serverRef.current && this.serverRef.current.show(res.data);
        }
      }
    });
  }
  initPending() {
    getPending().then((res) => {
      this.setState({
        pendingInfo: res.data,
      });
    });
  }
  init_notice() {
    if (sessionStorage.getItem('notice')) {
      return;
    }
    this.props.dispatch({
      type: 'global/_getEditionNotice',
      payload: {
        enterprise_id: this.props.global.enterprise_id,
        operater_id: this.props.global.operater_id,
        version: '3.0.5',
        callback: (res) => {
          this.setState({
            noticeInfo: res.data ? res.data : {},
            showNotice: res.data && res.data.unit_url ? true : false,
          });
        },
      },
    });
  }
  handleCloseNotice() {
    sessionStorage.setItem('notice', 1);
    this.setState({
      showNotice: false,
    });
  }

  // 是否显示新功能更新弹窗
  init_showUpdate() {
    if (localStorage.getItem('VERSION') && localStorage.getItem('VERSION') === VERSION) {
      this.setState({
        updateVisible: false,
      });
    } else {
      this.setState({
        updateVisible: true,
      });
    }
  }

  init_num() {
    this.props.dispatch({
      type: 'WorkPlatform/getTodayNum',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      },
    });
  }
  init_WillInterview() {
    this.props.dispatch({
      type: 'WorkPlatform/getWillInterview',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      },
    });
  }
  init_ResumeList() {
    this.props.dispatch({
      type: 'WorkPlatform/getResumeList',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      },
    });
  }
  init_OfferList() {
    this.props.dispatch({
      type: 'WorkPlatform/getOfferList',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      },
    });
  }
  init_EditionList() {
    this.props.dispatch({
      type: 'WorkPlatform/getEditionList',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
      },
    });
  }
  init_EntryList() {
    this.props.dispatch({
      type: 'WorkPlatform/getEntryList',
      payload: {
        enterprise_id: global.enterprise_id,
        operator_id: global.operator_id,
        today_date: this.state.date,
      },
    });
  }
  toRouter = (path) => {
    history.push(path);
  };
  handleChangeDate = (e) => {
    this.setState(
      {
        date: e,
      },
      () => {
        this.init_EntryList();
      },
    );
  };


  checkStep = (val) => {
    this.setState(
      {
        step: +val,
      },
      () => {
        if (val === 0) {
          this.props.dispatch({
            type: 'global/setStepNum',
            payload: { workStep: 1 },
          });
          Utils.setItem('workStep');
        }
      },
    );
  };
  render() {
    const { WorkPlatform, global } = this.props;
    const { step, pendingInfo } = this.state;
    return (
      <div>111</div>
      // <div>
      //     <div id="canvas" className="container" />
      //     <div className='properties-panel'></div>
      // </div>
      // <div className={style.workPlatWrap}>
      //   {this.state.noticeInfo.is_update === 1 ? (
      //     <Alert
      //       content={this.state.noticeInfo.unit_url}
      //       show={this.state.showNotice}
      //       onClose={() => {
      //         this.handleCloseNotice();
      //       }}
      //     />
      //   ) : (
      //     ''
      //   )}
      //   <div className={style.rowBlock}>
      //     {/* <Card width={540} classNames={style.cardpos} style={{ height: 140 }}>
           
      //     </Card> */}
      //     <Card
      //       width={'66%'}
      //       style={{ paddingLeft: '30px', marginRight: 30, paddingRight: '0' }}
      //       className={style.topCards}
      //     >
      //       <div className={style.topCard}>
      //         <div className={style.todayInfoLeft}>
      //           <img
      //             className={style.totalPic}
      //             src={require('../../assets/images/workplat/workplat_pic1.png')}
      //           />
      //         </div>

      //         <div className={style.todayInfo}>
      //           <div
      //             className={`${style.showCount} ${style.centerCount}`}
      //             onClick={() => this.toRouter('/recruitment/index')}
      //           >
      //             <div>
      //               <div className={style.subTitle}>在招职位总数</div>
      //               <div className={style.count}>
      //                 <span style={{ paddingRight: '4px' }}>{WorkPlatform.numInfo.positions}</span>
      //                 <span style={{ fontSize: '14px' }}>个</span>
      //               </div>
      //             </div>
      //           </div>
      //           <div className={style.line}></div>
      //           <div
      //             className={`${style.showCount} ${style.centerCount}`}
      //             onClick={() => {
      //               this.toRouter({
      //                 pathname: '/calendar/index',
      //                 query: {
      //                   type: 1,
      //                 },
      //               });
      //               localStorage.setItem('todayTime', 1);
      //             }}
      //           >
      //             <div>
      //               <div className={style.subTitle}>今日待面试</div>
      //               <div className={style.count}>
      //                 <span style={{ paddingRight: '4px' }}>{WorkPlatform.numInfo.interviews}</span>
      //                 <span style={{ fontSize: '14px' }}>人</span>
      //               </div>
      //             </div>
      //           </div>
      //           <div className={style.line}></div>
      //           <div
      //             className={`${style.showCount} ${style.centerCount}`}
      //             onClick={() => {
      //               this.toRouter({
      //                 pathname: '/candidate/index',
      //                 query: {
      //                   process: 99,
      //                 },
      //               });
      //             }}
      //           >
      //             <div>
      //               <div className={style.subTitle}>今日待筛选简历</div>
      //               <div className={style.count}>
      //                 <span style={{ paddingRight: '4px' }}>{WorkPlatform.numInfo.resume}</span>
      //                 <span style={{ fontSize: '14px' }}>人</span>
      //               </div>
      //             </div>
      //           </div>
      //           <div className={style.line}></div>
      //           <div
      //             className={`${style.showCount} ${style.centerCount}`}
      //             onClick={() => {
      //               this.toRouter({
      //                 pathname: '/candidate/index',
      //                 query: {
      //                   process: 5,
      //                 },
      //               });
      //             }}
      //           >
      //             <div>
      //               <div className={style.subTitle}>面试通过</div>
      //               <div className={style.count}>
      //                 <span style={{ paddingRight: '4px' }}>
      //                   {WorkPlatform.numInfo.process_pass}
      //                 </span>
      //                 <span style={{ fontSize: '14px' }}>人</span>
      //               </div>
      //             </div>
      //           </div>
      //           <div className={style.line}></div>
      //           <div
      //             className={`${style.showCount} ${style.centerCount}`}
      //             onClick={() => {
      //               this.toRouter({
      //                 pathname: '/candidate/index',
      //                 query: {
      //                   process: 7,
      //                 },
      //               });
      //             }}
      //           >
      //             <div>
      //               <div className={style.subTitle}>待入职</div>
      //               <div className={style.count}>
      //                 <span style={{ paddingRight: '4px' }}>{WorkPlatform.numInfo.entry}</span>
      //                 <span style={{ fontSize: '14px' }}>人</span>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </Card>
      //     <Card
      //       width={'32%'}
      //       style={{ minHeight: 140, paddingLeft: 0, paddingRight: 0 }}
      //       className={style.topCards}
      //     >
      //       <div className={style.notice}>
      //         <div
      //           className={style.notice_item}
      //           onClick={() => {
      //             this.toRouter('/candidate/waitDistribution');
      //           }}
      //         >
      //           <img
      //             className={style.Icon}
      //             src={require('../../assets/images/workplat/email.png')}
      //           />
      //           <div className={style.notice_title}>
      //             邮箱同步简历消息
      //             <span
      //               style={{
      //                 color: '#007BFF',
      //                 fontSize: '20px',
      //                 fonteight: 600,
      //                 paddingLeft: '4px',
      //                 paddingRight: '4px',
      //               }}
      //             >
      //               {WorkPlatform.numInfo.email_user}
      //             </span>
      //             个
      //           </div>
      //         </div>
      //         <div className={style.line}></div>
      //         <div
      //           className={style.notice_item}
      //           onClick={() => {
      //             this.toRouter('/candidate/followReminde');
      //           }}
      //         >
      //           <img
      //             className={style.Icon}
      //             src={require('../../assets/images/workplat/candidate.png')}
      //           />
      //           <div className={style.notice_title}>
      //             候选人跟进提醒
      //             <span
      //               style={{
      //                 color: '#007BFF',
      //                 fontSize: '20px',
      //                 fonteight: 600,
      //                 paddingLeft: '4px',
      //                 paddingRight: '4px',
      //               }}
      //             >
      //               {WorkPlatform.numInfo.follow_remind}
      //             </span>
      //             个
      //           </div>
      //         </div>
      //       </div>
      //     </Card>
      //   </div>
      //   <div className={`${style.rowBlock}`}>
      //     <Card
      //       title="即将面试"
      //       width={'67%'}
      //       showMore
      //       classNames={style.cardpos}
      //       onMore={() => {
      //         this.toRouter('/calendar/index');
      //       }}
      //     >
      //       {WorkPlatform.interviewList.length > 0 ? (
      //         <TimeList
      //           dataSource={WorkPlatform.interviewList}
      //           openDetail={(id) => {
      //             let userIdList = WorkPlatform.interviewList.map((item) => item.id);
      //             localStorage.setItem('userIdList', userIdList);
      //             this.detailRef.current && this.detailRef.current.show(id);
      //           }}
      //         />
      //       ) : (
      //         <NoData pic="interview_empty.png" content="暂时没有面试安排，休息一下吧~" />
      //       )}
      //     </Card>
      //     <Card
      //       width={'32%'}
      //       style={{ minHeight: 444 }}
      //       title="即将入职"
      //       showMore
      //       onMore={() => {
      //         this.toRouter({
      //           pathname: '/candidate/index',
      //           query: {
      //             process: 7,
      //           },
      //         });
      //       }}
      //     >
      //       <div>
      //         <Canlendar handleChangeDay={this.handleChangeDate.bind(this)}></Canlendar>
      //         <ul className={style.resume}>
      //           {WorkPlatform.entryList.list && WorkPlatform.entryList.list.length > 0 ? (
      //             WorkPlatform.entryList.list.map((item) => (
      //               <li
      //                 key={item.id}
      //                 className={`${style.resumeItem} ${style.itemBg}`}
      //                 onClick={() => {
      //                   // this.toRouter({
      //                   //   pathname: '/candidate/detail',
      //                   //   query: {
      //                   //     user_id: item.id,
      //                   //   },
      //                   // });
      //                   this.detailRef.current && this.detailRef.current.show(item.id);
      //                 }}
      //               >
      //                 <div className={style.resumeItem}>
      //                   <span className={style.resumeIcon}>
      //                     <Icon name="iconT2-houxuanren-xuanzhong" />
      //                   </span>
      //                   <span className={style.resumeContent}>
      //                     {item.name} | {item.position_name}
      //                   </span>
      //                 </div>
      //                 <span className={style.resumeUser} style={{ maxWidth: 100 }}>
      //                   {item.department_name}
      //                 </span>
      //               </li>
      //             ))
      //           ) : (
      //             <NoData
      //               pic="enter_empty.png"
      //               content="今天没有候选人入职，看看别的日子吧"
      //               style={{ width: 73, height: 56, marginTop: '70px' }}
      //             ></NoData>
      //           )}
      //         </ul>
      //       </div>
      //     </Card>
      //     {/* <Card
      //       width={'32%'}
      //       style={{ minHeight: 444 }}
      //       title="小易助手"
      //       showMore={pendingInfo.total_count > 3 ? true : false}
      //       onMore={() => {
      //         this.setState({
      //           pendVisible: true,
      //         });
      //       }}
      //     >
      //       {pendingInfo.total_count > 0 ? (
      //         <Things info={pendingInfo} />
      //       ) : (
      //         <NoData
      //           pic="pend_empty.png"
      //           content="暂无处理事项~"
      //           style={{ width: 120, height: 72 }}
      //         ></NoData>
      //       )}
      //     </Card> */}
      //   </div>
      //   <div className={style.rowBlock} style={{ marginBottom: 0 }}>
      //     <div className={style.blockLeft}>
      //       <div className={style.leftItems}>
      //         <Card
      //           width={'49%'}
      //           title="筛选简历"
      //           showMore
      //           classNames={style.cardpos}
      //           onMore={() => {
      //             this.toRouter({
      //               pathname: '/candidate/index',
      //               query: {
      //                 process: 2,
      //               },
      //             });
      //           }}
      //         >
      //           <ul className={style.resume}>
      //             {WorkPlatform.resumeList.length > 0 ? (
      //               WorkPlatform.resumeList.map((item) => (
      //                 <li
      //                   key={item.id}
      //                   className={style.resumeItem}
      //                   onClick={() => {
      //                     // this.toRouter({
      //                     //   pathname: '/candidate/detail',
      //                     //   query: {
      //                     //     user_id: item.id,
      //                     //   },
      //                     // });
      //                     let userIdList = WorkPlatform.resumeList.map((item) => item.id);
      //                     localStorage.setItem('userIdList', userIdList);
      //                     this.detailRef.current && this.detailRef.current.show(item.id);
      //                   }}
      //                 >
      //                   <div className={style.resumeItem}>
      //                     <img src={require('@assets/images/workplat/resume_icon.png')} />
      //                     <span className={style.resumeUser}>{item.name}</span>
      //                     <span className={style.resumeWord}>的简历筛选通过了</span>
      //                   </div>
      //                   <span className={style.time} style={{ whiteSpace: 'nowrap' }}>
      //                     {item.created_at.split(' ')[0]}
      //                   </span>
      //                 </li>
      //               ))
      //             ) : (
      //               <NoData
      //                 pic="resume_empty.png"
      //                 content="很遗憾，还没有候选人的简历通过筛选"
      //                 style={{ width: 73, height: 56 }}
      //               ></NoData>
      //             )}
      //           </ul>
      //         </Card>
      //         <Card
      //           width={'49%'}
      //           title="面试通过"
      //           showMore
      //           onMore={() => {
      //             this.toRouter({
      //               pathname: '/candidate/index',
      //               query: {
      //                 process: 5,
      //               },
      //             });
      //           }}
      //         >
      //           <ul className={style.resume}>
      //             {WorkPlatform.offerList.length > 0 ? (
      //               WorkPlatform.offerList.map((item) => (
      //                 <li
      //                   key={item.id}
      //                   className={style.resumeItem}
      //                   onClick={() => {
      //                     // this.toRouter({
      //                     //   pathname: '/candidate/detail',
      //                     //   query: {
      //                     //     user_id: item.id,
      //                     //   },
      //                     // });
      //                     let userIdList = WorkPlatform.offerList.map((item) => item.id);
      //                     localStorage.setItem('userIdList', userIdList);
      //                     this.detailRef.current && this.detailRef.current.show(item.id);
      //                   }}
      //                 >
      //                   <div className={style.resumeItem}>
      //                     <img src={require('@assets/images/workplat/pass_icon.png')} />
      //                     <span className={style.resumeUser}>{item.name}</span>{' '}
      //                     <span className={style.resumeUser} style={{ maxWidth: '110px' }}>
      //                       | {item.position_name}
      //                     </span>
      //                   </div>
      //                   <span className={style.time} style={{ whiteSpace: 'nowrap' }}>
      //                     {item.updated_at.split(' ')[0]}
      //                   </span>
      //                 </li>
      //               ))
      //             ) : (
      //               <NoData
      //                 pic="passinterview_empty.png"
      //                 content="一个满意的候选人都没有？"
      //                 style={{ width: 73, height: 56 }}
      //               ></NoData>
      //             )}
      //           </ul>
      //         </Card>
      //       </div>
      //       <Card
      //         width={'100%'}
      //         title="更新公告"
      //         showMore
      //         classNames={style.cardpos}
      //         onMore={() => {
      //           this.toRouter('/workPlatform/version');
      //         }}
      //       >
      //         <ul className={style.resume}>
      //           {WorkPlatform.editionList.length > 0 ? (
      //             WorkPlatform.editionList.map((item, index) => (
      //               <li
      //                 key={item.id}
      //                 className={style.resumeItem}
      //                 onClick={() => {
      //                   this.toRouter(`/workPlatform/version/detail/${item.id}`);
      //                 }}
      //               >
      //                 <div className={style.resumeItem}>
      //                   <img src={require('@assets/images/workplat/notice_icon.png')} />
      //                   <span className={style.resumeContent}>{item.update_desc}</span>
      //                   {index == 0 ? (
      //                     <img
      //                       style={{
      //                         width: 26,
      //                         height: 13,
      //                         marginLeft: '10px',
      //                       }}
      //                       src={require('@assets/images/workplat/new.png')}
      //                     />
      //                   ) : (
      //                     ''
      //                   )}
      //                 </div>
      //                 <span className={style.time} style={{ whiteSpace: 'nowrap' }}>
      //                   {item.created_at.split(' ')[0]}
      //                 </span>
      //               </li>
      //             ))
      //           ) : (
      //             <NoData
      //               pic="notice_empty.png"
      //               content="我们会很快更新，请保持关注"
      //               style={{ width: 73, height: 56 }}
      //             />
      //           )}
      //         </ul>
      //       </Card>
      //     </div>
      //     <Card
      //       width={'32%'}
      //       style={{ minHeight: 444 }}
      //       title="小易助手"
      //       showMore={pendingInfo.total_count > 3 ? true : false}
      //       onMore={() => {
      //         this.setState({
      //           pendVisible: true,
      //         });
      //       }}
      //     >
      //       {pendingInfo.total_count > 0 ? (
      //         <Things info={pendingInfo} />
      //       ) : (
      //         <NoData
      //           pic="pend_empty.png"
      //           content="暂无处理事项~"
      //           style={{ width: 120, height: 72 }}
      //         ></NoData>
      //       )}
      //     </Card>
      //   </div>
      //   <div
      //     className={style.feedback}
      //     onClick={() => {
      //       this.feedbackRef.current.show();
      //     }}
      //   >
      //     <img src={require('./img/feedback.png')} />
      //     <br />
      //     意<br />见<br />反<br />馈
      //   </div>
      //   {/* 新手引导 */}
      //   {global.stepObj && (global.stepObj.workStep === 0 || !global.stepObj.workStep) && (
      //     <GuideModel step={step ? step : 1} checkStep={this.checkStep} />
      //   )}
      //   {/* 简历更新弹窗 */}
      //   {!this.state.updateVisible && <ResumeModel />}
      //   {/* 新功能更新弹窗 */}
      //   <UpdateModal
      //     visible={this.state.updateVisible}
      //     version={VERSION}
      //     handleSuccess={() => {
      //       this.setState({ updateVisible: false });
      //       localStorage.setItem('VERSION', VERSION);
      //     }}
      //   />
      //   {/* 待办事项 */}
      //   <PendingModal
      //     info={pendingInfo}
      //     visible={this.state.pendVisible}
      //     handleOk={() => {
      //       this.setState({
      //         pendVisible: false,
      //       });
      //     }}
      //   />
      //   {/* 意见反馈 */}
      //   <FeedbackModal feedbackRef={this.feedbackRef} />
      //   {/* 服务到期弹框 */}
      //   <ServerTip cRef={this.serverRef} />
      //   {/* 候选人详情 */}
      //   {/* <DetailModal
      //     cRef={this.detailRef}
      //     handleInit={() => {
      //       //this.getTableList();
      //     }}
      //   /> */}
      //   {/* 点击进入服务群 */}
      //   <ServerGroup />
      // </div>
    );
  }
}
function mapStateToProps({ WorkPlatform, global }) {
  return { WorkPlatform, global };
}
export default connect(mapStateToProps)(index);
