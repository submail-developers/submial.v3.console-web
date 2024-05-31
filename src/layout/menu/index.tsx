import {
  NavLink,
  RouteObject,
  useMatches,
  useMatch,
  useLocation,
} from 'react-router-dom'
import { menus, RouteExtParams } from '@/routes'
import { useEffect, useState } from 'react'

import './index.scss'

type MenuItem = RouteObject & {
  menuName?: string
}

type GroupItem = {
  groupName?: string
  groupIcon?: string
  children: MenuItem[]
}

type MenuItemProps = {
  menu: MenuItem
  basePath: string
}

const MenuItem = (props: MenuItemProps) => {
  const [isActive, setIsActive] = useState(false)
  const match = useMatch(`${props.basePath}${props.menu.path}`)
  useEffect(() => {
    if (match) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [match])
  return (
    <NavLink
      to={`${props.basePath}/${props.menu.path}`}
      className={`menu-item fn16 fx-y-center ${isActive ? 'active' : ''}`}>
      <div className='w-100 g-ellipsis'>{props.menu.menuName}</div>
    </NavLink>
  )
}

export default function Menu() {
  const [basePath, setBasePath] = useState('')
  const [menuList, setMenuList] = useState<GroupItem[]>([])

  const location = useLocation()
  const matchList = useMatches()

  useEffect(() => {
    // 获取console/xxx对应的路由信息
    const currentMatchBaseRouteObj = matchList.find((match) =>
      match.id.includes('-'),
    )
    if (currentMatchBaseRouteObj) {
      setBasePath(currentMatchBaseRouteObj.pathname)
      let groupedArray: GroupItem[] = []
      menus.forEach((item) => {
        // 匹配对应产品的路由
        if (`/console/${item.path}` == currentMatchBaseRouteObj.pathname) {
          item.children.forEach((obj) => {
            let {
              groupName = '',
              groupIcon = '',
              menuName = '',
            }: RouteExtParams = obj.loader(null) as RouteExtParams
            if (groupName) {
              // 查找是否已存在该组的对象
              const existingGroup = groupedArray.find(
                (item) => item.groupName === groupName,
              )
              if (existingGroup) {
                // 如果已存在该组的对象，则将当前对象推入该组的children数组中
                existingGroup.children.push({ ...obj, menuName })
              } else {
                // 如果不存在该组的对象，则创建一个新的组对象，并将当前对象推入其中
                groupedArray.push({
                  groupName,
                  groupIcon,
                  children: [{ ...obj, menuName }],
                })
              }
            }
          })
        }
      })
      setMenuList(groupedArray)
    }
  }, [location, matchList])

  return (
    <div className='menu-group-list'>
      {menuList.map((item) => (
        <div className='group-item' key={item.groupName}>
          <div className='group-name fx-y-center'>
            <div className='group-icon'>
              <span
                className={`icon iconfont fn18 ${item.groupIcon} m-l-2`}></span>
            </div>
            <div className='group-text'>{item.groupName}</div>
          </div>
          <div className='menu-list fx-col'>
            {item.children.map((menu) => (
              <MenuItem key={menu.path} menu={menu} basePath={basePath} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
