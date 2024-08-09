import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import Error from '@/pages/error'
import LazyImportComponent from '../lazyConfig'
import { RouteExtParams, loaderFn, handleFn } from '../type'

// 黑名单路由
export const blackChildren: RouteObject[] = [
  {
    path: 'index',
    errorElement: <Error />,
    element: (
      <LazyImportComponent
        lazyChildren={lazy(() => import('@/pages/black/list'))}
      />
    ),
  },
]
