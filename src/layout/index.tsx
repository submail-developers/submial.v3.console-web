import { CSSProperties, useState } from 'react'
import MyHeader from './header'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Menu from './menu'
import { useLocalStorage } from '@/hooks'

import './index.scss'

const { Header, Sider, Content } = Layout

const sideStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRight: '1px solid #e7e7e7',
}

export default function Fn() {
  const [collapsed, setcollapsed] = useLocalStorage('siderClosed', true) // 是否收起侧边栏
  const onBreakpoint = (broken) => {
    setcollapsed(broken)
  }
  return (
    <Layout className='layout-container'>
      <Header
        className='layout-header'
        style={{ height: collapsed ? 104 : 65 }}>
        <MyHeader broken={collapsed} />
      </Header>
      <Layout
        className='layout-content'
        style={{ height: `calc(100% - ${collapsed ? '104px' : '65px'})` }}>
        <Sider
          className='layout-sider'
          width={280}
          style={sideStyle}
          collapsed={collapsed}
          breakpoint='sm'
          collapsedWidth={0}
          trigger={null}
          onBreakpoint={onBreakpoint}>
          <Menu />
        </Sider>
        <Content className='page-content-wrap'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
