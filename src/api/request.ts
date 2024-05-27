import axios from 'axios'
import { message } from '@/components/staticFn/staticFn'
import type {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
} from 'axios'
const baseURL = import.meta.env.DEV
  ? '/apis/'
  : (import.meta.env.VITE_API_URL as string)
const request: AxiosInstance = axios.create({
  timeout: 60 * 1000,
  baseURL: baseURL,
})
// 前置拦截
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 后置拦截
request.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data.status == 'error') {
      // message.destroy()
      message.error({
        content: res.data.message,
        onClose: () => {
          if (res.data.message == 'session timeout') {
            window.location.href = `/login?redirct='+encodeURI(${window.location.href})`
          }
        },
      })
      return Promise.reject(res.data)
    } else if (res && res.data) {
      return res.data
    } else {
      message.error(JSON.stringify(res.data))
      return Promise.reject(res)
    }
  },
  (error) => {
    if (error.response) {
      message.error(error.response?.data?.error)
    }
    return Promise.reject(error)
  },
)

export default request
