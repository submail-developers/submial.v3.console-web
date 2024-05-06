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
  const [isRouterHideMenu, setisRouterHideMenu] = useLocalStorage(
    'isRouterHideMenu',
    true,
  ) // 是否收起侧边栏
  const [isSmPoint, setIsSmPoint] = useLocalStorage('isSmPoint', true) // 是否收起侧边栏
  // 顶部导航的高度
  const [headerH, setHeaderH] = useState(65)
  const [hideRight, setHideRight] = useState(false)
  // 路由中配置是否展示侧边栏
  const hideRef = useRef(false)
  const match = useMatches()
  const onBreakpoint = (broken) => {
    setIsSmPoint(broken)
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
    setisRouterHideMenu(hideMenu)
    hideRef.current = hideMenu
    setHideRight(hideHeaderRight)
  }, [match])
  return (
    <Layout className='layout-container'>
      <Header
        className='layout-header'
        style={{ height: headerH, lineHeight: '64px' }}>
        <MyHeader broken={isSmPoint} hideRight={hideRight} />
      </Header>
      <Layout
        className='layout-content'
        style={{ height: `calc(100% - ${isSmPoint ? '104px' : '65px'})` }}>
        <Sider
          className='layout-sider'
          width={280}
          style={sideStyle}
          collapsed={isSmPoint || isRouterHideMenu}
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
