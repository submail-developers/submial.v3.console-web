import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import Error from '@/pages/error'
import LazyImportComponent from '../lazyConfig'
import { RouteExtParams, loaderFn, handleFn } from '../type'

export const addressChildren: RouteObject[] = [
  {
    path: 'index',
    errorElement: <Error />,
    element: (
      <LazyImportComponent
        lazyChildren={lazy(() => import('@/pages/address/default'))}
      />
    ),
  },
  {
    path: 'detail/:id',
    loader: loaderFn({
      breadName: '地址簿详情',
    }),
    errorElement: <Error />,
    element: (
      <LazyImportComponent
        lazyChildren={lazy(() => import('@/pages/address/detail'))}
      />
    ),
  },
  {
    path: 'folder',
    loader: loaderFn({
      breadName: '文件夹列表',
    }),
    errorElement: <Error />,
    element: (
      <LazyImportComponent
        lazyChildren={lazy(() => import('@/pages/address/folder'))}
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
        lazyChildren={lazy(() => import('@/pages/address/folderDetail'))}
      />
    ),
  },
]
