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
import { ConfigProvider, App as AntdApp } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { PlusOutlined } from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'

import { API } from 'apis'
import './index.scss'
import { usePoint } from '@/hooks'

interface DataType extends API.GetChatbotListItem {}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState([
    { name: '1213' },
    { name: '123' },
  ])

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      className: 'paddingL30',
      width: 80,
      render: (_, record) => <span>1</span>,
    },
    {
      title: 'Chatbot名称',
      className: 'paddingL30',
      width: 150,
      fixed: true,
      render: (_, record) => <span>技术部门</span>,
    },
    {
      title: 'Chatbot ID',
      width: 120,
      render: (_, record) => <span>010294912841</span>,
    },
    {
      title: '归厲CSP',
      width: 220,
      render: (_, record) => <span>上海赛邮云技术有限公司</span>,
    },
    {
      title: '状态',
      width: 120,
      render: (_, record) => <span>审核完成</span>,
    },
    {
      title: '更新时间',
      width: 140,
      render: (_, record) => <span>2024-03-10</span>,
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to='/console/rcs/chatbot/detail'>查看</NavLink>
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

  return (
    <PageContent extClass='chatbot-list' xxl={1200} xl={960}>
      <Image src={codeImg} preview={false} width={60}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn24'>申请/管理 Chatbot</div>
        <Button
          type='primary'
          size={point ? 'large' : 'middle'}
          onClick={toCreate}
          icon={<PlusOutlined rev={null} className='fn14' />}>
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
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={10} md={10} lg={8} xl={6}>
            <Form.Item name='key' label='关键词搜索'>
              <Input placeholder='Chatbot名称/ID' />
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={4}>
            <Form.Item name='status' label='状态'>
              <Select
                placeholder='请选择'
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button type='primary' className='w-100'>
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
        pagination={{ position: ['bottomRight'] }}
        scroll={{ x: 'max-content' }}
      />
    </PageContent>
  )
}
