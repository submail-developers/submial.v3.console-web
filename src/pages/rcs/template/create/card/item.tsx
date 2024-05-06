import { Image } from 'antd'
import { Media, Action, Reply, CardLayout, CardMessage } from '../type'
import './index.scss'
import { useEffect, useState } from 'react'
type TextStyle = {
  b: boolean
  i: boolean
  u: boolean
}
type Props = {
  message: CardMessage
}
export default function Fn({ message }: Props) {
  const [titleStyle, setTitleStyle] = useState<TextStyle>({
    b: false,
    i: false,
    u: false,
  })
  const [desStyle, setDesStyle] = useState<TextStyle>({
    b: false,
    i: false,
    u: false,
  })
  useEffect(() => {
    const { layout = {} } = message.generalPurposeCard
    if ('titleFontStyle' in layout) {
      let titleFontStyle = layout.titleFontStyle as string
      let styles = titleFontStyle.split(',')
      setTitleStyle({
        b: styles.includes('bold'),
        i: styles.includes('italics'),
        u: styles.includes('underline'),
      })
    }
    if ('descriptionFontStyle' in layout) {
      let descriptionFontStyle = layout.descriptionFontStyle as string
      let styles = descriptionFontStyle.split(',')
      setDesStyle({
        b: styles.includes('bold'),
        i: styles.includes('italics'),
        u: styles.includes('underline'),
      })
    }
  }, [])
  console.log(message.generalPurposeCard)
  return (
    <div
      className='center-content card-center-content'
      style={{ height: '100%' }}>
      <div className='banner'>
        <Image
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          src={message.generalPurposeCard.content.media.mediaOssUrl}
          preview={false}
        />
      </div>
      <div
        className='card-title'
        style={{
          fontWeight: titleStyle.b ? 'bold' : 'normal',
          fontStyle: titleStyle.i ? 'italic' : 'normal',
          textDecoration: titleStyle.u ? 'underline' : 'none',
          fontSize: '14px',
        }}>
        {message.generalPurposeCard.content.title}
      </div>
      <div
        className='card-des'
        style={{
          fontWeight: desStyle.b ? 'bold' : 'normal',
          fontStyle: desStyle.i ? 'italic' : 'normal',
          textDecoration: desStyle.u ? 'underline' : 'none',
        }}>
        {message.generalPurposeCard.content.description}
      </div>
      {message.generalPurposeCard.content.suggestions.map((item, index) => (
        <div className='card-btn' key={index}>
          <div className='card-btn-input fx-center-center'>
            {item.action.displayText}
          </div>
        </div>
      ))}
    </div>
  )
}
