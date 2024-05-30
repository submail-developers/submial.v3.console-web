import { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TextItem from '@/pages/rcs/template/create/text/item'
import CardItem from '@/pages/rcs/template/create/card/item'
import CardsItem from '@/pages/rcs/template/create/cards/item'
import Chats from './chats'
import { Skeleton, Space } from 'antd'
import Footer from './footer'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import { API } from 'apis'

import './index.scss'
import '@/pages/rcs/template/mobile.scss'

export default function Mobile() {
  const state = useStateStore()
  const location = useLocation()
  const isChatbot = location.pathname.includes('/chatbot')
  const isTemplate = location.pathname.includes('/template')
  const tempInfo: API.RcsTempListItem = state?.template || null
  const chatbot: API.ChatbotItem = state?.chatbot || null
  const ref = useRef(null)
  const [scrollToBottom, setScrollToBottom] = useState(false)

  useEffect(() => {
    if (scrollToBottom && ref.current) {
      let timer = setTimeout(() => {
        ref.current.scrollTo({
          top: ref.current.scrollHeight,
          behavior: 'smooth', // 使用平滑滚动效果
        })
        // 滚动完成后重置状态
        setScrollToBottom(false)
        clearTimeout(timer)
      }, 50)
    }
  }, [scrollToBottom, ref.current])

  return (
    <div className='interactive-mob'>
      <div className='rcs-mobile small m-t-8' style={{ marginBottom: 0 }}>
        <div className='mobile-content'>
          {isChatbot && (
            <div className='title fw-500'>{chatbot && chatbot.name}</div>
          )}
          {isTemplate && (
            <div className='title fw-500'>{tempInfo && tempInfo.title}</div>
          )}
          <div className='temp-content'>
            {isChatbot && chatbot && (
              <>
                <div className='chat-container' ref={ref}>
                  <div className='skeleton-wrap p-b-16 g-radius-8'>
                    <Skeleton.Node style={{ width: 240 }}>
                      <div style={{ width: 240 }}></div>
                    </Skeleton.Node>
                    <Skeleton.Node
                      style={{ width: 240, height: 32 }}
                      className='m-t-4'>
                      <div style={{ width: 240 }}></div>
                    </Skeleton.Node>
                    <Skeleton.Node
                      style={{ width: 240, height: 60 }}
                      className='m-t-4'>
                      <div style={{ width: 240 }}></div>
                    </Skeleton.Node>
                    <Skeleton.Button
                      shape='round'
                      style={{ width: 240, height: 32 }}
                      className='m-t-8'></Skeleton.Button>
                  </div>

                  <Chats onLoad={() => setScrollToBottom(true)} />
                </div>
                <Space className='float-skeleton' align='center'>
                  <Skeleton.Button
                    shape='round'
                    style={{ width: 80, height: 28 }}></Skeleton.Button>
                  <Skeleton.Button
                    shape='round'
                    style={{ width: 80, height: 28 }}></Skeleton.Button>
                </Space>
              </>
            )}
            {isTemplate && tempInfo && (
              <>
                <div className='chat-container' ref={ref}>
                  {tempInfo.type == 1 && (
                    <TextItem message={tempInfo.message.message} />
                  )}
                  {tempInfo.type == 2 && (
                    <CardItem message={tempInfo.message.message} />
                  )}
                  {tempInfo.type == 3 && (
                    <CardsItem message={tempInfo.message.message} />
                  )}
                  {tempInfo.type == 4 && <div>文件模版暂未开发</div>}

                  <Chats onLoad={() => setScrollToBottom(true)} />
                </div>

                <Space align='center' className='float-wrap'>
                  {tempInfo.suggestions?.suggestions
                    .filter((item) => Boolean(item.action))
                    .map((item, index) => (
                      <div className='float-item' key={index}>
                        {item.action.displayText}
                      </div>
                    ))}
                </Space>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
