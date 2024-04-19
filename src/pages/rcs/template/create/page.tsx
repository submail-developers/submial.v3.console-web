import { ReactNode } from 'react'
import { Space, Button } from 'antd'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import './page.scss'

type Props = {
  left: ReactNode
  content: ReactNode
  right: ReactNode
}

export default function Fn(props: Props) {
  const [searchParams] = useSearchParams()
  const name = decodeURIComponent(searchParams.get('name'))
  return (
    <div className='rcs-template'>
      <Space className='handle-buttons'>
        <Button>取消编辑</Button>
        <Button type='primary'>提交审核</Button>
      </Space>
      <div className='left'>{props.left}</div>
      <div className='center'>
        <div className='mobile'>
          <div className='mobile-content'>
            <div className='title fw-500'>{name}</div>
            <div className='temp-content'>{props.content}</div>
          </div>
        </div>
      </div>
      <div className='right'>{props.right}</div>
    </div>
  )
}
