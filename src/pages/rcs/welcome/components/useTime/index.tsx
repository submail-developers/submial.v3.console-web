import { useEffect, useRef, useState } from 'react'
import { Flex, Row, Col, Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { usePoint } from '@/hooks'

type formatterItem = {
  color: string
  dataIndex: number
  name: string
  percent: number
  value: number
}

type Props = {}

const color = ['#0698EC', '#47D1CB']

export default function Fn(props: Props) {
  const ref = useRef(null)
  const point = usePoint('xxl')
  const initData = [
    { value: 1048, name: '3s至6s' },
    { value: 735, name: '小于3s' },
  ]
  const [chartData, setChartData] = useState([])
  const formatterRef = useRef<formatterItem[]>([])
  const timer = useRef(null)

  const updataFormMatter = (params) => {
    if (
      formatterRef.current.find((item) => item.dataIndex == params.dataIndex)
    ) {
      formatterRef.current = formatterRef.current.map((item) => {
        if (item.dataIndex == params.dataIndex) {
          item = {
            color: params.color,
            dataIndex: params.dataIndex,
            name: params.name,
            percent: params.percent,
            value: params.value,
          }
          return item
        }
        return item
      })
    } else {
      formatterRef.current = [
        ...formatterRef.current,
        {
          color: params.color,
          dataIndex: params.dataIndex,
          name: params.name,
          percent: params.percent,
          value: params.value,
        },
      ]
    }
  }

  const option = {
    color,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)', // 提示框内容格式
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
          // show: false,
          position: 'inner',
          fontSize: 12,
          formatter: function (params) {
            updataFormMatter(params)
            return params.percent + '%'
          },
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
        data: initData,
      },
    ],
  }
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setChartData(formatterRef.current)
    }, 1000)
  }, [])
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={24} lg={12} xl={24} xxl={12}>
        <Flex justify='center' align='center'>
          <ReactEcharts
            option={option}
            style={{ width: point ? 210 : '100%', height: 240 }}
            ref={ref}
          />
        </Flex>
      </Col>
      <Col span={24} md={24} lg={12} xl={24} xxl={12}>
        <Flex justify='center' align='center' className='h-100'>
          <div className='w-100 p-x-12'>
            {chartData.map((item, index) => (
              <Flex
                gap={12}
                className='w-100 p-y-4'
                align='center'
                key={item.name}>
                <div
                  className='icon g-radius-50'
                  style={{
                    backgroundColor: item.color,
                    width: 12,
                    height: 12,
                  }}></div>
                <Flex
                  justify='space-between'
                  align='center'
                  className='fx-auto'>
                  <span className='gray-color'>{item.name}</span>
                  <span>
                    {item.value.toLocaleString()}（{item.percent}%）
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
