import { useEffect, useState } from 'react'
import { Flex, Image, Space, Tabs } from 'antd'
import PageContent from '@/components/pageContent'
import codeImg from '@/assets/rcs/address/address_icon.png'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import './index.scss'

export default function Fn() {
  const nav = useNavigate()
  const [activeId, setActiveId] = useState('0')

  useEffect(() => {
    const value = window.localStorage.getItem('count')
    const valueParse = JSON.parse(value) ? JSON.parse(value) : 0
    setActiveId(valueParse)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('count', activeId)
  }, [activeId])

  const toNext = (item) => {
    setActiveId(item.id)
    nav(item.url)
  }
  const navList = [
    {
      id: '0',
      name: '地址簿',
      url: '/console/rcs/address/index/0',
    },
    {
      id: '1',
      name: '地址簿文件夹',
      url: '/console/rcs/address/folder',
    },
  ]

  return (
    <PageContent extClass='address-list' xxl={1400} xl={980}>
      <Image src={codeImg} preview={false} width={72}></Image>
      <Flex
        justify='space-between'
        wrap='wrap'
        gap={12}
        style={{ marginTop: '4px' }}>
        <Space align='baseline'>
          <div className='fn22 fw-500'>地址簿管理</div>
        </Space>
      </Flex>
      <div className='tab-address fx'>
        {navList.map((item) => (
          <div
            key={item.id}
            className={`fn16 ${activeId == item.id ? 'active' : ''}`}
            onClick={() => toNext(item)}>
            {item.name}
          </div>
        ))}
      </div>
      <Outlet />
    </PageContent>
  )
}
