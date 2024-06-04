import { useEffect, useCallback, useState, memo } from 'react'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import TextItem from '@/pages/rcs/template/create/text/item'
import CardItem from '@/pages/rcs/template/create/card/item'
import CardsItem from '@/pages/rcs/template/create/cards/item'
import { Spin, Empty } from 'antd'
import { API } from 'apis'
import { getRcsTempList } from '@/api'
import { sample } from 'lodash'

type ChatItemProps = {
  item: API.GetRcsInteractiveListResItem
  onLoad: () => void
}

// 随机生成关键字
const pattern = /\((.*?)\)/
const UserSendKewords = memo(({ keywords }: { keywords: string }) => {
  let text = ''
  const match = pattern.exec(keywords)
  if (match) {
    text = sample(match[1].split('|'))
  } else {
    text = sample(keywords.split('\n'))
  }
  return <span>{text || ''}</span>
})

// 交互的消息
const ChatItem = (props: ChatItemProps) => {
  console.log(1)
  const [tempInfo, setTempInfo] = useState<API.RcsTempListItem>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const getTempInfo = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        id: props.item.reply_id,
        keyword: '',
        status: '1', // 默认all     0等待审核，1通过，2驳回
      })
      if (res.list.length == 1) {
        setTempInfo(res.list[0])
        props.onLoad()
      } else {
        setError(true)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }, [props.item.id])

  useEffect(() => {
    getTempInfo()
  }, [])

  return (
    <div>
      <div className='fx-col fx-y-end p-y-8'>
        <span className='icon iconfont icon-user color fn20 fw-500 '></span>
        <div className='color-warning-blue p-x-12 p-y-4 g-radius-4'>
          {props.item.type == '1' && (
            <span>{props.item.fixed_button_title}</span>
          )}
          {props.item.type == '2' && (
            <span>{props.item.card_button_title}</span>
          )}
          {props.item.type == '3' && (
            <UserSendKewords keywords={props.item.keywords} />
          )}
        </div>
      </div>
      <div className='p-y-8'>
        <span
          className='icon iconfont icon-jiqiren-filled color'
          style={{ fontSize: 24 }}></span>
        {loading ? (
          <div>
            <Spin size='small' />{' '}
          </div>
        ) : null}
        {error && <Empty description='未查询到模版' />}
        {tempInfo && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default function Chats({ onLoad }) {
  const state = useStateStore()
  return (
    <div className='m-t-8'>
      {state.chats.map((item, index) => (
        <ChatItem item={item} key={index} onLoad={onLoad} />
      ))}
    </div>
  )
}
