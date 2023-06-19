import style1 from './index.less';
import React, { useState, useEffect, useRef } from 'react';
import { Popover, Icon } from '@components'
import { Input, Tooltip } from 'antd'

export default ({ nav, navId, handleChangeNav, ...props }) => {
  const [navCopy, setNavCopy] = useState(nav);
  // 展示更多 要展示的内容
  const moreList = () => {
    return (
      <div className={style1.listBox}>
        <Input placeholder="搜索关键字" onChange={handleSearch} />
        <div className={style1.list}>
          {navCopy.length ? navCopy.map((item, index) => <div
            key={item.id}
            // style={{ display: item.hidden ? 'none' : 'block' }}
            className={`${style1.item} ${item.id === navId ? style1.itemActive : ''}`}
            onClick={() => { onClickNav(item.id, index) }}
          >
            {item.name}
          </div>) : <div style={{ color: '#9f9f9f', textAlign: 'center', paddingTop: 100 }}>暂无数据</div>}
        </div>
      </div>
    )
  }
  // 展示更多点击 移动滚动条
  const onClickNav = (id, index) => {
    // let scrollWidth = document.querySelector(`#nav${index}`).offsetLeft
    // let scrollBox = document.getElementById('scrollBox')
    // scrollBox.scrollLeft = scrollWidth - 280
    handleChangeNav(id)
  }
  // input搜索
  const handleSearch = e => {
    let text = e.target.value.toUpperCase()
    let arr = nav.map(item => {
      if (item.name.toUpperCase().indexOf(text) > -1) {
        return item
      }
    })
    let arr2 = arr.filter(items => items)
    setNavCopy(arr2)
    // moreList()
  }

  return (
    <div className={style1.navBox}>
      <div className={`${style1.box}`} id='scrollBox'>
        <div className={style1.nav}>
          <div className={style1.navWrap}>
            {nav?.slice(0, 7).map((item, index) => 
              (
                <div
                  id={`nav${index}`}
                  className={`${style1.navItem} ${item.id === navId || (item.children && item.children.some(v => { return v.id == navId})) ? style1.active : ''
                    }`}
                  key={index}
                  onClick={() => {
                    handleChangeNav(item.id);
                  }}
                >
                  {/* <div className={style1.radiusLeftBg}>
                    <div className={style1.radiusLeft} />
                  </div> */}
                  <div className={style1.radiusCenterBg}>
                    <div className={style1.radiusCenter}>
                      <div className={style1.content}>
                        {item.tip ?
                          <Tooltip title={item.tip}>
                            <div className={style1.label}>{item.name}</div>
                          </Tooltip>
                         : 
                          <div className={style1.label}>{item.name}</div>
                        }
                        <div className={style1.num}>
                          {item.red_point && item.red_point.length > 0 && (
                            <div className={style1.point} />
                          )}
                          {item.parent_count == undefined ? item.val : item.parent_count }
                        </div>
                        
                      </div>
                      <div className={style1.line}></div>
                    </div>
                    
                  </div>
                  {/* <div className={style1.radiusRightBg}>
                    <div className={style1.radiusRight} />
                  </div> */}
                </div>
              ) 
            )}
            {nav?.length > 7 && <div
              id={`nav6`}
              className={`${style1.navItem}`}
              onClick={() => {
                // handleChangeNav(item.id);
              }}
            >
              {/* <div className={style1.radiusLeftBg}>
                <div className={style1.radiusLeft} />
              </div> */}
              <div className={style1.radiusCenterBg}>
                <div className={style1.radiusCenter}>
                  <div className={style1.content}>
                    <Popover
                      content={moreList()}
                      placement='bottomRight'
                      trigger='click'
                    >
                      <div className={style1.arrowWrap}>
                        <div className={style1.arrow}></div>
                      </div>
                    </Popover>
                    <div className={style1.line}></div>
                  </div>
                </div>
              </div>
              {/* <div className={style1.radiusRightBg}>
                <div className={style1.radiusRight} />
              </div> */}
            </div>}
          </div>
        </div>
      </div>

      {/* <div className={style1.more}>
        <Popover
          content={moreList()}
          placement='bottomRight'
          trigger='click'
        >
          <span>
            <Icon name='iconmianshirili-gengduo1' classStyle={style1.iconStyle}></Icon>
          </span>
        </Popover>
      </div> */}
    </div>
  );
};
