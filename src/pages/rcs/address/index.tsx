import { useEffect, useState } from 'react'
import { Flex, Image, Space, Tabs } from 'antd'
import PageContent from '@/components/pageContent'
import codeImg from '@/assets/rcs/address/address_icon.png'
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom'
import './index.scss'

export default function Fn() {
  const nav = useNavigate()
  const loc = useLocation()
  const [isIndex, setIsIndex] = useState(0)

  useEffect(() => {
    if (loc.pathname.includes('index')) {
      setIsIndex(0)
    } else if (loc.pathname.includes('folder')) {
      setIsIndex(1)
    } else {
    }
  }, [loc])

  const toNext = (item) => {
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
    <PageContent extClass='address-list'>
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
        {navList.map((item, index) => (
          <div
            key={item.id}
            className={`fn16 ${isIndex == index ? 'active' : ''}`}
            onClick={() => toNext(item)}>
            {item.name}
          </div>
        ))}
      </div>
      <Outlet />
    </PageContent>
  )
}
