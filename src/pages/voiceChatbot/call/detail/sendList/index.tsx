import { Outlet } from 'react-router-dom'
import Nav from './nav'
export default function Fn() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}
