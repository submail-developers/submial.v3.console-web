import { useState, useEffect } from 'react'
import { Flex, Button, Divider, Image, App, Spin } from 'antd'
import PageContent from '@/components/pageContent'
import Info from './info'
import faceImg from '@/assets/rcs/face/chatbot.png'
import { useParams, NavLink } from 'react-router-dom'
import { getChatbot } from '@/api'
import Menu from './menu'
import { API } from 'apis'

import { ChatbotStatus, ChatbotColor } from '@/pages/rcs/chatbot/type'
import './index.scss'

export default function Fn() {
  const { id } = useParams()
  const [detail, setDetail] = useState<API.ChatbotItem>()
  const [loading, setLoading] = useState(false)
  const getDetail = async () => {
    setLoading(true)
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: id,
        status: 'all',
      })
      if (res.list.length == 1) {
        setDetail(res.list[0])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  return (
    <PageContent extClass='chatbot-detail'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>Chatbot 详情</div>
        {detail && ['0', '1', '2'].includes(detail.status) && (
          <NavLink to={`/console/rcs/chatbot/create/${id}`}>
            <Button
              type='primary'
              icon={<i className='icon iconfont icon-bianji'></i>}>
              编辑基本信息
            </Button>
          </NavLink>
        )}
      </Flex>
      <Divider />
      <div className='info-title m-b-20'>
        <Flex justify='space-between' className='w-100'>
          <span>基本信息</span>
          <span className={`${ChatbotColor[detail?.status]} fw-500 fn16`}>
            {ChatbotStatus[detail?.status]}
          </span>
        </Flex>
      </div>
      {detail && detail.status == '2' && (
        <div className='color-warning-red g-radius-4 p-x-16 p-y-8 fn13 m-b-24'>
          <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
          未通过原因：
        </div>
      )}

      {detail && (
        <>
          <Info detail={detail} reloadEvent={getDetail} />
          <Menu
            entries={detail?.menu?.menu?.entries || []}
            chatbotStatus={detail.status}
            menuStatus={detail.menu_status}
            reloadEvent={getDetail}
          />
        </>
      )}
      {loading && (
        <div className='fx-center-center m-t-32'>
          <Spin />
        </div>
      )}
    </PageContent>
  )
}
