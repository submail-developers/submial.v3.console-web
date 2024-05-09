import './modelFooter.scss'
import React, { useState } from 'react'
import { Button, InputNumber, Image } from 'antd'
interface Props {
  imgSrc?: string
  onOk: () => void
  onCancel: () => void
}
//
// 自定义弹框地步按钮
export default (props: Props) => {
  const [visible, setVisible] = useState(false)
  return (
    <div data-class='model-footer-wrap'>
      {/* <div className='left-part' onClick={() => setVisible(true)}>
        <i
          className='icon iconfont icon-xianshi'
          onClick={() => setVisible(true)}></i>{' '}
        &nbsp;预览
      </div>
      <Image
        width={0}
        style={{ display: 'none' }}
        preview={{
          visible,
          src: props.imgSrc || '',
          onVisibleChange: (value) => {
            setVisible(value)
          },
        }}
      /> */}
      {/* <div className='right-part'> */}
      <div className='footer-btn cancel' onClick={props.onCancel}>
        取消
      </div>
      <div className='footer-btn confirm' onClick={props.onOk}>
        确定
      </div>
      {/* </div> */}
    </div>
  )
}
