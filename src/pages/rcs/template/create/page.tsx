import { ReactNode, useState } from 'react'
import { Space, Button, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Footer from '@/components/rcsMobileFooter'

import './page.scss'
import '@/pages/rcs/template/mobile.scss'

type Props = {
  left?: ReactNode
  content: ReactNode
  tempConfig?: ReactNode // 模版配置
  callbackConfig?: ReactNode // 回落配置
  checkContent: ReactNode // 验证提审内容提示
  loading: boolean // 上传按钮loading
  submit: () => void
}

export default function Fn(props: Props) {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const name = decodeURIComponent(searchParams.get('name'))
  // 右侧模版配置与消息回落配置切换
  const [activeKey, setactiveKey] = useState('0')
  const onChange = (key: string) => {
    setactiveKey(key)
  }

  let items: TabsProps['items'] = [
    {
      key: '0',
      label: (
        <>
          <span
            className='icon iconfont icon-card fn18'
            style={{ marginRight: '2px' }}></span>
          <span>模版配置</span>
        </>
      ),
      children: props.tempConfig,
    },
    {
      key: '1',
      label: (
        <>
          <span
            className='icon iconfont icon-card fn18'
            style={{ marginRight: '2px' }}></span>
          <span>回落配置</span>
        </>
      ),
      children: props.callbackConfig,
    },
  ]
  items = items
    .filter((item) => Boolean(item.children))
    .map((item, index) => {
      item.key = `${index}`
      return item
    })

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <div className='tabs'>
      {items.map((item) => (
        <div
          key={item.key}
          className={`tab-item ${activeKey == item.key ? 'active' : ''}`}
          onClick={() => setactiveKey(item.key)}>
          {item.label}
        </div>
      ))}
    </div>
  )
  const onSub = () => {
    if (!props.loading) {
      props.submit()
    }
  }
  return (
    <div className='rcs-template'>
      <Space className='handle-buttons' size={16}>
        <Button
          type='primary'
          style={{ background: '#F1F2F4', color: '#282b31' }}
          onClick={() => nav(-1)}>
          取消编辑
        </Button>
        <Button
          type='primary'
          style={{ background: '#1764FF' }}
          loading={props.loading}
          onClick={onSub}>
          提交审核
        </Button>
      </Space>
      {props.left && <div className='left'>{props.left}</div>}
      <div className='center'>
        <div className='rcs-mobile'>
          <div className='mobile-content'>
            <div className='title fw-500'>{name}</div>
            <div className='temp-content'>{props.content}</div>
          </div>
          <Footer />
        </div>
        <div className='check-tips'>{props.checkContent}</div>
      </div>
      <div className='right'>
        <Tabs
          renderTabBar={renderTabBar}
          activeKey={activeKey}
          items={items}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
