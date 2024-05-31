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
import type { CheckboxValueType } from 'antd/es/checkbox/Group'

const { Option } = Select

interface Props {
  onchildrenMethod: (info: any) => void
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

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])
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
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAddressList()
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

  const handleSearch = () => {
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
  const onChange = (checkedValues: CheckboxValueType[]) => {
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
      }}
      autoComplete='off'>
      <Row gutter={6}>
        <Col
          xl={24}
          className='search-part fx-between-center'
          style={{ padding: '0' }}>
          <Form.Item name='keyword' label='名称'>
            <Search
              placeholder='地址簿名称/ID'
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Form.Item>

          <Button
            type='primary'
            className='fx-start-center'
            htmlType='submit'
            onClick={(e) => showModal(false, '')}>
            <i className='icon iconfont icon-jia'></i>
            &nbsp;&nbsp;创建地址簿
          </Button>
        </Col>
        <Col xl={24} className='set-item fx-start-center'>
          <div className='fx-start-center'>
            <img
              src={getAddressPath(Number('4'))}
              alt=''
              width='40'
              style={{ marginRight: '16px' }}
            />
            <span className='fn16'>地址簿</span>
          </div>
          <div className='fx-start-center batch'>
            <div className='fx-start-center switch m-r-20'>
              <Switch
                size='small'
                defaultChecked={false}
                onChange={handelSwitchChange}
              />{' '}
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
                    <i className='icon iconfont icon-move'></i>
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
                    <a className={indeterminate || checkAll ? 'active' : ''}>
                      <i className='icon iconfont icon-shezhibiaoqian'></i>
                      设置标签
                    </a>
                  </Dropdown>
                </Form.Item>
              </>
            ) : (
              <>
                <div className='fx-center-center batch-item1 m-r-10 m-l-10'>
                  <i className='icon iconfont icon-dizhibu1 primary-color'></i>
                  <Form.Item name='tag' label=''>
                    <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                      {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='fx-center-center batch-item2'>
                  <i className='icon iconfont icon-paixu primary-color fn14'></i>
                  <Form.Item name='order_by' label=''>
                    <Select placeholder='选择排序' popupMatchSelectWidth={120}>
                      {order.map((order) => (
                        <Option key={order.value} value={order.value}>
                          {order.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
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
            <Col span={24} lg={12} xl={10} xxl={6} key={item.id}>
              <div className='address-book-item'>
                <div>
                  <div className='trapezoid' onClick={() => copy(item.sign)}>
                    <IDIcon />
                    <div className='sign fn15'>{item.sign}</div>
                  </div>
                </div>
                <div className='book-list' onClick={() => toDetail(item)}>
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
                      <Tooltip title='移入文件夹'>
                        <Button onClick={() => openSingleAddressModal(item.id)}>
                          <i className='icon iconfont icon-move'></i>
                        </Button>
                      </Tooltip>
                      <Tooltip title='编辑'>
                        <Button onClick={() => showModal(true, item)}>
                          <i className='icon iconfont icon-input'></i>
                        </Button>
                      </Tooltip>
                      <Popconfirm
                        placement='left'
                        title='警告'
                        description='确定删除该地址簿吗？'
                        onConfirm={() => deleteAddress(item.id)}
                        okText='确定'
                        cancelText='取消'>
                        <Tooltip title='删除'>
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
