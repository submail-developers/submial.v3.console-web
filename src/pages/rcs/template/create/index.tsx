import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/store/hook'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useEffect } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const { Header, Sider, Content } = Layout

export default function Fn() {
  const dispatch = useAppDispatch()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { id } = params
  const name = decodeURIComponent(searchParams.get('name'))
  console.log(id, name)

  // useEffect(() => {
  //   if (id == '0') {
  //     dispatch(
  //       changeBreadcrumbItem({
  //         title: '编辑模版',
  //         index: 3,
  //       }),
  //     )
  //   }
  // }, [id])

  return (
    <DndProvider backend={HTML5Backend}>
      <Outlet />
    </DndProvider>
  )
}
