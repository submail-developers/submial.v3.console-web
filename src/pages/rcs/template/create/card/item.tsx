import { Image } from 'antd'
import { CardMessage } from '../type'
import { useEffect, useState } from 'react'
import { imgTypes, audioTypes, videoTypes } from '../components/meteial/type'

import './index.scss'

type TextStyle = {
  b: boolean
  i: boolean
  u: boolean
}
type Props = {
  message: CardMessage
}
export default function Fn({ message }: Props) {
  const [mediaType, setMediaType] = useState<'1' | '2' | '3'>() // '1' | '2' | '3' 图片｜音频｜视频
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
    const { layout = {}, content } = message.generalPurposeCard
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
    let { mediaContentType = '' } = content.media
    const index = [
      imgTypes.includes(mediaContentType),
      audioTypes.includes(mediaContentType),
      videoTypes.includes(mediaContentType),
    ].findIndex((item) => Boolean(item))
    if (index == 0) {
      setMediaType(`1`)
    } else if (index == 1) {
      setMediaType(`2`)
    } else if (index == 2) {
      setMediaType(`3`)
    } else {
    }
  }, [])
  return (
    <div className='center-content card-center-content'>
      <div className='banner' style={{ background: 'transparent' }}>
        {mediaType == '1' && (
          <Image
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            src={message.generalPurposeCard.content.media.mediaOssUrl}
            preview={false}
          />
        )}
        {mediaType == '2' && (
          <audio
            src={message.generalPurposeCard.content.media.mediaOssUrl}
            controls></audio>
        )}
        {mediaType == '3' && (
          <video
            src={message.generalPurposeCard.content.media.mediaOssUrl}
            controls></video>
        )}
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
        className='card-des fn13'
        style={{
          fontWeight: desStyle.b ? 'bold' : 'normal',
          fontStyle: desStyle.i ? 'italic' : 'normal',
          textDecoration: desStyle.u ? 'underline' : 'none',
        }}>
        {message.generalPurposeCard.content.description}
      </div>
      {message.generalPurposeCard.content.suggestions?.map((item, index) => (
        <div className='card-btn' key={index}>
          <div className='card-btn-input fx-center-center'>
            {item.action?.displayText || item.reply?.displayText || ''}
          </div>
        </div>
      ))}
    </div>
  )
}
