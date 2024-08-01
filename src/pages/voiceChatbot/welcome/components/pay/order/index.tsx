import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Row, Col, Image, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useStateStore } from '../reducer'
import dayjs from 'dayjs'

import alipayimg from '@/assets/rcs/welcome/alipay.svg'
import wechatpayimg from '@/assets/rcs/welcome/wechatpay.svg'

import './index.scss'
import { API } from 'apis'

const QRCodePay = ({ orderId }: { orderId: string }) => {
  return (
    <Row className='p-y-24'>
      <Col span={12} className='fx-col fx-y-center'>
        <div className='fn16'>支付二维码</div>
        <Image
          src={`https://www.mysubmail.com/payment/qrcode/${orderId}`}
          preview={false}
          width={200}
        />
      </Col>
      <Col span={12}>
        <Row gutter={16}>
          <Col span={10}>
            <Image src={alipayimg} preview={false} />
          </Col>
          <Col span={10}>
            <Image src={wechatpayimg} preview={false} />
          </Col>
        </Row>
        <div className='m-t-16'>
          请打开支付宝或微信使用扫一扫功能，扫描左侧二维码进行扫码支付
        </div>
        <div className='color-warning-yellow g-radius-4 p-x-16 p-y-8 fn13 m-t-16'>
          <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
          支付金额较大时，使用微信支付可能遇到限额问题，建议使用支付宝支付。
        </div>
      </Col>
    </Row>
  )
}
const WebPay = ({ orderId }: { orderId: string }) => {
  return (
    <div className='p-y-20 web-pay'>
      <div className='text-center fn16'>网页在线支付</div>
      <NavLink
        to={`/payment/aliwebpay/${orderId}`}
        target='__blank'
        className='p-24 g-radius-4 fx-around-center link m-t-12'>
        <Image src={alipayimg} preview={false} width={100} />
        <span className='text-color'>前往支付宝网页支付</span>
      </NavLink>
    </div>
  )
}
const BankPay = ({ orderInfo }: { orderInfo: API.CreateOrderRes }) => {
  return (
    <div className='p-y-24 bank-pay'>
      <div className='text-center'>
        请将您的订单款项使用您的公司对公账户转账至:
      </div>
      <div className='order-info p-t-24 p-x-24' style={{ maxWidth: 'none' }}>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>开户银行</div>
          <div className='value'>招商银行 上海金沙江路支行</div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>户名</div>
          <div className='value'>上海赛邮云计算有限公司</div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>银行账号</div>
          <div className='value'>1219 2204 6510902</div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>应转账金额</div>
          <div className='value color'>
            ¥{orderInfo && orderInfo.price.toLocaleString()}
          </div>
        </div>
      </div>
      <div className='m-t-16 fn12'>
        请将本页的订单号附在转账备注上，我们在收到您的转账后对该订单自动进行处理，您还可以在转账成功后，前往工单页面向我们提交您的转账凭证,以便我们加速处理您的转账。
      </div>

      <div className='color-warning-red g-radius-4 p-x-16 p-y-12 fn12 m-t-12'>
        <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
        该账户为公司账户，仅支持公对公转账，不支持个人银行转账！请使用公司账户进行转账，且需要与您填写的开票信息一致。
      </div>
    </div>
  )
}

export default function Fn() {
  const state = useStateStore()
  const [activeKey, setactiveKey] = useState('1')

  const onChange = (key: string) => {
    setactiveKey(key)
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '扫码支付',
      children: <QRCodePay orderId={state.orderInfo?.ordernumber || ''} />,
    },
    {
      key: '2',
      label: '网页支付',
      children: <WebPay orderId={state.orderInfo?.ordernumber || ''} />,
    },
    {
      key: '3',
      label: '公对公银行转账',
      children: <BankPay orderInfo={state.orderInfo} />,
    },
  ]
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <div className='tabs'>
      {items.map((item) => (
        <div
          key={item.key}
          className={`tab-item ${activeKey == item.key ? 'active' : ''}`}
          onClick={() => setactiveKey(item.key)}>
          {item.label}
        </div>
      ))}
    </div>
  )
  return (
    <div className='pay-order'>
      <div className='order-info'>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>订单编号</div>
          <div className='value color'>
            {state.orderInfo && state.orderInfo.ordernumber}
          </div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>订单日期</div>
          <div className='value'>
            {state.orderInfo &&
              dayjs(state.orderInfo.create_at).format(
                'YYYY年MM月DD日 HH:mm:ss',
              )}
          </div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>商品合计</div>
          <div className='value'>
            ¥{state.orderInfo && state.orderInfo.price.toLocaleString()}
          </div>
        </div>
        <div className='order-item fx-y-center'>
          <div className='label text-right'>应支付金额</div>
          <div className='value color'>
            ¥{state.orderInfo && state.orderInfo.price.toLocaleString()}
          </div>
        </div>
      </div>
      <Tabs
        renderTabBar={renderTabBar}
        items={items}
        activeKey={activeKey}
        className='m-t-24'
        onChange={onChange}
      />
    </div>
  )
}
