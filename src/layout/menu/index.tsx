import { NavLink, RouteObject, useMatches, useLocation } from 'react-router-dom'
import { menus, RouteExtParams } from '@/routes'
import { useEffect, useState } from 'react'

type MenuItem = RouteObject & {
  menuName?: string
}

type GroupItem = {
  groupName?: string
  groupIcon?: string
  children: MenuItem[]
}

export default function Menu() {
  const [menuList, setMenuList] = useState<GroupItem[]>([])

  const location = useLocation()
  const matchList = useMatches()

  useEffect(() => {
    // 获取console/xxx对应的路由信息
    const currentMatchBaseRouteObj = matchList.find((match) =>
      match.id.includes('-'),
    )
    if (currentMatchBaseRouteObj) {
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

            // // 查找是否已存在该组的对象
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
          <div className='group-name'>{item.groupName}</div>
          <div className='menu-list'>
            {item.children.map((menu) => (
              <div className='menu-item' key={menu.path}>
                {menu.menuName}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
