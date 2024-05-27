import { useEffect, useState } from 'react'
import { Flex, Space, Switch, Divider, Popconfirm } from 'antd'
import { API } from 'apis'
import { changeRcsInteractiveStatus } from '@/api'
import { useStateDispatch, useStateStore } from '@/pages/rcs/sandbox/reducer'
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
    <Flex className='sandbox-config-item m-t-24' gap={16}>
      <div className='left-config'>
        <Switch
          size='small'
          value={status}
          loading={loading}
          onClick={(_, event) => changeState(_, event)}
        />
      </div>
      <div className='center-config fx-col p-b-4'>
        <div className='fn16 fw-500'>{props.item.title}</div>
        {['1', '2'].includes(props.item.type) && (
          <Space className='p-y-4' size={32}>
            <span className='gray-color'>绑定按键</span>
            <span className='color'>
              {props.item.fixed_button_title || props.item.card_button_title}
            </span>
          </Space>
        )}
        {props.item.type == '3' && (
          <>
            <Space className='p-y-4' size={32}>
              <span className='gray-color' style={{ marginRight: '1em' }}>
                关键字
              </span>
              <span className='color'>{props.item.keywords}</span>
            </Space>
            <Space className='p-y-4' size={32}>
              <span className='gray-color'>触发规则</span>
              <span className='color g-ellipsis'>
                {MatchType[props.item.match_type]}
              </span>
            </Space>
          </>
        )}
        <Space className='p-y-4' size={32}>
          <span className='gray-color'>下行模版</span>
          <span className='color g-ellipsis'>
            <span>【{props.item.reply_sign}】</span>
            {props.item.reply_title}
          </span>
        </Space>
      </div>
      <div className='right-config'>
        <Space size={0} align='center'>
          <div className='handle-item fx-center-center' onClick={addChats}>
            <span className='icon iconfont icon-yanshi'></span>
          </div>
          <Divider type='vertical' />
          <div className='handle-item fx-center-center' onClick={props.onEdit}>
            <span className='icon iconfont icon-bianji'></span>
          </div>
          <Divider type='vertical' />

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
