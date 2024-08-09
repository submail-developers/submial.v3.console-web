import Nav from '../nav'
import { Outlet } from 'react-router-dom'
export default function Fn() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  )
}
