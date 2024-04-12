import { CSSProperties } from 'react'

import './index.scss'

type Props = {
  loading: boolean
  onDel: () => void
  style?: CSSProperties
}

// 删除按钮
export default function ADel(props: Props) {
  return (
    <div
      className='a-del-btn fx-center-center'
      onClick={() => props.onDel()}
      title='删除'
      style={props.style}>
      <span
        className={`icon iconfont fn16 fw-500 ${
          props.loading ? 'icon-shuaxin' : 'icon-shanchu'
        }`}></span>
    </div>
  )
}
