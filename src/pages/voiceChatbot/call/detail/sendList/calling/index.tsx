import { useState, useEffect } from 'react'
import { Flex, Table, Button, Form, Select, Space } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { getChatbot, getHistory, exportRcsHistory } from '@/api'
import { API } from 'apis'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'

import Nav from '../../nav'
import SendNav from '../nav'

type T = {
  id: string
}

// interface DataType extends API.GetHistoryItems {}
interface DataType extends T {}

export default function Fn() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([
    {
      id: '123',
    },
  ])

  const getList = async () => {}

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    if (page == 1) {
      getList()
    } else {
      setPage(1)
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

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号',
      fixed: true,
      width: 160,
      className: 'paddingL20',
      render: (_, record) => <div className='fw-500'>13112312332</div>,
    },
    {
      title: '未外呼原因',
      width: 140,
      render: (_, record) => (
        <Space className='w-100' size={0}>
          原因
        </Space>
      ),
    },
    {
      title: '外呼次数',
      width: 100,
      render: (_, record) => <div>20</div>,
    },
  ]
  return (
    <div>
      <Nav />
      <SendNav />
      <Form
        form={form}
        className='m-t-24'
        name='calling-form'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}>
        <Flex justify='space-between' align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='未外呼原因' name='chatbot' className='m-b-0'>
            <Select
              placeholder='全部类型'
              allowClear
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              options={[]}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={search}>
              导出未外呼号码
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table
        loading={loading}
        className='theme-cell reset-table m-t-24'
        columns={columns}
        dataSource={tableData}
        rowKey='id'
        pagination={{
          defaultPageSize: limit,
          position: ['bottomRight'],
          current: page,
          pageSize: limit,
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50],
          total: total,
          showTotal: (total) => `共 ${total} 条`,
          onChange: () => {},
        }}
        scroll={{ x: 'fit-content' }}
      />
    </div>
  )
}
