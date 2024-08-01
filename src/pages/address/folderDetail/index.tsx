import { useEffect, useState, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Flex,
  Pagination,
  Popconfirm,
  Dropdown,
  Space,
  Image,
  Divider,
  App,
  Tooltip,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import ACopy from '@/components/aCopy'
import EditAddressDialog from '../default/cerateAddress/index'
import MoveAddressDialog from './moveAddressDialog/index'
import MoveinAddressDialog from './moveInDialog/index'
import { API } from 'apis'
import {
  getFolderDetail,
  deleteAddressbooks,
  updateAddressBookTag,
  moveAddressBook,
  clearFolderAddress,
} from '@/api'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { usePoint } from '@/hooks'
import {
  TagsColorEnum,
  tags,
  tags_key,
  getFolderPath,
  getAddressPath,
} from '@/pages/address/type'
import { useStateStore } from '../reducer'

import './index.scss'

interface DataType extends API.GetFolderDetailItems {}

const { Search } = Input

const sortOptions = [
  { label: '创建日期降序', value: 'create_desc' },
  { label: '创建日期升序', value: 'create_asc' },
  { label: '联系人数降序', value: 'address_desc' },
  { label: '联系人数升序', value: 'address_asc' },
]

export default function Fn() {
  const state = useStateStore()
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title')
  const tag = searchParams.get('tag')

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()

  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [openMoveInModal, setOpenMoveInModal] = useState(false)

  const [singleId, setSingleId] = useState() //单个地址簿id
  const [isSingle, setIsSingle] = useState(false) //单独移动地址簿
  const [allId, setAllId] = useState([]) //所有id
  const formValuesRef = useRef({}) // 暂存搜索条件

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取地址簿
  const getList = async () => {
    setLoading(true)
    setSelectedRowKeys([])
    const values = await form.getFieldsValue()
    formValuesRef.current = { ...formValuesRef.current, ...values } // 批量操作后，搜索条件被隐藏获取不到数据。解决该问题
    try {
      const res = await getFolderDetail({
        ...formValuesRef.current,
        id: id,
        type: 1,
        search_type: 'all',
        page: currentPage,
      })
      setAddressList(res.addressbook)
      setTotal(res.rows)
      setLoading(false)
      let arr = []
      res.addressbook.forEach((item, index) => {
        arr.push(item.id)
      })
      setAllId(arr)
    } catch (error) {
      setLoading(false)
    }
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    // setpageSize(pageSize)
  }
  const editItem = (isEdit, item) => {
    setOpenCreateModal(true)
    setEditData(item)
  }

  // // 删除地址簿
  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressbooks({ id })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }
  // 清空文件夹
  const cleanAllFolders = async () => {
    try {
      const res = await clearFolderAddress({
        ids: allId.join(','),
        type: 1,
        folder: id,
      })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getList()
      }
    } catch (error) {}
  }

  // 设置标签
  const setTag = async (e) => {
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

  // 移出文件夹
  const moveOutAddress = async (itemId) => {
    // 移出
    try {
      let params = {
        ids: itemId,
        folder: id,
        type: 1,
        flag: 2,
      }
      const res = await moveAddressBook(params)
      if (res.status == 'success') {
        message.success('移出成功')
        getList()
      }
    } catch (error) {}
  }
  // 移动文件夹
  const moveOtherFolder = (itemId) => {
    setOpenMoveModal(true)
    setSingleId(itemId)
    setIsSingle(true)
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
            src={getAddressPath(Number(TagsColorEnum[record.tag]))}
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
          to={`/console/${state.rootPath}/address/detail/${record.id}?name=${
            record.name
          }&tag=${TagsColorEnum[record.tag]}&folder=${id}`}>
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
              onClick={() => editItem(true, record)}>
              <i className='icon iconfont icon-input'></i>
            </div>
          </Tooltip>
          <Tooltip title='移动到其他文件夹' placement='bottom'>
            <div
              className='text-color g-pointer'
              onClick={() => moveOtherFolder(record.id)}>
              <i className='icon iconfont icon-move'></i>
            </div>
          </Tooltip>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定移出该地址簿吗？'
            onConfirm={() => moveOutAddress(record.id)}
            okText='确定'
            cancelText='取消'
            zIndex={100}>
            <Tooltip title='移出文件夹' placement='bottom' zIndex={99}>
              <div className='text-color g-pointer'>
                <i className='icon iconfont icon-moveout'></i>
              </div>
            </Tooltip>
          </Popconfirm>
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
    <div className='address-folder-detail'>
      <Flex justify='space-between' align='flex-end' wrap='wrap' gap={12}>
        <Form
          name='address-book-list-form'
          data-class='address-book-list'
          form={form}
          layout='vertical'
          initialValues={{
            keywords: '',
            tag: 'all',
            order_by: 'create_desc',
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
              <Search placeholder='地址簿名称/ID' onSearch={() => getList()} />
            </Form.Item>
          </Flex>
        </Form>

        <Button
          type='primary'
          className='fx-start-center'
          icon={<i className='icon iconfont icon-jia'></i>}
          onClick={() => setOpenMoveInModal(true)}>
          移入地址簿
        </Button>
      </Flex>
      <Flex
        justify='space-between'
        align='center'
        wrap='wrap'
        className='g-radius-4 p-x-16 p-y-12 m-t-24'
        gap={12}
        style={{ background: 'var(--table-bg)' }}>
        <Space align='center'>
          <Image src={getFolderPath(Number(tag))} preview={false} height={48} />
          <span className='fn16'>{title}</span>
        </Space>
        <Space align='center' size={12} wrap>
          <div
            className={`color g-pointer ${
              selectedRowKeys.length == 0 ? 'disabled' : ''
            }`}
            onClick={moveFolder}>
            <i className='icon iconfont icon-move m-r-8'></i>
            移动到文件夹
          </div>
          <Divider type='vertical' style={{ height: 16 }} />
          <Dropdown
            trigger={['click']}
            menu={{
              items: tags_key,
              selectable: true,
              onClick: setTag,
            }}>
            <div
              className={`color g-pointer ${
                selectedRowKeys.length == 0 ? 'disabled' : ''
              }`}>
              <i className='icon iconfont icon-tag m-r-8'></i>
              设置标签
            </div>
          </Dropdown>
          <Divider type='vertical' />
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定清空文件夹吗？'
            onConfirm={cleanAllFolders}
            okText='确定'
            cancelText='取消'>
            <Space
              align='center'
              size={4}
              className='error-color g-pointer handle-text'>
              <i className='icon iconfont icon-saozhou'></i>
              <span>清空文件夹</span>
            </Space>
          </Popconfirm>
          <Divider type='vertical' />
          <div
            onClick={() => nav(-1)}
            className='g-pointer handle-text'
            title='返回'>
            <i className='icon iconfont icon-fanhui primary-color fn14'></i>
          </div>
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

      <EditAddressDialog
        isEdit={true}
        open={openCreateModal}
        editData={editData}
        onCancel={() => setOpenCreateModal(false)}
        onSearch={getList}
      />
      {/*  移出*/}
      <MoveAddressDialog
        oldFolderId={id}
        singleId={singleId}
        isSingle={isSingle}
        ids={selectedRowKeys}
        open={openMoveModal}
        onSearch={getList}
        onCancel={() => setOpenMoveModal(false)}
      />

      {/* 移入移出 */}
      <MoveinAddressDialog
        folderId={id}
        folderTitle={title}
        open={openMoveInModal}
        foldetAddressList={addressList}
        onCancel={() => setOpenMoveInModal(false)}
        onSearch={getList}
      />
    </div>
  )
}
