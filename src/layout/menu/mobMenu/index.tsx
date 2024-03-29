import { Flex, Drawer } from 'antd'
import MyBreadcrumb from '@/layout/header/breadcrumb'

import './index.scss'
import { useState } from 'react'

export default function MobMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex className='mob-menu' justify='space-between' align='center'>
        <MyBreadcrumb></MyBreadcrumb>
        <div className='mob-menu-btn' onClick={() => setOpen(!open)}>
          1
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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  )
}
