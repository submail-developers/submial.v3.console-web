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
  // 选中该模版
  const handleItem = () => {
    if (onSelect) onSelect()
  }
  // 编辑事件
  const editEvent = () => {
    if (item.type == 4) {
      message.warning('文件模版暂未开发')
      return
    }
    nav(
      `/console/rcs/template/create/${item.type}/${item.id}?name=${item.title}`,
    )
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
  const createSend = () => {
    nav(`/console/rcs/send/${item.sign}`)
  }
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
          <div className='preview-model p-t-12 p-x-12'>
            <div className='temp-type fx-center-center p-x-16 fn12'>
              {item.type == 1 && '纯文本模版'}
              {item.type == 2 && '单卡片模版'}
              {item.type == 3 && '多卡片模版'}
              {item.type == 4 && '文件模版'}
            </div>
            <div className='preview-content'>
              {item.type == 1 && <TextItem message={item.message.message} />}
              {item.type == 2 && <CardItem message={item.message.message} />}
              {item.type == 3 && <CardsItem message={item.message.message} />}
              {item.type == 4 && <div>文件模版暂未开发</div>}
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
            <div className='id-btn'>
              <span className='icon iconfont icon-id fn14 m-r-6'></span>
              {item.sign}
              <ACopy text={item.sign} title='点击复制ID' />
            </div>
            {!hiddenHandle && (
              <Space align='center' size={16}>
                {/* 审核中通过-进入创建在线发送任务入口 */}
                {item.checked == '1' && (
                  <div
                    className='g-pointer text-color'
                    title='创建在线发送任务'
                    onClick={createSend}>
                    <span className='icon iconfont icon-fasong fn16'></span>
                  </div>
                )}
                {/* 审核中禁止编辑 */}
                {item.checked != '0' && (
                  <div
                    className='g-pointer text-color'
                    title='编辑'
                    onClick={editEvent}>
                    <span className='icon iconfont icon-bianji fn16'></span>
                  </div>
                )}
                <Popconfirm
                  title='删除模版'
                  description='确认删除该模版吗？'
                  onConfirm={delEvent}
                  placement='bottom'>
                  <div className='g-pointer text-color'>
                    <span className='icon iconfont icon-shanchu fn16'></span>
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
