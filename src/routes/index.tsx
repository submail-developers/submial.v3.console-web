import { lazy } from 'react'
import {
  RouteObject,
  createHashRouter,
  createBrowserRouter,
  redirect,
  Navigate,
} from 'react-router-dom'
import Layout from '@/layout/index'
import Error from '@/pages/error'
import LazyImportComponent from './lazyConfig'

/**
 * handle中拿到的参数
 * @param name string 路由名称
 * @example https://reactrouter.com/en/6.10.0/hooks/use-matches
 */
export interface RouteExtParams {
  groupName?: string // 侧边栏组的名称
  groupIcon?: string // 侧边栏组的icon-name
  breadName?: string // 面包屑展示的名字
  menuName?: string // 侧边栏的名称
}
const loaderFn = (props?: RouteExtParams, cb?: () => void) => {
  return () => {
    cb && cb()
    return props || {}
  }
}

const handleFn = (params?: RouteExtParams) => {
  return {
    crumb: (data: RouteExtParams) => {
      // 获取loader上的数据
      return data.breadName
    },
    ...params,
  }
}

export const menus: RouteObject[] = [
  {
    path: 'rcs',
    loader: loaderFn({ breadName: '(5G)RCS 消息' }),
    children: [
      {
        path: 'welcome',
        loader: loaderFn({
          groupName: 'WELCOME',
          breadName: '',
          menuName: '控制台',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/welcome'))}
          />
        ),
      },
      {
        path: 'chatbot',
        loader: loaderFn({
          groupName: 'Chatbot 管理',
          breadName: '申请管理chatbot',
          menuName: '申请管理chatbot',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/chatbot'))}
          />
        ),
      },
      {
        path: 'templates',
        loader: loaderFn({
          groupName: 'Chatbot 管理',
          breadName: '创建 / 管理 RCS消息模板',
          menuName: '创建 / 管理 RCS消息模板',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/chatbot'))}
          />
        ),
      },
    ],
  },
  {
    path: 'aim',
    loader: loaderFn({ breadName: 'aim' }),
    children: [
      {
        path: 'welcome',
        loader: loaderFn({ breadName: '' }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/welcome'))}
          />
        ),
      },
    ],
  },
]

export const baseRouter: RouteObject[] = [
  {
    path: '/',
    loader: () => {
      throw redirect('/console/rcs')
    },
  },
  {
    path: '/console/rcs',
    element: <Navigate to={'/console/rcs/welcome'} />,
  },
  {
    path: '/console/aim',
    element: <Navigate to={'/console/aim/welcome'} />,
  },
  {
    path: '/console',
    loader: loaderFn({ breadName: '控制台' }),
    element: <Layout />,
    children: menus,
  },
  {
    path: '*',
    loader: () => {
      throw redirect('/console/rcs')
    },
  },
]

const router = createBrowserRouter(baseRouter)

export default router
