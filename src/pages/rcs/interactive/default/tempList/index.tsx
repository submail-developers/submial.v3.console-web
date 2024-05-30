import {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Flex } from 'antd'
import { getRcsTempList } from '@/api'
import {
  useStateDispatch,
  useStateStore,
} from '@/pages/rcs/interactive/reducer'
import ACopy from '@/components/aCopy'
import { API } from 'apis'
import type { ColumnsType } from 'antd/es/table'
import './index.scss'

interface DataType extends API.RcsTempListItem {}

const pageSize = 10
function Fn(props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      search,
    }
  })
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const nav = useNavigate()
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<API.RcsTempListItem[]>([])
  const [loading, setLoading] = useState(false)
  const keywordsRef = useRef('')

  const search = (keywords) => {
    keywordsRef.current = keywords
    setPage(1)
    getList(1)
  }

  const getList = async (page) => {
    setLoading(true)
    try {
      const res = await getRcsTempList({
        page: page,
        limit: pageSize,
        status: '1',
        keyword: keywordsRef.current,
      })
      setList(res.list)
      setTotal(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const change = (item: API.RcsTempListItem) => {
    dispatch({
      type: 'changeTemplate',
      payload: item,
    })
    nav(`/console/rcs/interactive/template/${item.id}`, {
      replace: true,
    })
  }

  const changePage = (page, pageSize) => {
    setPage(page)
    getList(page)
  }

  const toDetail = (e, item: API.RcsTempListItem) => {
    e.stopPropagation()
    dispatch({
      type: 'changeChatbot',
      payload: item,
    })
    nav(`/console/rcs/interactive/detail/template/${item.id}`)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '模版列表',
      className: 'paddingL30',
      render: (_, record) => <div className='w-100'>{record.title}</div>,
    },
    {
      title: '',
      width: 120,
      render: (_, record) => (
        <Flex justify='flex-end' align='center' className='p-r-24' gap={16}>
          <span className='tag-color'>已配置</span>
          <div
            className='fx-center-center'
            style={{ width: 32 }}
            onClick={(e) => toDetail(e, record)}>
            <span className='icon iconfont icon-bianji text-color'></span>
          </div>
        </Flex>
      ),
    },
  ]
  // 获取交互详情-刷新页面时重新dispatch
  useEffect(() => {
    if (!state.template) {
      getInfo()
    }
  }, [state.template])
  const getInfo = async () => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        id: id,
        keyword: '',
        status: '1', // 默认all     0等待审核，1通过，2驳回
      })
      if (res.list.length == 1) {
        dispatch({
          type: 'changeTemplate',
          payload: {
            ...res.list[0],
          },
        })
      }
    } catch (error) {}
  }

  return (
    <Table
      className='theme-cell reset-table m-t-24'
      columns={columns}
      dataSource={list}
      rowKey={'id'}
      loading={loading}
      pagination={{
        position: ['bottomRight'],
        current: page,
        pageSize: pageSize,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: [],
        total: total,
        showSizeChanger: false,
        hideOnSinglePage: true,
        onChange: changePage,
      }}
      scroll={{ y: 500 }}
      rowClassName={(record) =>
        record.id == id ? 'color g-pointer' : 'g-pointer'
      }
      onRow={(record) => {
        return {
          onClick: (event) => {
            change(record)
          },
        }
      }}
    />
  )
}
export default forwardRef(Fn)
