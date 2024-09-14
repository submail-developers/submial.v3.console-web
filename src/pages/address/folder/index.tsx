import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Popconfirm,
  Tooltip,
  Pagination,
  App,
  Flex,
  Dropdown,
  Checkbox,
  Space,
  Image,
  Divider,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import ACopy from '@/components/aCopy'
import { getFolderPath, tags, tags_key } from '@/pages/address/type'
import {
  getAddressbooksFolder,
  deleteAddressbooksFolder,
  batchDeleteFolder,
  batchUpdateFolderTag,
} from '@/api'
import CerateFloder from './createFolder'
import { useStateStore } from '../reducer'
import { usePoint } from '@/hooks'
import { API } from 'apis'

import './index.scss'

interface DataType extends API.GetMobAddressbooksFolderItems {}

const { Option } = Select
const { Search } = Input

const sortOptions = [
  { label: '最后编辑', value: 'update' },
  { label: '创建日期', value: 'create' },
  { label: '文件数升序', value: 'vol-asc' },
  { label: '文件数降序', value: 'vol-desc' },
]

export default function Fn() {
  const state = useStateStore()
  const point = usePoint('lg')
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressFolderList, setAddressFolderList] = useState([])
  const [editData, setEditData] = useState()

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取地址簿文件夹
  const getList = async () => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
      const formValues = await form.getFieldsValue()
      let params = {
        ...formValues,
        id: '',
        type: 1,
        search_type: 'all',
        page: currentPage,
      }
      const res = await getAddressbooksFolder(params)
      setAddressFolderList(res.folders)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const createFolder = () => {
    setIsEditMode(false)
    setOpenCreateModal(true)
  }
  // 编辑
  const editFolder = (item) => {
    setOpenCreateModal(true)
    setIsEditMode(true)
    setEditData(item)
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }
  // 单个删除
  const deleteFolder = async (id) => {
    try {
      const res = await deleteAddressbooksFolder({
        id,
        type: 1,
      })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }
  // 批量删除
  const delFolders = async () => {
    try {
      const res = await batchDeleteFolder({
        id: selectedRowKeys.join(','),
        type: 1,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }
  // 批量设置标签
  const editTags = async (e) => {
    try {
      let params = {
        id: selectedRowKeys.join(','),
        type: 1,
        tag: e.key,
      }
      const res = await batchUpdateFolderTag(params)
      if ((res.status = 'success')) {
        message.success('设置成功')
        getList()
      }
    } catch (error) {}
  }
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {},
      onDoubleClick: () => {
        if (selectedRowKeys.includes(record.id)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.id),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.id])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: !point ? 32 : 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '标签',
      width: 50,
      render: (_, record) => (
        <div>
          <Image
            height={40}
            src={getFolderPath(Number(record.tag))}
            preview={false}
          />
        </div>
      ),
    },
    {
      title: '文件夹名称',
      dataIndex: 'name',
      fixed: true,
      className: 'paddingL20',
      width: 200,
      render: (_, record) => (
        <Link
          to={`/console/${state.rootPath}/address/folder/detail/${record.id}?title=${record.title}&tag=${record.tag}`}>
          {record.title}
        </Link>
      ),
    },
    {
      title: '地址簿数量',
      width: 120,
      render: (_, record) => <>{Number(record.num).toLocaleString()}</>,
    },
    {
      title: 'ID',
      width: 100,
      render: (_, record) => (
        <div style={{ position: 'relative', width: 'fit-content' }}>
          【{record.sign}】
          <ACopy text={record.sign} />
        </div>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'create_at',
      width: 180,
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space size={24}>
          <Tooltip title='编辑' placement='bottom'>
            <div
              className='text-color g-pointer'
              onClick={() => editFolder(record)}>
              <i className='icon iconfont icon-input'></i>
            </div>
          </Tooltip>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除该地址簿吗？'
            onConfirm={() => deleteFolder(record.id)}
            okText='确定'
            cancelText='取消'
            zIndex={100}>
            <Tooltip title='删除' placement='bottom' zIndex={99}>
              <div className='text-color g-pointer'>
                <i className='icon iconfont icon-shanchu'></i>
              </div>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getList()
  }, [currentPage, pageSize])

  return (
    <>
      <div className='address-folder-list'>
        <Flex justify='space-between' align='flex-end' wrap='wrap' gap={16}>
          <Form
            name='address-book-list-form'
            data-class='address-book-list'
            form={form}
            layout='vertical'
            initialValues={{
              keywords: '',
              search_type: 'all',
              order_by: 'update',
              tag: 'all',
            }}
            autoComplete='off'>
            <Flex align='flex-end' gap={16} wrap='wrap'>
              <Form.Item name='tag' label='标签类型' className='m-b-0'>
                <Select
                  placeholder='全部标签'
                  onChange={() => getList()}
                  popupMatchSelectWidth={140}
                  style={{ width: 140 }}
                  options={[
                    { label: '全部标签', value: 'all' },
                    ...tags,
                  ]}></Select>
              </Form.Item>
              <Form.Item name='order_by' label='排序' className='m-b-0'>
                <Select
                  placeholder='选择排序'
                  onChange={() => getList()}
                  popupMatchSelectWidth={140}
                  style={{ width: 140 }}
                  options={sortOptions}></Select>
              </Form.Item>
              <Form.Item name='keywords' label='搜索' className='m-b-0'>
                <Search
                  placeholder='地址簿名称/ID'
                  onSearch={() => getList()}
                />
              </Form.Item>
            </Flex>
          </Form>

          <Button
            type='primary'
            className='fx-start-center'
            icon={<i className='icon iconfont icon-jia'></i>}
            onClick={() => createFolder()}>
            创建文件夹
          </Button>
        </Flex>
        <Flex
          justify='space-between'
          align='center'
          wrap='wrap'
          gap={12}
          className='g-radius-4 p-x-16 p-y-12 m-t-24'
          style={{ background: 'var(--table-bg)' }}>
          <Space align='center'>
            <Image
              src={getFolderPath(Number('4'))}
              preview={false}
              height={40}
            />
            <span className='fn16'>地址簿文件夹</span>
          </Space>
          <Space align='center' size={12}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: tags_key,
                selectable: true,
                onClick: editTags,
              }}>
              <div
                className={`color g-pointer ${
                  selectedRowKeys.length == 0 ? 'disabled' : ''
                }`}>
                <i className='icon iconfont icon-tag m-r-8'></i>
                设置标签
              </div>
            </Dropdown>
            <Divider type='vertical' style={{ height: 16 }} />
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选择的文件夹吗？'
              onConfirm={delFolders}
              disabled={selectedRowKeys.length == 0}
              okText='确定'
              cancelText='取消'
              zIndex={100}>
              <div
                className={`error-color g-pointer ${
                  selectedRowKeys.length == 0 ? 'disabled' : ''
                }`}>
                <i className='icon iconfont icon-shanchu m-r-8'></i>
                删除
              </div>
            </Popconfirm>
          </Space>
        </Flex>
        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={addressFolderList}
          rowKey={'id'}
          sticky
          pagination={false}
          scroll={{ x: 'fit-content' }}
          onRow={onRow}
          rowSelection={rowSelection}
        />

        <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            showSizeChanger={false}
            total={total}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
        </Flex>
        <CerateFloder
          isEdit={isEditMode}
          open={openCreateModal}
          editData={editData}
          onOk={() => setOpenCreateModal(false)}
          onCancel={() => setOpenCreateModal(false)}
          onSearch={getList}
        />
      </div>
    </>
  )
}
