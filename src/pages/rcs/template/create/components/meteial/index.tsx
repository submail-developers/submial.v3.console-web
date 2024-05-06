import { Input, Image, Space, Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getRcsMeteialList, getRcsOnlineMeteialList } from '@/api'
import { API } from 'apis'
import './index.scss'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import videoTypeImg from '@/assets/rcs/fileType/video.png'
import { config as dndConfig } from '../../dnd'
import { useDrag } from 'react-dnd'
import { getFileName } from '@/utils'

type T = '1' | '2' | '3' | 'all'

type ItemProps = {
  item: API.RcsOnlineMeteialItem
}
type DropResult = API.RcsOnlineMeteialItem
const Item = (props: ItemProps) => {
  const [loadError, setLoadError] = useState(props.item.type != '1')
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndConfig.accept,
    item: { ...props.item },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        // console.log(item, dropResult, 'dropResult')
        // alert(`You dropped ${item.name} into ${dropResult.name}!`)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <div className='item' ref={drag} style={{ opacity }} data-testid={`box`}>
      <div className='item-media'>
        {props.item.type == '1' && (
          <Image
            src={props.item.storeAt}
            preview={false}
            fallback={imgTypeImg}
            style={{ width: loadError ? '50%' : '100%' }}
            onError={() => setLoadError(true)}
          />
        )}
        {props.item.type == '2' && (
          <Image
            src={audioTypeImg}
            preview={false}
            style={{ width: loadError ? '50%' : '100%' }}
          />
        )}
        {props.item.type == '3' && (
          <video src={props.item.storeAt} controls></video>
        )}
      </div>
      <div className='name g-ellipsis' title={props.item.name}>
        {getFileName({
          fileName: props.item.name,
          before: 4,
          after: 3,
        })}
      </div>
    </div>
  )
}

export default function Fn() {
  const [keywords, setkeywords] = useState('')
  const [type, setType] = useState<T>('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.RcsOnlineMeteialItem[]>([])
  const getList = async () => {
    setLoading(true)
    try {
      const res = await getRcsOnlineMeteialList({
        id: '',
        page: page,
        limit: 20,
        keyword: keywords,
        type,
        status: 'all',
      })
      setList(res.libs)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    getList()
  }, [type, page])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop === clientHeight && !loading) {
      console.log('getmore')
      // fetchData()
    }
  }
  return (
    <div className='rcs-temp-meteial'>
      <div className='top-search'>
        <Input
          style={{ height: 40 }}
          value={keywords}
          onPressEnter={getList}
          onChange={(e) => setkeywords(e.target.value)}
          suffix={<span className='icon iconfont icon-search'></span>}
        />
        <Space size={20}>
          <div
            className={`type ${type == 'all' ? 'active' : ''}`}
            onClick={() => setType('all')}>
            全部
          </div>
          <div
            className={`type ${type == '1' ? 'active' : ''}`}
            onClick={() => setType('1')}>
            图片
          </div>
          <div
            className={`type ${type == '3' ? 'active' : ''}`}
            onClick={() => setType('3')}>
            视频
          </div>
          <div
            className={`type ${type == '2' ? 'active' : ''}`}
            onClick={() => setType('2')}>
            音频
          </div>
        </Space>
      </div>
      <div className='meteial-list' onScroll={handleScroll}>
        <Row wrap gutter={[20, 16]}>
          {list.map((item) => (
            <Col span={12} key={item.id}>
              <Item item={item} />
            </Col>
          ))}
        </Row>
        {loading && (
          <div
            className='fx-center-center fx-col w-100 color'
            style={{ height: '80px' }}>
            <LoadingOutlined className='fn20' />
            <span>加载中...</span>
          </div>
        )}
      </div>
    </div>
  )
}
