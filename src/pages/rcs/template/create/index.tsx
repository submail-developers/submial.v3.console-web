import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/store/hook'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useEffect } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from 'react-dnd-multi-backend'
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
}
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
    <DndProvider options={HTML5toTouch}>
      <Outlet />
    </DndProvider>
  )
}
