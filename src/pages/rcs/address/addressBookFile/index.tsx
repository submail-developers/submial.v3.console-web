import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
  Tooltip,
  Pagination,
  App,
  Flex,
  Dropdown,
  Switch,
  Checkbox,
  Space,
  Image,
  Divider,
  Spin,
  Empty,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import { getFolderPath } from '../type'
import {
  getAddressbooksFolder,
  deleteAddressbooksFolder,
  createAddressbooksFolder,
  batchDeleteFolder,
  batchUpdateFolderTag,
} from '@/api'
import CerateAddressDialog from './createAddressFileDialog/index'
import { NavLink, useNavigate } from 'react-router-dom'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import './index.scss'
import { constant } from 'lodash'
import { usePoint } from '@/hooks'

const { Option } = Select

const { Search } = Input
interface Props {
  onchildrenMethod: (info: any) => void
}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
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

  const [selectedList, setselectedList] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group
  const [checkValues, setCheckValues] = useState([])

  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    try {
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
  useEffect(() => {
    getAddressFolderList()
  }, [currentPage, pageSize])
  useEffect(() => {
    setLoading(true)
  }, [])

  const showModal = (isEdit) => {
    setIsEditMode(isEdit)
    setOpenCreateModal(true)
  }

  const handleOk = () => {
    setOpenCreateModal(false)
  }

  const handleCancel = () => {
    setOpenCreateModal(false)
  }

  const handleSearch = () => {
    getAddressFolderList()
  }

  // 设置标签
  const items = [
    { label: '全部标签', key: 'all' },
    { label: '默认标签', key: 'tag-blue' },
    { label: '红色标签', key: 'tag-red' },
    { label: '紫色标签', key: 'tag-purple' },
    { label: '青色标签', key: 'tag-cyan' },
    { label: '绿色标签', key: 'tag-green' },
    { label: '黄色标签', key: 'tag-yellow' },
  ]

  const edit = async (e) => {
    try {
      let params = {
        id: selectedList.join(','),
        type: 1,
        tag: e.key,
      }
      const res = await batchUpdateFolderTag(params)
      if ((res.status = 'success')) {
        message.success('设置成功')
        getAddressFolderList()
      }
    } catch (error) {}
  }

  useEffect(() => {
    let hasChecked = false
    let checkedAll = true
    if (addressFolderList.length === 0 || selectedList.length == 0) {
      setIndeterminate(false)
      setCheckAll(false)
      return
    }
    addressFolderList.forEach((item) => {
      if (selectedList.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
    setIndeterminate(!checkedAll && hasChecked)
    setCheckAll(checkedAll)
  }, [addressFolderList, selectedList])

  // 单个checkbox点击
  const onChange = (checkedValues: string[]) => {
    setCheckValues(checkedValues)
    setselectedList(checkedValues)
  }
  // 全选点击
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckAll(e.target.checked)
    if (e.target.checked) {
      let _select = []
      addressFolderList.forEach((item) => {
        _select.push(item.id)
      })
      setselectedList(_select)
    } else {
      setselectedList([])
    }
  }

  const handelSwitchChange = (checked: boolean) => {
    setIsVisible(checked)
  }

  const options = [
    { label: '全部标签', value: 'all' },
    { label: '默认标签', value: 'tag-blue' },
    { label: '红色标签', value: 'tag-red' },
    { label: '紫色标签', value: 'tag-purple' },
    { label: '青色标签', value: 'tag-cyan' },
    { label: '绿色标签', value: 'tag-green' },
    { label: '黄色标签', value: 'tag-yellow' },
  ]
  const orderOptions = [
    { label: '最后编辑', value: 'update' },
    { label: '创建日期', value: 'create' },
    { label: '文件数升序', value: 'vol-asc' },
    { label: '文件数降序', value: 'vol-desc' },
  ]
  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }

  const folderEdit = (item, e) => {
    setOpenCreateModal(true)
    setIsEditMode(true)
    setEditData(item)
    e.stopPropagation()
  }
  const stopEvent = (e) => {
    e.stopPropagation()
  }

  const deleteFolder = async (id) => {
    try {
      const res = await deleteAddressbooksFolder({
        id,
        type: 1,
      })
      if ((res.status = 'success')) {
        message.success('删除成功')
        getAddressFolderList()
      }
    } catch (error) {}
  }

  const toDetail = (item) => {
    if (isVisible) return
    nav(
      `/console/rcs/address/folder/detail/${item.id}?title=${item.title}&tag=${item.tag}`,
    )
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
  // 批量删除
  const batchDel = async () => {
    try {
      const res = await batchDeleteFolder({
        id:
          checkValues.length > 0
            ? checkValues.join(',')
            : selectedList.join(','),
        type: 1,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getAddressFolderList()
      }
    } catch (error) {}
  }
  return (
    <Form
      name='address-book-file-form'
      data-class='address-book-file'
      form={form}
      layout='vertical'
      initialValues={{ order_by: 'update', tag: 'all', keyword: '' }}
      autoComplete='off'>
      <Row gutter={6}>
        <Col span={24}>
          <Row justify='space-between' align='bottom'>
            <Col span={12} xl={8}>
              <Form.Item name='keyword' label='名称' className='m-b-0'>
                <Search
                  placeholder='地址簿文件夹名称/ID'
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
                onClick={(e) => showModal(false)}>
                创建文件夹
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
                  src={getFolderPath(Number('4'))}
                  preview={false}
                  height={48}
                />
                <span className='fn16'>地址簿文件夹</span>
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
                          {orderOptions.map((order) => (
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
                        }`}>
                        <i className='icon iconfont icon-shanchu m-r-8'></i>
                        删除
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
        className='w-100 g-t-12'
        value={selectedList}
        onChange={onChange}>
        <Row gutter={[20, 16]} wrap style={{ marginTop: '24px' }}>
          {addressFolderList.map((item, index) => (
            <Col span={24} lg={12} xl={12} xxl={6} key={item.id}>
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
                  className={`book-list ${!isVisible ? 'g-pointer' : ''}`}
                  onClick={() => toDetail(item)}>
                  <div className='fx-y-center'>
                    <div>
                      <img src={getFolderPath(Number(item.tag))} alt='' />
                    </div>
                    <div className='to-detail'>
                      <div className='fn16 fw-500'>{item.title}</div>
                      <div style={{ marginTop: '10px' }}>
                        <span>{item.num}</span> 个地址簿
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
                      <Tooltip title='编辑' placement='bottom'>
                        <Button
                          onClick={(e) => folderEdit(item, e)}
                          className='fx-center-center'>
                          <i className='icon iconfont icon-input'></i>
                        </Button>
                      </Tooltip>
                      <Popconfirm
                        placement='bottom'
                        title='警告'
                        description='确定删除该文件夹吗？'
                        onConfirm={() => deleteFolder(item.id)}
                        okText='确定'
                        cancelText='取消'
                        zIndex={100}>
                        <Tooltip title='删除' placement='bottom' zIndex={99}>
                          <Button className='fx-center-center'>
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
          {/* {addressFolderList.length == 0 && !loading && (
            <Empty className='m-t-40' style={{ margin: '0 auto' }} />
          )} */}
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
        onOk={handleOk}
        onCancel={handleCancel}
        onSearch={getAddressFolderList}
      />
    </Form>
  )
}
