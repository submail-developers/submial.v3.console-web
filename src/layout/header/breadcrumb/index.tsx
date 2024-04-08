import { useState, useEffect } from 'react'
import { Breadcrumb } from 'antd'
import { useMatches } from 'react-router-dom'
import { useSize } from '@/hooks'
import { breadcrumbStatus, changeBreadcrumb } from '@/store/reducers/breadcrumb'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import './index.scss'
export default function MyBreadcrumb() {
  const items = useAppSelector(breadcrumbStatus)
  const dispatch = useAppDispatch()

  const size = useSize()
  const match = useMatches()

  useEffect(() => {
    const list = []
    match.forEach((item) => {
      let { data } = item
      let title = ''
      if (data) {
        title = (data as { breadName: string }).breadName
      }
      if (title) {
        list.push({
          href: item.pathname,
          title: title,
        })
      }
    })
    delete list[list.length - 1].href
    dispatch(changeBreadcrumb(list))
  }, [match])

  return (
    <Breadcrumb items={items} className={`breadcrumb ${size}`}></Breadcrumb>
  )
}
