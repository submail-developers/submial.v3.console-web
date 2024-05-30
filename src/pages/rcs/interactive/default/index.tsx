import { useEffect, useRef, useState } from 'react'
import { Input } from 'antd'
import ChatbotList from './chatbotList'
import TempList from './tempList'

import './index.scss'

export default function Fn() {
  const chatbotRef = useRef(null)
  const tempRef = useRef(null)
  const [keyword, setKeyword] = useState('')

  const searchEvent = (isInit = false) => {
    chatbotRef.current.search(keyword, isInit)
    tempRef.current.search(keyword)
  }
  const handleSearch = (value, event, { source }) => {
    setKeyword(value)
    if (source != 'clear') {
      chatbotRef.current.search(value)
      tempRef.current.search(value)
    }
  }
  useEffect(() => {
    searchEvent(true)
  }, [])
  return (
    <div className='interactive-default'>
      <div className='left-content fx-col'>
        <Input.Search
          className='top-search'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
          // onPressEnter={() => searchEvent(false)}
          allowClear
          placeholder='chatbot名称/模版名称'
        />
        <ChatbotList ref={chatbotRef} />
        <TempList ref={tempRef} />
      </div>
    </div>
  )
}
