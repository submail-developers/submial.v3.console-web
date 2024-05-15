import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Button, Space, Tooltip, App, Popconfirm } from 'antd'
import {
  EnumTempStatusBadge,
  EnumTempStatusText,
} from '@/pages/rcs/template/list/type'
import { IDIcon } from '@/components/aIcons'
import ACopy from '@/components/aCopy'

import TextItem from '@/pages/rcs/template/create/text/item'
import CardItem from '@/pages/rcs/template/create/card/item'
import CardsItem from '@/pages/rcs/template/create/cards/item'

import { delRcsTemp } from '@/api'
import { API } from 'apis'

import './index.scss'

type Props = {
  item: API.RcsTempListItem
  hiddenHandle?: boolean
  onSelect?: () => void
  onDel?: () => void
}
export default function Fn({
  item,
  onSelect,
  hiddenHandle = false,
  onDel,
}: Props) {
  const nav = useNavigate()
  const { message } = App.useApp()
  const [type, setType] = useState<'text' | 'card' | 'cards' | ''>('')
  // 选中该模版
  const handleItem = () => {
    if (onSelect) onSelect()
  }
  // 编辑事件
  const editEvent = () => {
    nav(`/console/rcs/template/create/${type}/${item.id}?name=${item.title}`)
  }
  // 删除事件
  const delEvent = async () => {
    try {
      const res = await delRcsTemp({
        id: item.sign,
      })
      if (res.status == 'success') {
        message.success('删除成功！')
        onDel()
      }
    } catch (error) {}
  }
  // 初始化获取模版类型
  useEffect(() => {
    if (typeof item.message.message == 'string') {
      setType('text')
    } else if ('generalPurposeCard' in item.message.message) {
      setType('card')
    } else if ('generalPurposeCardCarousel' in item.message.message) {
      setType('cards')
    } else {
    }
  }, [])
  return (
    <div className='rcs-temp-item'>
      <Tooltip title={item.rejectReason || ''} placement='bottom'>
        <div
          className={`temp-item-content ${onSelect ? 'openSelect' : ''}`}
          onClick={handleItem}>
          <div className='name g-ellipsis'>{item.title}</div>
          <div className='time'>创建时间：{item.createAt}</div>
          {!hiddenHandle && (
            <div className={`status ${EnumTempStatusBadge[item.checked]}`}>
              {EnumTempStatusText[item.checked]}
            </div>
          )}
          <div className='preview-model p-12'>
            <div className='temp-type fx-center-center p-x-16 fn12'>
              {type == 'text' && '纯文本模版'}
              {type == 'card' && '单卡片模版'}
              {type == 'cards' && '多卡片模版'}
            </div>
            <div className='preview-content'>
              {type == 'text' && <TextItem message={item.message.message} />}
              {type == 'card' && <CardItem message={item.message.message} />}
              {type == 'cards' && <CardsItem message={item.message.message} />}
            </div>

            <Space align='center' className='float-wrap'>
              {item.suggestions?.suggestions
                .filter((item) => Boolean(item.action))
                .map((item, index) => (
                  <div className='float-item' key={index}>
                    {item.action.displayText}
                  </div>
                ))}
            </Space>
          </div>
          <Flex
            justify='space-between'
            align='center'
            style={{ paddingTop: '12px' }}>
            <Button
              className='id-btn'
              style={{ padding: '0 4px', color: '#fd29a4' }}
              size='small'
              icon={
                <IDIcon
                  style={{
                    color: '#fd29a4',
                    fontSize: '14px',
                  }}
                />
              }>
              {item.sign}
              <ACopy text={item.sign} title='点击复制ID' />
            </Button>
            {!hiddenHandle && (
              <Space align='center' size={16}>
                <div className='g-pointer' title='编辑' onClick={editEvent}>
                  <span className='icon iconfont icon-bianji fn18'></span>
                </div>
                <Popconfirm
                  title='删除模版'
                  description='确认删除该模版吗？'
                  onConfirm={delEvent}
                  placement='bottom'>
                  <div className='g-pointer'>
                    <span className='icon iconfont icon-shanchu fn18 error-color'></span>
                  </div>
                </Popconfirm>
              </Space>
            )}
          </Flex>
        </div>
      </Tooltip>
    </div>
  )
}
