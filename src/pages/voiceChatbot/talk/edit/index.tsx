import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTalkToken, getTalkList, delTalkItem } from '@/api'
import './index.scss'
export default function Fn() {
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
    initToken()
  }, [])

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === 'http://112.27.72.233:10000') {
        try {
          console.log('讯飞推送的内容:', JSON.parse(event.data))
          let cbData = JSON.parse(event.data)
          // 退出/提审
          if (['close', 'submit'].includes(cbData.cmdId)) {
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
            src={`http://112.27.72.233:10000/qetesh-openapi-page/#/flow/${id}${
              editable == '1' ? '/1' : ''
            }?${editable == '1' ? 'editable=1&' : ''}token=${token}`}
            style={{ border: 'none' }}></iframe>
        )}
      </div>
    </div>
  )
}
