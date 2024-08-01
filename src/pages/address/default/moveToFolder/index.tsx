import { useState, forwardRef, useEffect } from 'react'
import { Modal, Spin, App, Flex, Pagination, Button, Image } from 'antd'
import { getAddressbooksFolder } from '@/api'

import { getFolderPath } from '@/pages/address/type'
import './index.scss'

import { moveAddressBook } from '@/api'
interface Props {
  ids: any
  singleId: string
  isSingle: boolean
  open: boolean
  onCancel: () => void
  onSearch: () => void
}

const Dialog = (props: Props, ref: any) => {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
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
      setInitLoading(false)
    } catch (error) {
      setInitLoading(false)
    }
  }

  useEffect(() => {
    if (props.open) {
      setInitLoading(true)
      getAddressFolderList()
    }
  }, [currentPage, pageSize, props.open])

  const handleOk = async () => {
    setLoading(true)
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
      open={props.open}
      onCancel={props.onCancel}
      title='移动地址簿至文件夹'
      width={600}
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
            size='small'
            total={folderTotal}
            showSizeChanger={false}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(folderTotal) => `共 ${folderTotal} 条`}
          />
          <div>
            <Button onClick={props.onCancel}>取消</Button>
            <Button className='btn-ok' loading={loading} onClick={handleOk}>
              确定
            </Button>
          </div>
        </Flex>
      }>
      <div className='list'>
        {addressFolderList.map((item) => (
          <div
            className={`fx-between-center p-y-4 p-l-24 p-r-40 m-y-8 g-pointer g-radius-4 g-transition-300 ${
              addressList == item.id && 'active'
            } item`}
            key={item.id}
            onClick={() => handelAddressList(item)}>
            <div className='fx-start-center'>
              <Image
                width={36}
                preview={false}
                src={getFolderPath(Number(item.tag))}
              />
              <span className='fw-500 m-l-12'>{item.title}</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>{item.num}</span> 个地址簿
            </div>
          </div>
        ))}
        {initLoading && (
          <div className='loading fx-center-center'>
            <Spin></Spin>
          </div>
        )}
      </div>
    </Modal>
  )
}
export default forwardRef(Dialog)
