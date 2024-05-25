import { useEffect, useRef, useState } from 'react'
import codeImg from '@/assets/rcs/send1.png'
import { Image, Flex, Divider, Input } from 'antd'
import PageContent from '@/components/pageContent'
import Mobile from '@/pages/rcs/interactive/compontent/mobile'
import ChatbotList from './compontent/layout/chatbotList'
import TempList from './compontent/layout/tempList'
import { Outlet } from 'react-router-dom'
import { StorePage } from './reducer'

import './index.scss'

const pageW = {
  lg: '100%',
  xl: '100%',
  xxl: '100%',
}
export default function Fn() {
  const chatbotRef = useRef(null)
  const tempRef = useRef(null)
  const [keyword, setKeyword] = useState('')

  const searchEvent = (isInit = false) => {
    chatbotRef.current.search(keyword, isInit)
    tempRef.current.search(keyword)
  }
  useEffect(() => {
    searchEvent(true)
  }, [])
  return (
    <PageContent extClass='interactive p-16' {...pageW}>
      <StorePage>
        <div className='interactive-top'>
          {/* <Image src={codeImg} preview={false} width={72}></Image> */}
          <Flex
            justify='space-between'
            align='center'
            style={{ marginTop: '4px' }}>
            <div className='fn22 fw-500'>上行交互</div>
          </Flex>
          <Divider className='m-t-12 m-b-16' />
        </div>
        <Flex gap={24} className='interactive-container'>
          <div className='left'>
            <div className='left-content fx-col'>
              <div className='top-search'>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onPressEnter={() => searchEvent(false)}
                  allowClear
                  placeholder='chatbot名称/模版名称'
                />
              </div>
              <ChatbotList ref={chatbotRef} />
              <TempList ref={tempRef} />
            </div>
          </div>
          <div className='interactive-content'>
            <div className='fx interactive hide-scrollbar'>
              <Outlet />
              <Mobile />
            </div>
          </div>
        </Flex>
      </StorePage>
    </PageContent>
  )
}
