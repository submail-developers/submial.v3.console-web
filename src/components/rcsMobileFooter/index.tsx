import { Space } from 'antd'
import './index.scss'
// rcs手机模型的底部
export default function RcsMobileFooter() {
  return (
    <div className='rcs-mobile-footer p-t-16'>
      <Space className='p-x-12 w-100' align='center'>
        <div className='handle-item'>
          <span className='icon iconfont icon-menu fw-500'></span>
        </div>
        <div className='handle-item'>
          <span className='icon iconfont icon-jia fn12 fw-600'></span>
        </div>
        <input type='text' className='input' />
        <div className='handle-item'>
          <span className='icon iconfont icon-fasong fw-500'></span>
        </div>
      </Space>
      <div className='line'></div>
    </div>
  )
}
