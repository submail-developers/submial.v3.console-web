import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
} from 'antd'
import { getRcsMeteialList, delRcsMeteial, getRcsTempList } from '@/api'
import Item from '@/pages/rcs/template/list/item'
import { API } from 'apis'
import './index.scss'
type Props = {
  open: boolean
  onCancel: () => void
}

type TitleProps = {
  loading: boolean
  onSearch: (str: string) => void
}
const Title = (props: TitleProps) => {
  const [text, setText] = useState<string>()
  return (
    <Flex justify='space-between' align='center'>
      <div>选择模版</div>
      <Space>
        <Input
          placeholder='模版标题/模版ID'
          value={text}
          autoComplete='off'
          onChange={(e) => setText(e.target.value)}
          onPressEnter={() => props.onSearch(text)}
        />
        <Button
          type='primary'
          loading={props.loading}
          onClick={() => props.onSearch(text)}>
          搜索
        </Button>
      </Space>
    </Flex>
  )
}
export default function Fn(props: Props) {
  const nav = useNavigate()
  const [keyword, setKeyword] = useState('')

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.RcsTempListItem[]>([])
  const [loading, setLoading] = useState(false)

  const getList = async () => {
    try {
      const res = await getRcsTempList({
        page: currentPage,
        limit: pageSize,
        status: 'all',
        keyword: keyword,
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
    setLoading(true)
    setcurrentPage(1)
    setKeyword(val)
    getList()
  }

  const onSelect = (item: API.RcsTempListItem) => {
    nav(`/console/rcs/send/${item.id}`, { replace: true })
    props.onCancel()
  }

  useEffect(() => {
    getList()
  }, [currentPage, pageSize])

  return (
    <Modal
      closeIcon={null}
      open={props.open}
      onCancel={props.onCancel}
      width={1092}
      title={<Title loading={loading} onSearch={handleSearch} />}
      footer={
        <Flex justify='space-between' align='center'>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            pageSizeOptions={[]}
            total={total}
            showSizeChanger={false}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
          <Button onClick={props.onCancel}>取消</Button>
        </Flex>
      }
      classNames={{ header: 'modal-header', body: 'modal-body' }}
      wrapClassName='select-create-send-temp'
      destroyOnClose>
      <Flex
        justify={list.length < 2 ? 'flex-start' : 'space-around'}
        gap={24}
        wrap='wrap'>
        {list.map((item, index) => (
          <div key={item.id}>
            <Item item={item} onSelect={() => onSelect(item)} />
          </div>
        ))}
      </Flex>
      {list.length == 0 && <Empty className='m-t-40' />}
    </Modal>
  )
}
