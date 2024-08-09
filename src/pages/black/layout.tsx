import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useStateDispatch } from './reducer'

export default function Fn() {
  const dispatch = useStateDispatch()
  const loc = useLocation()

  useEffect(() => {
    if (loc.pathname) {
      // 获取产品的rootPath
      const regex = /\/console\/(.*?)\/black/
      const match = loc.pathname.match(regex)
      if (match) {
        const rootPath = match[1]
        dispatch({
          type: 'changeRootPath',
          payload: rootPath,
        })
      }
    }
  }, [loc])
  return <Outlet />
}
