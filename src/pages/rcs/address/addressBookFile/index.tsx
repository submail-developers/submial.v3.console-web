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
} from 'antd'
import { IDIcon } from '@/components/aIcons'
import { getFolderPath } from '../type'
import { getAddressbooksFolder, deleteAddressbooksFolder } from '@/api'
import CerateAddressDialog from './createAddressFileDialog/index'
import { NavLink, useNavigate } from 'react-router-dom'

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

  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getAddressbooksFolder({
        ...formValues,
        id: '',
        type: 1,
        tag: 'all',
        order_by: 'update',
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
  return (
    <Form
      name='address-book-file-form'
      data-class='address-book-file'
      form={form}
      layout='vertical'
      initialValues={{ tag: 'all', keyword: '', order_by: 'update' }}
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
        </Col>
      </Row>

      <Row gutter={[20, 16]} wrap style={{ marginTop: '24px' }}>
        {addressFolderList.map((item, index) => (
          <Col span={24} lg={12} xl={10} xxl={8} key={item.id}>
            <div className='address-book-item'>
              <div>
                <div className='trapezoid' onClick={() => copy(item.sign)}>
                  <IDIcon />
                  <div className='sign fn15'>{item.sign}</div>
                </div>
              </div>
              <div className='book-list' onClick={() => toDetail(item)}>
                <div>
                  <img src={getFolderPath(Number(item.tag))} alt='' />
                </div>
                <div className='to-detail'>
                  <div className='fn16 fw-500'>{item.title}</div>
                  <div style={{ marginTop: '10px' }}>
                    <span>{item.num}</span> 个地址簿
                  </div>
                </div>
                <div
                  className='fx-between-center handle-item'
                  onClick={stopEvent}>
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
                        <i className='icon iconfont icon-shanchu2'></i>
                      </Button>
                    </Tooltip>
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
        onOk={handleOk}
        onCancel={handleCancel}
        onSearch={getAddressFolderList}
      />
    </Form>
  )
}
