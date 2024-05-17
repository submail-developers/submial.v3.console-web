import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Popconfirm,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import redImg from '@/assets/rcs/address/address_red.png'
import purpleImg from '@/assets/rcs/address/address_purple.png'
import cyanImg from '@/assets/rcs/address/address_cyan.png'
import blueImg from '@/assets/rcs/address/address_blue.png'
import greenImg from '@/assets/rcs/address/address_green.png'
import yellowImg from '@/assets/rcs/address/address_yellow.png'
import { getAddressbooksFolder } from '@/api'
import CerateAddressDialog from './seeAddressFileDialog/index'
import './index.scss'
const { Option } = Select
const addresssIcon = {
  '1': redImg,
  '2': purpleImg,
  '3': cyanImg,
  '4': blueImg,
  '5': greenImg,
  '6': yellowImg,
}
export default function Fn() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressFolderList, setAddressFolderList] = useState([])

  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      console.log(formValues, 'formValues')
      const res = await getAddressbooksFolder({
        ...formValues,
        id: '',
        type: 1,
        search_type: 'all',
        page: currentPage,
      })
      setAddressFolderList(res.folders)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
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
    setLoading(true)
  }

  const options = [
    { label: '全部标签', value: 'all', color: '#1764ff' },
    { label: '无标签', value: 'none', color: '#282b31' },
    { label: '红色', value: 'red', color: '#ff4446' },
    { label: '紫色', value: 'purple', color: '#6f42c1' },
    { label: '青色', value: 'cyan', color: '#17a2b8' },
    { label: '蓝色', value: 'blue', color: '#1764ff' },
    { label: '绿色', value: 'green', color: '#17c13d' },
    { label: '黄色', value: 'yellow', color: '#ffba00' },
  ]
  const order = [
    { label: '最后编辑', value: 'update' },
    { label: '创建日期', value: 'create' },
    { label: '文件数升序', value: 'vol-asc' },
    { label: '文件数降序', value: 'vol-desc' },
  ]
  return (
    <Form
      name='address-book-file-form'
      data-class='address-book-file'
      form={form}
      layout='vertical'
      initialValues={{ tag: 'all', keyword: '', order_by: 'update' }}
      autoComplete='off'>
      <Row gutter={16}>
        <Col span={10} md={10} lg={8} xl={6}>
          <Form.Item name='keyword' label='名称'>
            <Input placeholder='地址簿文件夹名称/ID' />
          </Form.Item>
        </Col>
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
              onClick={() => showModal(false)}>
              <i className='icon iconfont icon-upload'></i>
              &nbsp;&nbsp;创建地址簿文件夹
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Divider className='line'></Divider>

      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        {addressFolderList.map((item, index) => (
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
                <div
                  className='to-detail'
                  // onClick={() => showThirdTab(item)}
                >
                  <div className='fn18'>{item.name}</div>
                  <div style={{ marginTop: '10px' }}>
                    <span>{item.num}</span> 个地址簿
                  </div>
                </div>
                <div
                  className='fx-between-center'
                  style={{ marginTop: '40px' }}>
                  <Button onClick={() => setOpenMoveModal(true)}>
                    <i className='icon iconfont icon-upload'></i>
                  </Button>
                  <Button
                  // onClick={() => showModal(true, item)}
                  >
                    <i className='icon iconfont icon-input'></i>
                  </Button>
                  <Popconfirm
                    placement='left'
                    title='警告'
                    description='确定删除该地址簿吗？'
                    // onConfirm={() => deleteAddress(item.id)}
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
      <CerateAddressDialog
        isEdit={isEditMode}
        open={openCreateModal}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </Form>
  )
}
