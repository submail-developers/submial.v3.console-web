import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal, Form, App, Flex, Pagination, Button, Spin } from 'antd'
import { getAddressbooksFolder } from '@/api'
import './index.scss'
import redImg from '@/assets/rcs/address/folder_red.png'
import purpleImg from '@/assets/rcs/address/folder_purple.png'
import cyanImg from '@/assets/rcs/address/folder_cyan.png'
import blueImg from '@/assets/rcs/address/folder_blue.png'
import greenImg from '@/assets/rcs/address/folder_green.png'
import yellowImg from '@/assets/rcs/address/folder_yellow.png'

import { moveAddressBook } from '@/api'
interface Props {
  FolderList: any[]
  ids: any
  oldFolderId: string
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
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()

  const [initLoading, setInitLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [addressList, setAddressList] = useState()
  const [folderId, setFolderId] = useState()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [addressFolderList, setAddressFolderList] = useState([])
  const [folderTotal, setFolderTotal] = useState<number>(0)

  const currentFilesTitle = searchParams.get('title')
  const currentFilesTag = searchParams.get('tag')
  // 获取地址簿文件夹
  const getAddressFolderList = async () => {
    setInitLoading(true)
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
      setInitLoading(false)
    } catch (error) {
      setInitLoading(false)
    }
  }

  // 获取当前文件夹
  useEffect(() => {
    if (props.open) {
      getAddressFolderList()
    }
  }, [currentPage, pageSize, props.open])

  useEffect(() => {
    if (!props.open) {
      setcurrentPage(1)
    }
  }, [props.open])

  const handleOk = async () => {
    setLoading(true)
    try {
      let ids = props.ids.length > 0 ? props.ids.join(',') : props.singleId
      let params = {
        ids: ids,
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

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
      confirmLoading={loading}
      open={props.open}
      onCancel={props.onCancel}
      title='移动地址簿'
      width={600}
      data-class='see-move-address'
      closable={false}
      wrapClassName='modal-move-address'
      footer={
        <Flex justify='space-between' align='center'>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            pageSizeOptions={[]}
            size='small'
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
        name='form-move-address-folder'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ type: 'none' }}
        autoComplete='off'>
        <div style={{ color: '#666d7a', marginBottom: '10px' }}>当前文件夹</div>
        <div>
          <div className='now-address fx-between-center p-x-24 p-y-4 '>
            <div className='fx-start-center'>
              <img src={addresssIcon[currentFilesTag]} alt='' />
              <span className='fw-500'>{currentFilesTitle}</span>
            </div>
            <div></div>
          </div>
        </div>
        <div
          className='m-t-10'
          style={{ color: '#666d7a', marginBottom: '10px' }}>
          文件夹列表
        </div>
        <div className='list'>
          {addressFolderList
            .filter((i) => i.id != props.oldFolderId)
            .map((item) => (
              <div
                className={`now-address2 fx-between-center p-x-24 p-y-4 g-pointer ${
                  addressList === item.id && 'active'
                }`}
                key={item.id}
                onClick={() => handelAddressList(item)}>
                <div className='fx-start-center'>
                  <img src={addresssIcon[item.tag]} alt='' />
                  <span className='fw-500'>{item.title}</span>
                </div>
                <div>
                  <span className='num-p'>{item.num}</span> 个地址簿
                </div>
              </div>
            ))}

          {initLoading && (
            <div className='fx-center-center loading'>
              <Spin></Spin>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  )
}
export default Dialog
