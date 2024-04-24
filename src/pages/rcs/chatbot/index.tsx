import { useEffect, useState } from 'react'
import {
  Flex,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Row,
  Col,
  Table,
  Image,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { PlusOutlined } from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'
import { usePoint } from '@/hooks'
import { getChatbot } from '@/api'

import { API } from 'apis'
import './index.scss'

interface DataType extends API.ChatbotItem {}

export enum ChatbotStatus {
  '未提交',
  '我方通过',
  '驳回',
  '审核中',
}
export enum ChatbotColor {
  'color-gray',
  'color-default',
  'color-error',
  'color-warning',
}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      className: 'paddingL30',
      width: 80,
      dataIndex: 'index',
    },
    {
      title: 'Chatbot名称',
      className: 'paddingL30',
      width: 150,
      fixed: true,
      dataIndex: 'name',
    },
    {
      title: 'Chatbot ID',
      width: 120,
      dataIndex: 'chatbotID',
    },
    {
      title: '基本信息审核',
      width: 220,
      dataIndex: 'provider',
    },
    {
      title: '状态',
      width: 120,
      render: (_, record) => (
        <span className={`${ChatbotColor[record.status]}`}>
          {ChatbotStatus[record.status]}
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
      width: 140,
      render: (_, record) => (
        <>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to={`/console/rcs/chatbot/detail/${record.id}`}>
              查看
            </NavLink>
          </Button>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to='/console/rcs/chatbot/create/1'>编辑</NavLink>
          </Button>
          <Button type='link' style={{ paddingLeft: 0 }}>
            删除
          </Button>
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePageInfo = (page, pageSize) => {
    setPage(page)
    setLimit(pageSize)
  }

  useEffect(() => {
    getList()
  }, [limit, page])

  return (
    <PageContent extClass='chatbot-list'>
      <Image src={codeImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>申请/管理 Chatbot</div>
        <Button
          type='primary'
          size={point ? 'large' : 'middle'}
          onClick={toCreate}
          icon={<PlusOutlined className='fn14' rev={null} />}>
          申请 Chatbot
        </Button>
      </Flex>
      <Divider className='line'></Divider>

      <Form
        name='chatbot-list-form'
        className='chatbot-list-form'
        form={form}
        layout='vertical'
        size={point ? 'large' : 'middle'}
        initialValues={{ status: 'all', keywords: '' }}
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={10} md={10} lg={8} xl={6}>
            <Form.Item name='keywords' label='关键词搜索'>
              <Input placeholder='Chatbot名称/ID' />
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={4}>
            <Form.Item name='status' label='状态'>
              <Select
                placeholder='请选择'
                options={[
                  { value: 'all', label: '全部' },
                  { value: '1', label: '我方通过' },
                  { value: '2', label: '驳回' },
                  { value: '3', label: '审核中' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button
                type='primary'
                className='w-100'
                onClick={() => getList()}>
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        className='theme-cell reset-table'
        columns={columns}
        dataSource={tableData}
        rowKey={'name'}
        sticky
        loading={loading}
        pagination={{
          position: ['bottomRight'],
          current: page,
          pageSize: limit,
          hideOnSinglePage: true,
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50],
          total: total,
          onChange: changePageInfo,
        }}
        scroll={{ x: 'max-content' }}
      />
    </PageContent>
  )
}
