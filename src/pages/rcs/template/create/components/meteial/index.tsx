import {
  Input,
  Space,
  Row,
  Col,
  Flex,
  Pagination,
  Button,
  ConfigProvider,
  Empty,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { getRcsOnlineMeteialList } from '@/api'
import { API } from 'apis'
import './index.scss'
import UploadModal from './uploadModal'
import Item from './item'

type MediaType = '1' | '2' | '3' // 1图片 2音频 3视频
type T = MediaType | 'all'

export default function Fn() {
  const [keywords, setkeywords] = useState('')
  const [type, setType] = useState<T>('all')
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [showModal, setshowModal] = useState(false)
  const [list, setList] = useState<API.RcsOnlineMeteialItem[]>([])
  const timerRef = useRef(null) // 定时器
  const getListingRef = useRef(false) // 是否正在获取列表数据

  const getList = async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    getListingRef.current = true
    try {
      const res = await getRcsOnlineMeteialList({
        id: '',
        page: currentPage,
        limit: pageSize,
        keyword: keywords,
        type,
        status: 'all',
      })
      getListingRef.current = false
      setList(res.libs)
      setTotal(res.total)
      timerRef.current = setTimeout(() => {
        const hasUploading = res.libs.findIndex((item) =>
          ['8', '9'].includes(item.status),
        )
        !getListingRef.current && hasUploading != -1 && getList()
      }, 5000)
    } catch (error) {
      getListingRef.current = false
    }
  }

  const uploadSuccess = (hasError: boolean) => {
    getList()
    if (!hasError) {
      setshowModal(false)
    }
  }

  useEffect(() => {
    getList()
  }, [type, currentPage, pageSize])

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }

  return (
    <div className='rcs-temp-meteial'>
      <div className='top-search p-16'>
        <Input
          style={{ height: 40 }}
          value={keywords}
          onPressEnter={getList}
          onChange={(e) => setkeywords(e.target.value)}
          suffix={<span className='icon iconfont icon-search'></span>}
        />
        <Flex justify='space-between' align='center'>
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
          <Space
            className='g-pointer primary-color'
            size={2}
            onClick={() => setshowModal(true)}>
            <UploadOutlined className='fn16' rev={undefined} />
            <span>上传素材</span>
          </Space>
        </Flex>
      </div>
      <div className='rcs-meteial-list p-16'>
        <Row wrap gutter={[20, 12]}>
          {list.map((item) => (
            <Col span={12} key={item.id}>
              <Item item={item} delSuccess={() => getList()} />
            </Col>
          ))}
          {list.length == 0 && (
            <Col span={24} className='fx-center-center m-t-40'>
              <Empty description='暂无素材，请上传素材' />
            </Col>
          )}
        </Row>
      </div>
      <div className='float-btm'>
        <Flex justify='flex-end' className='p-x-16 p-y-8 page'>
          <Pagination
            size='small'
            defaultCurrent={1}
            // hideOnSinglePage
            showSizeChanger={false}
            current={currentPage}
            defaultPageSize={pageSize}
            total={total}
            // showQuickJumper
            simple
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
        </Flex>
      </div>
      <UploadModal
        show={showModal}
        onCancel={() => setshowModal(false)}
        onOk={uploadSuccess}
      />
    </div>
  )
}
