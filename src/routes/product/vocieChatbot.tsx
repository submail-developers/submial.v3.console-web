import { lazy } from 'react'
import { RouteObject, Navigate, useParams } from 'react-router-dom'
import Error from '@/pages/error'
import LazyImportComponent from '../lazyConfig'
import { RouteExtParams, loaderFn, handleFn } from '../type'
import { addressChildren } from './address'
import { blackChildren } from './black'

// 重定向到已外呼任务详情
const RedirectCalled = () => {
  const { id } = useParams()
  return (
    <Navigate
      to={`/console/voiceChatbot/call/detail/${id}/sendList/called`}
      replace
    />
  )
}

// 需要重定向的路由
export const baseRouters: RouteObject[] = [
  {
    path: '/console/voiceChatbot',
    element: <Navigate to={'/console/voiceChatbot/welcome'} replace />,
  },
  {
    path: '/console/voiceChatbot/talk',
    element: <Navigate to={'/console/voiceChatbot/talk/index'} replace />,
  },
  {
    path: '/console/voiceChatbot/call',
    element: <Navigate to={'/console/voiceChatbot/call/index'} replace />,
  },
  {
    path: '/console/voiceChatbot/address',
    element: <Navigate to={'/console/voiceChatbot/address/index'} replace />,
  },
  {
    path: '/console/voiceChatbot/black',
    element: <Navigate to={'/console/voiceChatbot/black/index'} replace />,
  },
  {
    path: '/console/voiceChatbot/call/detail/:id/sendList',
    element: <RedirectCalled />,
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
        path: 'talk',
        loader: loaderFn({
          groupName: '机器人管理',
          groupIcon: 'icon-jiqiren',
          breadName: '话术管理',
          menuName: '创建/管理话术',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/talk'))}
          />
        ),
        children: [
          {
            path: 'index',
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/talk/list'),
                )}
              />
            ),
          },
          {
            path: 'edit/:id/:editable', // editable：0查看1编辑
            loader: loaderFn({
              hideMenu: true,
              hideHeaderRight: true,
              breadName: '话术详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/talk/edit'),
                )}
              />
            ),
          },
        ],
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
            loader: loaderFn({
              breadName: '创建任务',
            }),
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
            path: 'detail/:id',
            loader: loaderFn({
              breadName: '任务详情',
            }),
            errorElement: <Error />,
            element: (
              <LazyImportComponent
                lazyChildren={lazy(
                  () => import('@/pages/voiceChatbot/call/detail'),
                )}
              />
            ),
            children: [
              {
                path: 'info',
                errorElement: <Error />,
                element: (
                  <LazyImportComponent
                    lazyChildren={lazy(
                      () => import('@/pages/voiceChatbot/call/detail/info'),
                    )}
                  />
                ),
              },
              {
                path: 'sendList',
                loader: loaderFn({
                  // breadName: '任务列表',
                }),
                errorElement: <Error />,
                element: (
                  <LazyImportComponent
                    lazyChildren={lazy(
                      () => import('@/pages/voiceChatbot/call/detail/sendList'),
                    )}
                  />
                ),
                children: [
                  {
                    path: 'called',
                    loader: loaderFn({
                      // breadName: '已呼号码',
                    }),
                    errorElement: <Error />,
                    element: (
                      <LazyImportComponent
                        lazyChildren={lazy(
                          () =>
                            import(
                              '@/pages/voiceChatbot/call/detail/sendList/called'
                            ),
                        )}
                      />
                    ),
                  },
                  {
                    path: 'calling',
                    loader: loaderFn({
                      // breadName: '未呼号码',
                    }),
                    errorElement: <Error />,
                    element: (
                      <LazyImportComponent
                        lazyChildren={lazy(
                          () =>
                            import(
                              '@/pages/voiceChatbot/call/detail/sendList/calling'
                            ),
                        )}
                      />
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'grade',
        loader: loaderFn({
          groupName: '外呼任务管理',
          groupIcon: 'icon-xiaoxi',
          breadName: '意向客户管理',
          menuName: '意向客户管理',
        }),
        errorElement: <Error />,
        element: (
          <LazyImportComponent
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/grade'))}
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
            lazyChildren={lazy(() => import('@/pages/black/index'))}
          />
        ),
        children: blackChildren,
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
            lazyChildren={lazy(() => import('@/pages/voiceChatbot/fee'))}
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
