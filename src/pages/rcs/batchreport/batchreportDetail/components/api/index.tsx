import {} from 'react'
import { Image, Row, Col } from 'antd'

import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'

import { API } from 'apis'
import Big from 'big.js'

type Props = {
  address: string
  rate: API.AnalysisRate
}
export default function Fn(props: Props) {
  let totaoRate = new Big(100)
  let deliveryedRate = '0' // 发送成功率
  let droppedRate = '0' // 发送失败率
  let sendTotal = Number(props.rate.deliveryed) + Number(props.rate.dropped) // 发送总数
  if (sendTotal > 0) {
    deliveryedRate = (
      (Number(props.rate.deliveryed) / sendTotal) *
      100
    ).toFixed(2)
    droppedRate = totaoRate.minus(deliveryedRate).toFixed(2)
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} xs={12} lg={8} xxl={6}>
        <div
          className='fx-y-center p-12 g-radius-4'
          style={{ border: '1px solid #e6e6e6' }}>
          <Image src={apiIco1} preview={false} width={40} />
          <div className='m-l-20'>
            <div className='gray-color-sub'>API请求</div>
            <div>{Number(props.rate.request).toLocaleString()}</div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={12} lg={8} xxl={6}>
        <div
          className='fx-y-center p-12 g-radius-4'
          style={{ border: '1px solid #e6e6e6' }}>
          <Image src={apiIco3} preview={false} width={40} />
          <div className='m-l-20'>
            <div className='gray-color-sub'>实际收费</div>
            <div>{Number(props.rate.fee).toLocaleString()}</div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={12} lg={8} xxl={6}>
        <div
          className='fx-y-center p-12 g-radius-4'
          style={{ border: '1px solid #e6e6e6' }}>
          <Image src={apiIco2} preview={false} width={40} />
          <div className='m-l-20'>
            <div className='gray-color-sub'>发送成功</div>
            <div>
              <span>{Number(props.rate.deliveryed).toLocaleString()}</span>
              <span className='gray-color-sub'>（{deliveryedRate}%）</span>
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={12} lg={8} xxl={6}>
        <div
          className='fx-y-center p-12 g-radius-4'
          style={{ border: '1px solid #e6e6e6' }}>
          <Image src={apiIco4} preview={false} width={40} />
          <div className='m-l-20'>
            <div className='gray-color-sub'>发送失败</div>
            <div>
              <span>{Number(props.rate.dropped).toLocaleString()}</span>
              <span className='gray-color-sub'>（{droppedRate}%）</span>
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={12} lg={8} xxl={6}>
        <div
          className='fx-y-center p-12 g-radius-4'
          style={{ border: '1px solid #e6e6e6' }}>
          <Image src={apiIco5} preview={false} width={40} />
          <div className='m-l-20'>
            <div className='gray-color-sub'>联系人</div>
            <div>{Number(props.address).toLocaleString()}</div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
