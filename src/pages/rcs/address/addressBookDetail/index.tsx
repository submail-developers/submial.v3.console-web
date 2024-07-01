import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Checkbox,
  message,
  Empty,
  Dropdown,
  Image,
  Pagination,
  Flex,
  Spin,
  Space,
} from 'antd'
import type { MenuProps } from 'antd'
import ImportAddressDialog from './ImportDialog/index'
import {
  getMobAddressbookDetail,
  deleteAddressMob,
  truncateMob,
  exportAddress,
} from '@/api'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { getAddressPath } from '../type'
import './index.scss'
import AExport from '@/components/aExport'
import { useAppSelector } from '@/store/hook'
import { settingRcs } from '@/store/reducers/settingRcs'
import { downloadFile } from '@/utils'

const items: MenuProps['items'] = [
  { label: '导出 TXT', key: 'txt' },
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 EXCEL', key: 'excel' },
  { label: '导出 JSON', key: 'json' },
  { label: '导出 XML', key: 'xml' },
]

export default function Fn() {
  const rcsSetting = useAppSelector(settingRcs)
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [addressDetailList, setAddressDetailList] = useState([])
  const [checkValues, setCheckValues] = useState([])

  // 全选
  const [selectedList, setselectedList] = useState<string[]>([])
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group

  const { Search } = Input
  const { id } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name')
  const title = searchParams.get('title')
  const tag = searchParams.get('tag')

  const oldTitle = searchParams.get('oldTitle')
  const oldTag = searchParams.get('oldTag')
  const folderId = searchParams.get('folderId')

  // 导出
  const exportconfirm = searchParams.get('exportconfirm')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [fileType, setFileType] = useState()
  const [exportParams, setExportParams] = useState([])

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
  }

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
    }
  }

  // 导出
  const exportEvent = async (type) => {
    const res = await exportAddress({
      type,
      id,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    getAddressDetailList()
  }, [currentPage])

  const showModal = (isEdit) => {
    setIsEditMode(isEdit)
    setOpenCreateModal(true)
  }

  const handleCancel = () => {
    setOpenCreateModal(false)
    setIsOpenModal(false)
  }

  const handleSearch = () => {
    getAddressDetailList()
  }

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
    if (checkValues.length == 0) return
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
  const deleteAllMob = async () => {
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
  useEffect(() => {
    setLoading(true)
  }, [])

  // 单个checkbox点击
  const onChange = (checkedValues: string[]) => {
    setCheckValues(checkedValues)
    setselectedList(checkedValues)
  }
  // 全选点击
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
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
  const toBack = () => {
    nav(-1)
  }

  return (
    <Form
      name='address-book-detail-form'
      data-class='address-book-detail'
      form={form}
      layout='vertical'
      initialValues={{ type: 'all', keyword: '' }}
      autoComplete='off'>
      <Flex align='flex-end' justify='space-between'>
        <Form.Item name='keyword' label='联系人手机号' className='m-b-0'>
          <Search
            placeholder='地址簿名称/ID'
            allowClear
            onSearch={handleSearch}
          />
        </Form.Item>
        <Space>
          <Button
            type='primary'
            className='fx-start-center '
            htmlType='submit'
            onClick={() => showModal(false)}>
            <i className='icon iconfont icon-daorulianxiren'></i>
            导入联系人
          </Button>
          <AExport
            items={items}
            onExportEvent={exportEvent}
            useCode={rcsSetting?.settings?.export_confrim == '1'}
          />
        </Space>
      </Flex>

      <Col span={24} className='set-item fx-start-center m-t-24'>
        <div className='fx-start-center'>
          <Image src={getAddressPath(Number(tag))} width={48} preview={false} />
          <span className='fn16 m-l-16'>{title}</span>
        </div>
        <div className='dea-set fx-between-center'>
          {total > 0 && (
            <>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}>
                全选
              </Checkbox>
              <div onClick={batchDel}>
                <span
                  className={`batch-del-address g-pointer fx-center-center ${
                    indeterminate || checkAll ? 'active' : ''
                  }`}>
                  <i className='icon iconfont icon-shanchu'></i>删除
                </span>
              </div>
              <div className='clear-address'>
                <Popconfirm
                  placement='bottom'
                  title='警告'
                  description='确定清空地址簿吗？'
                  onConfirm={deleteAllMob}
                  okText='确定'
                  cancelText='取消'>
                  <div className='g-pointer fx-center-center'>
                    <i className='icon iconfont icon-saozhou'></i>
                    <span> 清空地址簿</span>
                  </div>
                </Popconfirm>
              </div>
            </>
          )}
          <div onClick={toBack} style={{ paddingRight: 0 }}>
            <i className='icon iconfont icon-fanhui primary-color fn14'></i>
          </div>
        </div>
      </Col>
      <CheckboxGroup
        style={{ width: '100%', marginTop: '20px' }}
        value={selectedList}
        onChange={onChange}>
        <Row wrap gutter={8} style={{ width: '100%' }}>
          {loading && (
            <Col span={24} className='m-y-40 fx-center-center'>
              <Spin />
            </Col>
          )}
          {addressDetailList.map((item) => (
            <Col key={item.id} span={12} lg={8} xl={6} xxl={4}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.id} className='fn16'>
                  {item.address}
                </Checkbox>
                <Popconfirm
                  placement='left'
                  title='警告'
                  description='确定删除该条号码？'
                  onConfirm={() => singleDeleteAddress(item)}
                  okText='确定'
                  cancelText='取消'>
                  <i className='icon iconfont icon-shanchu g-pointer'></i>
                </Popconfirm>
              </div>
            </Col>
          ))}
          {addressDetailList.length == 0 && !loading && (
            <Empty className='m-t-40' style={{ margin: '0 auto' }} />
          )}
        </Row>
      </CheckboxGroup>

      <Flex justify='flex-end' className='m-t-24'>
        <Pagination
          current={currentPage}
          pageSize={100}
          total={total}
          showSizeChanger={false}
          showQuickJumper
          hideOnSinglePage
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}></Pagination>
      </Flex>

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
