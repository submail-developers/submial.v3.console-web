import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  ConfigProvider,
  Popconfirm,
  Dropdown,
  Space,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import codeImg from '@/assets/rcs/address/blue.png'
import { DownOutlined } from '@ant-design/icons'
import CerateAddressDialog from './seeAddressFileDialog/index'
import './index.scss'
const { Option } = Select

export default function Fn() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
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

  const onClick = ({ key }) => {
    console.log(key)
  }
  const items = [
    {
      label: '移出此文件夹',
      key: '0',
    },
    {
      label: '移至其他文件夹',
      key: '1',
    },
  ]
  return (
    <Form
      name='see-address-book-file-form'
      data-class='see-address-book-file'
      form={form}
      layout='vertical'
      initialValues={{ type: 'all', keyword: '' }}
      autoComplete='off'>
      <Row gutter={16}>
        <Col span={10} md={10} lg={8} xl={6}>
          <Form.Item name='keyword' label='名称'>
            <Input placeholder='地址簿名称/ID' />
          </Form.Item>
        </Col>
        <Col span={8} md={8} lg={6} xl={4}>
          <Form.Item name='type' label='标签类型'>
            <Select placeholder='选择颜色'>
              {options.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  style={{ color: option.color }}>
                  {option.label}
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
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: 'red',
                },
              }}>
              <Button
                type='primary'
                className='fx-start-center color-status-error'
                htmlType='submit'
                loading={loading}>
                <Popconfirm
                  placement='left'
                  title='警告'
                  description='确定清空地址簿吗？'
                  // onConfirm={() => singleDeleteEvent(record.mob)}
                  okText='确定'
                  cancelText='取消'
                  className='fx-y-center'>
                  <i className='icon iconfont icon-upload'></i>
                  &nbsp;&nbsp;清空文件夹
                </Popconfirm>
              </Button>
            </ConfigProvider>
          </Form.Item>
        </Col>
      </Row>
      <div className='fx-between-center handle-address'>
        <div className='fx-start-center'>
          <img src={codeImg} alt='' width='60' />
          赛邮云技术部通讯录
        </div>
        <div className='ex-set fx-start-center'>
          <div onClick={() => showModal(false)}>
            <i className='icon iconfont icon-shanchu'></i>导入地址簿
          </div>

          <div
          // onClick={showFirstTab}
          >
            <i className='icon iconfont icon-shanchu'></i>返回地址簿
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        <Col xl={8}>
          <div className='address-book-item'>
            <div>
              <div className='trapezoid'>
                <IDIcon />
                <div className='sign'>wsghR4</div>
              </div>
            </div>
            <div className='book-list'>
              <div>
                <img src={codeImg} alt='' />
              </div>
              <div
                className='to-detail'
                //  onClick={showThirdTab}
              >
                <div className='fn18'>赛邮云技术部通讯录</div>
                <div style={{ marginTop: '10px' }}>
                  <span>99</span> 个联系人
                </div>
              </div>
              <div className='fx-between-center' style={{ marginTop: '40px' }}>
                {/* <Button onClick={() => setOpenMoveModal(true)}>
                  <i className='icon iconfont icon-upload'></i>
                </Button> */}
                <Dropdown
                  menu={{
                    items,
                    onClick,
                  }}
                  trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>Click me</Space>
                  </a>
                </Dropdown>
                <Button onClick={() => showModal(true)}>
                  <i className='icon iconfont icon-input'></i>
                </Button>
                <Button>
                  <i className='icon iconfont icon-shanchu'></i>
                </Button>
              </div>
            </div>
          </div>
        </Col>
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
