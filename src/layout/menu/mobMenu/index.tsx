import { Flex, Drawer } from 'antd'
import MyBreadcrumb from '@/layout/header/breadcrumb'
import { useLocation } from 'react-router-dom'
import MenuList from '../index'

import './index.scss'
import { useEffect, useRef, useState } from 'react'

export default function MobMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const pathRef = useRef('')

  useEffect(() => {
    if (location.pathname != pathRef.current) {
      setOpen(false)
    }
    pathRef.current = location.pathname
  }, [location])

  return (
    <>
      <Flex className='mob-menu' justify='space-between' align='center'>
        <MyBreadcrumb></MyBreadcrumb>
        <div
          className={`mob-menu-btn ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}>
          <span className='icon iconfont icon-xiangxia fn8'></span>
        </div>
      </Flex>
      <Drawer
        className='mob-menu-drawer'
        title=''
        placement={'top'}
        height={'100%'}
        closable={false}
        onClose={() => setOpen(false)}
        mask={false}
        zIndex={99}
        open={open}>
        <MenuList />
      </Drawer>
    </>
  )
}
