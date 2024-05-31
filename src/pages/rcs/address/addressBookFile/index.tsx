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
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import './index.scss'
import { constant } from 'lodash'
const { Option } = Select

const { Search } = Input
interface Props {
  onchildrenMethod: (info: any) => void
}

export default function Fn() {
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

  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])
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
  const onChange = (checkedValues: CheckboxValueType[]) => {
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
      <Row gutter={8}>
        <Col
          xl={24}
          className='search-part fx-between-center'
          style={{ padding: '0' }}>
          <Form.Item name='keyword' label='名称'>
            <Search
              placeholder='地址簿文件夹名称/ID'
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Form.Item>
          <Button
            type='primary'
            className='fx-start-center'
            htmlType='submit'
            onClick={() => showModal(false)}>
            <i className='icon iconfont icon-jia'></i>
            &nbsp;&nbsp;创建文件夹
          </Button>
        </Col>

        <Col xl={24} className='set-item fx-start-center'>
          <div className='fx-start-center'>
            <img
              src={getFolderPath(Number('4'))}
              alt=''
              width='40'
              style={{ marginRight: '16px' }}
            />
            <span className='fn16'>地址簿文件夹</span>
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

                <div onClick={batchDel}>
                  <span
                    className={`batch-del-address fx-center-center ${
                      indeterminate || checkAll ? 'active' : ''
                    }`}>
                    <i className='icon iconfont icon-shanchu'></i>删除
                  </span>
                </div>
                {/* <Form.Item name='tag' label=''> */}
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
                {/* </Form.Item> */}
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
                      {orderOptions.map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
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
        <Row gutter={[20, 16]} wrap style={{ marginTop: '24px' }}>
          {addressFolderList.map((item, index) => (
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
                      <Tooltip title='编辑'>
                        <Button onClick={(e) => folderEdit(item, e)}>
                          <i className='icon iconfont icon-input'></i>
                        </Button>
                      </Tooltip>
                      <Popconfirm
                        placement='left'
                        title='警告'
                        description='确定删除该文件夹吗？'
                        onConfirm={() => deleteFolder(item.id)}
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
        onOk={handleOk}
        onCancel={handleCancel}
        onSearch={getAddressFolderList}
      />
    </Form>
  )
}
