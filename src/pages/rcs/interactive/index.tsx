import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import codeImg from '@/assets/rcs/send1.png'
import { Image, Flex, Divider, Button, Space, ConfigProvider } from 'antd'
import PageContent from '@/components/pageContent'
import Mobile from '@/pages/rcs/interactive/compontent/mobile'
import { Outlet } from 'react-router-dom'
import { StorePage } from './reducer'

import { chatbotList, templateList } from './tour/data'
import './index.scss'

const pageW = {
  lg: '100%',
}
export default function Fn() {
  const nav = useNavigate()
  const location = useLocation()
  const redirectPathNameRef = useRef('')
  const toTour = () => {
    redirectPathNameRef.current = location.pathname
    nav(`/console/rcs/interactive/tour/chatbot/${chatbotList[0].id}`)
  }
  const reDirectEvent = () => {
    nav(redirectPathNameRef.current)
  }
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
                <div className='fn14 m-t-8 gray-color'>
                  配置完成 5G 消息的交互和触发规则，用下行回复的方式实现 Chatbot
                  对话。
                </div>
              </div>
              <Space>
                {/* {location.pathname.includes('tour') ? (
                  <ConfigProvider wave={{ disabled: true }}>
                    <Button
                      type='primary'
                      style={{
                        background: '#F1F2F4',
                        color: '#282b31',
                        boxShadow: 'none',
                      }}
                      onClick={reDirectEvent}>
                      关闭演示
                    </Button>
                  </ConfigProvider>
                ) : (
                  <Button
                    type='primary'
                    style={{
                      boxShadow: 'none',
                    }}
                    icon={
                      <span className='icon iconfont icon-yanshi fn14'></span>
                    }
                    onClick={toTour}>
                    交互演示
                  </Button>
                )} */}

                {location.pathname.includes('detail') && (
                  <Button
                    type='primary'
                    style={{
                      background: '#F1F2F4',
                      color: '#282b31',
                      boxShadow: 'none',
                    }}
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
