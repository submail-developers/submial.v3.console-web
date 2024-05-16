import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  ConfigProvider,
  Popconfirm,
  Checkbox,
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import codeImg from '@/assets/rcs/address/blue.png'
import CerateAddressDialog from './ImportDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import './index.scss'
interface Props {
  onchildrenMethod: () => void
}

export default function Fn(props: Props) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const CheckboxGroup = Checkbox.Group

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

  const mobileList = [
    {
      id: '1',
      mob: '13770372676',
    },
    {
      id: '2',
      mob: '13770372672',
    },
    {
      id: '3',
      mob: '13770372673',
    },
    {
      id: '4',
      mob: '13770372674',
    },
    {
      id: '5',
      mob: '13770372675',
    },
    {
      id: '6',
      mob: '13770372671',
    },
  ]

  const showFirstTab = () => {
    props.onchildrenMethod()
  }

  return (
    <Form
      name='address-book-file-detail-form'
      data-class='address-book-file-detail'
      form={form}
      layout='vertical'
      initialValues={{ type: 'all', keyword: '' }}
      autoComplete='off'>
      <Row gutter={16}>
        <Col span={10} md={10} lg={8} xl={6}>
          <Form.Item name='keyword' label='联系人手机号'>
            <Input placeholder='联系人手机号' />
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
                  &nbsp;&nbsp;清空地址簿
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
            <i className='icon iconfont icon-shanchu'></i>导入联系人
          </div>
          <div>
            <i className='icon iconfont icon-shanchu'></i>导出为
          </div>
          <div onClick={showFirstTab}>
            <i className='icon iconfont icon-shanchu'></i>返回地址簿
          </div>
        </div>
      </div>
      <CheckboxGroup
        style={{ width: '100%', marginTop: '20px' }}
        // value={selectedList}
        // onChange={onChange}
      >
        <Row wrap gutter={12} style={{ width: '100%' }}>
          {mobileList.map((item) => (
            <Col key={item.id}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.id}>{item.mob}</Checkbox>
                <Popconfirm
                  placement='left'
                  title='警告'
                  description='确定删除该条黑名单吗？'
                  // onConfirm={() => singleDeleteEvent(item.id)}
                  okText='确定'
                  cancelText='取消'>
                  <i className='icon iconfont icon-shanchu fn16'></i>
                </Popconfirm>
              </div>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>

      <CerateAddressDialog
        isEdit={isEditMode}
        open={openCreateModal}
        onCancel={handleCancel}
      />
      <MoveAddressDialog
        open={openMoveModal}
        onCancel={() => setOpenMoveModal(false)}
      />
    </Form>
  )
}
