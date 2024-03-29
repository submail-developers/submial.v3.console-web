import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from '@/routes'
// import { store } from '@/store'

// antd
import token from '@/style/antdToken'
import AntdStaticFn from '@/components/staticFn/staticFn'

// 设置默认风格样式及antd使用中文格式
// 使用AntdApp包裹组件的原因https://ant.design/components/app-cn
import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: token,
      }}
      locale={zhCN}>
      <AntdApp style={{ width: '100%', height: '100%' }}>
        {/* <Provider store={store}> */}
        <RouterProvider router={router} />
        {/* </Provider> */}
        {/* antd的静态方法。在路由拦截里可以使用message、notification、modal */}
        <AntdStaticFn />
      </AntdApp>
    </ConfigProvider>
  )
}
