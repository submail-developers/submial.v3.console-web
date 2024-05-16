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
  message,
  Empty,
  Select,
  Dropdown,
  Space,
} from 'antd'
import type { MenuProps } from 'antd'
import redImg from '@/assets/rcs/address/address_red.png'
import purpleImg from '@/assets/rcs/address/address_purple.png'
import cyanImg from '@/assets/rcs/address/address_cyan.png'
import blueImg from '@/assets/rcs/address/address_blue.png'
import greenImg from '@/assets/rcs/address/address_green.png'
import yellowImg from '@/assets/rcs/address/address_yellow.png'
import codeImg from '@/assets/rcs/address/blue.png'
import ImportAddressDialog from './ImportDialog/index'
import MoveAddressDialog from './moveAddressDialog/index'
import {
  getMobAddressbookDetail,
  getMobAddressbooks,
  deleteAddressMob,
  truncateMob,
} from '@/api'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'

import './index.scss'
interface Props {
  onchildrenMethod: () => void
  addressInfo: any
}
const addresssIcon = {
  '1': redImg,
  '2': purpleImg,
  '3': cyanImg,
  '4': blueImg,
  '5': greenImg,
  '6': yellowImg,
}
const { Option } = Select

export default function Fn(props: Props) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressDetailList, setAddressDetailList] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [checkValues, setCheckValues] = useState([])
  const CheckboxGroup = Checkbox.Group

  // 获取地址簿详情
  const getAddressDetailList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbookDetail({
        id: props.addressInfo.id,
        address: formValues.keyword,
        page: currentPage,
      })
      setAddressDetailList(res.addressbook)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  useEffect(() => {
    getAddressDetailList()
  }, [currentPage, props.addressInfo])
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
    getAddressDetailList()
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

  const items: MenuProps['items'] = [
    { label: '导出 TXT', key: 'txt' },
    { label: '导出 CSV', key: 'csv' },
    { label: '导出 EXCEL', key: 'excel' },
    { label: '导出 JSON', key: 'json' },
    { label: '导出 XML', key: 'xml' },
  ]
  const showFirstTab = () => {
    props.onchildrenMethod()
  }

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckValues(checkedValues)
    if (checkedValues.length > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }
  // 删除手机号
  const singleDeleteAddress = async (item) => {
    try {
      const res = await deleteAddressMob({
        id: item.id,
        addressbook: props.addressInfo.id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getAddressDetailList()
      }
    } catch (error) {}
  }
  // 批量删除
  const batchDel = async () => {
    try {
      const res = await deleteAddressMob({
        id: checkValues.join(','),
        addressbook: props.addressInfo.id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getAddressDetailList()
      }
    } catch (error) {}
  }
  // 清空地址簿
  const DeleteAllMob = async () => {
    try {
      const res = await truncateMob({
        id: props.addressInfo.id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getAddressDetailList()
      }
    } catch (error) {}
  }

  return (
    <Form
      name='address-book-detail-form'
      data-class='address-book-detail'
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
              onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </Col>

        <Col span={6} md={4} xl={3} style={{ marginLeft: 'auto' }}>
          <Form.Item label=' ' className='del-set'>
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
                  onConfirm={DeleteAllMob}
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
          <img src={addresssIcon[props.addressInfo.tag]} alt='' width='60' />
          {props.addressInfo.name}
        </div>
        <div className='fx-between-center'>
          {isVisible && (
            <div className='batch-del' onClick={batchDel}>
              <i className='icon iconfont icon-shanchu'></i> 删除
            </div>
          )}
          <div className='ex-set fx-start-center'>
            <div style={{ width: '100%' }}>
              <div onClick={() => showModal(false)}>
                <i className='icon iconfont icon-shanchu'></i>导入联系人
              </div>
              <div>
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>导出</Space>
                  </a>
                </Dropdown>
              </div>
              <div onClick={showFirstTab}>
                <i className='icon iconfont icon-shanchu'></i>返回地址簿
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckboxGroup
        style={{ width: '100%', marginTop: '20px' }}
        // value={selectedList}
        onChange={onChange}>
        <Row wrap gutter={12} style={{ width: '100%' }}>
          {addressDetailList.map((item) => (
            <Col key={item.id}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.id}>{item.address}</Checkbox>
                <Popconfirm
                  placement='left'
                  title='警告'
                  description='确定删除该条号码？'
                  onConfirm={() => singleDeleteAddress(item)}
                  okText='确定'
                  cancelText='取消'>
                  <i className='icon iconfont icon-shanchu fn16'></i>
                </Popconfirm>
              </div>
            </Col>
          ))}
          {addressDetailList.length == 0 && (
            <Empty className='m-t-40' style={{ margin: '0 auto' }} />
          )}
        </Row>
      </CheckboxGroup>

      <ImportAddressDialog
        id={props.addressInfo.id}
        isEdit={isEditMode}
        open={openCreateModal}
        onCancel={handleCancel}
        getAddressDetailList={getAddressDetailList}
      />
      <MoveAddressDialog
        open={openMoveModal}
        onCancel={() => setOpenMoveModal(false)}
      />
    </Form>
  )
}
