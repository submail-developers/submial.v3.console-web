import { Flex, Row, Col } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { usePoint } from '@/hooks'
import { API } from 'apis'

type Props = {
  data?: API.VCGadeRateItem[]
}

const color = ['#006BFC', '#55BBFA', '#A8CFE7', '#DBDBDB']
const names = ['A', 'B', 'C', 'D']

export default function Fn(props: Props) {
  const point = usePoint('xxl')
  let data: number[] = [0, 0, 0, 0] // 数量
  let dataRate: (string | number)[] = [0, 0, 0, 0] // 比例
  let total: number = 0 // 总数
  if (props.data) {
    props.data.forEach((item) => {
      let index = names.findIndex((im) => item.intention == im)
      data[index] = Number(item.num)
    })
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
    color,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      show: false,
      orient: 'vertical',
      itemWidth: 16,
      itemHeight: 16,
      left: 'center',
      top: 'center',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['54%', '82%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          position: 'inner',
          fontSize: 12,
          color: '#282b31',
        },
        emphasis: {
          label: {
            show: false,
          },
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
    <Row gutter={[16, 16]}>
      <Col span={24} md={24} lg={12}>
        <Flex justify='flex-end' align='center'>
          <ReactEcharts
            option={option}
            style={{ width: point ? 210 : '100%', height: 160 }}
          />
        </Flex>
      </Col>
      <Col span={24} md={24} lg={12}>
        <Flex justify='center' align='center' className='h-100'>
          <div className='w-100 p-x-12' style={{ maxWidth: 360 }}>
            {data.map((item, index) => (
              <Flex gap={12} className='w-100 p-y-4' align='center' key={index}>
                <div
                  className='icon g-radius-50'
                  style={{
                    backgroundColor: color[index],
                    width: 12,
                    height: 12,
                  }}></div>
                <Flex
                  justify='space-between'
                  align='center'
                  className='fx-auto'>
                  <span className='gray-color'>{names[index]}类客户</span>
                  <span>
                    {Number(item).toLocaleString()}
                    <span className='gray-color-sub'>
                      （{dataRate[index]}%）
                    </span>
                  </span>
                </Flex>
              </Flex>
            ))}
          </div>
        </Flex>
      </Col>
    </Row>
  )
}
