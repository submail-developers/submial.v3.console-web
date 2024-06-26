import { lazy } from 'react'
import {
  RouteObject,
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
  groupName?: string // 侧边栏组的名称。如果为空则不在侧边栏显示
  groupIcon?: string // 侧边栏组的icon-name
  breadName?: string // 面包屑展示的名字
  menuName?: string // 侧边栏的名称
  hideMenu?: boolean // 是否展示侧边栏
  hideHeaderRight?: boolean // 是否隐藏顶部右侧导航
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
            path: 'create/:id',
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
            path: ':sign/:id', // 模版的sign和id
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
            lazyChildren={lazy(() => import('@/pages/rcs/address/index'))}
          />
        ),
        children: [
          {
            path: 'index/:id',
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/address/addressBook'),
                )}
              />
            ),
          },
          {
            path: 'address/detail/:id',
            loader: loaderFn({
              breadName: '地址簿详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/address/addressBookDetail'),
                )}
              />
            ),
          },
          {
            path: 'folder',
            loader: loaderFn({
              breadName: '文件夹',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/address/addressBookFile'),
                )}
              />
            ),
          },
          {
            path: 'folder/detail/:id',
            loader: loaderFn({
              breadName: '文件夹详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/rcs/address/seeAddressFile'),
                )}
              />
            ),
          },
        ],
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
            lazyChildren={lazy(() => import('@/pages/test'))}
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
      throw redirect('/console/rcs/welcome')
    },
  },
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
    element: <Navigate to={'/console/rcs/address/index/0'} replace />,
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
    element: <Navigate to={'/console/rcs/send/0/0'} replace />,
  },
  {
    path: '/console/rcs/interactive',
    element: (
      <Navigate to={'/console/rcs/interactive/list/chatbot/0'} replace />
    ),
  },
  {
    path: '/console/aim',
    element: <Navigate to={'/console/aim/welcome'} replace />,
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
      throw redirect('/console/rcs/welcome')
    },
  },
]

const router = createBrowserRouter(baseRouter)

export default router
