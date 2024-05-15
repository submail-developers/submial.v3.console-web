import { Image, Flex } from 'antd'
import { CardsMessage, CardContent } from '../type'
import { useEffect, useState } from 'react'
import { imgTypes, audioTypes, videoTypes } from '../components/meteial/type'

import './index.scss'
import './cardItem/index.scss'

type TextStyle = {
  b: boolean
  i: boolean
  u: boolean
}
type Props = {
  message: CardsMessage
}
export default function Fn({ message }: Props) {
  const [cards, setCards] = useState<CardContent[]>([])
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
    const { layout = {}, content } = message.generalPurposeCardCarousel
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
    setCards(content)
  }, [])
  return (
    <Flex gap={16} className='center-content cards-center-content'>
      {cards.map((item, index) => {
        return (
          <CardsItem
            key={index}
            item={item}
            titleConfig={titleStyle}
            desConfig={desStyle}
          />
        )
      })}
    </Flex>
  )
}

type CardsItemProps = {
  item: CardContent
  titleConfig: TextStyle
  desConfig: TextStyle
}
const CardsItem = (props: CardsItemProps) => {
  const [mediaType, setMediaType] = useState<'1' | '2' | '3'>() // '1' | '2' | '3' 图片｜音频｜视频
  useEffect(() => {
    let { mediaContentType = '' } = props.item.media
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
    <div className={`scroll-item g-radius-4`}>
      <div className='w-100 scroll-item-content p-b-16'>
        <div
          className='banner'
          style={{
            backgroundImage: props.item.media?.mediaOssUrl ? 'none' : '',
            height: '128px',
          }}>
          {mediaType == '1' && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              src={props.item.media.mediaOssUrl}
              preview={false}
            />
          )}
          {mediaType == '2' && (
            <audio src={props.item.media.mediaOssUrl} controls></audio>
          )}
          {mediaType == '3' && (
            <video src={props.item.media.mediaOssUrl} controls></video>
          )}
        </div>
        <div
          className='card-title'
          style={{
            fontWeight: props.titleConfig.b ? 'bold' : 'normal',
            fontStyle: props.titleConfig.i ? 'italic' : 'normal',
            textDecoration: props.titleConfig.u ? 'underline' : 'none',
            fontSize: '14px',
          }}>
          {props.item.title}
        </div>
        <div
          className='card-des'
          style={{
            fontWeight: props.desConfig.b ? 'bold' : 'normal',
            fontStyle: props.desConfig.i ? 'italic' : 'normal',
            textDecoration: props.desConfig.u ? 'underline' : 'none',
          }}>
          {props.item.description}
        </div>
        {props.item.suggestions?.map((item, index) => (
          <div className='card-btn' key={index}>
            <div className='card-btn-input fx-center-center'>
              {item.action?.displayText || item.reply?.displayText || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
