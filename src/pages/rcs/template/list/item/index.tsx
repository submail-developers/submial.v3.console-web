import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Button, Space, Tooltip } from 'antd'
import {
  EnumTempStatusBadge,
  EnumTempStatusText,
} from '@/pages/rcs/template/list/type'
import { IDIcon } from '@/components/aIcons'

import CardItem from '@/pages/rcs/template/create/card/item'

import { API } from 'apis'

import './index.scss'

type Props = {
  item: API.RcsTempListItem
  hiddenHandle?: boolean
  onSelect?: () => void
}
export default function Fn({ item, onSelect, hiddenHandle = false }: Props) {
  const nav = useNavigate()
  const [type, setType] = useState('')
  const handleItem = () => {
    if (onSelect) onSelect()
  }
  const editEvent = () => {
    nav(`/console/rcs/template/create/card/${item.id}?name=${item.title}`)
  }
  useEffect(() => {
    if ('generalPurposeCard' in item.message.message) {
      setType('card')
    }
  }, [])
  return (
    <div className='rcs-temp-item'>
      <Tooltip title={onSelect ? '' : '审核备注'} placement='bottom'>
        <div
          className={`temp-item-content ${onSelect ? 'openSelect' : ''}`}
          onClick={handleItem}>
          <div className='name g-ellipsis'>{item.title}</div>
          <div className='time'>创建时间：{item.createAt}</div>
          <div className={`status ${EnumTempStatusBadge[item.checked]}`}>
            {EnumTempStatusText[item.checked]}
          </div>
          <div className='preview-model p-12'>
            <div className='preview-content'>
              {type == 'card' && <CardItem message={item.message.message} />}
            </div>

            <Space align='center' className='float-wrap'>
              {item.suggestions.suggestions
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
            </Button>
            {!hiddenHandle && (
              <Space align='center' size={16}>
                <div className='g-pointer' title='查看'>
                  <span className='icon iconfont icon-xianshi fn18'></span>
                </div>
                <div className='g-pointer' title='编辑' onClick={editEvent}>
                  <span className='icon iconfont icon-bianji fn18'></span>
                </div>
                <div className='g-pointer' title='删除'>
                  <span className='icon iconfont icon-shanchu fn18 error-color'></span>
                </div>
              </Space>
            )}
          </Flex>
        </div>
      </Tooltip>
    </div>
  )
}
