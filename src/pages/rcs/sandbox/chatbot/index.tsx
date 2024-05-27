import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStateStore, useStateDispatch } from '@/pages/rcs/sandbox/reducer'
import Config from './config'
import { getChatbot } from '@/api'

export default function Fn() {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const { id } = useParams()
  // 获取交互详情
  useEffect(() => {
    if (!state.chatbot && id != '0') {
      getInfo()
    }
  }, [id, state.chatbot])
  const getInfo = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10,
        appid: id,
        keywords: '',
        status: '1', // 默认all   0=未提交，1=我方通过，2=我们驳回，3=我方审核中
      })
      if (res.list.length == 1) {
        dispatch({
          type: 'changeChatbot',
          payload: {
            ...res.list[0],
          },
        })
      }
    } catch (error) {}
  }
  return <Config />
}
