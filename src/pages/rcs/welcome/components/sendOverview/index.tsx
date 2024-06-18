import ReactEcharts from 'echarts-for-react'
import type { Dayjs } from 'dayjs'
import { map } from 'lodash'

import { API } from 'apis'

type Props = {
  time: [Dayjs, Dayjs]
  points: {
    request: API.PointItem[]
    deliveryed: API.PointItem[]
    dropped: API.PointItem[]
  }
}

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
    formattedDates.push(currentDate.format('M/D'))
    currentDate = currentDate.add(1, 'day')
  }

  const option = {
    color: ['#1764ff', '#00a97b', '#f00011'],
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
        data: map(props.points?.request, 'cnt'),
        type: 'line',
        smooth: false,
        name: '发送',
      },
      {
        data: map(props.points?.deliveryed, 'cnt'),
        type: 'line',
        smooth: false,
        name: '成功',
        lineStyle: {
          type: 'dashed',
        },
      },
      {
        data: map(props.points?.dropped, 'cnt'),
        type: 'line',
        smooth: false,
        name: '失败',
        lineStyle: {
          type: 'dashed',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }

  return <ReactEcharts option={option} style={{ height: 360 }} />
}
