import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Modal,
  Flex,
  Space,
  Input,
  Button,
  Pagination,
  Row,
  Col,
  Empty,
  Spin,
} from 'antd'
import { getRcsTempList } from '@/api'
import Item from '@/pages/rcs/template/list/item'
import { API } from 'apis'
import { usePoint } from '@/hooks'

type Props = {
  open: boolean
  onCancel: () => void
}

type TitleProps = {
  onSearch: (str: string) => void
}

// 弹框title
const Title = (props: TitleProps) => {
  const [text, setText] = useState<string>()
  const onPressEnter = (e) => {
    props.onSearch(e.target.value)
  }
  return (
    <Flex justify='space-between' align='center'>
      <div>选择模版</div>
      <Space>
        <Input
          placeholder='模版名称或ID'
          value={text}
          autoComplete='off'
          onChange={(e) => setText(e.target.value)}
          onPressEnter={onPressEnter}
        />
        <Button type='primary' onClick={() => props.onSearch(text)}>
          搜索
        </Button>
      </Space>
    </Flex>
  )
}

// 选择发送模版弹框
export default function Fn(props: Props) {
  const point = usePoint('sm')
  const nav = useNavigate()
  const [keyword, setKeyword] = useState('')
  const keywordRef = useRef('')
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.RcsTempListItem[]>([])
  const [loading, setLoading] = useState(false)

  const getList = async () => {
    setLoading(true)
    try {
      const res = await getRcsTempList({
        page: currentPage,
        limit: pageSize,
        status: '1',
        keyword: keywordRef.current,
      })
      setLoading(false)
      setList(res.list)
      setTotal(res.total)
    } catch (error) {
      setLoading(false)
    }
  }
  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }

  const handleSearch = (val) => {
    keywordRef.current = val
    if (currentPage == 1) {
      getList()
    } else {
      setcurrentPage(1)
    }
  }

  // 选择该模版
  const onSelect = (item: API.RcsTempListItem) => {
    nav(`/console/rcs/send/${item.sign}`, { replace: true })
    props.onCancel()
  }

  useEffect(() => {
    if (props.open) {
      getList()
    } else {
      setcurrentPage(1)
    }
  }, [currentPage, pageSize, props.open])

  return (
    <Modal
      closeIcon={null}
      open={props.open}
      onCancel={props.onCancel}
      width={1092}
      title={<Title onSearch={handleSearch} />}
      footer={
        <Flex justify='space-between' align='center'>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={[]}
            size={point ? 'default' : 'small'}
            total={total}
            showSizeChanger={false}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
          <Button onClick={props.onCancel}>取消</Button>
        </Flex>
      }
      destroyOnClose>
      <Row gutter={24}>
        {list.map((item, index) => (
          <Col span={24} md={12} lg={8} key={item.id}>
            <div>
              <Item item={item} hiddenHandle onSelect={() => onSelect(item)} />
            </div>
          </Col>
        ))}
      </Row>
      {list.length == 0 && <Empty className='m-t-40' />}
      {loading && (
        <div
          className='w-100 fx-center-center'
          style={{ position: 'absolute', top: '100px', left: 0 }}>
          <Spin></Spin>
        </div>
      )}
    </Modal>
  )
}
