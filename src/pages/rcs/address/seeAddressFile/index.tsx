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
// import CerateAddressDialog from './cerateAddressDialog/index'
// import MoveAddressDialog from './moveAddressDialog/index'
import {
  getFolderDetail,
  getMobAddressbooks,
  deleteAddressbooks,
  getAddressbooksFolder,
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
const { Search } = Input
export default function Fn(props: Props) {
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState([])
  const [editData, setEditData] = useState()

  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
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
  // 获取地址簿
  const getFolderDetailList = async () => {
    try {
      const res = await getFolderDetail({
        id: props.folderInfo.id,
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
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getFolderDetailList()
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
    // getFolderDetailList()
  }
  const showThirdTab = (info) => {
    props.onchildrenMethod(info)
  }
  // 删除地址簿
  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressbooks({ id })
      if ((res.status = 'success')) {
        message.success('删除成功')
        // getFolderDetailList()
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
  const searchType = [
    { label: '全部', value: 'all' },
    { label: '名称', value: 'title' },
    { label: '地址簿 ID', value: 'id' },
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
        // getFolderDetailList()
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
        <Col xl={24} className='fx-between-center' style={{ padding: '0' }}>
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
            onClick={() => showModal(false, '')}>
            <i className='icon iconfont icon-jia'></i>
            &nbsp;&nbsp;移入地址簿
          </Button>
        </Col>
        <Col xl={24} className='set-item fx-start-center'>
          <div className='fx-start-center'>
            <img
              src={blueImg}
              alt=''
              width='40'
              style={{ marginRight: '16px' }}
            />
            地址簿
          </div>
          <div className='fx-start-center'>
            <div className='fx-start-center' style={{ marginRight: '10px' }}>
              <Switch defaultChecked={false} onChange={handelSwitchChange} />
              &nbsp; 批量操作
            </div>

            {isVisible ? (
              <>
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}>
                    全选
                  </Checkbox>
                </div>

                <Form.Item name='move' label=''>
                  <div
                    className={`primary-color move-folder ${
                      indeterminate || isAllActive ? 'active' : ''
                    }`}
                    onClick={moveFolder}>
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
                    <a className={indeterminate || isAllActive ? 'active' : ''}>
                      设置标签
                    </a>
                  </Dropdown>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item name='tag' label=''>
                  <Select placeholder='所有标签'>
                    {options.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name='order_by' label=''>
                  <Select placeholder='选择排序'>
                    {order.map((order) => (
                      <Option key={order.value} value={order.value}>
                        {order.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div>清空文件夹</div>
                <div>
                  <i className></i>
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
        <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
          {addressList.map((item) => (
            <Col xl={8} key={item.id}>
              <div className='address-book-item'>
                <div>
                  <div className='trapezoid'>
                    <IDIcon />
                    <div className='sign'>{item.sign}</div>
                  </div>
                </div>
                <div className='book-list'>
                  <div>
                    <img src={addresssIcon[item.tag]} alt='' />
                  </div>
                  <div className='to-detail' onClick={() => showThirdTab(item)}>
                    <div className='fn18'>{item.name}</div>
                    <div style={{ marginTop: '10px' }}>
                      <span className='num-p'>{item.address}</span> 个联系人
                    </div>
                  </div>
                  {isVisible ? (
                    <Checkbox value={item.id}>选择</Checkbox>
                  ) : (
                    <div
                      className='fx-between-center'
                      style={{ marginTop: '40px' }}>
                      <Button onClick={() => openSingleAddressModal(item.id)}>
                        <i className='icon iconfont icon-yidongwenjianjia'></i>
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
                          <i className='icon iconfont icon-shanchu'></i>
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
      {/* <CerateAddressDialog
        isEdit={isEditMode}
        open={openCreateModal}
        editData={editData}
        onCancel={handleCancel}
        onSearch={getAddressList}
      /> */}

      {/* <MoveAddressDialog
        singleId={singleId}
        isSingle={isSingle}
        ids={selectedList}
        open={openMoveModal}
        FolderList={addressFolderList}
        onSearch={getAddressList}
        onCancel={() => setOpenMoveModal(false)}
      /> */}
    </Form>
  )
}
