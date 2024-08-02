import { lazy } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import Error from '@/pages/error'
import LazyImportComponent from '../lazyConfig'
import { RouteExtParams, loaderFn, handleFn } from '../type'
import { addressChildren } from './address'

// 需要重定向的路由
export const baseRouters: RouteObject[] = [
  {
    path: '/console/voiceChatbot',
    element: <Navigate to={'/console/voiceChatbot/welcome'} replace />,
  },
  {
    path: '/console/voiceChatbot/address',
    element: <Navigate to={'/console/voiceChatbot/address/index'} replace />,
  },
  {
    path: '/console/voiceChatbot/call',
    element: <Navigate to={'/console/voiceChatbot/call/index'} replace />,
  },
]

// 只能语音机器人产品路由
export const voiceChatbotMenus: RouteObject[] = [
  {
    path: 'voiceChatbot',
    loader: loaderFn({ breadName: '智能语音机器人' }),
    children: [
      {
        path: 'configure',
        loader: loaderFn({
          groupName: '',
          groupIcon: '',
          breadName: '开通产品',
          menuName: '',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/configure'))}
          />
        ),
      },
      {
        path: 'welcome',
        loader: loaderFn({
          groupName: 'WELCOME',
          groupIcon: 'icon-home',
          breadName: '',
          menuName: '控制台',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/welcome'))}
          />
        ),
      },
      {
        path: 'chatbot',
        loader: loaderFn({
          groupName: '机器人管理',
          groupIcon: 'icon-jiqiren',
          breadName: '机器人管理',
          menuName: '创建/管理话术',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/test'))}
          />
        ),
      },
      {
        path: 'call',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '外呼任务管理',
          menuName: '创建/管理外呼任务',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/call'))}
          />
        ),
        children: [
          {
            path: 'index',
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/call/list'),
                )}
              />
            ),
          },
          {
            path: 'create',
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/call/create'),
                )}
              />
            ),
          },
          {
            path: 'detail',
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/call/detail'),
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'callApis',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '外呼历史任务',
          menuName: '外呼历史任务',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/test'))}
          />
        ),
      },
      {
        path: 'callAnalysis',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '外呼分析报告',
          menuName: '外呼分析报告',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/test'))}
          />
        ),
      },
      {
        path: 'address',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '地址簿管理',
          menuName: '地址簿管理',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/address/index'))}
          />
        ),
        children: addressChildren,
      },
      {
        path: 'black',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '黑名单管理',
          menuName: '黑名单管理',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/test'))}
          />
        ),
      },
      {
        path: 'fee',
        loader: loaderFn({
          groupName: '计费',
          groupIcon: 'icon-qianbao',
          breadName: '计费',
          menuName: '外呼计费日志',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/test'))}
          />
        ),
      },
      {
        path: 'settings',
        loader: loaderFn({
          groupName: '偏好设置',
          groupIcon: 'icon-shezhi',
          breadName: '偏好设置',
          menuName: '偏好设置',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/setting'))}
          />
        ),
      },
    ],
  },
]
