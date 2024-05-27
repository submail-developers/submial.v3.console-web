import { useEffect, useState, Fragment } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Space, Flex, Divider, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useStateStore } from '@/pages/rcs/interactive/reducer'
import { API } from 'apis'

import './index.scss'

type DropMenuProps = {
  menuItem: API.EntriesItem
}
const DropMenu = ({ menuItem }: DropMenuProps) => {
  let items: MenuProps['items'] = []
  if (menuItem?.menu && menuItem?.menu.entries.length > 0) {
    menuItem?.menu.entries.forEach((item, index) => {
      items.push({
        key: index,
        label:
          item.action?.displayText ||
          item.reply?.displayText ||
          item.menu?.displayText,
      })
    })
  }
  return (
    <>
      {items.length > 0 ? (
        <Dropdown menu={{ items }} placement='top' arrow trigger={['click']}>
          <div className='menu-item g-pointer fx-center-center'>
            <span className='menus-line m-r-4'></span>
            <span className='fn13 menu-item-text'>
              {menuItem.action?.displayText ||
                menuItem.reply?.displayText ||
                menuItem.menu?.displayText}
            </span>
          </div>
        </Dropdown>
      ) : (
        <div className='menu-item g-pointer fx-center-center'>
          <span className='fn13 menu-item-text'>
            {menuItem.action?.displayText ||
              menuItem.reply?.displayText ||
              menuItem.menu?.displayText}
          </span>
        </div>
      )}
    </>
  )
}

// rcs手机模型的底部
export default function RcsMobileFooter() {
  const { id } = useParams()
  const state = useStateStore()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [entries, setentries] = useState<API.EntriesItem[]>([]) // 固定菜单列表
  useEffect(() => {
    if (state.chatbot) {
      setentries(state.chatbot.menu?.menu?.entries || [])
    } else {
      setentries([])
    }
  }, [state.chatbot])

  useEffect(() => {
    if (state.chatbot) {
      setShowMenu(true)
    }
    if (state.template) {
      setShowMenu(false)
    }
  }, [id])

  useEffect(() => {
    const isChatbot = location.pathname.includes('/chatbot')
    if (isChatbot) {
      setShowMenu(true)
    } else {
      setShowMenu(false)
      setentries([])
    }
  }, [location])

  return (
    <div
      className={`rcs-mobile-footer rcs-interactive-mobile-footer p-t-12 ${
        showMenu ? 'showMenu' : ''
      }`}>
      <div
        className='cube'
        style={{ transform: `rotateX(${showMenu ? -90 : 0}deg)` }}>
        <Space className='p-x-8 w-100 face front' align='center'>
          <div
            className='handle-item g-pointer'
            onClick={() => setShowMenu(true)}>
            <span className='icon iconfont icon-menu fw-500 fn10'></span>
          </div>
          <div className='handle-item'>
            <span className='icon iconfont icon-jia fn12 fw-600'></span>
          </div>
          <input type='text' className='input' />
          <div className='handle-item g-pointer'>
            <span className='icon iconfont icon-fasong fw-500 fn13'></span>
          </div>
        </Space>
        <Flex className='p-x-8 w-100 face top' align='center'>
          <div
            className='handle-item g-pointer'
            onClick={() => setShowMenu(false)}>
            <span className='icon iconfont icon-jianpan fn16 fw-500'></span>
          </div>
          <Flex
            className='menu-list hide-scrollbar p-r-8'
            align='center'
            wrap='nowrap'>
            {entries.map((item, index) => (
              <Fragment key={index}>
                <DropMenu menuItem={item} />
                {index != entries.length - 1 && (
                  <Divider type='vertical' className='m-x-4' />
                )}
              </Fragment>
            ))}
          </Flex>
        </Flex>
      </div>
      <div className='line'></div>
    </div>
  )
}
