import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, App, Flex, Pagination, Button } from 'antd'
import { getAddressbooksFolder } from '@/api'
import { API } from 'apis'
import './index.scss'
import redImg from '@/assets/rcs/address/folder_red.png'
import purpleImg from '@/assets/rcs/address/folder_purple.png'
import cyanImg from '@/assets/rcs/address/folder_cyan.png'
import blueImg from '@/assets/rcs/address/folder_blue.png'
import greenImg from '@/assets/rcs/address/folder_green.png'
import yellowImg from '@/assets/rcs/address/folder_yellow.png'
import { usePoint } from '@/hooks'

import { moveAddressBook } from '@/api'
interface Props {
  // FolderList: any[]
  ids: any
  singleId: string
  isSingle: boolean
  open: boolean
  onCancel: () => void
  onSearch: () => void
}

const addresssIcon = {
  '0': blueImg,
  '1': redImg,
  '2': purpleImg,
  '3': cyanImg,
  '4': blueImg,
  '5': greenImg,
  '6': yellowImg,
}

const Dialog = (props: Props, ref: any) => {
  const point = usePoint('sm')

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [addressFolderList, setAddressFolderList] = useState([])
  const [folderTotal, setFolderTotal] = useState<number>(0)
  const [addressList, setAddressList] = useState()
  const [folderId, setFolderId] = useState()

  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    try {
      const res = await getAddressbooksFolder({
        id: '',
        type: 1,
        page: currentPage,
        tag: 'all',
        order_by: 'update',
        search_type: 'all',
        keywords: '',
      })
      setAddressFolderList(res.folders)
      setFolderTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getAddressFolderList()
  }, [currentPage, pageSize])

  const handleOk = async () => {
    try {
      let params = {
        ids: props.isSingle ? props.singleId : props.ids.join(','),
        folder: folderId,
        type: 1,
        flag: 1,
      }
      const res = await moveAddressBook(params)
      if (res.status == 'success') {
        message.success('移动成功')
        props.onSearch()
        props.onCancel()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const handelAddressList = (item) => {
    setAddressList(item.id)
    setFolderId(item.id)
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }

  return (
    <Modal
      onOk={handleOk}
      open={props.open}
      onCancel={props.onCancel}
      title='移动地址簿'
      width={480}
      style={{ top: 240 }}
      data-class='move-address'
      closable={false}
      wrapClassName='modal-move-address'
      footer={
        <Flex justify='space-between' align='center'>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            pageSizeOptions={[]}
            size={point ? 'default' : 'small'}
            total={folderTotal}
            showSizeChanger={false}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(folderTotal) => `共 ${folderTotal} 条`}
          />
          <div>
            <Button onClick={props.onCancel}>取消</Button>
            <Button className='btn-ok' onClick={handleOk}>
              确定
            </Button>
          </div>
        </Flex>
      }>
      <Form
        name='form-move-address'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ type: 'none' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        {addressFolderList.map((item) => (
          <div
            className={`now-address2 fx-start-center ${
              addressList === item.id && 'active'
            }`}
            key={item.id}
            onClick={() => handelAddressList(item)}>
            <div className='fx-start-center'>
              <img src={addresssIcon[item.tag]} alt='' />
              <span className='fw-500'>{item.title}</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>{item.num}</span> 个地址簿
            </div>
          </div>
        ))}
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
