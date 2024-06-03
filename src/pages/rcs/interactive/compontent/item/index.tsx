import { useEffect, useState } from 'react'
import { Flex, Space, Switch, Divider, Popconfirm } from 'antd'
import ACopy from '@/components/aCopy'
import { API } from 'apis'
import { changeRcsInteractiveStatus } from '@/api'
import {
  useStateDispatch,
  useStateStore,
} from '@/pages/rcs/interactive/reducer'
import './index.scss'

enum MatchType {
  '全文匹配' = 1,
  '关键字包含',
  '正则表达式',
}
type Props = {
  item: API.GetRcsInteractiveListResItem
  onEdit: () => void
  onDel: () => void
  onChangeStatus: () => void
}

const Keywords = ({ text, isReg }: { text: string; isReg: boolean }) => {
  let list = text.split('\n').filter((item) => item)
  return (
    <>
      {isReg ? (
        <span className='color'>{text}</span>
      ) : (
        <Space wrap align='center'>
          {list.map((item, index) => (
            <div className='keyword-item fn13' key={index}>
              {item}
            </div>
          ))}
        </Space>
      )}
    </>
  )
}

export default function Item(props: Props) {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(true)
  // 修改开启状态
  const changeState = async (_: any, event: any) => {
    event.stopPropagation()
    setLoading(true)
    const res = await changeRcsInteractiveStatus({
      id: props.item.id,
      status: !(props.item.enabled == '1'),
    })
    if (res.status == 'success') {
      setStatus(!(props.item.enabled == '1'))
      props.onChangeStatus()
    }
    setLoading(false)
  }

  const addChats = () => {
    dispatch({
      type: 'changeChats',
      payload: [...state.chats, props.item],
    })
  }

  useEffect(() => {
    setLoading(false)
    setStatus(props.item.enabled == '1')
  }, [props.item.enabled])

  return (
    <Flex
      className={`interactive-config-item m-t-24 ${
        props.item.enabled == '1' ? '' : 'disabled'
      }`}
      gap={16}>
      <div className='left-config'>
        <Switch
          size='small'
          value={status}
          loading={loading}
          onClick={(_, event) => changeState(_, event)}
        />
      </div>
      <div className='center-config fx-col p-b-4'>
        <div className='fn16 fw-500 title'>{props.item.title}</div>
        {['1', '2'].includes(props.item.type) && (
          <Flex className='p-y-4' gap={32}>
            <span className='gray-color fx-shrink'>绑定按键</span>
            <span className='tag-color'>
              {props.item.fixed_button_title || props.item.card_button_title}
            </span>
          </Flex>
        )}
        {props.item.type == '3' && (
          <>
            <Flex className='p-y-4' gap={32}>
              <span
                className='gray-color fx-shrink'
                style={{ paddingRight: '1em' }}>
                关键字
              </span>
              <Keywords
                text={props.item.keywords}
                isReg={props.item.match_type == '3'}
              />
            </Flex>
            <Flex className='p-y-4' gap={32}>
              <span className='gray-color fx-shrink'>触发规则</span>
              <span className='tag-color g-ellipsis'>
                {MatchType[props.item.match_type]}
              </span>
            </Flex>
          </>
        )}
        <Flex className='p-y-4' gap={32}>
          <span className='gray-color fx-shrink'>下行模版</span>
          <span className='tag-color g-ellipsis' title={props.item.reply_title}>
            <span style={{ position: 'relative' }}>
              【{props.item.reply_sign}】
              <ACopy text={props.item.reply_sign} />
            </span>
            {props.item.reply_title}
          </span>
        </Flex>
      </div>
      <div className='right-config'>
        <Space size={0} align='center'>
          {props.item.enabled == '1' && (
            <>
              <div className='handle-item fx-center-center' onClick={addChats}>
                <span className='icon iconfont icon-yanshi'></span>
              </div>
              <Divider type='vertical' />
              <div
                className='handle-item fx-center-center'
                onClick={props.onEdit}>
                <span className='icon iconfont icon-bianji'></span>
              </div>
              <Divider type='vertical' />
            </>
          )}

          <Popconfirm
            title='删除'
            description='确定删除该交互配置？'
            placement='bottom'
            onConfirm={props.onDel}
            okText='确定'
            cancelText='取消'>
            <div className='handle-item fx-center-center'>
              <span className='icon iconfont icon-shanchu'></span>
            </div>
          </Popconfirm>
        </Space>
      </div>
    </Flex>
  )
}
