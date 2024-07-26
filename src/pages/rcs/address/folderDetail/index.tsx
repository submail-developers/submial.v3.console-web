import { useEffect, useState, useRef } from 'react'
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
import EditAddressDialog from '../addressBook/cerateAddressDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import MoveinAddressDialog from './moveInDialog/index'
import {
  getFolderDetail,
  deleteAddressbooks,
  updateAddressBookTag,
  moveAddressBook,
  clearFolderAddress,
} from '@/api'
import './index.scss'
import { message } from '@/components/staticFn/staticFn'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { usePoint } from '@/hooks'
import {
  TagsColorEnum,
  tags,
  tags_key,
  getFolderPath,
  getAddressPath,
} from '@/pages/rcs/address/type'

const { Option } = Select
const { Search } = Input
const CheckboxGroup = Checkbox.Group

const order = [
  { label: '创建日期升序', value: 'create_asc' },
  { label: '创建日期降序', value: 'create_desc' },
  { label: '联系人数升序', value: 'address_asc' },
  { label: '联系人数降序', value: 'address_desc' },
]

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

  const [singleId, setSingleId] = useState() //单个地址簿id
  const [isSingle, setIsSingle] = useState(false) //单独移动地址簿
  const [allId, setAllId] = useState([]) //所有id
  const formValuesRef = useRef({}) // 暂存搜索条件
  const { id } = useParams()

  const [searchParams] = useSearchParams()
  const title = searchParams.get('title')
  const tag = searchParams.get('tag')

  // 获取地址簿
  const getAddressList = async () => {
    setLoading(true)
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

  useEffect(() => {
    getAddressList()
  }, [currentPage])

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

  // 批量操作--移动文件夹
  const moveFolder = () => {
    setIsSingle(false)
    setOpenMoveModal(true)
  }
  const toDetail = (item) => {
    if (isVisible) return
    nav(
      `/console/rcs/address/address/detail/${item.id}?name=${item.name}&tag=${
        TagsColorEnum[item.tag]
      }`,
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
          keywords: '',
          tag: 'all',
          order_by: 'create_desc',
        }}
        autoComplete='off'>
        <Row gutter={6}>
          <Col span={24}>
            <Row justify='space-between' align='bottom' gutter={[12, 12]}>
              <Col span={12} xl={8}>
                <Form.Item name='keywords' label='搜索' className='m-b-0'>
                  <Search placeholder='地址簿名称/ID' onSearch={handleSearch} />
                </Form.Item>
              </Col>
              <Col span={12} xl={8} className='fx-x-end'>
                <Button
                  type='primary'
                  className='fx-start-center'
                  icon={<i className='icon iconfont icon-jia'></i>}
                  onClick={() => setOpenMoveInModal(true)}>
                  移入地址簿
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24} className='m-t-24'>
            <Row
              className='p-y-12 p-x-16 g-radius-4 handle-row'
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
                            className='select-item1'
                            placeholder=''
                            onChange={() => getAddressList()}
                            popupMatchSelectWidth={120}
                            options={[
                              { label: '全部标签', value: 'all' },
                              ...tags,
                            ]}></Select>
                        </Form.Item>
                      </Space>
                      {point && <Divider type='vertical' />}
                      <Space align='center' size={0}>
                        <i className='icon iconfont icon-paixu primary-color fn14'></i>
                        <Form.Item name='order_by' label='' className='m-b-0'>
                          <Select
                            className='select-item1'
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
                          className='error-color g-pointer handle-text'>
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
                          className={`primary-color handle-item handle-text ${
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
                            trigger={['click']}
                            menu={{
                              items: tags_key,
                              selectable: true,
                              onClick: edit,
                            }}>
                            <a
                              className={`
                              handle-item 
                              handle-text
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
                  <div
                    onClick={toBack}
                    className='g-pointer handle-text'
                    title='返回'>
                    <i className='icon iconfont icon-fanhui primary-color fn14'></i>
                  </div>
                </Flex>
              </Col>
            </Row>
          </Col>
        </Row>
        <CheckboxGroup
          style={{ width: '100%', marginTop: '10px', position: 'relative' }}
          value={selectedList}
          onChange={onChange}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
              <Spin />
            </div>
          )}
          <Row gutter={[20, 16]} style={{ marginTop: '24px' }}>
            {addressList.map((item) => (
              <Col span={24} lg={12} xl={12} xxl={8} key={item.id}>
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
                        <img
                          src={getAddressPath(Number(TagsColorEnum[item.tag]))}
                          alt=''
                        />
                      </div>

                      <div className='to-detail fx-auto'>
                        <div className='fn18'>{item.name}</div>
                        <div
                          style={{ marginTop: '10px' }}
                          className='fx-between-center'>
                          <span>
                            <span className='num-p'>{item.address}</span>{' '}
                            个联系人
                          </span>
                          {isVisible ? (
                            <Checkbox
                              value={item.id}
                              className='choose-address fx-x-end'
                              onClick={stopEvent}>
                              选择
                            </Checkbox>
                          ) : (
                            <div
                              className='fx-x-end handle-item'
                              onClick={stopEvent}>
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
                    </div>
                  </div>
                </div>
              </Col>
            ))}
            {addressList.length == 0 && !loading && (
              <Empty className='m-t-40' style={{ margin: '0 auto' }} />
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
