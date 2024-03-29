import { useRef, useEffect, useState } from 'react'
import echarts from '@/config/echart' // 引入 echartsConfig.ts
import { EChartsOption } from 'echarts/types/dist/echarts'

type Props = {
  option: EChartsOption
}
export default function SuccessRate(props: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  let chartInstance
  useEffect(() => {
    if (chartRef.current && props.option) {
      chartInstance = echarts.init(chartRef.current)
      chartInstance.setOption(props.option)

      return () => {
        if (chartInstance) {
          chartInstance.dispose()
          chartInstance = null
        }
      }
    }
  }, [props.option])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}
