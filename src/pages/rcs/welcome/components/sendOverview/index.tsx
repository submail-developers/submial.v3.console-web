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
    formattedDates.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }

  let request: API.PointItem[] = []
  let deliveryed: API.PointItem[] = []
  let dropped: API.PointItem[] = []

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
  })

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
    ],
    tooltip: {
      trigger: 'axis',
    },
  }

  return <ReactEcharts option={option} style={{ height: 360 }} />
}
