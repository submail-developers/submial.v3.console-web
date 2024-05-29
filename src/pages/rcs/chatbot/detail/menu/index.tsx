import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Skeleton, Space, Button, Empty, App } from 'antd'
import EditDialog from './editDialog/editDialog'
import Footer from './footer'
import { API } from 'apis'
import { usePoint } from '@/hooks'
import { saveFixedMenu } from '@/api'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'

import './index.scss'
import '@/pages/rcs/template/mobile.scss'

enum StatusText {
  '审核通过' = 1,
  '审核失败',
  '审核中',
}
enum StatusStyle {
  'color-status-success' = 1,
  'color-status-error',
  'color-status-waiting',
}

type Props = {
  entries: API.EntriesItem[]
  chatbotStatus: '1' | '2' | '3' //  1通过  2不通过  3审核中
  menuStatus: '1' | '2' | '3' // 固定菜单审核状态 1通过  2不通过  3审核中
  reloadEvent: () => void
}

type EditMenuParams = {
  menuItem: API.EntriesItem
  index: number
  idx: number
}

const MenuEvent = ({
  item,
  editing,
}: {
  item: API.EntriesItem
  editing: boolean
}) => {
  const size = usePoint('xxl')
  let textWitdth = 0
  if (size) {
    if (editing) {
      textWitdth = 374
    } else {
      textWitdth = 470
    }
  } else {
    if (editing) {
      textWitdth = 144
    } else {
      textWitdth = 240
    }
  }

  let title = ''
  let eventText = ''
  if (item.menu) {
    title = '菜单'
  } else if (item.reply) {
    title = '回复消息'
    eventText = item.reply.displayText
  } else if (item.action) {
    if (item.action.urlAction) {
      title = '跳转链接'
      eventText = item.action.urlAction.openUrl.url
    } else if (item.action.dialerAction) {
      title = '拨号事件'
      eventText =
        item.action.dialerAction?.dialPhoneNumber?.phoneNumber ||
        item.action.dialerAction?.dialEnrichedCall?.phoneNumber ||
        item.action.dialerAction?.dialVideoCall?.phoneNumber
    } else if (item.action.mapAction) {
      title = '地图事件'
      console.log(item.action, 'item.action')
      if (
        item.action.mapAction?.showLocation?.location?.latitude &&
        item.action.mapAction?.showLocation?.location?.longitude
      ) {
        eventText = `经度：${item.action.mapAction?.showLocation?.location?.latitude}；纬度：${item.action.mapAction?.showLocation?.location.longitude}`
      } else {
        eventText = item.action.mapAction?.showLocation?.location?.query
      }
    } else if (item.action.calendarAction) {
      title = '日历事件'
      eventText = `${
        item.action.calendarAction?.createCalendarEvent?.title
      }：${dayjs(
        item.action.calendarAction?.createCalendarEvent?.startTime,
      ).format('YYYY/MM/DD HH:mm:ss')}-${dayjs(
        item.action.calendarAction?.createCalendarEvent?.endTime,
      ).format('YYYY/MM/DD HH:mm:ss')}`
    } else {
    }
  } else {
  }

  return (
    <Space size={12} className='menu-event'>
      <div style={{ color: '#5068A6', width: 100 }}>【{title}】</div>
      <div
        className='g-ellipsis'
        title={eventText}
        style={{ width: textWitdth }}>
        {eventText}
      </div>
    </Space>
  )
}

export default function Menu(props: Props) {
  const modalRef = useRef(null)
  const { id } = useParams()
  const { message } = App.useApp()
  const entriesCopyRef = useRef<API.EntriesItem[]>([])
  const [entries, setEntries] = useState<API.EntriesItem[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const cancel = () => {
    setEntries(cloneDeep(entriesCopyRef.current))
    setEditing(false)
  }
  /**
   * @param menuItem 编辑的菜单item
   * @param index 主菜单index
   * @param idx 子菜单菜单index
   * @param isMainMenu 是否为主菜单
   * */
  const editMenu = ({ menuItem, index, idx }: EditMenuParams) => {
    modalRef.current.open({
      title: idx == -1 ? '编辑主菜单' : '编辑子菜单',
      menuItem,
      index,
      idx,
      isMainMenu: idx == -1,
    })
  }

  // index=-1时为新增主菜单；否则为新增子菜单
  const addEenu = (index = -1) => {
    modalRef.current.open({
      title: index == -1 ? '新增主菜单' : '新增子菜单',
      index,
      isMainMenu: index == -1,
    })
  }

  const delMenu = (index, idx = -1) => {
    if (idx == -1) {
      setEntries((prev) => {
        return prev.filter((item, i) => i != index)
      })
    } else {
      setEntries((prev) => {
        return prev.map((item, i) => {
          if (i == index) {
            item.menu.entries = item.menu.entries.filter(
              (sub, subIndex) => subIndex != idx,
            )
          }
          return item
        })
      })
    }
  }

  const changeMenu = (params) => {
    let { menuItem, index, idx, type } = params
    if (type == 'edit') {
      if (idx == -1) {
        setEntries((prev) => {
          return prev.map((item, itemIndex) => {
            if (itemIndex == index) {
              item = menuItem
            }
            return item
          })
        })
      } else {
        setEntries((prev) => {
          return prev.map((item, itemIndex) => {
            if (itemIndex == index) {
              item.menu.entries = item.menu.entries.map(
                (entries, entriesIndex) => {
                  if (entriesIndex == idx) {
                    entries = menuItem
                  }
                  return entries
                },
              )
            }
            return item
          })
        })
      }
    } else {
      if (index == -1) {
        setEntries((prev) => {
          return [...prev, menuItem]
        })
      } else {
        setEntries((prev) => {
          return prev.map((item, itemIndex) => {
            if (itemIndex == index) {
              item.menu = {
                ...item.menu,
                entries: [...item.menu.entries, menuItem],
              }
            }
            return item
          })
        })
      }
    }
  }

  const submitMenu = async () => {
    try {
      setLoading(true)
      let flag = false
      entries.forEach((item) => {
        if (item.menu && item.menu.entries.length == 0) {
          flag = true
        }
      })
      if (flag) {
        message.warning('主菜单按钮类型为菜单时至少携带一个子菜单！', 6)
        setLoading(false)
        return
      }
      const res = await saveFixedMenu({
        appid: id,
        message:
          entries.length > 0
            ? JSON.stringify({
                menu: {
                  entries,
                },
              })
            : '',
      })
      if (res.status == 'success') {
        message.success('保存成功')
        setEditing(false)
        setLoading(false)
        props.reloadEvent()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    entriesCopyRef.current = cloneDeep(props.entries)
    setEntries(cloneDeep(props.entries))
  }, [props.entries])

  return (
    <div className='chatbot-menu m-t-24'>
      <div className='content p-r-24'>
        <div className='form-group-title'>固定菜单</div>
        <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 m-t-24'>
          <b className='fn16'>提示</b>
          <br />
          主菜单最大可创建数量为
          <span className='error-color'> 3 </span>
          个；
          <br />
          每个主菜单可携带的二级菜单最大可创建数量为
          <span className='error-color'> 5 </span>
          个。
        </div>
        <Flex justify='space-between' align='center' className='m-t-16'>
          {editing ? (
            <>
              <div>
                {entries.length < 3 && (
                  <Space
                    className='color g-pointer'
                    size={4}
                    onClick={() => addEenu(-1)}>
                    <span className='icon iconfont icon-jia fn13 fw-500'></span>
                    <span className='fw-500'>新增主菜单</span>
                  </Space>
                )}
              </div>
              <Space>
                <Button
                  onClick={cancel}
                  type='primary'
                  style={{ background: '#F1F2F4', color: '#282b31' }}>
                  取消编辑
                </Button>
                <Button type='primary' loading={loading} onClick={submitMenu}>
                  提交审核
                </Button>
              </Space>
            </>
          ) : (
            <>
              <div
                className={`p-x-16 g-radius-11 ${
                  StatusStyle[Number(props.menuStatus)]
                }`}>
                {StatusText[Number(props.menuStatus)]}
              </div>
              <Button onClick={() => setEditing(true)} type='primary'>
                编辑固定菜单
              </Button>
            </>
          )}
        </Flex>
        {props.chatbotStatus != '2' ? (
          entries.map((item, index) => (
            <div className='menu-item m-t-8' key={index}>
              <Flex
                align='center'
                justify='space-between'
                className='main-menu p-x-12 g-radius-4'>
                <Flex align='center' gap={0}>
                  <div className='menu-icon fx-y-center'>
                    <span className='icon iconfont icon-jianpan fn18 gray-color'></span>
                  </div>
                  <span className='gray-color fw-500 menu-title'>主菜单</span>
                  <span className='fn14 fw-500 menu-name'>
                    {item?.menu?.displayText ||
                      item.action?.displayText ||
                      item?.reply?.displayText}
                  </span>
                  <MenuEvent item={item} editing={editing} />
                </Flex>
                {editing && (
                  <Space size={0}>
                    {item?.menu && item?.menu?.entries.length < 5 && (
                      <div
                        className='handle-item'
                        onClick={() => addEenu(index)}>
                        <span className='icon iconfont icon-jia fn15'></span>
                      </div>
                    )}
                    <div
                      className='handle-item'
                      onClick={() =>
                        editMenu({
                          menuItem: item,
                          index,
                          idx: -1,
                        })
                      }>
                      <span className='icon iconfont icon-bianji fn15'></span>
                    </div>
                    <div
                      className='handle-item'
                      onClick={() => delMenu(index, -1)}>
                      <span className='icon iconfont icon-shanchu fn15'></span>
                    </div>
                  </Space>
                )}
              </Flex>
              {item?.menu?.entries.length > 0 && (
                <div className='p-y-12 sub-menu-list'>
                  {item?.menu?.entries.map((submenu, idx) => (
                    <Flex
                      align='center'
                      justify='space-between'
                      className='sub-menu p-x-12 g-radius-4'
                      key={idx}>
                      <Flex align='center' gap={0}>
                        <div className='menu-icon fx-y-center'></div>
                        <span className='gray-color fw-500 menu-title'>
                          二级菜单
                        </span>
                        <span className='fn14 fw-500 menu-name'>
                          {submenu?.menu?.displayText ||
                            submenu.action?.displayText ||
                            submenu?.reply?.displayText}
                        </span>
                        <MenuEvent item={submenu} editing={editing} />
                      </Flex>
                      {editing && (
                        <Space size={0}>
                          <div
                            className='handle-item'
                            onClick={() =>
                              editMenu({
                                menuItem: submenu,
                                index,
                                idx,
                              })
                            }>
                            <span className='icon iconfont icon-bianji fn15'></span>
                          </div>
                          <div
                            className='handle-item'
                            onClick={() => delMenu(index, idx)}>
                            <span className='icon iconfont icon-shanchu fn15'></span>
                          </div>
                        </Space>
                      )}
                    </Flex>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='fx-center-center m-t-40'>
            <Empty description='Chatbot 审核未通过' />
          </div>
        )}
        {props.chatbotStatus != '2' && entries.length == 0 && (
          <div className='fx-center-center m-t-40'>
            <Empty />
          </div>
        )}
      </div>
      <div className='mob'>
        <div className='rcs-mobile small m-t-8' style={{ marginBottom: 0 }}>
          <div className='mobile-content'>
            <div className='skeleton-wrap p-x-8 p-t-8 p-b-16 g-radius-8'>
              <Skeleton.Node style={{ width: 244 }}>
                <div style={{ width: 244 }}></div>
              </Skeleton.Node>
              <Skeleton.Node
                style={{ width: 244, height: 32 }}
                className='m-t-4'>
                <div style={{ width: 244 }}></div>
              </Skeleton.Node>
              <Skeleton.Node
                style={{ width: 244, height: 60 }}
                className='m-t-4'>
                <div style={{ width: 244 }}></div>
              </Skeleton.Node>
              <Skeleton.Button
                shape='round'
                style={{ width: 244, height: 32 }}
                className='m-t-8'></Skeleton.Button>
            </div>
            <Space className='float-skeleton p-x-8' align='center'>
              <Skeleton.Button
                shape='round'
                style={{ width: 80, height: 28 }}></Skeleton.Button>
              <Skeleton.Button
                shape='round'
                style={{ width: 80, height: 28 }}></Skeleton.Button>
            </Space>
          </div>
          <Footer entries={entries} />
        </div>
      </div>
      <EditDialog ref={modalRef} onSubmit={changeMenu} />
    </div>
  )
}
