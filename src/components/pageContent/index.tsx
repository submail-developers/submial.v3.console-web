import { ReactNode, useEffect, useState } from 'react'
import { Grid } from 'antd'
import { useLocalStorage } from '@/hooks'
import './index.scss'

type Points = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

type PageContentPoints = {
  [key in Points]?: string | number
}

type Props = PageContentPoints & {
  extClass?: string
  children: ReactNode
}

const defaultPoints: PageContentPoints = {
  xs: '100%',
  sm: '100%',
  md: '100%',
  lg: 700,
  xl: 920,
  xxl: 1200,
}

const pointList: Points[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

export default function PageContent(props: Props) {
  const points = Grid.useBreakpoint()
  const [currentPoint, setcurrentPoint] = useLocalStorage('currentPoint', 'xl')

  const style: PageContentPoints = { ...defaultPoints, ...props }

  useEffect(() => {
    const current = pointList.find((item) => {
      if (points[item]) {
        return item
      }
    })
    setcurrentPoint(current || 'xl')
  }, [points])
  return (
    <div
      data-class='page-content'
      className={`${props.extClass || ''}`}
      style={{ width: style[currentPoint] }}>
      {props.children}
    </div>
  )
}
