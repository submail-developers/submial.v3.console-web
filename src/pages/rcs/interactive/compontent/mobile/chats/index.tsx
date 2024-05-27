import { useEffect, useCallback, useState } from 'react'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import TextItem from '@/pages/rcs/template/create/text/item'
import CardItem from '@/pages/rcs/template/create/card/item'
import CardsItem from '@/pages/rcs/template/create/cards/item'
import { Spin, Empty } from 'antd'
import { API } from 'apis'
import { getRcsTempList } from '@/api'

type ChatItemProps = {
  item: API.GetRcsInteractiveListResItem
  onLoad: () => void
}
const ChatItem = (props: ChatItemProps) => {
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
      {props.item.type == '3' && (
        <div className='fx-col fx-y-end p-y-8'>
          <span className='icon iconfont icon-user color fn20 fw-500'></span>
          <span>{props.item.keywords}</span>
        </div>
      )}
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
