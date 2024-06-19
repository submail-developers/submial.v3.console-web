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
  Tooltip,
  Space,
  Image,
  Divider,
  Spin,
  Empty,
} from 'antd'
import { IDIcon } from '@/components/aIcons'

import CerateAddressDialog from './cerateAddressDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import { useNavigate } from 'react-router-dom'
import { getAddressPath } from '../type'
import {
  getMobAddressbooks,
  deleteAddressbooks,
  updateAddressBookTag,
} from '@/api'
import { API } from 'apis'
import type { SearchProps } from 'antd/es/input/Search'
import './index.scss'
import { message } from '@/components/staticFn/staticFn'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { usePoint } from '@/hooks'

const { Option } = Select

interface Props {
  onchildrenMethod: (info: any) => void
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
  { label: '创建日期降序', value: 'create_desc' },
  { label: '创建日期升序', value: 'create_ascall' },
  { label: '联系人数降序', value: 'address_desc' },
  { label: '联系人数升序', value: 'address_asc' },
]

// 设置标签
const items = [
  { label: '全部标签', key: 'all' },
  { label: '无标签', key: 'tag-blue' },
  { label: '红色标签', key: 'tag-red' },
  { label: '紫色标签', key: 'tag-purple' },
  { label: '青色标签', key: 'tag-cyan' },
  { label: '绿色标签', key: 'tag-green' },
  { label: '黄色标签', key: 'tag-yellow' },
]

const { Search } = Input
export default function Fn() {
  const nav = useNavigate()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()
  const [loading, setLoading] = useState(false)

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedList, setselectedList] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group

  const [singleId, setSingleId] = useState() //单个地址簿id
  const [isSingle, setIsSingle] = useState(false) //单独移动地址簿

  const [exportconfirm, setExportconfirm] = useState('')

  // 获取地址簿
  const getAddressList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbooks({
        ...formValues,
        page: currentPage,
        limit: pageSize,
      })
      setExportconfirm(res.exportconfirm)
      setAddressList(res.addressbooks)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getAddressList()
  }, [currentPage, pageSize])

  useEffect(() => {
    setLoading(true)
  }, [])

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

  const handleSearch = () => {
    setLoading(true)
    getAddressList()
  }

  // 删除地址簿
  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressbooks({ id })
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
    setselectedList(checkedValues)
  }
  // 全选点击
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
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

  const toDetail = (item) => {
    if (isVisible) {
      return
    }
    nav(
      `/console/rcs/address/address/detail/${item.id}?title=${item.name}&tag=${item.tag}&exportconfirm=${exportconfirm}`,
    )
  }
  const stopEvent = (e) => {
    e.stopPropagation()
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
  // 复制
  const copy = async (sign) => {
    try {
      await navigator.clipboard.writeText(sign)
      message.success('复制成功')
    } catch (error) {
      message.success('复制失败')
    }
  }

  return (
    <Form
      name='address-book-list-form'
      data-class='address-book-list'
      form={form}
      layout='vertical'
      initialValues={{
        keyword: '',
        search_type: 'all',
        order_by: 'create_desc',
        tag: 'all',
      }}
      autoComplete='off'>
      <Row gutter={6}>
        <Col span={24}>
          <Row justify='space-between' align='bottom'>
            <Col span={12} xl={8}>
              <Form.Item name='keyword' label='名称' className='m-b-0'>
                <Search
                  className='w-100'
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
                onClick={(e) => showModal(false, '')}>
                创建地址簿
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
                  src={getAddressPath(Number('4'))}
                  preview={false}
                  height={48}
                />
                <span className='fn16'>地址簿</span>
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
                          onChange={() => getAddressList()}
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
                          onChange={() => getAddressList()}
                          popupMatchSelectWidth={120}>
                          {order.map((order) => (
                            <Option key={order.value} value={order.value}>
                              {order.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Space>
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
                        className={`primary-color handle-item ${
                          indeterminate || checkAll ? 'active' : 'disabled'
                        }`}
                        onClick={moveFolder}>
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
            <Col span={24} lg={12} xl={8} xxl={6} key={item.id}>
              <div className='address-book-item'>
                <div>
                  <div
                    className='trapezoid g-pointer'
                    onClick={() => copy(item.sign)}
                    title='点击复制'>
                    <IDIcon />
                    <div className='sign fn15'>{item.sign}</div>
                  </div>
                </div>
                <div
                  className={`book-list ${isVisible ? '' : 'g-pointer'}`}
                  onClick={() => toDetail(item)}>
                  <div className='fx-y-center'>
                    <div>
                      <img src={getAddressPath(Number(item.tag))} alt='' />
                    </div>
                    <div className='to-detail'>
                      <div className='fn16 fw-500'>{item.name}</div>
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
                      <Tooltip title='移入文件夹' placement='bottom'>
                        <Button onClick={() => openSingleAddressModal(item.id)}>
                          <i className='icon iconfont icon-move'></i>
                        </Button>
                      </Tooltip>
                      <Tooltip title='编辑' placement='bottom'>
                        <Button onClick={() => showModal(true, item)}>
                          <i className='icon iconfont icon-input'></i>
                        </Button>
                      </Tooltip>
                      <Popconfirm
                        placement='bottom'
                        title='警告'
                        description='确定删除该地址簿吗？'
                        onConfirm={() => deleteAddress(item.id)}
                        okText='确定'
                        cancelText='取消'
                        zIndex={100}>
                        <Tooltip title='删除' placement='bottom' zIndex={99}>
                          <Button>
                            <i className='icon iconfont icon-shanchu'></i>
                          </Button>
                        </Tooltip>
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
          pageSizeOptions={[]}
          total={total}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}
        />
      </Flex>
      <CerateAddressDialog
        isEdit={isEditMode}
        open={openCreateModal}
        editData={editData}
        onCancel={handleCancel}
        onSearch={getAddressList}
      />

      <MoveAddressDialog
        singleId={singleId}
        isSingle={isSingle}
        ids={selectedList}
        open={openMoveModal}
        // FolderList={addressFolderList}
        onSearch={getAddressList}
        onCancel={() => setOpenMoveModal(false)}
      />
    </Form>
  )
}
