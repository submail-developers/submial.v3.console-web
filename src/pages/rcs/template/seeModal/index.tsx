import { Modal, Row, Col, Empty, Spin, Flex, Button, Input, Space } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useEffect, useState, ReactNode } from 'react'
import { getRcsTempList } from '@/api'
import Item from '@/pages/rcs/template/list/item'
import { API } from 'apis'
import './index.scss'
type Props = {
  sign: string // 模版sign
  message?: any // 含有参数值的message
  children?: ReactNode
}

export default function Fn(props: Props) {
  const [show, setShow] = useState(false)
  const [item, setItem] = useState<API.RcsTempListItem>()
  const [loading, setLoading] = useState(false)
  const getList = async () => {
    setLoading(true)
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        status: 'all',
        keyword: props.sign,
      })
      setLoading(false)
      if (res?.list.length > 0) {
        let _list = res?.list.filter((item) => item.sign == props.sign)
        if (_list.length == 1) {
          let _item = JSON.parse(JSON.stringify(_list[0]))
          // 传入的message中的title，description含有参数的值，将title，description设置为有参数值的数据
          if (_item.message.message.generalPurposeCard) {
            let content = _item.message.message.generalPurposeCard.content
            if (props.message) {
              content.title =
                props.message.message.generalPurposeCard.content.title
              content.description =
                props.message.message.generalPurposeCard.content.description
            }
            _item.message.message.generalPurposeCard.content = content
            setItem(_item)
          } else if (_item.message.message.generalPurposeCardCarousel) {
            let content =
              _item.message.message.generalPurposeCardCarousel.content
            content = content.map((item, index) => {
              if (props.message) {
                item.title =
                  props.message.message.generalPurposeCardCarousel.content[
                    index
                  ].title
                item.description =
                  props.message.message.generalPurposeCardCarousel.content[
                    index
                  ].description
              }
              return item
            })
            _item.message.message.generalPurposeCardCarousel.content = content
            setItem(_item)
          } else if (typeof _item.message.message == 'string') {
            if (props.message) {
              _item.message.message = props.message.message
            }
            setItem(_item)
          } else {
            setItem(_item)
          }
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      getList()
    }
  }, [show])
  return (
    <>
      {props.children ? (
        <Space
          size={4}
          align='center'
          className='text-color g-pointer gray-color-sub see-modal-trigger'
          onClick={() => setShow(true)}
          title='查看模版详情'>
          {props.children}
          <EyeOutlined className='see-modal-eye' rev={null} />
        </Space>
      ) : (
        <div
          className='text-color g-pointer gray-color-sub'
          onClick={() => setShow(true)}
          title='查看模版详情'>
          <EyeOutlined rev={null} />
        </div>
      )}
      <Modal
        closeIcon={null}
        footer={
          <Flex justify='flex-end'>
            <Button onClick={() => setShow(false)}>关闭</Button>
          </Flex>
        }
        open={show}
        onCancel={() => setShow(false)}
        title='模版详情'
        width={800}
        destroyOnClose
        wrapClassName='modal-see-temp'>
        {item && (
          <Flex wrap='wrap' gap={24}>
            <Item item={item} hiddenHandle />
            <div style={{ flex: '1', minWidth: 200 }}>
              <div className='m-b-8' style={{ color: '#666d7a' }}>
                回落短信
              </div>
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                value={item?.smsContent || ''}
                disabled
              />
              <div className='m-b-8 m-t-16' style={{ color: '#666d7a' }}>
                回落彩信
              </div>
              <Input
                value={`${
                  item.mmsSubject ? '【' + item?.mmsSubject + '】' : ''
                }${item?.mmsTemplate || ''}`}
                disabled
              />
            </div>
          </Flex>
        )}

        {!item && !loading && (
          <Empty className='m-t-40' description='未查询到模版' />
        )}
        {loading && (
          <div
            className='w-100 fx-center-center'
            style={{ position: 'absolute', top: '100px', left: 0 }}>
            <Spin></Spin>
          </div>
        )}
      </Modal>
    </>
  )
}
