import { useState, useEffect, useRef } from 'react'
import { List, Skeleton, Button, Popconfirm } from 'antd'
import { getNoticeList, delNotice, delAllNotice } from '@/api'
import { unionBy } from 'lodash'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LoadingOutlined } from '@ant-design/icons'
import { API } from 'apis'
import './index.scss'

type Props = {
  show: boolean
  total: number
}
type DataType = API.NoticeItem
type ItemProps = {
  item: DataType
  onReGetList: () => void
}

dayjs.extend(relativeTime)

const Item = ({ item, onReGetList }: ItemProps) => {
  const [loading, setLoading] = useState(false)
  const delEvent = async (id: string) => {
    setLoading(true)
    try {
      const res = await delNotice({ id })
      setLoading(false)
      if (res.status == 'success') {
        onReGetList()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='title'>
        <div
          className='text g-ellipsis'
          dangerouslySetInnerHTML={{ __html: item.subject }}></div>
        <div
          className='clear-btn'
          title='删除该通知'
          onClick={() => delEvent(item.id)}>
          {loading ? (
            <LoadingOutlined className='fn14' />
          ) : (
            <span
              className='iconfont icon-chahao fn14'
              style={{ cursor: 'pointer', color: '#393e49' }}></span>
          )}
        </div>
      </div>
      <div
        className='des g-ellipsis'
        dangerouslySetInnerHTML={{ __html: item.msg }}></div>
      <div className='time'>{dayjs(item.create_at).fromNow(true)}前</div>
    </>
  )
}

export default function Notice(props: Props) {
  const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<DataType[]>([])
  const pageNumber = useRef(1)

  const getList = async () => {
    try {
      const res = await getNoticeList({
        page: pageNumber.current,
      })
      if (res.status == 'success') {
        setInitLoading(false)
        setLoading(false)
        setList(unionBy([...list, ...res.notifications], 'id'))
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (props.show) {
      getList()
    } else {
      pageNumber.current = 1
      setList([])
    }
    return () => {
      setList([])
    }
  }, [props.show])

  // 获取更多
  const onLoadMore = () => {
    pageNumber.current += 1
    setLoading(true)
    getList()
  }

  const clearAllEvent = async () => {
    const res = await delAllNotice()
    if (res.status == 'success') {
      pageNumber.current = 1
      setList([])
    }
  }

  // 删除成功重新获取列表
  const reGetList = () => {
    if (pageNumber.current == 1) {
      getList()
    } else {
      let allList = []
      for (let i = 0; i < pageNumber.current; i++) {
        allList.push(getNoticeList({ page: i + 1 }))
      }
      const pAll = Promise.all(allList)
      pAll.then((res) => {
        let _list = []
        res.forEach((item) => {
          _list = [..._list, ...item.notifications]
        })
        setList(_list)
      })
    }
  }

  let loadMore = null
  if (!initLoading && props.total > list.length) {
    if (loading) {
      loadMore = (
        <div className='loadmore-btn fx-col fx-y-center' onClick={onLoadMore}>
          <span>加载更多通知</span> <LoadingOutlined spin className='fn16' />
        </div>
      )
    } else {
      loadMore = (
        <div className='loadmore-btn fx-col fx-y-center' onClick={onLoadMore}>
          <span>加载更多通知</span>
          <span className='iconfont icon-xiangxia'></span>
        </div>
      )
    }
  }

  return (
    <List
      header={
        <Popconfirm
          title='清除全部通知'
          description='确定清除全部通知？'
          onConfirm={clearAllEvent}
          okText='确定'
          cancelText='取消'>
          <div className='clear-all'>清除全部</div>
        </Popconfirm>
      }
      footer={null}
      className='notice-list'
      loading={initLoading}
      itemLayout='horizontal'
      loadMore={loadMore}
      dataSource={list}
      split={false}
      bordered={false}
      rowKey={'id'}
      renderItem={(item) => (
        <List.Item>
          <Item item={item} onReGetList={reGetList} />
        </List.Item>
      )}
    />
  )
}
