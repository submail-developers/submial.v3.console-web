import { Image, Space, Spin, Popconfirm, Tooltip, App } from 'antd'
import { PlayCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { delRcsMeteial } from '@/api'
import { API } from 'apis'
import './index.scss'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import videoTypeImg from '@/assets/rcs/fileType/video.png'
import { getFileName } from '@/utils'
import { usePoint } from '@/hooks'
import MediaDrag from '../drag'
import dayjs from 'dayjs'
import './index.scss'

type MediaType = '1' | '2' | '3' // 1图片 2音频 3视频
type T = MediaType | 'all'

type ItemProps = {
  item: API.RcsOnlineMeteialItem
  delSuccess: () => void
}

type EndTimeProps = {
  expireAt: string
}
const EndTime = ({ expireAt }: EndTimeProps) => {
  const currentTime = dayjs()
  const days = currentTime.diff(expireAt, 'd', true)
  return (
    <div className='end-time p-l-6 p-b-6'>
      <div className='time-text p-x-10 fn13'>
        {days < 0 ? '已过期' : `期限: ${Math.ceil(days)}天`}
      </div>
    </div>
  )
}

export default function MeteialItem(props: ItemProps) {
  const { message } = App.useApp()
  const point = usePoint('lg')
  const [loadError, setLoadError] = useState(props.item.type != '1')
  const [previewImg, setpreviewImg] = useState(false)
  const [previewAudio, setpreviewAudio] = useState(false)
  const [previewVideo, setpreviewVideo] = useState(false)
  const [imageRender, setimageRender] = useState<React.ReactNode>()
  const [videoRender, setvideoRender] = useState<React.ReactNode>()
  const [audioRender, setaudioRender] = useState<React.ReactNode>()

  const previewEvent = () => {
    if (props.item.type == '2') {
      setpreviewAudio(true)
      setaudioRender(
        <audio
          className='source-video'
          style={{ width: `${point ? '50%' : '90%'}` }}
          controls
          src={props.item.storeAt}
        />,
      )
    } else if (props.item.type == '3') {
      setpreviewVideo(true)
      setvideoRender(
        <video
          className='source-video'
          muted
          width={point ? '50%' : '90%'}
          controls
          src={props.item.storeAt}
        />,
      )
    } else {
      setpreviewImg(true)
      setimageRender(
        <Image
          preview={false}
          className='source-video'
          width={point ? '50%' : '90%'}
          src={props.item.storeAt}
        />,
      )
    }
  }

  const delEvent = async () => {
    try {
      const res = await delRcsMeteial({
        id: props.item.id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        props.delSuccess()
      }
    } catch (error) {}
  }

  return (
    <div className='rcs-meteial-item'>
      <div className='item-media'>
        {props.item.type == '1' && (
          <>
            <Image
              src={props.item.storeAt}
              fallback={imgTypeImg}
              style={{ width: loadError ? '50%' : '100%' }}
              onError={() => setLoadError(true)}
              preview={false}
            />
            {/* 预览 */}
            <div style={{ display: 'none' }}>
              <Image
                src=''
                preview={{
                  visible: previewImg,
                  imageRender: () => imageRender,
                  toolbarRender: () => null,
                  onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                    setimageRender(null)
                    setpreviewImg(visible)
                  },
                }}
              />
            </div>
          </>
        )}
        {props.item.type == '2' && (
          <>
            <Image
              src={audioTypeImg}
              preview={false}
              style={{ width: loadError ? '50%' : '100%' }}
            />
            {/* 预览 */}
            <div style={{ display: 'none' }}>
              <Image
                src=''
                preview={{
                  visible: previewAudio,
                  imageRender: () => audioRender,
                  toolbarRender: () => null,
                  onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                    setaudioRender(null)
                    setpreviewAudio(visible)
                  },
                }}
              />
            </div>
          </>
        )}
        {props.item.type == '3' && (
          <>
            <video src={props.item.storeAt}></video>
            <div style={{ display: 'none' }}>
              <Image
                src=''
                preview={{
                  visible: previewVideo,
                  imageRender: () => videoRender,
                  toolbarRender: () => null,
                  onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                    setvideoRender(null)
                    setpreviewVideo(visible)
                  },
                }}
              />
            </div>
            <div className='video-play' onClick={previewEvent}>
              <PlayCircleOutlined
                className='fn24'
                title='播放视频'
                rev={undefined}
              />
            </div>
          </>
        )}

        {props.item.status == '0' && props.item.expireAt && (
          <EndTime expireAt={props.item.expireAt} />
        )}

        <div className='modal'>
          <Space className='handle' size={4}>
            {/* 预览图片按钮 */}
            {props.item.type == '1' && (
              <div className='handle-item' onClick={previewEvent}>
                <EyeOutlined className='fn14' title='预览' rev={undefined} />
              </div>
            )}
            {/* 预览音频|视频按钮 */}
            {(props.item.type == '2' || props.item.type == '3') && (
              <div className='handle-item' onClick={previewEvent}>
                <PlayCircleOutlined
                  className='fn14'
                  title={`${props.item.type == '2' ? '播放音频' : '播放音频'}`}
                  rev={undefined}
                />
              </div>
            )}
            {props.item.status == '0' && (
              <Tooltip
                placement='bottom'
                mouseEnterDelay={0.3}
                title='重置素材有效期'
                overlayInnerStyle={{ fontSize: '12px', minHeight: '24px' }}
                trigger={['click', 'hover']}
                destroyTooltipOnHide>
                <div className='handle-item'>
                  <span className='icon iconfont icon-shuaxin fn16'></span>
                </div>
              </Tooltip>
            )}
            <Popconfirm
              title='删除素材'
              description='确定删除该素材？'
              onConfirm={delEvent}
              placement='bottom'
              okText='确定'
              cancelText='取消'>
              <div className='handle-item'>
                <span className='icon iconfont icon-shanchu fn16'></span>
              </div>
            </Popconfirm>
          </Space>
        </div>
        {/* 审核中 */}
        {['8', '9'].includes(props.item.status) && (
          <Tooltip
            placement='bottom'
            mouseEnterDelay={0.3}
            title='素材上传中，上传成功后才能在模版中使用'
            overlayInnerStyle={{ fontSize: '12px', minHeight: '24px' }}
            trigger={['click', 'hover']}
            destroyTooltipOnHide>
            <div className='uploading fx fn14 p-l-4 p-t-4'>
              <Spin size='small' />
            </div>
          </Tooltip>
        )}
      </div>
      <div className='name g-ellipsis' title={props.item.name}>
        {getFileName({
          fileName: props.item.name,
          before: 6,
          after: 3,
        })}
      </div>
      {props.item.status == '0' && <MediaDrag item={props.item} />}
    </div>
  )
}
