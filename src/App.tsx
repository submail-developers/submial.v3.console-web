import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from '@/routes'
import { store } from '@/store'

// antd
import token, { components } from '@/style/antdToken'
import AntdStaticFn from '@/components/staticFn/staticFn'

// 设置默认风格样式及antd使用中文格式
// 使用AntdApp包裹组件的原因https://ant.design/components/app-cn
import { ConfigProvider, App as AntdApp } from 'antd'
import type { ConfigProviderProps } from 'antd'

import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'
import zhCN from 'antd/es/locale/zh_CN'
type Locale = ConfigProviderProps['locale']

export default function App() {
  const [locale, setLocal] = useState<Locale>(zhCN)
  useEffect(() => {
    setLocal(zhCN)
    dayjs.locale('zh-cn')
  }, [])
  return (
    <ConfigProvider
      theme={{
        token: token,
        components,
      }}
      locale={locale}>
      <AntdApp style={{ width: '100%', height: '100%' }}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
        {/* antd的静态方法。在路由拦截里可以使用message、notification、modal */}
        <AntdStaticFn />
      </AntdApp>
    </ConfigProvider>
  )
}
