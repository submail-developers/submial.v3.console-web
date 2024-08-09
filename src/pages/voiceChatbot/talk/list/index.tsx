import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Flex,
  Table,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Input,
  Tooltip,
  Space,
  Popconfirm,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { usePoint } from '@/hooks'
import PageContent from '@/components/pageContent'
import CreateModal from './createModal'
import { getTalkToken, getTalkList, delTalkItem } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/history.png'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'

import './index.scss'
import ACopy from '@/components/aCopy'

interface DataType extends API.GetTalkListItem {}

export default function Fn() {
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [open, setopen] = useState(false)

  const getList = async () => {
    setLoading(true)
    try {
      const formValues = form.getFieldsValue()
      let params = {
        page: page,
        limit: limit,
        ...formValues,
      }

      const res = await getTalkList(params)
      setTableData(res.data)
      setTotal(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const delEvent = async (ids) => {
    try {
      const res = await delTalkItem({ ids })
      if (res.status == 'success') {
        getList()
      }
    } catch (error) {}
  }

  const onConfirm = (id: number) => {
    setopen(false)
    getList()
    nav(`/console/voiceChatbot/talk/edit/${id}/1`)
  }

  const changePageInfo = (page, pageSize) => {
    if (pageSize != limit) {
      setPage(1)
      setLimit(pageSize)
    } else {
      setPage(page)
    }
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    let changeKey = Object.keys(changedValues)[0]
    if (!['name'].includes(changeKey)) {
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

  const columns: ColumnsType<DataType> = [
    {
      title: '话术名称',
      fixed: true,
      width: 220,
      className: 'paddingL20 tag-color',
      render: (_, record) => (
        <div style={{ position: 'relative' }}>
          {record.name}
          <ACopy text={record.name} />
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      width: 180,
    },
    {
      title: '话术类型',
      width: 120,
      render: (_, record) => (
        <>
          {record.type == 1 ? (
            <span className='send-type'>普通话术</span>
          ) : (
            <span className='send-type type2'>动态话术</span>
          )}
        </>
      ),
    },
    {
      title: '当前状态',
      width: 120,
      render: (_, record) => (
        <>
          {record.status == 3 ? (
            <span className='gray-color-sub'>待发布</span>
          ) : (
            <span className='success-color'>已发布</span>
          )}
        </>
      ),
    },
    {
      title: '操作',
      width: 280,
      render: (_, record) => (
        <>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to={`/console/voiceChatbot/talk/edit/${record.id}/0`}>
              查看
            </NavLink>
          </Button>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to={`/console/voiceChatbot/talk/edit/${record.id}/1`}>
              编辑
            </NavLink>
          </Button>
          <Button type='link' style={{ paddingLeft: 0 }}>
            导出
          </Button>

          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除该地址簿吗？'
            onConfirm={() => delEvent(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link' style={{ paddingLeft: 0 }}>
              删除
            </Button>
          </Popconfirm>
          <Button type='link' style={{ paddingLeft: 0 }}>
            复制
          </Button>
          <Button type='link' style={{ paddingLeft: 0 }}>
            锁定
          </Button>
        </>
      ),
    },
  ]

  return (
    <PageContent extClass='flow-list'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>话术库</div>
        <Button
          type='primary'
          onClick={() => setopen(true)}
          icon={<PlusOutlined className='fn14' rev={undefined} />}>
          创建话术
        </Button>
      </Flex>
      <Divider />
      <Form
        form={form}
        name='flow-list-form'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='话术名称' name='name' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={search}>
              查询
            </Button>
          </Form.Item>
        </Flex>

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
            onChange: changePageInfo,
          }}
          scroll={{ x: 'fit-content' }}
        />
      </Form>
      <CreateModal
        open={open}
        onCancel={() => setopen(false)}
        onConfirm={onConfirm}
      />
    </PageContent>
  )
}
