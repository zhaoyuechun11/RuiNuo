import React, {
  Fragment,
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Radio,
  message,
  Modal,
  Button,
  Checkbox,
} from 'antd';
import { connect, history } from 'umi';
import { Dialog, Icon,Confirm } from '@components';
import style from './addbasicField.less';
import isFunction from 'lodash/isFunction';
import  { getSelectField,create } from '../../models/server.js'


const { confirm } = Modal;
const AddbasicFieldy= ({
  addbasicFieldyRef,
  addbasicFieldyRefHide,
  refresh,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisplay, setIsDisplay] = useState(2);
  const [isRequired, setIsRequired] = useState(2);
  const [names, setNames] = useState(['']);
  const dialogRef = useRef();
  const confirmRef  =  useRef()
  const [selectList, setSelectList] = useState([]);
  const [fileList, setFileList] = useState([]);
  // const [fileList, setFileList] = useState([]);
  useImperativeHandle(addbasicFieldyRef, () => ({
    showModal: showModal,
  }));
  useImperativeHandle(addbasicFieldyRefHide, () => ({
    hide: () => {
      dialogRef.current && dialogRef.current.hide();
    },
  }));

  const showModal = () => {
    getSelectField().then((res)=>{
      setLoading(true)
      dialogRef.current && dialogRef.current.show();
      if (res.status_code==200) {
        setLoading(false)

        setFileList(res.data)
        let arr= []
        res.data.map((model,i)=>{
          model.structure.map((item,j)=>{
               if (item.is_select==1) {
                 arr.push(item.key)
               }
           })
         })
         setSelectList(arr)

      }
    })
    
  };

  const onFinish = () => {
    const json = JSON.stringify(selectList)
    create({select_json:json}).then((res)=>{
      if (res.status_code==200) {
        message.success('添加成功!');
        dialogRef.current && dialogRef.current.hide();
        isFunction (refresh) && refresh()
      }
    })

    
    
  };
  const onBeforeShow= ()=>{
  }
  const  list = []
  const chioseStr =(str)=>{
    const newFileList = fileList.map((model,i)=>{
       model.structure.map((item,j)=>{
          if (item.key==str.key) {
            item.is_select=item.is_select==1?2:1
            if (item.is_select==1) {
              selectList.push(str.key)
            }else{
              let index = selectList.indexOf(str.key)
              selectList.splice(index,1)
            }
          }
          return item
        })
        return model
      })
    setFileList(newFileList);
    setSelectList(selectList)
  }


  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  return (
    <Fragment>
      <Dialog
        ref={dialogRef}
        maskClosable={false}
        width={640}
        title="新增字段"
        destroyOnClose={true}
        confirmLoading={loading}
        visible={visible}
        onBeforeShow={onBeforeShow}
        onCancel={() => {
          dialogRef.current && dialogRef.current.hide();
        }}
        onOk={() => {
          onFinish();
        }}
      >
        <div className={style.dataBox}>
          <div className={style.warining}>新增字段取的是标准简历的字段，如当前字段不满足，请前往【标准简历设置】新增字段</div>
          <div className={style.modeleBox}>
            {
              fileList.length && fileList.map((model,index)=>{
                return(
                  <div className={style.modele_item}>
                  <div className ={style.left}>{model.name}</div>
                  <div className ={style.right}>
                    {
                      model.structure&&model.structure.map((str,j)=>{
                        return(
                            str.is_disabled==1?(
                              <Button className={style.btn_active}>{str.name}</Button>

                            ):(
                              <Button className={str.is_select==2?style.btn:style.btn_active} onClick={()=>chioseStr(str)}>{str.name}</Button>
                            )
                        )
                      })
                    }
                  </div>
                </div>

                )
              })
            }
         
          </div>
          

        </div>
        <Confirm
        confirmRef={confirmRef}
        img='commom/export_icon.png'
        imgStyle={{width:73,height:67}}
        title='请确认'
        content='自定义选项的字段提交后不支持二次修改，请知晓！'
        onOk={()=>{
          confirmRef.current &&  confirmRef.current.hide();
          dialogRef.current && dialogRef.current.hide();
        }}
        showCancel={true}
        
        ></Confirm>
         
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = ({ global: { enterprise_id, operator_id } }) => {
  return {
    enterprise_id,
    operator_id,
  };
};
export default connect(mapStateToProps)(AddbasicFieldy);
