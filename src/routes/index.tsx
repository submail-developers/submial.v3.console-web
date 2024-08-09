import { RouteObject, createBrowserRouter, redirect } from 'react-router-dom'
import Layout from '@/layout/index'
import { RouteExtParams, loaderFn, handleFn } from './type'
import { rcsMenus, baseRouters as rcsBaseRouters } from './product/rcs'
import {
  voiceChatbotMenus,
  baseRouters as vioceChatbotBaseRouters,
} from './product/vocieChatbot'

// 产品路由
export const menus: RouteObject[] = [...rcsMenus, ...voiceChatbotMenus]

// 需要重定向的路由
export const baseRouter: RouteObject[] = [
  {
    path: '/',
    loader: () => {
      throw redirect('/console/voiceChatbot/welcome')
    },
  },
  ...rcsBaseRouters,
  ...vioceChatbotBaseRouters,
  {
    path: '/console',
    loader: loaderFn({ breadName: '控制台' }),
    element: <Layout />,
    children: menus,
  },
  {
    path: '*',
    loader: () => {
      throw redirect('/console/voiceChatbot/welcome')
    },
  },
]

const router = createBrowserRouter(baseRouter)

export default router
