import { App, Typography } from 'antd'

import './index.scss'

const { Paragraph } = Typography

type Props = {
  text: string
  title?: string
}

/**
 * 该组件是覆盖在父元素上的: position: absolute;wigth/height:100%;
 * 需要给父元素加上: position: relative;
 * @param  text string 复制的文本
 */
export default function ACopy(props: Props) {
  const { message: messageApi } = App.useApp()
  return (
    <Paragraph
      copyable={{
        text: props.text,
        tooltips: false,
        icon: [false, false],
        onCopy: () => messageApi.success('复制成功'),
      }}
      className='handle-copy'
      title={props.title || '点击复制'}></Paragraph>
  )
}
