import { Row, Col, Flex, Space } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { API } from 'apis'
import Big from 'big.js'

type Props = {
  dropreason: API.AnalysisDropreasonItem[]
}
const color = ['#FF4D4F', '#ffba00', '#fd7e14']
const names = ['无法投递消息', '短信签名受限', '网关黑名单']

export default function Fn(props: Props) {
  let data: (string | number)[] = ['0', '0', '0'] // 数量
  let dataRate: (string | number)[] = ['0', '0', '0'] // 比例
  let total: number = 0 // 总数
  if (props.dropreason.length > 0) {
    props.dropreason.forEach((item, index) => {
      data[index] = item.cnt
      total += Number(item.cnt)
    })
  }
  if (total != 0) {
    dataRate[0] = ((Number(data[0]) / total) * 100).toFixed(2)
    dataRate[1] = ((Number(data[1]) / total) * 100).toFixed(2)
    let _total = new Big(100)
    dataRate[2] = _total.minus(dataRate[0]).minus(dataRate[1]).toFixed(2)
  }

  const option = {
    color: color,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },

    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '50%'],
        label: {
          position: 'inner',
          fontSize: 12,
          formatter: function (params) {
            return params.percent + '%'
          },
          color: '#282b31',
        },

        labelLine: {
          show: false,
        },

        data: [
          {
            name: props.dropreason[0]?.reason || names[0],
            value: data[0],
          },
          {
            name: props.dropreason[1]?.reason || names[1],
            value: data[1],
          },
          { name: props.dropreason[2]?.reason || names[2], value: data[2] },
        ],
      },
    ],
  }
  return (
    <Row>
      <Col span={24} xxl={12}>
        <ReactEcharts option={option} style={{ height: 240 }} />
      </Col>
      <Col span={24} xxl={12}>
        <Flex
          align='center'
          justify='center'
          className='h-100 p-x-12'
          style={{ flexDirection: 'column', minHeight: 120 }}>
          {data.map((item, index) => (
            <Flex
              key={index}
              align='center'
              justify='space-between'
              className='m-y-6 w-100'>
              <Space align='center'>
                <div
                  className='g-radius-50'
                  style={{
                    backgroundColor: color[index],
                    width: 16,
                    height: 16,
                  }}></div>
                <div>{props.dropreason[index]?.reason || names[index]}</div>
              </Space>
              <div>
                {Number(item).toLocaleString()}
                <span className='gray-color-sub'>（{dataRate[index]}%）</span>
              </div>
            </Flex>
          ))}
        </Flex>
      </Col>
    </Row>
  )
}
