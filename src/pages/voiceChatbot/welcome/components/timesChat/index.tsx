import { Row, Col, Flex, Space } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { API } from 'apis'

type Props = {
  data: API.VCTaskTraces
}
const color = ['#9DF3FF', '#47D1CB', '#0698EC', '#ffba00', '#FF4D4F']
const names = ['小于2次', '2-5次', '5-8次', '9次以上']

export default function Fn(props: Props) {
  let data: number[] = [0, 0, 0, 0] // 数量
  let dataRate: (string | number)[] = [0, 0, 0, 0] // 比例
  let total: number = 0 // 总数
  if (props.data) {
    data = [
      props.data.less_than_2_times,
      props.data.between_2_and_5_times,
      props.data.between_5_and_8_times,
      props.data.more_than_9_times,
    ].map((item) => Number(item))
    total = data.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0,
    )
    if (total > 0) {
      dataRate = [
        ((data[0] / total) * 100).toFixed(2),
        ((data[1] / total) * 100).toFixed(2),
        ((data[2] / total) * 100).toFixed(2),
        ((data[3] / total) * 100).toFixed(2),
      ]
    }
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
          { name: names[0], value: data[0] },
          { name: names[1], value: data[1] },
          { name: names[2], value: data[2] },
          { name: names[3], value: data[3] },
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
                <div>{names[index]}</div>
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
