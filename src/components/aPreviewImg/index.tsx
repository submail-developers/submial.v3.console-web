import { useState, CSSProperties } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import './index.scss'

type Props = {
  src: string
  style?: CSSProperties
}

// 预览图片
export default function APreviewImg(props: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      className='a-preview-img-btn fx-center-center'
      title='预览'
      style={props.style}
      onClick={() => setVisible(true)}>
      <Image
        src={props.src}
        style={{ display: 'none' }}
        preview={{
          visible: visible,
          onVisibleChange: (visible) => setVisible(visible),
        }}
      />
      <EyeOutlined rev='null' />
    </div>
  )
}
