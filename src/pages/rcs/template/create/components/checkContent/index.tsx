import { CSSProperties } from 'react'
import { Flex } from 'antd'

import './index.scss'

export type CheckStatusItem = {
  name: string // 验证的字段
  label: string // 提示名称
  value: boolean // 提示状态
}
type CheckContentProps = {
  style: CSSProperties
  items: CheckStatusItem[]
}
export default function CheckContent(props: CheckContentProps) {
  return (
    <div className='temp-check-content' style={props.style}>
      <div className='check-wrap p-y-4'>
        <div className='check-title p-x-16 fx-y-center fw-500'>编辑状态</div>
        <div className='check-list'>
          {props.items.map((item) => (
            <Flex
              justify='space-between'
              align='center'
              className='p-x-16 check-item'
              key={item.name}>
              <div className='name'>{item.label}</div>
              <div className='status'>
                {item.value ? (
                  <i className='icon iconfont icon-yes fn10 fw-600 primary-color'></i>
                ) : (
                  <i className='icon iconfont icon-chahao fn10 error-color'></i>
                )}
              </div>
            </Flex>
          ))}
        </div>
      </div>
    </div>
  )
}
