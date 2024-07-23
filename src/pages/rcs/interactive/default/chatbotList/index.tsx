import {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChatbot } from '@/api'
import { API } from 'apis'
import { Table, Flex, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  useStateDispatch,
  useStateStore,
} from '@/pages/rcs/interactive/reducer'

import './index.scss'

interface DataType extends API.ChatbotItem {}

function Fn(props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      search,
    }
  })
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const nav = useNavigate()
  const { id, type } = useParams()
  const [list, setList] = useState<API.ChatbotItem[]>([]) // chatbot列表
  const [loading, setLoading] = useState(false)
  const keywordsRef = useRef('')
  const search = (keywords, isInit) => {
    keywordsRef.current = keywords
    getList(isInit)
  }
  // 获取chatbot列表
  const getList = async (isInit = false) => {
    setLoading(true)
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: keywordsRef.current as string,
        status: '1',
      })
      setList(res.list)
      if (isInit && res.list.length > 0 && id == '0') {
        dispatch({
          type: 'changeChatbot',
          payload: res.list[0],
        })
        nav(`/console/rcs/interactive/list/chatbot/${res.list[0].id}`, {
          replace: true,
        })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const change = (item: API.ChatbotItem) => {
    dispatch({
      type: 'changeChatbot',
      payload: item,
    })
    nav(`/console/rcs/interactive/list/chatbot/${item.id}`)
  }
  const toDetail = (e, item: API.ChatbotItem) => {
    e.stopPropagation()
    dispatch({
      type: 'changeChatbot',
      payload: item,
    })
    nav(`/console/rcs/interactive/detail/chatbot/${item.id}`)
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'Chatbot列表',
      className: 'paddingL30',
      render: (_, record) => <div className='w-100'>{record.name}</div>,
    },
    {
      title: '',
      width: 120,
      render: (_, record) => (
        <Flex justify='flex-end' align='center' className='p-r-24' gap={16}>
          <span className='tag-color'>
            {record.interactive == '1' ? '' : '未配置'}
          </span>

          <Tooltip placement='bottom' title={'配置交互'}>
            <div
              className='fx-center-center text-color g-pointer'
              style={{ width: 32 }}
              onClick={(e) => toDetail(e, record)}>
              <span className='icon iconfont icon-bianji'></span>
            </div>
          </Tooltip>
        </Flex>
      ),
    },
  ]

  // 获取交互详情-刷新页面时重新dispatch
  useEffect(() => {
    if (type == 'chatbot') {
      if ((!state.chatbot && id != '0') || state.chatbot?.id != id) {
        getInfo()
      }
    }
  }, [id, state.chatbot, type])
  const getInfo = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10,
        appid: id,
        keywords: '',
        status: '1', // 默认all   0=未提交，1=我方通过，2=我们驳回，3=我方审核中
      })
      if (res.list.length == 1) {
        dispatch({
          type: 'changeChatbot',
          payload: {
            ...res.list[0],
          },
        })
      }
    } catch (error) {}
  }

  return (
    <Table
      className='theme-cell reset-table'
      columns={columns}
      dataSource={list}
      loading={loading}
      rowKey={'id'}
      pagination={false}
      scroll={{ y: 400 }}
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
