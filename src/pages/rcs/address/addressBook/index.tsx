import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Flex,
  Pagination,
  Popconfirm,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import redImg from '@/assets/rcs/address/address_red.png'
import purpleImg from '@/assets/rcs/address/address_purple.png'
import cyanImg from '@/assets/rcs/address/address_cyan.png'
import blueImg from '@/assets/rcs/address/address_blue.png'
import greenImg from '@/assets/rcs/address/address_green.png'
import yellowImg from '@/assets/rcs/address/address_yellow.png'
import CerateAddressDialog from './cerateAddressDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import { getMobAddressbooks, deleteAddressbooks } from '@/api'
import { API } from 'apis'

import './index.scss'
import { color } from 'echarts/core'
import { message } from '@/components/staticFn/staticFn'
const { Option } = Select

interface Props {
  onchildrenMethod: any
  // : () => void
}

const addresssIcon = {
  '1': redImg,
  '2': purpleImg,
  '3': cyanImg,
  '4': blueImg,
  '5': greenImg,
  '6': yellowImg,
}

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
  // 获取地址簿
  const getAddressList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbooks({
        ...formValues,
        page: currentPage,
        limit: pageSize,
      })
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
  const showThirdTab = (info) => {
    props.onchildrenMethod(info)
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
      <Row gutter={16}>
        <Col span={8} md={8} lg={6} xl={3}>
          <Form.Item name='tag' label='标签类型'>
            <Select placeholder='选择颜色'>
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} md={8} lg={6} xl={3}>
          <Form.Item name='order_by' label='排序'>
            <Select placeholder='选择排序'>
              {order.map((order) => (
                <Option key={order.value} value={order.value}>
                  {order.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} md={8} lg={6} xl={3}>
          <Form.Item name='search_type' label='搜索类型'>
            <Select placeholder='选择排序'>
              {searchType.map((searchType) => (
                <Option key={searchType.value} value={searchType.value}>
                  {searchType.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={10} md={10} lg={8} xl={3}>
          <Form.Item name='keyword' label='名称'>
            <Input placeholder='地址簿名称/ID' />
          </Form.Item>
        </Col>
        <Col span={6} md={4} xl={3}>
          <Form.Item label=' '>
            <Button
              type='primary'
              className='w-100'
              htmlType='submit'
              loading={loading}
              onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </Col>

        <Col span={6} md={4} xl={3} style={{ marginLeft: 'auto' }}>
          <Form.Item label=' '>
            <Button
              type='primary'
              className='fx-start-center'
              htmlType='submit'
              loading={loading}
              onClick={() => showModal(false, '')}>
              <i className='icon iconfont icon-upload'></i>
              &nbsp;&nbsp;创建地址簿
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Divider className='line'></Divider>

      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        {addressList.map((item, index) => (
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
                    <span>{item.address}</span> 个联系人
                  </div>
                </div>
                <div
                  className='fx-between-center'
                  style={{ marginTop: '40px' }}>
                  <Button onClick={() => setOpenMoveModal(true)}>
                    <i className='icon iconfont icon-upload'></i>
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
              </div>
            </div>
          </Col>
        ))}
      </Row>
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
        open={openMoveModal}
        onCancel={() => setOpenMoveModal(false)}
      />
    </Form>
  )
}
