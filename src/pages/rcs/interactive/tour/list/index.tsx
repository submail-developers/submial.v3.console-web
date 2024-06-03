import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input, Flex, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { usePoint } from '@/hooks'
import { chatbotList, templateList } from '../data'
import { API } from 'apis'
import {
  useStateDispatch,
  useStateStore,
} from '@/pages/rcs/interactive/reducer'
import './index.scss'

interface DataTypeChatbot extends API.ChatbotItem {}
interface DataTypeTemplate extends API.RcsTempListItem {}

export default function Fn() {
  const nav = useNavigate()
  const { id, type } = useParams()
  const dispatch = useStateDispatch()
  const [keyword, setKeyword] = useState('')
  const size = usePoint('xl')
  const handleSearch = (value, event, { source }) => {
    setKeyword(value)
  }
  const columnsChatbot: ColumnsType<DataTypeChatbot> = [
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
          <span className='tag-color'>已配置</span>
          <div
            className='fx-center-center text-color'
            style={{ width: 32 }}
            onClick={(e) => {}}>
            <span className='icon iconfont icon-bianji'></span>
          </div>
        </Flex>
      ),
    },
  ]

  const columnsTemplate: ColumnsType<DataTypeTemplate> = [
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
            onClick={(e) => {}}>
            <span className='icon iconfont icon-bianji text-color'></span>
          </div>
        </Flex>
      ),
    },
  ]
  const changeChatbot = (item: DataTypeChatbot) => {
    dispatch({
      type: 'changeChatbot',
      payload: item,
    })
    nav(`/console/rcs/interactive/tour/chatbot/${item.id}`, {
      replace: true,
    })
  }
  const changeTemplate = (item: DataTypeTemplate) => {
    dispatch({
      type: 'changeTemplate',
      payload: item,
    })
    nav(`/console/rcs/interactive/tour/template/${item.id}`, {
      replace: true,
    })
  }

  useEffect(() => {
    if (type == 'chatbot') {
      dispatch({
        type: 'changeChatbot',
        payload: chatbotList.find((item) => item.id == id),
      })
    } else {
      dispatch({
        type: 'changeTemplate',
        payload: templateList.find((item) => item.id == id),
      })
    }
  }, [id, type])

  return (
    <div className='tour-list' style={{ paddingTop: size ? 60 : 44 }}>
      <div className='left-content fx-col'>
        <Input.Search
          className='top-search'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
          allowClear
          placeholder='chatbot名称/模版名称'
        />
        <Table
          className='theme-cell reset-table'
          columns={columnsChatbot}
          dataSource={chatbotList}
          rowKey={'id'}
          pagination={false}
          scroll={{ y: 400 }}
          rowClassName={(record) =>
            record.id == id ? 'color g-pointer' : 'g-pointer'
          }
          onRow={(record) => {
            return {
              onClick: (event) => {
                changeChatbot(record)
              },
            }
          }}
        />
        <Table
          className='theme-cell reset-table m-t-24'
          columns={columnsTemplate}
          dataSource={templateList}
          rowKey={'id'}
          pagination={false}
          scroll={{ y: 500 }}
          rowClassName={(record) =>
            record.id == id ? 'color g-pointer' : 'g-pointer'
          }
          onRow={(record) => {
            return {
              onClick: (event) => {
                changeTemplate(record)
              },
            }
          }}
        />
      </div>
    </div>
  )
}
