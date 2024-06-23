import { ReactNode, CSSProperties } from 'react'
import { Spin } from 'antd'
import './index.scss'
type MyCardProps = {
  title: string
  loading?: boolean
  minHeight?: number | string
  children: ReactNode
}
export default function MyCard(props: MyCardProps) {
  let contentStyle: CSSProperties = {}
  if ('minHeight' in props) {
    contentStyle['minHeight'] = props.minHeight
  }
  return (
    <div className='batchreport-card'>
      <div className='title fn16 fw-500'>{props.title}</div>
      <div className='content' style={{ ...contentStyle }}>
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
