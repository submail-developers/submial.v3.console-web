import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTalkToken, submitTalk } from '@/api'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import './index.scss'

// 代理讯飞的地址
const baseURI = 'https://bot.mysubmail.com'

export default function Fn() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const { id, editable } = useParams()
  const ref = useRef(null)
  const [token, setToken] = useState('')
  const initToken = async () => {
    try {
      const res = await getTalkToken()
      setToken(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (editable == '1') {
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '编辑话术',
        }),
      )
    }
  }, [editable])

  useEffect(() => {
    initToken()
  }, [])

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin === baseURI) {
        try {
          console.log('讯飞推送的内容:', JSON.parse(event.data))
          let cbData = JSON.parse(event.data)
          // 退出/提审
          if (['close', 'submit'].includes(cbData.cmdId)) {
            if (cbData.cmdId == 'submit') {
              await submitTalk({ id: cbData.data.id, name: cbData.data.name })
            }
            nav('/console/voiceChatbot/talk/index', { replace: true })
          }
        } catch (error) {}
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
  return (
    <div className='talk-edit'>
      <div className='iframe-wrap'>
        {token && (
          <iframe
            ref={ref}
            // referrerPolicy='unsafe-url'
            name='chatIframe'
            width='100%'
            height='100%'
            src={`${baseURI}/qetesh-openapi-page/#/flow/${id}${
              editable == '1' ? '/1' : ''
            }?${editable == '1' ? 'editable=1&' : ''}token=${token}`}
            style={{ border: 'none' }}></iframe>
        )}
      </div>
    </div>
  )
}
