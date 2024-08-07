import { useState, useEffect, useRef } from 'react'
import {
  Flex,
  Row,
  Col,
  Button,
  Divider,
  Image,
  Pagination,
  Spin,
  Empty,
} from 'antd'
import PageContent from '@/components/pageContent'
import Item from './components/item'
import CreateModal from './components/create'

import { getRcsSubhookList } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/subhook.png'
import './index.scss'

export default function Fn() {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [subhookList, setSubhookList] = useState<API.RcsSubhookItem[]>([])
  const ref = useRef(null)

  // subhook列表
  const getList = async () => {
    try {
      const res = await getRcsSubhookList({
        page: page,
        limit: limit,
      })
      setSubhookList(res.subhooks)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePageInfo = (page, pageSize) => {
    setLoading(true)
    if (pageSize != limit) {
      setPage(1)
      setLimit(pageSize)
    } else {
      setPage(page)
    }
  }

  useEffect(() => {
    setLoading(true)
    getList()
  }, [page, limit])

  const creatSubhook = () => {
    ref.current.open()
  }

  const editSubhook = (item: API.RcsSubhookItem) => {
    ref.current.open(item)
  }

  return (
    <PageContent extClass='subhook'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>SUBHOOK 状态推送</div>
        <Button
          type='primary'
          onClick={creatSubhook}
          icon={<i className='icon iconfont icon-jia'></i>}>
          创建 SUBHOOK
        </Button>
      </Flex>
      <Divider />

      <div style={{ position: 'relative', minHeight: 100 }}>
        {loading && (
          <div className='fx-center-center p-t-16 loading'>
            <Spin />
          </div>
        )}
        <Row gutter={[24, 24]}>
          {subhookList.map((item) => (
            <Col span={24} key={item.id}>
              <Item
                item={item}
                onRefresh={getList}
                onEdit={() => editSubhook(item)}
              />
            </Col>
          ))}
        </Row>
        {subhookList.length == 0 && <Empty />}
      </div>

      <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
        <Pagination
          defaultCurrent={1}
          current={page}
          defaultPageSize={limit}
          pageSizeOptions={[10, 20, 50]}
          total={total}
          showQuickJumper
          onChange={changePageInfo}
          showTotal={(total) => `共 ${total} 条`}
        />
      </Flex>
      <CreateModal onRefresh={getList} ref={ref} />
    </PageContent>
  )
}
