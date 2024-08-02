import { lazy } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import Error from '@/pages/error'
import LazyImportComponent from '../lazyConfig'
import { RouteExtParams, loaderFn, handleFn } from '../type'
import { addressChildren } from './address'

// 需要重定向的路由
export const baseRouters: RouteObject[] = [
  {
    path: '/console/rcs',
    element: <Navigate to={'/console/rcs/welcome'} replace />,
  },
  {
    path: '/console/rcs/account',
    element: <Navigate to={'/console/rcs/account/index'} replace />,
  },
  {
    path: '/console/rcs/chatbot',
    element: <Navigate to={'/console/rcs/chatbot/index'} replace />,
  },
  {
    path: '/console/rcs/address',
    element: <Navigate to={'/console/rcs/address/index'} replace />,
  },
  {
    path: '/console/rcs/batchreport',
    element: <Navigate to={'/console/rcs/batchreport/index'} replace />,
  },
  {
    path: '/console/rcs/template',
    element: <Navigate to={'/console/rcs/template/index'} replace />,
  },
  {
    path: '/console/rcs/send',
    element: <Navigate to={'/console/rcs/send/0'} replace />,
  },
  {
    path: '/console/rcs/interactive',
    element: (
      <Navigate to={'/console/rcs/interactive/list/chatbot/0'} replace />
    ),
  },
]

// 5g消息 rcs 产品路由
export const rcsMenus: RouteObject[] = [
  {
    path: 'rcs',
    loader: loaderFn({ breadName: '5G消息' }),
    children: [
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
            lazyChildren={lazy(() => import('@/pages/rcs/welcome'))}
          />
        ),
      },
      {
        path: 'account',
        loader: loaderFn({
          groupName: 'WELCOME',
          groupIcon: 'icon-home',
          breadName: '客户资料管理',
          menuName: '客户资料管理',
        }),
        errorElement: <Error />,
        children: [
          {
            path: 'index',
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/accountInfo'))}
              />
            ),
          },
          {
            path: 'create',
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/accountInfo/create'),
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'chatbot',
        loader: loaderFn({
          groupName: 'Chatbot 管理',
          groupIcon: 'icon-jiqiren',
          breadName: '管理Chatbot',
          menuName: '申请/管理 Chatbot',
        }),
        errorElement: <Error />,
        children: [
          {
            path: 'index',
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/chatbot'))}
              />
            ),
          },
          {
            path: 'create/:chatbotId', // 0为创建，否则为修改
            loader: loaderFn({
              breadName: '申请Chatbot',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/chatbot/create'))}
              />
            ),
          },
          {
            path: 'detail/:id',
            loader: loaderFn({
              breadName: 'Chatbot详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/chatbot/detail'))}
              />
            ),
          },
        ],
      },
      {
        path: 'template',
        loader: loaderFn({
          groupName: '模版管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '创建/管理模版',
          menuName: '创建/管理模版',
        }),
        errorElement: <Error />,
        children: [
          {
            path: 'index',
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/template/list'))}
              />
            ),
          },
          {
            // create/type/id
            // type:1纯文本  2单卡片  3多卡片  4文件(暂未开发)
            // id:0为创建，否则为修改
            // ?name=xxx 模版名称
            path: 'create',
            loader: loaderFn({
              breadName: '创建模版',
              hideMenu: true,
              hideHeaderRight: true,
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/template/create'))}
              />
            ),
            children: [
              // 纯文本
              {
                path: '1/:id',
                loader: loaderFn({}),
                errorElement: <Error />,
                element: (
                  <LazyImportComponent
                    lazyChildren={lazy(
                      () => import('@/pages/rcs/template/create/text'),
                    )}
                  />
                ),
              },
              // 单卡片
              {
                path: '2/:id',
                loader: loaderFn({}),
                errorElement: <Error />,
                element: (
                  <LazyImportComponent
                    lazyChildren={lazy(
                      () => import('@/pages/rcs/template/create/card'),
                    )}
                  />
                ),
              },
              // 多卡片
              {
                path: '3/:id',
                loader: loaderFn({}),
                errorElement: <Error />,
                element: (
                  <LazyImportComponent
                    lazyChildren={lazy(
                      () => import('@/pages/rcs/template/create/cards'),
                    )}
                  />
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'send',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: '创建在线发送任务',
          menuName: '创建在线发送任务',
        }),
        errorElement: <Error />,
        children: [
          {
            path: ':sign', // 模版的sign
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/send'))}
              />
            ),
          },
        ],
      },
      {
        path: 'batchreport',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: '批量任务发送报告',
          menuName: '批量任务发送报告',
        }),
        errorElement: <Error />,
        children: [
          {
            path: 'index',
            loader: loaderFn({}),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(() => import('@/pages/rcs/batchreport'))}
              />
            ),
          },
          {
            path: 'detail/:id',
            loader: loaderFn({
              breadName: '报告详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/batchreport/batchreportDetail'),
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'analysis',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: 'API 分析报告',
          menuName: 'API 分析报告',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/apiAnalysis'))}
          />
        ),
      },
      {
        path: 'history',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: 'API 历史明细',
          menuName: 'API 历史明细',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/apiHistory'))}
          />
        ),
      },
      {
        path: 'subhook',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: 'SUBHOOK 状态推送',
          menuName: 'SUBHOOK 状态推送',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/subhook'))}
          />
        ),
      },
      {
        path: 'errors',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
          breadName: 'API 错误日志',
          menuName: 'API 错误日志',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/apiErroslogs'))}
          />
        ),
      },
      {
        path: 'address',
        loader: loaderFn({
          groupName: '发送管理',
          groupIcon: 'icon-fasong',
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
        path: 'interactive',
        loader: loaderFn({
          groupName: '智能交互',
          groupIcon: 'icon-jiaohu',
          breadName: '上行交互',
          menuName: 'Chatbot 交互',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/interactive'))}
          />
        ),
        children: [
          {
            path: 'list/:type/:id', // type: chatbot|template
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/default'),
                )}
              />
            ),
          },
          {
            path: 'detail/chatbot/:id',
            loader: loaderFn({
              breadName: '交互详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/detail/chatbot'),
                )}
              />
            ),
          },
          {
            path: 'detail/template/:id',
            loader: loaderFn({
              breadName: '交互详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/detail/template'),
                )}
              />
            ),
          },
          {
            path: 'tour/:type/:id', // type: chatbot|template
            loader: loaderFn({
              breadName: '交互演示',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/tour/list'),
                )}
              />
            ),
          },
          {
            path: 'tour/detail/chatbot',
            loader: loaderFn({
              breadName: '交互演示',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/tour/list'),
                )}
              />
            ),
          },
          {
            path: 'tour/detail/tamplate',
            loader: loaderFn({
              breadName: '交互演示',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/interactive/tour/list'),
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'interactivelogs',
        loader: loaderFn({
          groupName: '智能交互',
          groupIcon: 'icon-qianbao',
          breadName: 'Chatbot 交互日志',
          menuName: 'Chatbot 交互日志',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/interactivelogs'))}
          />
        ),
      },
      {
        path: 'fee',
        loader: loaderFn({
          groupName: '计费',
          groupIcon: 'icon-qianbao',
          breadName: '5G消息计费日志',
          menuName: '5G消息计费日志',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/rcs/fee'))}
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
            lazyChildren={lazy(() => import('@/pages/rcs/setting'))}
          />
        ),
      },
    ],
  },
]
