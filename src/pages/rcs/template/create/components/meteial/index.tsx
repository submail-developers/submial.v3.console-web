import { Input, Image, Space, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { getRcsMeteialList } from '@/api'
import { API } from 'apis'
import './index.scss'
import audioTypeImg from '@/assets/rcs/fileType/audio.png'

type T = '1' | '2' | '3' | 'all'

type ItemProps = {
  type: T
}
const Item = () => {
  return (
    <div className='item'>
      <Image src={audioTypeImg} preview={false} />
    </div>
  )
}

export default function Fn() {
  const [keywords, setkeywords] = useState('')
  const [type, setType] = useState<T>('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.RcsMeteialItem[]>([])
  const getList = async () => {
    try {
      const res = await getRcsMeteialList({
        id: '',
        page: page,
        limit: 20,
        keyword: '',
        type: '1',
      })
      setList(res.libs)
    } catch (error) {}
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
          value={keywords}
          onPressEnter={getList}
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
              <Item />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
