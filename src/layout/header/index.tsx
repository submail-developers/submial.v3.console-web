import logo from '@/assets/logo/submail.logo.svg'
import { login, loginInit, getInfo } from '@/api'

import { CSSProperties, useEffect, useRef } from 'react'
import { Flex, Space, Image, Dropdown, Button, Badge, Grid } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MyBreadcrumb from './breadcrumb'
import type { MenuProps } from 'antd'
import Notice from './notice'
import ProductNav from './productNav'
import ChatBtn from './chatBtn'
import MobMenu from '@/layout/menu/mobMenu'

import { API } from 'apis'

import './index.scss'
import { useState } from 'react'
type Props = {
  broken: boolean
  hideRight: boolean
}

const countItems: MenuProps['items'] = [
  {
    key: '1',
    label: <a href='/console/account/orders'>订单管理</a>,
  },
  {
    key: '2',
    label: <a href='/console/account/invoice'>发票信息</a>,
  },
  {
    key: '3',
    label: <a href='/console/account/subaccounts'>管理子账户</a>,
  },
  {
    key: '4',
    label: <a href='/console/account/settings'>账户设置</a>,
  },
  {
    key: '5',
    label: <a href='/logout'>登出</a>,
  },
]
const docItems: MenuProps['items'] = [
  {
    key: '1',
    label: <a href='/documents'>开发文档</a>,
  },
  {
    key: '2',
    label: <a href='/lab'>SUBMAIL Lab</a>,
  },
]

export default function MyHeader(props: Props) {
  const [showProd, setshowProd] = useState(false)
  const points = Grid.useBreakpoint()
  const timerRef = useRef(null)
  const [showNoticeList, setshowNoticeList] = useState(false)

  const [info, setInfo] = useState<API.GetInfoRes>()

  const loginEvent = async () => {
    await loginInit()
    await login()
  }

  const getMsgInfo = async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const info = await getInfo()
    setInfo(info)
    timerRef.current = setTimeout(() => {
      getMsgInfo()
    }, 5000)
  }

  useEffect(() => {
    // getMsgInfo()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Flex className='header-content' justify='space-between' align='center'>
        <Space size={0} style={{ width: '280px' }}>
          <div className={`product-btn ${showProd ? 'active' : ''}`}>
            <div className='line-box' onClick={() => setshowProd(!showProd)}>
              <div className='line line-1'>
                <div className='line-icon'></div>
              </div>
              <div className='line line-2'>
                <div className='line-icon'></div>
              </div>
              <div className='line line-3'>
                <div className='line-icon'></div>
              </div>
            </div>
            <ProductNav show={showProd} />
          </div>
          <a href='/console'>
            <Image
              src={logo}
              preview={false}
              className={`header-logo ${props.broken ? 'mob' : ''}`}></Image>
          </a>
        </Space>
        <Flex
          justify={points.sm ? 'space-between' : 'flex-end'}
          align='center'
          style={{ flexGrow: '1', padding: '0 16px 0 0', height: '100%' }}>
          {points.sm && <MyBreadcrumb></MyBreadcrumb>}
          {/* <Button onClick={loginEvent}>登陆</Button> */}
          {!props.hideRight && (
            <Space align='center' size={points.lg ? 16 : 0}>
              <Dropdown
                trigger={['click']}
                menu={{ items: countItems }}
                arrow
                placement={points.lg ? 'bottom' : 'bottomRight'}
                overlayClassName='drop-right'>
                {points.md ? (
                  <div className='right-menu account-btn'>我的账户</div>
                ) : (
                  <div className='account-mini-btn'>
                    <UserOutlined
                      style={{ color: '#393e49', fontSize: '16px' }}
                      rev={undefined}
                    />
                  </div>
                )}
              </Dropdown>

              {points.lg && (
                <>
                  <Dropdown
                    trigger={['click']}
                    arrow
                    overlayClassName='drop-right'
                    onOpenChange={(open) => setshowNoticeList(open)}
                    dropdownRender={() => (
                      <Notice show={showNoticeList} total={info.notification} />
                    )}>
                    <Flex className='right-menu' align='center' gap={2}>
                      通知
                      <Badge count={(info && info.notification) || ''} />
                    </Flex>
                  </Dropdown>
                  <Dropdown
                    trigger={['click']}
                    menu={{ items: docItems }}
                    arrow
                    overlayClassName='drop-right'>
                    <div className='right-menu'>文档中心</div>
                  </Dropdown>
                </>
              )}
            </Space>
          )}
        </Flex>
        <ChatBtn />
      </Flex>
      {!points.sm && <MobMenu />}
    </>
  )
}
