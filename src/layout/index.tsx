import { CSSProperties, useState } from 'react'
import MyHeader from './header'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Menu from './menu'

import './index.scss'

const { Header, Sider, Content } = Layout

const headerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #e7e7e7',
  padding: '0',
  zIndex: '100',
}

const sideStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRight: '1px solid #e7e7e7',
}

export default function Fn() {
  const [collapsed, setcollapsed] = useState(true) // 是否收起侧边栏
  const onBreakpoint = (broken) => {
    setcollapsed(broken)
  }
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ ...headerStyle, height: collapsed ? 104 : 65 }}>
        <MyHeader broken={collapsed} />
      </Header>
      <Layout style={{ background: '#fff' }}>
        <Sider
          width={230}
          style={sideStyle}
          collapsed={collapsed}
          breakpoint='sm'
          collapsedWidth={0}
          trigger={null}
          onBreakpoint={onBreakpoint}>
          <Menu />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
