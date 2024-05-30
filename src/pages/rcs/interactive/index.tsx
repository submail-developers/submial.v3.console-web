import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import codeImg from '@/assets/rcs/send1.png'
import { Image, Flex, Divider, Button, Space } from 'antd'
import PageContent from '@/components/pageContent'
import Mobile from '@/pages/rcs/interactive/compontent/mobile'
import { Outlet } from 'react-router-dom'
import { StorePage } from './reducer'

import './index.scss'

const pageW = {
  lg: '100%',
  // xl: '100%',
  // xxl: '100%',
}
export default function Fn() {
  const nav = useNavigate()
  const location = useLocation()
  const chatbotRef = useRef(null)
  const tempRef = useRef(null)
  const [keyword, setKeyword] = useState('')

  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  // const searchEvent = (isInit = false) => {
  //   chatbotRef.current.search(keyword, isInit)
  //   tempRef.current.search(keyword)
  // }
  // useEffect(() => {
  //   searchEvent(true)
  // }, [])
  return (
    <div className='interactive-container'>
      <PageContent extClass='interactive p-16' {...pageW}>
        <StorePage>
          <div className='interactive-top'>
            <Image src={codeImg} preview={false} width={72}></Image>
            <Flex
              justify='space-between'
              align='flex-end'
              style={{ marginTop: '4px' }}>
              <div>
                <div className='fn22 fw-500'>上行交互</div>
                <div className='fn14 m-t-8'>
                  配置完成 5G 消息的交互和触发规则，用下行回复的方式实现 Chatbot
                  对话。
                </div>
              </div>
              <Space>
                <Button
                  type='primary'
                  icon={
                    <span className='icon iconfont icon-yanshi fn14'></span>
                  }>
                  交互演示
                </Button>
                {location.pathname.includes('detail') && (
                  <Button
                    type='primary'
                    style={{ background: '#F1F2F4', color: '#282b31' }}
                    onClick={() => nav(-1)}>
                    返回列表
                  </Button>
                )}
              </Space>
            </Flex>
            <Divider className='m-t-12 m-b-16' />
          </div>
          <div className='fx-x-between' style={{ paddingBottom: 60 }}>
            <Outlet />
            <div className='affix'>
              <Mobile />
            </div>
          </div>
        </StorePage>
      </PageContent>
    </div>
  )
}
