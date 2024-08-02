/**
 * handle中拿到的参数
 * @param name string 路由名称
 * @example https://reactrouter.com/en/6.10.0/hooks/use-matches
 */
export interface RouteExtParams {
  groupName?: string // 侧边栏组的名称。如果为空则不在侧边栏显示
  groupIcon?: string // 侧边栏组的icon-name
  breadName?: string // 面包屑展示的名字
  menuName?: string // 侧边栏的名称
  hideMenu?: boolean // 是否展示侧边栏
  hideHeaderRight?: boolean // 是否隐藏顶部右侧导航
}

export const loaderFn = (props?: RouteExtParams, cb?: () => void) => {
  return () => {
    cb && cb()
    return props || {}
  }
}

export const handleFn = (params?: RouteExtParams) => {
  return {
    crumb: (data: RouteExtParams) => {
      // 获取loader上的数据
      return data.breadName
    },
    ...params,
  }
}
