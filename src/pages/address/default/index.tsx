import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Flex,
  Pagination,
  Popconfirm,
  Dropdown,
  Tooltip,
  Space,
  Image,
  Divider,
  Table,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ACopy from '@/components/aCopy'
import CerateAddress from './cerateAddress/index'
import MoveToFolder from './moveToFolder/index'

import { Link } from 'react-router-dom'
import { usePoint } from '@/hooks'
import { useStateStore } from '../reducer'
import { getAddressPath, tags, tags_key } from '@/pages/address/type'
import { API } from 'apis'
import {
  getMobAddressbooks,
  deleteAddressbooks,
  updateAddressBookTag,
} from '@/api'
import './index.scss'

interface DataType extends API.GetMobAddressbooksItems {}

const { Search } = Input
const { Option } = Select

const sortOptions = [
  { label: '创建日期降序', value: 'create_desc' },
  { label: '创建日期升序', value: 'create_ascall' },
  { label: '联系人数降序', value: 'address_desc' },
  { label: '联系人数升序', value: 'address_asc' },
]

export default function Fn() {
  const state = useStateStore()
  const { message } = App.useApp()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(100)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()
  const [loading, setLoading] = useState(false)

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [singleId, setSingleId] = useState() //单个地址簿id
  const [isSingle, setIsSingle] = useState(false) //单独移动地址簿

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取地址簿
  const getList = async () => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbooks({
        ...formValues,
        page: currentPage,
        // limit: pageSize,
      })
      setAddressList(res.addressbooks)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    // setpageSize(pageSize)
  }
  const showModal = (isEdit, item) => {
    setIsEditMode(isEdit)
    setOpenCreateModal(true)
    setEditData(item)
  }

  const handleCancel = () => {
    setOpenCreateModal(false)
  }

  const handleSearch = () => {
    setLoading(true)
    getList()
  }

  // 删除地址簿
  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressbooks({ id })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }

  const edit = async (e) => {
    try {
      let params = {
        ids: selectedRowKeys.join(','),
        type: 1,
        tag: e.key,
      }
      const res = await updateAddressBookTag(params)
      if ((res.status = 'success')) {
        message.success('设置成功')
        getList()
      }
    } catch (error) {}
  }

  // 打开单个地址簿 移动地址簿弹窗
  const openSingleAddressModal = (id) => {
    setSingleId(id)
    setIsSingle(true)
    setOpenMoveModal(true)
  }
  // 批量操作--移动文件夹
  const moveFolder = () => {
    setIsSingle(false)
    setOpenMoveModal(true)
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
            src={getAddressPath(Number(record.tag))}
            preview={false}
          />
        </div>
      ),
    },
    {
      title: '地址簿名称',
      dataIndex: 'name',
      fixed: true,
      className: 'paddingL20',
      width: 200,
      render: (_, record) => (
        <Link
          to={`/console/${state.rootPath}/address/detail/${record.id}?name=${record.name}&tag=${record.tag}&folder=${record.folder}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: '联系人数量',
      width: 120,
      render: (_, record) => <>{Number(record.address).toLocaleString()}</>,
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
      dataIndex: 'datetime',
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
              onClick={() => showModal(true, record)}>
              <i className='icon iconfont icon-input'></i>
            </div>
          </Tooltip>
          <Tooltip title='移入文件夹' placement='bottom'>
            <div
              className='text-color g-pointer'
              onClick={() => openSingleAddressModal(record.id)}>
              <i className='icon iconfont icon-move'></i>
            </div>
          </Tooltip>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除该地址簿吗？'
            onConfirm={() => deleteAddress(record.id)}
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
  }, [currentPage])

  return (
    <div className='address-default'>
      <Flex justify='space-between' align='flex-end' wrap='wrap' gap={12}>
        <Form
          name='address-book-list-form'
          data-class='address-book-list'
          form={form}
          layout='vertical'
          initialValues={{
            keywords: '',
            search_type: 'all',
            order_by: 'create_desc',
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
              <Search placeholder='地址簿名称/ID' onSearch={handleSearch} />
            </Form.Item>
          </Flex>
        </Form>

        <Button
          type='primary'
          className='fx-start-center'
          icon={<i className='icon iconfont icon-jia'></i>}
          onClick={(e) => showModal(false, '')}>
          创建地址簿
        </Button>
      </Flex>
      <Flex
        justify='space-between'
        align='center'
        wrap='wrap'
        className='g-radius-4 p-x-16 p-y-12 m-t-24'
        style={{ background: 'var(--table-bg)' }}>
        <Space align='center'>
          <Image
            src={getAddressPath(Number('4'))}
            preview={false}
            height={40}
          />
          <span className='fn16'>地址簿</span>
        </Space>
        <Space align='center' size={12}>
          <div
            className={`color g-pointer ${
              selectedRowKeys.length == 0 ? 'disabled' : ''
            }`}
            onClick={moveFolder}>
            <i className='icon iconfont icon-move m-r-8'></i>
            移入文件夹
          </div>
          <Divider type='vertical' style={{ height: 16 }} />
          <Dropdown
            trigger={['click']}
            menu={{
              items: tags_key,
              selectable: true,
              onClick: edit,
            }}>
            <div
              className={`color g-pointer ${
                selectedRowKeys.length == 0 ? 'disabled' : ''
              }`}>
              <i className='icon iconfont icon-tag m-r-8'></i>
              设置标签
            </div>
          </Dropdown>
        </Space>
      </Flex>
      <Table
        loading={loading}
        className='theme-cell reset-table m-t-24'
        columns={columns}
        dataSource={addressList}
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
      <CerateAddress
        isEdit={isEditMode}
        open={openCreateModal}
        editData={editData}
        onCancel={handleCancel}
        onSearch={getList}
      />

      <MoveToFolder
        singleId={singleId}
        isSingle={isSingle}
        ids={selectedRowKeys}
        open={openMoveModal}
        // FolderList={addressFolderList}
        onSearch={getList}
        onCancel={() => setOpenMoveModal(false)}
      />
    </div>
  )
}
