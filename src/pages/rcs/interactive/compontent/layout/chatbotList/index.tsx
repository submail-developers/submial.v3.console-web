import { useImperativeHandle, forwardRef, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChatbot } from '@/api'
import { API } from 'apis'
import './index.scss'
import { Empty } from 'antd'
import { useStateDispatch } from '../../../reducer'
function Fn(props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      search,
    }
  })
  const dispatch = useStateDispatch()
  const nav = useNavigate()
  const { id } = useParams()
  const [list, setList] = useState<API.ChatbotItem[]>([]) // chatbot列表
  const keywordsRef = useRef('')
  const search = (keywords, isInit) => {
    keywordsRef.current = keywords
    getList(isInit)
  }
  // 获取chatbot列表
  const getList = async (isInit = false) => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 1000,
        appid: '',
        keywords: keywordsRef.current as string,
        status: 'all',
      })
      setList(res.list)
      if (isInit && res.list.length > 0 && id == '0') {
        dispatch({
          type: 'changeChatbot',
          payload: res.list[0],
        })
        nav(`/console/rcs/interactive/chatbot/${res.list[0].id}`)
      }
    } catch (error) {}
  }
  const change = (item: API.ChatbotItem) => {
    dispatch({
      type: 'changeChatbot',
      payload: item,
    })
    nav(`/console/rcs/interactive/chatbot/${item.id}`)
  }

  return (
    <div className='interactive-chatbot-list'>
      <div className='name fx-y-center fw-500 fn16 p-x-16 p-t-8'>
        chatbot列表
      </div>
      <div className='p-x-16 p-b-8 list'>
        {list.map((item) => (
          <div
            className={`list-item g-ellipsis p-y-4 g-pointer g-transition-300 ${
              id == item.id ? 'color' : ''
            }`}
            title={item.name}
            onClick={() => change(item)}
            key={item.id}>
            {item.name}
          </div>
        ))}
        {list.length == 0 && <Empty className='m-t-10' />}
      </div>
    </div>
  )
}
export default forwardRef(Fn)
