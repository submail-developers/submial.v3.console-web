import { useEffect, useState } from 'react'
import {
  Flex,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Table,
  Image,
  Popconfirm,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { PlusOutlined } from '@ant-design/icons'
import faceImg from '@/assets/rcs/face/chatbot.png'
import { getChatbot, deleteChatbot } from '@/api'
import { API } from 'apis'

import {
  EnmuMenuStatusText,
  EnmuMenuStatusColor,
  ChatbotStatus,
  ChatbotColor,
} from '@/pages/rcs/chatbot/type'
import './index.scss'

interface DataType extends API.ChatbotItem {}

export default function Fn() {
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)

  const columns: ColumnsType<DataType> = [
    {
      title: 'Chatbot名称',
      className: 'paddingL30',
      width: 200,
      fixed: true,
      dataIndex: 'name',
    },

    {
      title: '基本信息审核状态',
      width: 140,
      dataIndex: 'status',
      render: (_, record) => (
        <span className={`${ChatbotColor[record.status]}`}>
          {ChatbotStatus[record.status]}
        </span>
      ),
    },
    {
      title: '固定菜单审核状态',
      width: 140,
      render: (_, record) => (
        <span className={EnmuMenuStatusColor[record.menu_status]}>
          {EnmuMenuStatusText[record.menu_status] || '-'}
        </span>
      ),
    },

    {
      title: '更新时间',
      width: 180,
      dataIndex: 'datetime',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => (
        <>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to={`/console/rcs/chatbot/detail/${record.id}`}>
              查看
            </NavLink>
          </Button>
          {/* 保存/通过/驳回可编辑 */}
          {['0', '1', '2'].includes(record.status) && (
            <Button type='link' style={{ paddingLeft: 0 }}>
              <NavLink to={`/console/rcs/chatbot/create/${record.id}`}>
                编辑
              </NavLink>
            </Button>
          )}
          {['0', '2'].includes(record.status) && (
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该chatbot吗？'
              onConfirm={() => deleteSingleChatbot(record.id)}
              okText='确定'
              cancelText='取消'>
              <Button type='link' style={{ paddingLeft: 0 }}>
                删除
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  const toCreate = () => {
    nav('/console/rcs/chatbot/create/0')
  }

  const getList = async () => {
    setLoading(true)
    try {
      const formValues = await form.getFieldsValue()
      const res = await getChatbot({
        page,
        limit,
        ...formValues,
      })
      let _list: DataType[] = res.list.map((item, index) => {
        item.index = (page - 1) * limit + index + 1
        return item
      })
      settableData(_list)
      setTotal(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  // 删除chatbot
  const deleteSingleChatbot = async (id) => {
    try {
      const res = await deleteChatbot({
        appid: id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }

  const changePageInfo = (page, pageSize) => {
    setPage(page)
    setLimit(pageSize)
  }
  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    if (!('keywords' in changedValues)) {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }
  }

  const search = () => {
    setLoading(true)
    if (page == 1) {
      getList()
    } else {
      setPage(1)
    }
  }

  useEffect(() => {
    getList()
  }, [limit, page])

  return (
    <PageContent extClass='chatbot-list' lg={'100%'}>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>申请/管理 Chatbot</div>
        <Button
          type='primary'
          onClick={toCreate}
          icon={<PlusOutlined className='fn14' rev={undefined} />}>
          申请 Chatbot
        </Button>
      </Flex>
      <Divider />
      <Form
        name='chatbot-list-form'
        className='chatbot-list-form'
        form={form}
        layout='vertical'
        initialValues={{ status: 'all', status2: 'all' }}
        onValuesChange={onValuesChange}
        autoComplete='off'>
        <Flex align='flex-end' gap={16} wrap='wrap'>
          <Form.Item name='status' label='基本信息审核状态' className='m-b-0'>
            <Select
              placeholder='请选择'
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部' },
                { value: '1', label: '审核通过' },
                { value: '2', label: '审核驳回' },
                { value: '3', label: '审核中' },
              ]}
            />
          </Form.Item>
          <Form.Item name='status2' label='固定菜单审核状态' className='m-b-0'>
            <Select
              placeholder='请选择'
              options={[
                { value: 'all', label: '全部' },
                { value: '1', label: '等待审核' },
                { value: '2', label: '审核通过' },
                { value: '3', label: '审核驳回' },
                { value: '4', label: '未上传' },
              ]}
            />
          </Form.Item>
          <Form.Item name='keywords' label='关键词搜索' className='m-b-0'>
            <Input placeholder='Chatbot名称' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' className='w-100' onClick={search}>
              查询
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      <Table
        className='theme-cell reset-table m-t-24'
        columns={columns}
        dataSource={tableData}
        rowKey={'name'}
        sticky
        loading={loading}
        pagination={{
          position: ['bottomRight'],
          current: page,
          pageSize: limit,
          hideOnSinglePage: false,
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50],
          total: total,
          showTotal: (total) => `共 ${total} 条`,
          onChange: changePageInfo,
        }}
        scroll={{ x: 'fit-content' }}
      />
    </PageContent>
  )
}
