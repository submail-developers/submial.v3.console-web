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
import {
  getMobAddressbookDetail,
  getMobAddressbooks,
  deleteAddressMob,
  truncateMob,
} from '@/api'
import { useSearchParams, useParams } from 'react-router-dom'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
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

// export default function Fn(props: Props) {
export default function Fn() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [addressDetailList, setAddressDetailList] = useState([])
  const [checkValues, setCheckValues] = useState([])

  // 全选
  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group
  const [isActive, setIsActive] = useState([])
  const [isAllActive, setIsAllActive] = useState(false)

  const { Search } = Input
  const [params] = useSearchParams()
  const { id } = useParams()
  // 获取地址簿详情
  const getAddressDetailList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbookDetail({
        id,
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
  }, [currentPage])
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
  // const showFirstTab = () => {
  //   props.onchildrenMethod()
  // }

  // 删除手机号
  const singleDeleteAddress = async (item) => {
    try {
      const res = await deleteAddressMob({
        id: item.id,
        addressbook: id,
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
        id:
          checkValues.length > 0
            ? checkValues.join(',')
            : selectedList.join(','),
        addressbook: id,
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
        id: id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        getAddressDetailList()
      }
    } catch (error) {}
  }

  // 全选操作
  useEffect(() => {
    let hasChecked = false
    let checkedAll = true
    if (addressDetailList.length === 0 || selectedList.length == 0) {
      setIndeterminate(false)
      setCheckAll(false)
      return
    }
    addressDetailList.forEach((item) => {
      if (selectedList.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
    setIndeterminate(!checkedAll && hasChecked)
    setCheckAll(checkedAll)
  }, [addressDetailList, selectedList])

  // 单个checkbox点击
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckValues(checkedValues)
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
      addressDetailList.forEach((item) => {
        _select.push(item.id)
      })
      setselectedList(_select)
    } else {
      setselectedList([])
    }
  }

  // 返回
  const toBack = () => {}

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
            <Search
              placeholder='i地址簿名称/ID'
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Form.Item>
        </Col>

        <Col span={6} md={4} xl={3} style={{ marginLeft: 'auto' }}>
          <Form.Item label=' ' className='del-set'>
            <Button
              type='primary'
              className='fx-start-center '
              htmlType='submit'
              loading={loading}
              onClick={() => showModal(false)}>
              <i
                className='icon iconfont icon-daorulianxiren'
                style={{ marginRight: '10px' }}></i>
              导入联系人
            </Button>
          </Form.Item>
        </Col>
      </Row>

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
        <div className='dea-set fx-between-center'>
          <Checkbox
            className='primary-color'
            style={{ width: '90px' }}
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}>
            全选
          </Checkbox>
          <div onClick={batchDel}>
            <span
              className={`batch-del-address ${
                indeterminate || isAllActive ? 'active' : ''
              }`}>
              <i className='icon iconfont icon-shanchu'></i>删除
            </span>
          </div>
          <div>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定清空地址簿吗？'
              onConfirm={DeleteAllMob}
              okText='确定'
              cancelText='取消'
              className='fx-y-center'>
              &nbsp;&nbsp;<i className='icon iconfont icon-saozhou'></i>
              <span style={{ color: '#ff4d4f' }}> 清空地址簿</span>
            </Popconfirm>
          </div>
          <div>
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <i className='icon iconfont icon-daochuwei fn14'></i>导出为
              </a>
            </Dropdown>
          </div>
          <div onClick={toBack}>
            <i className='icon iconfont icon-fanhuidizhibu primary-color'></i>
          </div>
        </div>
      </Col>
      <CheckboxGroup
        style={{ width: '100%', marginTop: '20px' }}
        value={selectedList}
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
        id={id}
        isEdit={isEditMode}
        open={openCreateModal}
        onCancel={handleCancel}
        getAddressDetailList={getAddressDetailList}
      />
    </Form>
  )
}
