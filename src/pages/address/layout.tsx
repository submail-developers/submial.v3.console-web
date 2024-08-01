import { useEffect, useState } from 'react'
import { Flex, Image } from 'antd'
import PageContent from '@/components/pageContent'
import faceImg from '@/assets/rcs/face/address.png'
import { Outlet, Link, useLocation } from 'react-router-dom'

import { useStateDispatch, useStateStore } from './reducer'

import './layout.scss'

export default function Fn() {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const loc = useLocation()
  const [isIndex, setIsIndex] = useState(0)

  useEffect(() => {
    if (loc.pathname.includes('address/index')) {
      setIsIndex(0)
    } else if (loc.pathname.includes('address/folder')) {
      setIsIndex(1)
    } else if (loc.pathname.includes('/address/detail')) {
      if (loc.search.includes('&folder=0')) {
        setIsIndex(0)
      } else {
        setIsIndex(1)
      }
    } else {
    }

    if (loc.pathname) {
      // 获取产品的rootPath
      const regex = /\/console\/(.*?)\/address/
      const match = loc.pathname.match(regex)
      if (match) {
        const rootPath = match[1]
        dispatch({
          type: 'changeRootPath',
          payload: rootPath,
        })
      }
    }
  }, [loc])

  return (
    <PageContent extClass='address-list'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' wrap='wrap' style={{ height: 40 }}>
        <div className='fn22 fw-500'>地址簿管理</div>
      </Flex>
      <div className='tab-address fx'>
        <Link
          to={`/console/${state.rootPath}/address/index`}
          className={`tab-nav-item fn16 ${isIndex == 0 ? 'active' : ''}`}>
          地址簿
        </Link>
        <Link
          to={`/console/${state.rootPath}/address/folder`}
          className={`tab-nav-item fn16 ${isIndex == 1 ? 'active' : ''}`}>
          地址簿文件夹
        </Link>
      </div>
      <Outlet />
    </PageContent>
  )
}
