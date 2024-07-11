import { Modal, Row, Col, Empty, Spin, Flex, Button, Divider } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useEffect, useState, ReactNode } from 'react'
import { getRcsTempList } from '@/api'
import Item from '@/pages/rcs/template/list/item'
import { API } from 'apis'
type Props = {
  sign: string // 模版sign
  children?: ReactNode
}

const params = {
  // params1: '123',
  // params2: '321',
  // params: '你好啊',
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
          if (_item.message.message.generalPurposeCard) {
            let content = _item.message.message.generalPurposeCard.content
            content.title = replaceVars(content.title, params)
            content.description = replaceVars(content.description, params)
            _item.message.message.generalPurposeCard.content = content
            setItem(_item)
          } else if (_item.message.message.generalPurposeCardCarousel) {
            let content =
              _item.message.message.generalPurposeCardCarousel.content
            content = content.map((item) => {
              item.title = replaceVars(item.title, params)
              item.description = replaceVars(item.description, params)
              return item
            })
            _item.message.message.generalPurposeCardCarousel.content = content
            setItem(_item)
          } else if (typeof _item.message.message == 'string') {
            _item.message.message = replaceVars(_item.message.message, params)
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
  const replaceVars = (inputString, params) => {
    // 定义正则表达式匹配@var{}格式的内容
    const regex = /@var{(\w+)}/g

    // 使用replace方法进行替换
    const replacedString = inputString.replace(regex, (match, varName) => {
      // 根据varName从params对象中取出对应的值
      if (params[varName]) {
        return params[varName]
      } else {
        return match // 如果params中找不到对应的值，则保持原样
      }
    })

    return replacedString
  }

  useEffect(() => {
    if (show) {
      getList()
    }
  }, [show])
  return (
    <>
      <div
        className='text-color g-pointer gray-color-sub'
        onClick={() => setShow(true)}
        title='查看模版详情'>
        {props.children ? props.children : <EyeOutlined rev={null} />}
      </div>
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
        width={480}
        destroyOnClose>
        {item && (
          <div className='fx-center-center'>
            <Item item={item} hiddenHandle />
          </div>
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
