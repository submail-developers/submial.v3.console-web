import { Breadcrumb } from 'antd'
import { useMatches } from 'react-router-dom'
import './index.scss'
export default function MyBreadcrumb() {
  const match = useMatches()
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

  return <Breadcrumb items={list} className='breadcrumb'></Breadcrumb>
}
