import { useEffect, useRef } from 'react'
import { Spin } from 'antd'
import { API } from 'apis'
import dayjs from 'dayjs'
import ReactEcharts from 'echarts-for-react'

const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const hours = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

type Props = {
  hotPoints: API.HotPointItem[]
}
export default function MyTour(props: Props) {
  let dataObj = {}
  let data = []
  props.hotPoints.forEach((item) => {
    let day = dayjs(item.dateflg).day()
    let hours = Number(item.hourflg)
    let value = Number(item.cnt)
    if (dataObj[`${day}-${hours}`]) {
      dataObj[`${day}-${hours}`] += value
    } else {
      dataObj[`${day}-${hours}`] = value
    }
  })

  let max = 200
  let values = Object.values(dataObj)
  if (values.length > 0) {
    max = Math.max.apply(null, Object.values(dataObj))
  }
  for (let key in dataObj) {
    data.push([
      Number(key.split('-')[0]),
      Number(key.split('-')[1]),
      dataObj[key],
    ])
  }
  const option = {
    tooltip: {
      position: 'top',
      // textStyle: { color: '#282b31' },
      formatter: function (params) {
        let startTime = hours[params.value[1]]
        let endTime = hours[params.value[1] + 1] || hours[0]
        let text = `${
          params.name
        } ${startTime} - ${endTime}</br >发送：<b>${params.value[2].toLocaleString()}</b>`
        return text
      },
    },
    grid: {
      height: '93%',
      top: '0%',
      left: '0%',
    },
    xAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      position: 'right',
      data: hours,
      inverse: true,
      splitArea: {
        show: true,
      },
      // nameTextStyle: {
      //   fontSize: 10,
      // },
    },
    visualMap: [
      {
        bottom: '-100%', // 隐藏
        min: 0,
        max: max,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        inRange: {
          color: ['#afd0fb', 'rgba(23, 100, 255, 1)'],
        },
        textStyle: {
          color: '#282b31',
        },
      },
    ],
    labelLayout: {
      labelRect: { width: 20, height: 20 },
      rect: { width: 20, height: 20 },
    },
    series: [
      {
        name: '发送时段',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          // minMargin: 10,
          color: 'inherit', // #282b31 inherit
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  return <ReactEcharts option={option} style={{ height: 360 }} />
}
