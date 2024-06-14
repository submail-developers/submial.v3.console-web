import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  Fragment,
} from 'react'
import {
  Modal,
  Flex,
  Row,
  Col,
  Space,
  Spin,
  Form,
  Input,
  Steps,
  Divider,
  Button,
} from 'antd'

import Plp from './plp'

import './index.scss'
type Props = {}

const steps = [
  {
    title: '选择资源包',
    icon: 'icon-car',
  },
  {
    title: '创建订单',
    icon: 'icon-order',
  },
  {
    title: '支付',
    icon: 'icon-zhifu',
  },
  {
    title: '支付成功',
    icon: 'icon-right fn12',
  },
]

function Fn(props: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState(0)
  const [items, setItems] = useState(steps)

  const next = () => {
    setCurrent(current + 1)
  }
  const open = () => {
    setShow(true)
  }
  useEffect(() => {}, [current])
  return (
    <Modal
      open={show}
      onCancel={() => setShow(false)}
      width={700}
      title={
        <Space size={12} align='center' className='fw-400'>
          {steps.map((item, index) => (
            <Fragment key={item.title}>
              <Space className={`${index == current ? 'color' : ''}`}>
                <div className='icon-wrap fx-center-center'>
                  <span className={`icon iconfont ${item.icon}`}></span>
                </div>
                {index == current && (
                  <span className='title'>{item.title}</span>
                )}
              </Space>
              {index == steps.length - 1 ? null : (
                <div className='line'>
                  <Divider />
                </div>
              )}
            </Fragment>
          ))}
        </Space>
      }
      footer={
        <Flex justify='space-between' align='center'>
          <div></div>
          <Button onClick={() => setShow(false)}>取消</Button>
        </Flex>
      }
      maskClosable={false}
      closable={false}
      classNames={{ header: 'modal-header', body: 'modal-body' }}
      wrapClassName='welcome-pay-modal'
      destroyOnClose>
      {current == 0 && <Plp />}
    </Modal>
  )
}
export default forwardRef(Fn)
