import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Space, Switch, Image, App, Empty, Spin, Typography } from 'antd'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import Modal from '@/pages/rcs/interactive/compontent/modal'
import Item from '@/pages/rcs/interactive/compontent/item'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import { API } from 'apis'
import { getRcsInteractiveList, delRcsInteractive } from '@/api'

import './index.scss'

export type Options = {
  label: string
  value: string
  disabled: boolean
  item: API.EntriesItem | API.RcsSuggestionItem
}

export default function Config() {
  const { message } = App.useApp()
  const state = useStateStore()
  const { id } = useParams()
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(false)
  // 固定菜单按钮列表
  const [chatbotInteractiveList, setchatbotInteractiveList] = useState<
    API.GetRcsInteractiveListResItem[]
  >([])
  // 纯文字消息列表
  const [textInteractiveList, settextInteractiveList] = useState<
    API.GetRcsInteractiveListResItem[]
  >([])

  // 获取可配置的按钮列表
  const filterOptions = (
    entries: API.EntriesItem[],
    disableds: string[],
  ): Options[] => {
    let arr: Options[] = []
    entries.forEach((item: API.EntriesItem) => {
      if (item.action) {
        arr.push({
          label: `${item.action.displayText}${
            disableds.includes(item.action?.postback?.data) ? '（已配置）' : ''
          }`,
          value: item.action?.postback?.data || '',
          disabled: disableds.includes(item.action?.postback?.data),
          item: item,
        })
      } else if (item.reply) {
        arr.push({
          label: `${item.reply.displayText}${
            disableds.includes(item.reply?.postback?.data) ? '（已配置）' : ''
          }`,
          value: item.reply?.postback?.data || '',
          disabled: disableds.includes(item.reply?.postback?.data),
          item: item,
        })
      } else if (item.menu) {
        if (item.menu.entries && item.menu.entries.length > 0) {
          arr = [...arr, ...filterOptions(item.menu.entries, disableds)]
        }
      } else {
      }
    })
    return arr
  }

  const onAdd = (type: '1' | '3') => {
    if (type == '1') {
      let options: Options[] = []
      let disabledList: string[] = []
      chatbotInteractiveList.forEach((item) => {
        disabledList.push(item.fixed_button)
      })
      if (state.chatbot) {
        let entries: API.EntriesItem[] = state.chatbot.menu?.menu?.entries || []
        options = [...filterOptions(entries, disabledList)]
      }
      modalRef.current.openEvent({
        title: '新增固定菜单交互',
        options,
        initValues: {
          type,
          chatbotId: id,
        },
      })
    } else {
      modalRef.current.openEvent({
        title: '新增纯文字消息交互',
        initValues: {
          type,
          chatbotId: id,
        },
      })
    }
  }
  const onEdit = (item: API.GetRcsInteractiveListResItem) => {
    if (item.type == '1') {
      let options: Options[] = []
      let disabledList: string[] = []
      chatbotInteractiveList.forEach((im) => {
        if (im.id != item.id) {
          disabledList.push(im.fixed_button)
        }
      })
      if (state.chatbot) {
        let entries: API.EntriesItem[] = state.chatbot.menu?.menu?.entries || []
        options = [...filterOptions(entries, disabledList)]
      }
      modalRef.current.openEvent({
        title: '编辑固定菜单交互',
        options,
        initValues: {
          type: '1',
          id: item.id,
          chatbotId: id,
          title: item.title,
          button: options.find((im) => item.fixed_button == im.value),
          reply_id: item.reply_id,
        },
      })
    } else if (item.type == '3') {
      modalRef.current.openEvent({
        title: '编辑纯文字消息交互',
        initValues: {
          type: '3',
          id: item.id,
          chatbotId: id,
          title: item.title,
          keywords: item.keywords,
          match_type: item.match_type,
          reply_id: item.reply_id,
        },
      })
    } else {
    }
  }
  const onDel = async (id: string) => {
    const res = await delRcsInteractive({
      id: id,
    })
    if (res.status == 'success') {
      message.success('删除成功')
      getList()
    }
  }

  const getList = async () => {
    try {
      const res = await getRcsInteractiveList({ appid: id })
      if (res.data) {
        setchatbotInteractiveList(res.data.filter((item) => item.type == '1'))
        settextInteractiveList(res.data.filter((item) => item.type == '3'))
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    if (id != '0') getList()
  }, [id])

  return (
    <div className='interactive-config p-r-40'>
      <Flex justify='space-between' align='center'>
        <Space align='center'>
          <Image src={folder_blue} preview={false} width={32} />
          <span className='fn18 fw-500'>微服务架构模版</span>
        </Space>
        <Space align='center'>
          <Switch size='small' />
          <span>已启用</span>
        </Space>
      </Flex>

      {loading ? (
        <div className='m-t-40 p-t-40 fx-center-center'>
          <Spin />
        </div>
      ) : (
        <>
          <div className='config-list m-t-40'>
            <Flex
              className='config-header g-radius-4 p-x-16'
              align='center'
              justify='space-between'>
              <span className='fw-500'>固定菜单按钮</span>
              <div
                className='add-btn fx-center-center'
                onClick={() => onAdd('1')}>
                <span className='icon iconfont icon-jia fn14'></span>
              </div>
            </Flex>
            {chatbotInteractiveList.map((item) => (
              <Item
                key={item.id}
                item={item}
                onEdit={() => onEdit(item)}
                onDel={() => onDel(item.id)}
                onChangeStatus={() => getList()}
              />
            ))}
            {chatbotInteractiveList.length == 0 && (
              <Empty description='暂未配置数据' className='m-t-24' />
            )}
          </div>
          <div className='config-list m-t-24'>
            <Flex
              className='config-header g-radius-4 p-x-16'
              align='center'
              justify='space-between'>
              <span className='fw-500'>纯文字消息</span>
              <div
                className='add-btn fx-center-center'
                onClick={() => onAdd('3')}>
                <span className='icon iconfont icon-jia fn14'></span>
              </div>
            </Flex>
            {textInteractiveList.map((item) => (
              <Item
                key={item.id}
                item={item}
                onEdit={() => onEdit(item)}
                onDel={() => onDel(item.id)}
                onChangeStatus={() => getList()}
              />
            ))}
            {textInteractiveList.length == 0 && (
              <Empty description='暂未配置数据' className='m-t-24' />
            )}
          </div>
        </>
      )}
      <Modal ref={modalRef} onOk={() => getList()} />
    </div>
  )
}
