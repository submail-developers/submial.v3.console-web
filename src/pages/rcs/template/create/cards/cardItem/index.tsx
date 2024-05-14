import { Image } from 'antd'
import RcsInput from '@/components/rcsInput'
import { useDrop } from 'react-dnd'
import { config as dndConfig } from '../../dnd'
import errorImg from '@/assets/rcs/error.png'
import { API } from 'apis'
import { CardsItem, Media } from '@/pages/rcs/template/create/type'
import type { TextConfig } from '../index'

import './index.scss'

type Props = {
  item: CardsItem
  active: boolean
  actionsIndex: number
  btnIndex: number
  titleConfig: TextConfig
  desConfig: TextConfig
  onHandle: () => void
  onChangeActionsIndex: (index: number) => void
  onChangeBtnIndex: (index: number) => void
  onChangeMedia: (media: Media) => void
  onChangeTitle: (val: string) => void
  onChangeDes: (val: string) => void
  onChangeBtnText: (val: string, index) => void
  onAddBtn: () => void
}

export default function CardItem(props: Props) {
  // 拖拽素材到指定区域
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: dndConfig.accept,
    drop: (item: API.RcsOnlineMeteialItem, monitor) => {
      if (item) {
        props.onChangeMedia({
          mediaUrl: item.filePath,
          mediaOssUrl: item.storeAt,
          mediaContentType: item.file_type,
          mediaFileSize: item.fileSize,
          height: 'MEDIUM_HEIGHT',
          mediaType: item.type,
        })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  // 是否正在拖拽
  const isDroping = canDrop && isOver

  const addBtn = () => {
    props.onAddBtn()
  }
  const changeTitle = (val) => {
    props.onChangeTitle(val)
  }
  const changeDes = (val) => {
    props.onChangeDes(val)
  }
  // 编辑按钮
  const changeBtnText = (val, index) => {
    props.onChangeBtnText(val, index)
  }

  return (
    <div
      className={`scroll-item g-radius-4 ${props.active ? 'active' : ''}`}
      onClick={props.onHandle}>
      <div className='w-100 scroll-item-content p-b-16'>
        <div
          className='banner'
          ref={drop}
          style={{
            backgroundImage: props.item.media?.mediaOssUrl ? 'none' : '',
          }}>
          {!props.item.media && (
            <div className='banner-tips'>
              {isDroping ? '释放' : '拖拽左侧文件到此区域'}
            </div>
          )}
          {props.item.media && props.item.media.mediaType == '1' && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              src={props.item.media.mediaOssUrl}
              preview={false}
              fallback={errorImg}
            />
          )}
          {props.item.media && props.item.media.mediaType == '2' && (
            <audio src={props.item.media.mediaOssUrl} controls></audio>
          )}
          {props.item.media && props.item.media.mediaType == '3' && (
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
          <RcsInput
            text={props.item.title}
            onChange={changeTitle}
            max={200}
            min={1}
            label={'卡片标题'}
            chineseLen={2}
            showInsertParams
          />
        </div>
        <div
          className='card-des'
          style={{
            fontWeight: props.desConfig.b ? 'bold' : 'normal',
            fontStyle: props.desConfig.i ? 'italic' : 'normal',
            textDecoration: props.desConfig.u ? 'underline' : 'none',
          }}>
          <RcsInput
            text={props.item.description}
            onChange={changeDes}
            max={2000}
            min={1}
            label={'卡片内容'}
            chineseLen={2}
            showInsertParams
            style={{ minHeight: '48px' }}
          />
        </div>
        {props.item.suggestions.map((item, index) => (
          <div className='card-btn' key={index}>
            <RcsInput
              text={item.displayText}
              onChange={(val) => changeBtnText(val, index)}
              onFocus={() => {
                props.onChangeActionsIndex(index)
                props.onChangeBtnIndex(index)
              }}
              onBlur={() => props.onChangeActionsIndex(-1)}
              max={25}
              min={1}
              chineseLen={2}
              label={'按钮'}
              showInsertParams={false}
              active={index == props.actionsIndex}
              style={{
                height: 36,
                lineHeight: '34px',
                textAlign: 'center',
                borderRadius: '18px',
                backgroundColor: '#ECEFF2',
                overflow: 'auto',
                padding: '0 16px',
              }}
            />
          </div>
        ))}
        {props.item.suggestions.length < 4 && (
          <div className='card-btn-add fx-center-center' onClick={addBtn}>
            <span className='icon iconfont icon-jia fn14'></span>
          </div>
        )}
      </div>
    </div>
  )
}
