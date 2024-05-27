import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Space, Switch, Image, App, Empty, Spin } from 'antd'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import Item from '@/pages/rcs/sandbox/compontent/item'
import Modal from '@/pages/rcs/sandbox/compontent/modal'
import { useStateStore } from '@/pages/rcs/sandbox/reducer'
import { getRcsInteractiveList, delRcsInteractive } from '@/api'
import { API } from 'apis'

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
  // 模版内容里的-按钮
  const sugOptionsRef = useRef<Options[]>([])
  // 模版悬浮菜单-按钮
  const floatOptionsRef = useRef<Options[]>([])
  // 弹框的ref
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(true)
  // 所有列表
  const [list, setList] = useState<API.GetRcsInteractiveListResItem[]>([])
  // 固定菜单按钮列表
  const [sugInteractiveList, setsugInteractiveList] = useState<
    API.GetRcsInteractiveListResItem[]
  >([])
  // 固定菜单按钮列表
  const [floatInteractiveList, setfloatInteractiveList] = useState<
    API.GetRcsInteractiveListResItem[]
  >([])

  // 1为模版内按钮 2为悬浮按钮
  const onAdd = (type: '1' | '2') => {
    if (type == '1') {
      let disabledList: string[] = []
      sugInteractiveList.forEach((item) => {
        disabledList.push(item.card_button)
      })
      let options: Options[] = []
      sugOptionsRef.current.map((item) => {
        let disabled = disabledList.includes(item.value)
        options.push({
          ...item,
          label: `${item.label}${disabled ? '（已配置）' : ''}`,
          disabled: disabled,
        })
      })
      modalRef.current.openEvent({
        title: '新增模版按钮交互',
        options,
        initValues: {
          type: '2',
          card_id: id,
        },
      })
    } else {
      let disabledList: string[] = []
      floatInteractiveList.forEach((item) => {
        disabledList.push(item.card_button)
      })
      let options: Options[] = []
      floatOptionsRef.current.map((item) => {
        let disabled = disabledList.includes(item.value)
        options.push({
          ...item,
          label: `${item.label}${disabled ? '（已配置）' : ''}`,
          disabled: disabled,
        })
      })
      modalRef.current.openEvent({
        title: '新增悬浮按钮交互',
        options,
        initValues: {
          type: '2',
          card_id: id,
        },
      })
    }
  }

  // 编辑事件，1为模版内按钮 2为悬浮按钮
  const onEdit = (im: API.GetRcsInteractiveListResItem, type: '1' | '2') => {
    if (type == '1') {
      let disabledList: string[] = []
      sugInteractiveList.forEach((item) => {
        if (item.card_button != im.card_button) {
          disabledList.push(item.card_button)
        }
      })
      let options: Options[] = []
      sugOptionsRef.current.map((item) => {
        let disabled = disabledList.includes(item.value)
        options.push({
          ...item,
          label: `${item.label}${disabled ? '（已配置）' : ''}`,
          disabled: disabled,
        })
      })
      modalRef.current.openEvent({
        title: '编辑模版按钮交互',
        options,
        initValues: {
          type: '2',
          card_id: id,
          id: im.id,
          title: im.title,
          button: options.find((item) => im.card_button == item.value),
          reply_id: im.reply_id,
        },
      })
    } else {
      let disabledList: string[] = []
      floatInteractiveList.forEach((item) => {
        if (item.card_button != im.card_button) {
          disabledList.push(item.card_button)
        }
      })
      let options: Options[] = []
      floatOptionsRef.current.map((item) => {
        let disabled = disabledList.includes(item.value)
        options.push({
          ...item,
          label: `${item.label}${disabled ? '（已配置）' : ''}`,
          disabled: disabled,
        })
      })
      modalRef.current.openEvent({
        title: '编辑悬浮按钮交互',
        options,
        initValues: {
          type: '2',
          card_id: id,
          id: im.id,
          title: im.title,
          button: options.find((item) => im.card_button == item.value),
          reply_id: im.reply_id,
        },
      })
    }
  }

  // 删除事件
  const onDel = async (id: string) => {
    const res = await delRcsInteractive({
      id: id,
    })
    if (res.status == 'success') {
      message.success('删除成功')
      getList()
    }
  }

  // 获取配置列表
  const getList = async () => {
    try {
      const res = await getRcsInteractiveList({ template_id: id })
      if (res.data) {
        setList(res.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 生成modal中的options
  const filterOptionsEvent = (
    suggestions: API.RcsSuggestionItem[],
  ): Options[] => {
    let arr: Options[] = []
    if (Array.isArray(suggestions)) {
      suggestions.forEach((item: API.RcsSuggestionItem) => {
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

  // 获取模版按钮/悬浮按钮的列表
  useEffect(() => {
    if (state.template) {
      floatOptionsRef.current = filterOptionsEvent(
        state.template?.suggestions?.suggestions,
      )
      //type 1 | 2 | 3 | 4 // 1纯文本  2单卡片  3多卡片  4文件
      switch (state.template.type) {
        case 2:
          if (state.template?.message?.message.generalPurposeCard) {
            sugOptionsRef.current = filterOptionsEvent(
              state.template?.message?.message.generalPurposeCard.content
                .suggestions,
            )
          }
          break
        case 3:
          if (state.template?.message?.message.generalPurposeCardCarousel) {
            sugOptionsRef.current = []
            state.template?.message?.message.generalPurposeCardCarousel.content.forEach(
              (item) => {
                sugOptionsRef.current = [
                  ...sugOptionsRef.current,
                  ...filterOptionsEvent(item?.suggestions || []),
                ]
              },
            )
          }
          break
        default:
      }

      let floatIds: string[] = []
      let sugIds: string[] = []
      floatOptionsRef.current.forEach((item) => floatIds.push(item.value))
      sugOptionsRef.current.forEach((item) => sugIds.push(item.value))

      setfloatInteractiveList(
        list.filter((item) => floatIds.includes(item.card_button)),
      )
      setsugInteractiveList(
        list.filter((item) => sugIds.includes(item.card_button)),
      )
    }
  }, [state.template, list])

  // 获取列表
  useEffect(() => {
    setLoading(true)
    if (id != '0') getList()
  }, [id])

  return (
    <div className='sandbox-config p-r-40'>
      <>
        {/* 单卡片模版和多卡片模版才有模版内的按钮 */}
        <div className='config-list m-t-12'>
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
          {state.interactives.fixeds.map((item) => (
            <Item
              key={item.id}
              item={item}
              onEdit={() => onEdit(item, '1')}
              onDel={() => onDel(item.id)}
              onChangeStatus={() => getList()}
            />
          ))}
        </div>
        <div className='config-list m-t-24'>
          <Flex
            className='config-header g-radius-4 p-x-16'
            align='center'
            justify='space-between'>
            <span className='fw-500'>纯文字消息</span>
            <div
              className='add-btn fx-center-center'
              onClick={() => onAdd('2')}>
              <span className='icon iconfont icon-jia fn14'></span>
            </div>
          </Flex>
          {state.interactives.texts.map((item) => (
            <Item
              key={item.id}
              item={item}
              onEdit={() => onEdit(item, '2')}
              onDel={() => onDel(item.id)}
              onChangeStatus={() => getList()}
            />
          ))}
        </div>
        <div className='config-list m-t-24'>
          <Flex
            className='config-header g-radius-4 p-x-16'
            align='center'
            justify='space-between'>
            <span className='fw-500'>模版按钮</span>
            <div
              className='add-btn fx-center-center'
              onClick={() => onAdd('2')}>
              <span className='icon iconfont icon-jia fn14'></span>
            </div>
          </Flex>
          {state.interactives.btns.map((item) => (
            <Item
              key={item.id}
              item={item}
              onEdit={() => onEdit(item, '2')}
              onDel={() => onDel(item.id)}
              onChangeStatus={() => getList()}
            />
          ))}
        </div>
        <div className='config-list m-t-24'>
          <Flex
            className='config-header g-radius-4 p-x-16'
            align='center'
            justify='space-between'>
            <span className='fw-500'>悬浮按钮</span>
            <div
              className='add-btn fx-center-center'
              onClick={() => onAdd('2')}>
              <span className='icon iconfont icon-jia fn14'></span>
            </div>
          </Flex>
          {state.interactives.sugs.map((item) => (
            <Item
              key={item.id}
              item={item}
              onEdit={() => onEdit(item, '2')}
              onDel={() => onDel(item.id)}
              onChangeStatus={() => getList()}
            />
          ))}
        </div>
      </>

      <Modal ref={modalRef} onOk={() => getList()} />
    </div>
  )
}
