import { Row, Col, Image } from 'antd'
import ReactEcharts from 'echarts-for-react'
import type { Dayjs } from 'dayjs'
import { map } from 'lodash'
import Big from 'big.js'

import { API } from 'apis'

import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'

type Props = {
  time: [Dayjs, Dayjs]
  points: {
    request: API.PointItem[]
    deliveryed: API.PointItem[]
    dropped: API.PointItem[]
    fee: API.PointItem[]
  }
  rate: API.AnalysisRate
}
import './index.scss'
export default function Fn(props: Props) {
  let formattedDates = []
  // 生成时间段
  const startDate = props.time[0]
  const endDate = props.time[1]
  let currentDate = startDate
  while (
    currentDate.isSame(startDate) ||
    currentDate.isSame(endDate) ||
    currentDate.isBefore(endDate)
  ) {
    formattedDates.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }

  let request: API.PointItem[] = []
  let deliveryed: API.PointItem[] = []
  let dropped: API.PointItem[] = []
  let fee: API.PointItem[] = []
  formattedDates.forEach((item) => {
    request.push({
      cnt: props.points.request.find((i) => i.dateflg == item)?.cnt || 0,
      dateflg: item,
    })
    deliveryed.push({
      cnt: props.points.deliveryed.find((i) => i.dateflg == item)?.cnt || 0,
      dateflg: item,
    })
    dropped.push({
      cnt: props.points.dropped.find((i) => i.dateflg == item)?.cnt || 0,
      dateflg: item,
    })
    fee.push({
      cnt: props.points.fee.find((i) => i.dateflg == item)?.cnt || 0,
      dateflg: item,
    })
  })

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
  const option = {
    color: ['#1764ff', '#00a97b', '#f00011', '#ffba00'],
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: formattedDates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: map(request, 'cnt'),
        type: 'line',
        smooth: false,
        name: '发送',
      },
      {
        data: map(deliveryed, 'cnt'),
        type: 'line',
        smooth: false,
        name: '成功',
        lineStyle: {
          type: 'dashed',
        },
      },
      {
        data: map(dropped, 'cnt'),
        type: 'line',
        smooth: false,
        name: '失败',
        lineStyle: {
          type: 'dashed',
        },
      },
      {
        data: map(fee, 'cnt'),
        type: 'line',
        smooth: false,
        name: '计费',
        lineStyle: {
          type: 'dashed',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} xl={12}>
        <ReactEcharts option={option} style={{ height: 360 }} />
      </Col>
      <Col span={24} xl={12}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <div
              className='fx-y-center g-radius-4 p-12'
              style={{ border: '1px solid #e6e6e6' }}>
              <Image src={apiIco1} preview={false} width={40} />
              <div className='m-l-20'>
                <div className='gray-color-sub'>API请求</div>
                <div>{Number(props.rate.request).toLocaleString()}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div
              className='fx-y-center g-radius-4 p-12'
              style={{ border: '1px solid #e6e6e6' }}>
              <Image src={apiIco3} preview={false} width={40} />
              <div className='m-l-20'>
                <div className='gray-color-sub'>实际收费</div>
                <div>{Number(props.rate.fee).toLocaleString()}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div
              className='fx-y-center g-radius-4 p-12'
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
          <Col span={12}>
            <div
              className='fx-y-center g-radius-4 p-12'
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
          <Col span={12}>
            <div
              className='fx-y-center g-radius-4 p-12'
              style={{ border: '1px solid #e6e6e6' }}>
              <Image src={apiIco5} preview={false} width={40} />
              <div className='m-l-20'>
                <div className='gray-color-sub'>联系人</div>
                <div>{Number(props.rate.address).toLocaleString()}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
