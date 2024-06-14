import { ReactNode } from 'react'
import { Spin } from 'antd'
import './index.scss'
type MyCardProps = {
  title: string
  loading?: boolean
  children: ReactNode
}
export default function MyCard(props: MyCardProps) {
  return (
    <div className='welcome-card'>
      <div className='title fn16 fw-500'>{props.title}</div>
      <div className='content'>
        {props.children}

        {props.loading && (
          <div className='echarts-loading'>
            <Spin />
          </div>
        )}
      </div>
    </div>
  )
}
