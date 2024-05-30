import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Space, Switch, Image, App, Empty, Spin } from 'antd'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import Modal from '@/pages/rcs/interactive/compontent/modal'
import Item from '@/pages/rcs/interactive/compontent/item'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import { API } from 'apis'
import {
  getRcsInteractiveList,
  delRcsInteractive,
  changeRcsInteractiveAllStatus,
} from '@/api'
import type { Options } from '@/pages/rcs/interactive/type'

import './index.scss'

export default function Config() {
  const { message } = App.useApp()
  const state = useStateStore()
  const { id } = useParams()
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [allStatus, setAllStatus] = useState(false)
  const menuOptionsRef = useRef<Options[]>([])
  const [allInteractiveList, setallInteractiveList] = useState<
    API.GetRcsInteractiveListResItem[]
  >([])
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
  // 生成modal中的options
  const filterOptionsEvent = (suggestions: API.EntriesItem[]): Options[] => {
    let arr: Options[] = []
    if (Array.isArray(suggestions)) {
      suggestions.forEach((item: API.EntriesItem) => {
        if (item.action) {
          arr.push({
            label: `${item.action.displayText}`,
            value: item.action?.postback?.data || '',
            disabled: false,
            item: item,
          })
        } else if (item.reply) {
          arr.push({
            label: `${item.reply.displayText}`,
            value: item.reply?.postback?.data || '',
            disabled: false,
            item: item,
          })
        } else {
        }
      })
    }
    return arr
  }

  // 新增
  const onAdd = (type: '1' | '3') => {
    if (type == '1') {
      modalRef.current.openEvent({
        title: '新增固定菜单交互',
        options: menuOptionsRef.current,
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

  // 编辑
  const onEdit = (item: API.GetRcsInteractiveListResItem) => {
    if (item.type == '1') {
      let options: Options[] = []
      menuOptionsRef.current.forEach((im) => {
        if (im.value == item.fixed_button) {
          options.push({
            ...im,
            disabled: false,
          })
        } else {
          options.push(im)
        }
      })

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

  // 删除
  const onDel = async (id: string) => {
    const res = await delRcsInteractive({
      id: id,
    })
    if (res.status == 'success') {
      message.success('删除成功')
      getList()
    }
  }

  // 获取列表
  const getList = async () => {
    try {
      const res = await getRcsInteractiveList({ appid: id })
      if (res.data) {
        setallInteractiveList(res.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 一键开启/关闭
  const changeAllStatus = async (checked) => {
    setSwitchLoading(true)
    const res = await changeRcsInteractiveAllStatus({
      appid: id,
      status: checked,
    })
    if (res.status == 'success') {
      getList()
    }

    setSwitchLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    if (id != '0') getList()
  }, [id])

  useEffect(() => {
    // chatbot的menu列表 -> Options[]
    if (state.chatbot && state.chatbot.menu) {
      menuOptionsRef.current = filterOptionsEvent(
        state.chatbot?.menu?.menu?.entries || [],
      )
    }

    // menu列表的postback?.data
    let menuIds: string[] = []
    menuOptionsRef.current.forEach((item) => menuIds.push(item.value))
    let menuInteractives: API.GetRcsInteractiveListResItem[] = [] // 可以使用的菜单配置
    let menuInteractivesValues: string[] = [] // 被使用使用的菜单
    let desabledMenuInteractives: API.GetRcsInteractiveListResItem[] = [] // 已失效的菜单配置
    let textInteractives: API.GetRcsInteractiveListResItem[] = [] // 已失效的菜单配置

    allInteractiveList.forEach((item) => {
      // 菜单
      if (item.type == '1') {
        if (menuIds.includes(item.fixed_button)) {
          menuInteractives.push(item)
          menuInteractivesValues.push(item.fixed_button)
        } else {
          desabledMenuInteractives.push(item)
        }
        // 纯文字
      } else if (item.type == '3') {
        textInteractives.push(item)
      } else {
      }
    })
    menuOptionsRef.current = menuOptionsRef.current.map((item) => {
      item.disabled = menuInteractivesValues.includes(item.value)
      return item
    })
    setchatbotInteractiveList(menuInteractives)
    settextInteractiveList(textInteractives)
    setAllStatus(
      [...menuInteractives, ...textInteractives].some(
        (item) => item.enabled == '1',
      ),
    )
  }, [allInteractiveList, state.chatbot])

  useEffect(() => {
    if (state.chatbot && state.chatbot.menu) {
      menuOptionsRef.current = filterOptionsEvent(
        state.chatbot?.menu?.menu?.entries || [],
      )
    }
  }, [state.chatbot])

  return (
    <div className='interactive-config p-r-40'>
      <Flex justify='space-between' align='center'>
        <Space align='center'>
          <Image src={folder_blue} preview={false} width={32} />
          {state.chatbot && (
            <span className='fn18 fw-500'>{state.chatbot.name}</span>
          )}
        </Space>
        {allInteractiveList.length > 0 && (
          <Space align='center'>
            <Switch
              value={allStatus}
              size='small'
              loading={switchLoading}
              onChange={changeAllStatus}
            />
            <span>{allStatus ? '全部禁用' : '全部启用'}</span>
          </Space>
        )}
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
