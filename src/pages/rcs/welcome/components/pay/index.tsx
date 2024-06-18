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
  Space,
  Spin,
  Divider,
  Button,
  ConfigProvider,
  Popconfirm,
} from 'antd'
import { useStateDispatch, useStateStore } from './reducer'
import { TinyColor } from '@ctrl/tinycolor'
import { API } from 'apis'

import Plp from './plp'
import Car from './car'
import Order from './order'
import PaySuccess from './success'

import './index.scss'
import {
  getRcsPackages,
  getInvoices,
  cancalOrder,
  getPayStatus,
  createOrder,
} from '@/api'
type Step = -1 | 0 | 1 | 2 | 3

type Props = {}

type FooterProps = {
  step: Step
  onCancel: () => void
  onChangeStep: (step: Step) => void
}

const colors = ['#30dd8a', '#2bb673']
const getHoverColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString())
const getActiveColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).darken(5).toString())

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

// 弹框底部
const Footer = (props: FooterProps) => {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const [payLoading, setPayLoading] = useState(false)
  const timerRef = useRef(null)

  // 创建订单
  const createOrderEvent = async () => {
    if (state.carsId.length == 0) return
    try {
      let shopcar: API.ShopcarItem[] = []
      state.packages.forEach((item) => {
        if (state.car[item.id]) {
          shopcar.push({
            ...item,
            vol: state.car[item.id],
          })
        }
      })
      // 创建订单
      const res = await createOrder({
        shopcar,
        invoice: state.invoiceId || 'none',
      })
      if (res.status == 'success') {
        dispatch({
          type: 'changeOrder',
          payload: res,
        })
        dispatch({
          type: 'changeStep',
          payload: 2,
        })
      }
    } catch (error) {}
  }

  // 取消订单
  const cancalOrderEvent = async () => {
    try {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      const res = await cancalOrder({
        ordernumber: state.orderInfo?.ordernumber || '',
      })
      if (res.status == 'success') {
        props.onCancel()
      }
    } catch (error) {}
  }

  const cancalWaitingOrder = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      props.onCancel()
    }
  }

  // 获取订单状态
  const getOrderPayStatus = async () => {
    setPayLoading(true)
    try {
      const res = await getPayStatus({
        ordernumber: state.orderInfo.ordernumber,
      })
      // 轮询查询订单状态
      if (res.order == 'pending') {
        timerRef.current = setTimeout(() => {
          if (state.step == -1) {
            return
          }
          getOrderPayStatus()
        }, 3000)
        // 支付成功
      } else if (res.order == 'complete') {
        setPayLoading(false)
        dispatch({
          type: 'changeStep',
          payload: 3,
        })
        // 取消订单
      } else {
        setPayLoading(false)
        props.onCancel()
      }
    } catch (error) {
      setPayLoading(false)
    }
  }

  // 再次购买
  const rePay = () => {
    dispatch({
      type: 'rePay',
      payload: {},
    })
  }

  useEffect(() => {
    if (state.orderInfo) {
      getOrderPayStatus()
    }
  }, [state.orderInfo])
  return (
    <Flex justify='space-between' align='center'>
      {(props.step == 0 || props.step == -1) && (
        <>
          {state.carsId.length > 0 ? (
            <Button
              type='link'
              onClick={() => props.onChangeStep(1)}
              className='p-x-0'>
              <Space size={4} align='center'>
                <span>创建订单</span>
                <div className='icon iconfont icon-xiangxia fn7 g-rotate-270'></div>
              </Space>
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={() => props.onCancel()}>取消</Button>
        </>
      )}
      {props.step == 1 && (
        <>
          <Space size={40} align='center'>
            <Button
              type='link'
              onClick={() => props.onChangeStep(0)}
              className='p-x-0'>
              <Flex gap={10} style={{ marginLeft: -6 }}>
                <div className='icon iconfont icon-xiangxia fn7 g-rotate-90'></div>
                <div className='icon iconfont icon-car fn14'></div>
                <span>增加资源包</span>
              </Flex>
            </Button>
            {state.carsId.length > 0 && (
              <Button
                type='link'
                onClick={() => createOrderEvent()}
                className='p-x-0'>
                <Flex gap={10}>
                  <span>立即支付</span>
                  <div className='icon iconfont icon-xiangxia fn7 g-rotate-270'></div>
                </Flex>
              </Button>
            )}
          </Space>
          <Button onClick={() => props.onCancel()}>取消</Button>
        </>
      )}
      {props.step == 2 && (
        <>
          <Space size={40} align='center'>
            <Popconfirm
              title='取消订单'
              description='确定取消该订单吗？'
              okText='确定'
              cancelText='取消'
              trigger={['click']}
              onConfirm={cancalOrderEvent}>
              <Button type='link' className='p-x-0'>
                取消订单
              </Button>
            </Popconfirm>
            <Button
              type='primary'
              loading={payLoading}
              onClick={createOrderEvent}>
              <span>正在等待支付结果</span>
            </Button>
          </Space>
          <Button onClick={cancalWaitingOrder}>取消</Button>
        </>
      )}
      {props.step == 3 && (
        <>
          <Button type='primary' onClick={() => rePay()}>
            再次购买
          </Button>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(180deg, ${colors.join(', ')})`,
                  colorPrimaryHover: `linear-gradient(180deg, ${getHoverColors(
                    colors,
                  ).join(', ')})`,
                  colorPrimaryActive: `linear-gradient(180deg, ${getActiveColors(
                    colors,
                  ).join(', ')})`,
                  lineWidth: 0,
                },
              },
            }}>
            <Button type='primary' onClick={() => props.onCancel()}>
              完成订单
            </Button>
          </ConfigProvider>
        </>
      )}
    </Flex>
  )
}

function Fn(props: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const dispatch = useStateDispatch()
  const state = useStateStore()
  const [show, setShow] = useState(false)

  // 获取资源包
  const getPackages = async () => {
    try {
      const res = await getRcsPackages()
      dispatch({
        type: 'initPackages',
        payload: res.packages,
      })
    } catch (error) {}
  }

  // 获取发票列表
  const getInvoiceList = async () => {
    try {
      const res = await getInvoices()
      if (res?.invoices) {
        dispatch({
          type: 'initInvoiceList',
          payload: res.invoices,
        })
        dispatch({
          type: 'changeInvoiceId',
          payload: '',
        })
      }
    } catch (error) {}
  }

  // 开启弹框
  const open = () => {
    getPackages()
    getInvoiceList()
    setShow(true)
  }
  const onCancel = () => {
    setShow(false)
    dispatch({
      type: 'changeStep',
      payload: -1,
    })
  }
  const onChangeStep = (step: Step) => {
    dispatch({
      type: 'changeStep',
      payload: step,
    })
  }
  return (
    <Modal
      open={show}
      onCancel={() => setShow(false)}
      width={700}
      title={
        <ConfigProvider
          theme={{
            token: {
              colorSplit: 'rgba(5, 5, 5, 0.2)',
            },
          }}>
          <Space size={12} align='center' className='fw-400'>
            {steps.map((item, index) => (
              <Fragment key={item.title}>
                <Space className={`${index == state.step ? 'color' : ''}`}>
                  <div className='icon-wrap fx-center-center'>
                    <span className={`icon iconfont ${item.icon}`}></span>
                  </div>
                  {index == state.step && (
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
        </ConfigProvider>
      }
      footer={
        <Footer
          step={state.step}
          onCancel={onCancel}
          onChangeStep={onChangeStep}
        />
      }
      maskClosable={false}
      closable={false}
      classNames={{ header: 'modal-header', body: 'modal-body' }}
      wrapClassName='welcome-pay-modal'
      destroyOnClose>
      {state.step == -1 && (
        <div className='fx-center-center m-y-40'>
          <Spin />
        </div>
      )}
      {state.step == 0 && <Plp />}
      {state.step == 1 && <Car />}
      {state.step == 2 && <Order />}
      {state.step == 3 && <PaySuccess />}
    </Modal>
  )
}
export default forwardRef(Fn)
