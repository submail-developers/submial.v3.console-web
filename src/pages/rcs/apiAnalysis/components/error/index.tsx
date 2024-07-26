import { Row, Col, Flex, Space } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { API } from 'apis'
import { getRandomRedColor } from '@/utils'
// import Big from 'big.js'

type Props = {
  dropreason: API.AnalysisDropreasonItem[]
}
const defalutColor = [
  '#FF4D4F',
  '#ffba00',
  '#fd7e14',
  '#921C14',
  '#E87C7C',
  '#FFE68E',
  '#FF9F6A',
]

export default function Fn(props: Props) {
  let color = [...defalutColor] // 颜色
  let data: (string | number)[] = [] // 数量
  let dataRate: (string | number)[] = [] // 比例
  let total: number = 0 // 总数
  let seriesData = []
  if (props.dropreason.length > 0) {
    props.dropreason.forEach((item) => {
      total += Number(item.cnt)
    })
    props.dropreason.forEach((item, index) => {
      seriesData.push({
        name: item.reason,
        value: item.cnt,
      })
      data.push(item.cnt)
      if (total > 0) {
        dataRate[index] = ((Number(data[index]) / total) * 100).toFixed(2)
      }
    })
  }
  if (props.dropreason.length > defalutColor.length) {
    props.dropreason.forEach((item, index) => {
      if (index > defalutColor.length - 1) {
        color.push(getRandomRedColor())
      }
    })
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

        data: seriesData,
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
                <div>{props.dropreason[index]?.reason}</div>
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
