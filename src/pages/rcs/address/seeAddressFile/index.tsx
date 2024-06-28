import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Flex,
  Pagination,
  Popconfirm,
  Switch,
  Checkbox,
  Dropdown,
  Space,
  Image,
  Divider,
  Spin,
  Empty,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import ACopy from '@/components/aCopy'
import redImg from '@/assets/rcs/address/address_red.png'
import purpleImg from '@/assets/rcs/address/address_purple.png'
import cyanImg from '@/assets/rcs/address/address_cyan.png'
import blueImg from '@/assets/rcs/address/address_blue.png'
import greenImg from '@/assets/rcs/address/address_green.png'
import yellowImg from '@/assets/rcs/address/address_yellow.png'
import EditAddressDialog from '../addressBook/cerateAddressDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import MoveinAddressDialog from './seeAddressFileDialog/index'
import {
  getFolderDetail,
  getMobAddressbooks,
  deleteAddressbooks,
  getAddressbooksFolder,
  updateAddressBookTag,
  moveAddressBook,
  clearFolderAddress,
} from '@/api'
import { API } from 'apis'
import type { SearchProps } from 'antd/es/input/Search'
import './index.scss'
import { message } from '@/components/staticFn/staticFn'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { getFolderPath } from '../type'
import { usePoint } from '@/hooks'

const { Option } = Select

interface Props {
  onchildrenMethod: (info: any) => void
  folderInfo: any
}

const addresssIcon = {
  'tag-red': redImg,
  'tag-purple': purpleImg,
  'tag-cyan': cyanImg,
  'tag-blue': blueImg,
  'tag-green': greenImg,
  'tag-yellow': yellowImg,
  'tag-none': blueImg,
}
const addresssIcon2 = {
  'tag-red': '1',
  'tag-purple': '2',
  'tag-cyan': '3',
  'tag-blue': '4',
  'tag-green': '5',
  'tag-yellow': '6',
}
const { Search } = Input

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()

  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [openMoveInModal, setOpenMoveInModal] = useState(false)

  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedList, setselectedList] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group

  const [isActive, setIsActive] = useState([])
  const [isAllActive, setIsAllActive] = useState(false)
  const [addressFolderList, setAddressFolderList] = useState([])
  const [folderTotal, setFolderTotal] = useState<number>(0)

  const [singleId, setSingleId] = useState() //单个地址簿id
  const [isSingle, setIsSingle] = useState(false) //单独移动地址簿
  const [allId, setAllId] = useState([]) //所有id
  const { id } = useParams()
  const [folderId, setFolderId] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const title = searchParams.get('title')
  const tag = searchParams.get('tag')

  // 获取地址簿
  const getAddressList = async () => {
    try {
      const res = await getFolderDetail({
        id: id,
        type: 1,
        tag: 'all',
        order_by: 'create_asc',
        keywords: '',
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
  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    try {
      const res = await getAddressbooksFolder({
        id: '',
        type: 1,
        page: currentPage,
        tag: 'all',
        order_by: 'update',
        search_type: 'all',
        keywords: '',
      })
      setAddressFolderList(res.folders)
      setFolderTotal(res.rows)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setFolderId(id)
    getAddressList()
    getAddressFolderList()
  }, [currentPage])
  useEffect(() => {
    setLoading(true)
  }, [])

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
  const handleCancleMoveIn = () => {
    setOpenMoveInModal(false)
  }

  const handleSearch = () => {
    getAddressList()
  }
  // // 删除地址簿
  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressbooks({ id })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getAddressList()
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
        getAddressList()
      }
    } catch (error) {}
  }
  //
  const handelSwitchChange = (checked: boolean) => {
    setIsVisible(checked)
  }

  const options = [
    { label: '全部标签', value: 'all', color: '#1764ff' },
    { label: '默认标签', value: 'tag-blue', color: '#1764ff' },
    { label: '红色标签', value: 'tag-red', color: '#ff4446' },
    { label: '紫色标签', value: 'tag-purple', color: '#6f42c1' },
    { label: '青色标签', value: 'tag-cyan', color: '#17a2b8' },
    { label: '绿色标签', value: 'tag-green', color: '#17c13d' },
    { label: '黄色标签', value: 'tag-yellow', color: '#ffba00' },
  ]
  const order = [
    { label: '创建日期升序', value: 'create_ascall' },
    { label: '创建日期降序', value: 'create_desc' },
    { label: '联系人数升序', value: 'address_asc' },
    { label: '联系人数降序', value: 'address_desc' },
  ]

  useEffect(() => {
    let hasChecked = false
    let checkedAll = true
    if (addressList.length === 0 || selectedList.length == 0) {
      setIndeterminate(false)
      setCheckAll(false)
      return
    }
    addressList.forEach((item) => {
      if (selectedList.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
    setIndeterminate(!checkedAll && hasChecked)
    setCheckAll(checkedAll)
  }, [addressList, selectedList])

  // 单个checkbox点击
  const onChange = (checkedValues: string[]) => {
    setIsActive(checkedValues)
    setselectedList(checkedValues)
  }
  // 全选点击
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setIsAllActive(e.target.checked)
    } else {
      setIsAllActive(false)
    }
    setCheckAll(e.target.checked)
    if (e.target.checked) {
      let _select = []
      addressList.forEach((item) => {
        _select.push(item.id)
      })
      setselectedList(_select)
    } else {
      setselectedList([])
    }
  }

  const items = [
    { label: '全部标签', key: 'all' },
    { label: '无标签', key: 'tag-blue' },
    { label: '红色', key: 'tag-red' },
    { label: '紫色', key: 'tag-purple' },
    { label: '青色', key: 'tag-cyan' },
    { label: '绿色', key: 'tag-green' },
    { label: '黄色', key: 'tag-yellow' },
  ]

  const edit = async (e) => {
    try {
      let params = {
        ids: selectedList.join(','),
        type: 1,
        tag: e.key,
      }
      const res = await updateAddressBookTag(params)
      if ((res.status = 'success')) {
        message.success('设置成功')
        getAddressList()
      }
    } catch (error) {}
  }

  const items2 = [
    {
      label: '移出文件夹',
      key: '0',
    },
    {
      label: '移动到文件夹',
      key: '1',
    },
  ]
  const edit2 = async (e, ids) => {
    if (e.key == '0') {
      // 移出
      try {
        let params = {
          ids: ids,
          folder: id,
          type: 1,
          flag: 2,
        }
        const res = await moveAddressBook(params)
        if (res.status == 'success') {
          message.success('移出成功')
          getAddressList()
        }
      } catch (error) {}
    } else {
      setOpenMoveModal(true)
      setSingleId(ids)
      setIsSingle(true)
    }
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
  const toDetail = (item) => {
    if (isVisible) return
    nav(
      `/console/rcs/address/address/detail/${
        item.id
      }?name=folder&folderId=${folderId}&title=${item.name}&tag=${
        addresssIcon2[item.tag]
      }&oldTitle=${title}&oldTag=${tag}`,
    )
  }
  const stopEvent = (e) => {
    e.stopPropagation()
  }

  // 返回
  const toBack = () => {
    nav('/console/rcs/address/folder')
  }

  return (
    <>
      <Form
        name='address-folder-list-form'
        data-class='address-folder-list'
        form={form}
        layout='vertical'
        initialValues={{
          keyword: '',
          search_type: 'all',
          order_by: 'create_desc',
        }}
        autoComplete='off'>
        <Row gutter={6}>
          <Col span={24}>
            <Row justify='space-between' align='bottom'>
              <Col span={12} xl={8}>
                <Form.Item name='keyword' label='名称' className='m-b-0'>
                  <Search
                    placeholder='地址簿名称/ID'
                    allowClear
                    onSearch={handleSearch}
                  />
                </Form.Item>
              </Col>
              <Col span={12} xl={8} className='fx-x-end'>
                <Button
                  type='primary'
                  className='fx-start-center'
                  htmlType='submit'
                  icon={<i className='icon iconfont icon-jia'></i>}
                  onClick={() => setOpenMoveInModal(true)}>
                  移入地址簿
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24} className='m-t-24'>
            <Row
              className='p-y-12 p-x-16 g-radius-4'
              style={{ background: '#f6f7f9' }}>
              <Col span={12} md={6}>
                <Space align='center'>
                  <Image
                    src={getFolderPath(Number(tag))}
                    preview={false}
                    height={48}
                  />
                  <span className='fn16'>{title}</span>
                </Space>
              </Col>
              <Col span={12} md={18}>
                <Flex
                  justify='flex-end'
                  align={`${point ? 'center' : 'flex-end'}`}
                  gap={8}
                  wrap='wrap'
                  className='h-100'
                  style={{ flexDirection: point ? 'row' : 'column' }}>
                  <Space
                    align='center'
                    size={12}
                    className={`${point ? '' : 'p-r-10'}`}>
                    <Switch
                      size='small'
                      defaultChecked={false}
                      onChange={handelSwitchChange}
                    />
                    <span>批量操作</span>
                  </Space>
                  {!isVisible && (
                    <>
                      {point && <Divider type='vertical' />}
                      <Space align='center' size={0}>
                        <i className='icon iconfont icon-tag primary-color'></i>
                        <Form.Item name='tag' label='' className='m-b-0'>
                          <Select
                            className='select-item'
                            placeholder='全部标签'
                            onChange={() => getAddressFolderList()}
                            popupMatchSelectWidth={120}>
                            {options.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Space>
                      {point && <Divider type='vertical' />}
                      <Space align='center' size={0}>
                        <i className='icon iconfont icon-paixu primary-color fn14'></i>
                        <Form.Item name='order_by' label='' className='m-b-0'>
                          <Select
                            className='select-item'
                            placeholder='选择排序'
                            onChange={() => getAddressFolderList()}
                            popupMatchSelectWidth={120}>
                            {order.map((order) => (
                              <Option key={order.value} value={order.value}>
                                {order.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Space>
                      {point && <Divider type='vertical' />}
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
                          className='error-color g-pointer'>
                          <i className='icon iconfont icon-saozhou'></i>
                          <span>清空文件夹</span>
                        </Space>
                      </Popconfirm>
                    </>
                  )}
                  {isVisible && (
                    <>
                      {point && <Divider type='vertical' />}
                      <Space align='center'>
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={onCheckAllChange}
                          checked={checkAll}>
                          全选
                        </Checkbox>
                      </Space>
                      {point && <Divider type='vertical' />}
                      <Space align='center'>
                        <div
                          onClick={moveFolder}
                          className={`primary-color handle-item ${
                            indeterminate || checkAll ? 'active' : 'disabled'
                          }`}>
                          <i className='icon iconfont icon-move m-r-8'></i>
                          移动到文件夹
                        </div>
                      </Space>

                      {point && <Divider type='vertical' />}
                      <Space align='center'>
                        <Form.Item name='tag' label='' className='m-b-0'>
                          <Dropdown
                            menu={{
                              items: items,
                              selectable: true,
                              onClick: edit,
                            }}>
                            <a
                              className={`
                              handle-item 
                              ${
                                indeterminate || checkAll
                                  ? 'active'
                                  : 'disabled'
                              }
                              `}>
                              <i className='icon iconfont icon-tag m-r-8'></i>
                              设置标签
                            </a>
                          </Dropdown>
                        </Form.Item>
                      </Space>
                    </>
                  )}
                  {point && <Divider type='vertical' />}
                  <div onClick={toBack} className='g-pointer' title='返回'>
                    <i className='icon iconfont icon-fanhui primary-color fn14'></i>
                  </div>
                </Flex>
              </Col>
            </Row>
          </Col>
        </Row>
        <CheckboxGroup
          style={{ width: '100%', marginTop: '10px' }}
          value={selectedList}
          onChange={onChange}>
          <Row gutter={[20, 16]} style={{ marginTop: '24px' }}>
            {addressList.map((item) => (
              <Col span={24} lg={12} xl={12} xxl={6} key={item.id}>
                <div className='address-book-item'>
                  <div>
                    <div className='trapezoid'>
                      <ACopy text={item.sign} />
                      <IDIcon />
                      <div className='sign'>{item.sign}</div>
                    </div>
                  </div>

                  <div
                    className={`book-list ${isVisible ? '' : 'g-pointer'}`}
                    onClick={() => toDetail(item)}>
                    <div className='fx-y-center'>
                      <div>
                        <img src={addresssIcon[item.tag]} alt='' />
                      </div>

                      <div className='to-detail'>
                        <div className='fn18'>{item.name}</div>
                        <div style={{ marginTop: '10px' }}>
                          <span className='num-p'>{item.address}</span> 个联系人
                        </div>
                      </div>
                    </div>
                    {isVisible ? (
                      <Checkbox
                        value={item.id}
                        className='choose-address fx-x-end'
                        onClick={stopEvent}>
                        选择
                      </Checkbox>
                    ) : (
                      <div className='fx-x-end handle-item' onClick={stopEvent}>
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: items2,
                            selectable: true,
                            onClick: (e) => edit2(e, item.id),
                          }}>
                          <Button className='fx-center-center'>
                            <i className='icon iconfont icon-dots fn14'></i>
                          </Button>
                        </Dropdown>

                        <Button
                          onClick={() => showModal(true, item)}
                          className='fx-center-center'>
                          <i className='icon iconfont icon-input'></i>
                        </Button>
                        <Popconfirm
                          placement='left'
                          title='警告'
                          description='确定删除该地址簿吗？'
                          onConfirm={() => deleteAddress(item.id)}
                          okText='确定'
                          cancelText='取消'>
                          <Button className='fx-center-center'>
                            <i className='icon iconfont icon-shanchu'></i>
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            ))}
            {addressList.length == 0 && !loading && (
              <Empty className='m-t-40' style={{ margin: '0 auto' }} />
            )}
            {loading && (
              <Col span={24} className='m-y-40 fx-center-center'>
                <Spin />
              </Col>
            )}
          </Row>
        </CheckboxGroup>

        <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            // pageSizeOptions={[]}
            showSizeChanger={false}
            total={total}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
        </Flex>
      </Form>

      <EditAddressDialog
        isEdit={isEditMode}
        open={openCreateModal}
        editData={editData}
        onCancel={handleCancel}
        onSearch={getAddressList}
      />
      {/*  移出*/}
      <MoveAddressDialog
        oldFolderId={id}
        singleId={singleId}
        isSingle={isSingle}
        ids={selectedList}
        open={openMoveModal}
        FolderList={addressFolderList}
        onSearch={getAddressList}
        onCancel={() => setOpenMoveModal(false)}
      />

      {/* 移入移出 */}
      <MoveinAddressDialog
        folderId={id}
        folderTitle={title}
        open={openMoveInModal}
        foldetAddressList={addressList}
        onCancel={handleCancleMoveIn}
        onSearch={getAddressList}
      />
    </>
  )
}
