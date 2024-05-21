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
} from 'antd'
import { IDIcon } from '@/components/aIcons'
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
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { getAddressPath, getFolderPath } from '../type'

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
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()

  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [openMoveInModal, setOpenMoveInModal] = useState(false)

  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])
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
      let list = res.addressbook.map((item, index) => {
        arr.push(item.id)
      })
      setAllId(arr)
    } catch (error) {
      setLoading(false)
      console.log(error)
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    setFolderId(id)
    getAddressList()
    getAddressFolderList()
  }, [currentPage, pageSize])

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
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
    { label: '无标签', value: 'tag-blue', color: '#1764ff' },
    { label: '红色', value: 'tag-red', color: '#ff4446' },
    { label: '紫色', value: 'tag-purple', color: '#6f42c1' },
    { label: '青色', value: 'tag-cyan', color: '#17a2b8' },
    { label: '绿色', value: 'tag-green', color: '#17c13d' },
    { label: '黄色', value: 'tag-yellow', color: '#ffba00' },
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
  const onChange = (checkedValues: CheckboxValueType[]) => {
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
      <Row gutter={16}>
        <Col
          xl={24}
          className='search-part fx-between-center'
          style={{ padding: '0' }}>
          <Form.Item name='keyword' label='名称'>
            <Search
              placeholder='i地址簿名称/ID'
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Form.Item>

          <Button
            type='primary'
            className='fx-start-center'
            htmlType='submit'
            loading={loading}
            onClick={() => setOpenMoveInModal(true)}>
            <i className='icon iconfont icon-jia'></i>
            &nbsp;&nbsp;移入地址簿
          </Button>
        </Col>
        <Col xl={24} className='set-item fx-start-center'>
          <div className='fx-start-center'>
            <img
              src={getFolderPath(Number(tag))}
              alt=''
              width='40'
              style={{ marginRight: '16px' }}
            />

            <span className='fn16'>{title}</span>
          </div>
          <div className='fx-start-center batch-set'>
            <div className='fx-start-center switch m-r-20'>
              <Switch defaultChecked={false} onChange={handelSwitchChange} />
              <span style={{ marginLeft: '8px' }}>批量操作</span>
            </div>

            {isVisible ? (
              <>
                <div className='m-r-20'>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}>
                    全选
                  </Checkbox>
                </div>

                <Form.Item name='move' label=''>
                  <div
                    className={`primary-color move-folder m-r-20 ${
                      indeterminate || checkAll ? 'active' : ''
                    }`}
                    onClick={moveFolder}>
                    <i className='icon iconfont icon-yidongwenjianjia p-r-8'></i>
                    移动到文件夹
                  </div>
                </Form.Item>

                <Form.Item name='tag' label=''>
                  <Dropdown
                    menu={{
                      items: items,
                      selectable: true,
                      onClick: edit,
                    }}>
                    <a
                      className={`set-ico ${
                        indeterminate || checkAll ? 'active' : ''
                      }`}>
                      <i className='icon iconfont icon-shezhibiaoqian p-r-8'></i>
                      设置标签
                    </a>
                  </Dropdown>
                </Form.Item>
                <div
                  onClick={toBack}
                  style={{ width: '60px' }}
                  className='bactch-item '>
                  <i className='icon iconfont icon-fanhuidizhibu primary-color p-l-24'></i>
                </div>
              </>
            ) : (
              <>
                <div className='fx-center-center batch-item1 m-r-10 m-l-10'>
                  <i className='icon iconfont icon-dizhibu1 primary-color'></i>
                  <Form.Item name='tag' label='' className='bactch-item'>
                    <Select placeholder='所有标签'>
                      {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='fx-center-center batch-item2 '>
                  <i className='icon iconfont icon-paixu primary-color fn14'></i>
                  <Form.Item name='order_by' label='' className='bactch-item'>
                    <Select placeholder='选择排序'>
                      {order.map((order) => (
                        <Option key={order.value} value={order.value}>
                          {order.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='clear-address p-x-16'>
                  <Popconfirm
                    placement='left'
                    title='警告'
                    description='确定清空文件夹吗？'
                    onConfirm={cleanAllFolders}
                    okText='确定'
                    cancelText='取消'>
                    <span>
                      <i className='icon iconfont icon-saozhou p-r-8'></i>
                      清空文件夹
                    </span>
                  </Popconfirm>
                </div>
                <div
                  onClick={toBack}
                  style={{ width: '60px' }}
                  className='bactch-item'>
                  <i className='icon iconfont icon-fanhuidizhibu primary-color'></i>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
      <CheckboxGroup
        style={{ width: '100%', marginTop: '10px' }}
        value={selectedList}
        onChange={onChange}>
        <Row gutter={[20, 16]} style={{ marginTop: '24px' }}>
          {addressList.map((item) => (
            <Col span={24} lg={12} xl={10} xxl={8} key={item.id}>
              <div className='address-book-item'>
                <div>
                  <div className='trapezoid'>
                    <IDIcon />
                    <div className='sign'>{item.sign}</div>
                  </div>
                </div>

                <div className='book-list' onClick={() => toDetail(item)}>
                  <div>
                    <img src={addresssIcon[item.tag]} alt='' />
                  </div>

                  <div className='to-detail'>
                    <div className='fn18'>{item.name}</div>
                    <div style={{ marginTop: '10px' }}>
                      <span className='num-p'>{item.address}</span> 个联系人
                    </div>
                  </div>
                  {isVisible ? (
                    <Checkbox
                      value={item.id}
                      className='choose-address'
                      onClick={stopEvent}>
                      选择
                    </Checkbox>
                  ) : (
                    <div
                      className='fx-between-center handle-item'
                      onClick={stopEvent}>
                      <Button>
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: items2,
                            selectable: true,
                            onClick: (e) => edit2(e, item.id),
                          }}>
                          <a>
                            <i className='icon iconfont icon-gengduocaozuo'></i>
                          </a>
                        </Dropdown>
                      </Button>

                      <Button onClick={() => showModal(true, item)}>
                        <i className='icon iconfont icon-input'></i>
                      </Button>
                      <Popconfirm
                        placement='left'
                        title='警告'
                        description='确定删除该地址簿吗？'
                        onConfirm={() => deleteAddress(item.id)}
                        okText='确定'
                        cancelText='取消'>
                        <Button>
                          <i className='icon iconfont icon-shanchu2'></i>
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>

      <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          defaultPageSize={pageSize}
          pageSizeOptions={[]}
          total={total}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}
        />
      </Flex>

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
        open={openMoveInModal}
        foldetAddressList={addressList}
        onCancel={handleCancleMoveIn}
        onSearch={getAddressList}
      />
    </Form>
  )
}
