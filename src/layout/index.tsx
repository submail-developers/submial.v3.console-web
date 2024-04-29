import { CSSProperties, useEffect, useRef, useState } from 'react'
import MyHeader from './header'
import { Layout } from 'antd'
import { Outlet, useMatches } from 'react-router-dom'
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
  // 顶部导航的高度
  const [headerH, setHeaderH] = useState(65)
  const [hideRight, setHideRight] = useState(false)
  // 路由中配置是否展示侧边栏
  const hideRef = useRef(false)
  const match = useMatches()
  const onBreakpoint = (broken) => {
    // console.log(broken, !hideRef.current, 'b')
    if (!hideRef.current) {
      setcollapsed(broken)
    }
    setHeaderH(broken ? 104 : 65)
  }

  // 路由中配置是否展示侧边栏
  useEffect(() => {
    let hideMenu = false
    let hideHeaderRight = false
    match.forEach((item) => {
      let { data } = item
      // @ts-ignore
      if (data && data.hideMenu) {
        hideMenu = Boolean(
          (data as { hideMenu?: boolean; hideHeaderRight?: boolean }).hideMenu,
        )
      }
      // @ts-ignore
      if (data && data.hideHeaderRight) {
        hideHeaderRight = Boolean(
          (data as { hideMenu?: boolean; hideHeaderRight?: boolean })
            .hideHeaderRight,
        )
      }
    })

    hideMenu && setcollapsed(hideMenu)
    hideRef.current = hideMenu
    setHideRight(hideHeaderRight)
  }, [match])
  return (
    <Layout className='layout-container'>
      <Header className='layout-header' style={{ height: headerH }}>
        <MyHeader broken={collapsed} hideRight={hideRight} />
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
