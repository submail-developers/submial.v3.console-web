import { useParams, NavLink } from 'react-router-dom'
export default function Fn() {
  const { id } = useParams()

  return (
    <div className='send-list p-t-16'>
      <NavLink
        to={`/console/voiceChatbot/call/detail/${id}/sendList/called`}
        replace
        className={({ isActive, isPending }) =>
          isActive ? 'send-nav send-nav-active' : 'send-nav text-color'
        }>
        已外呼号码
      </NavLink>
      <NavLink
        to={`/console/voiceChatbot/call/detail/${id}/sendList/calling`}
        replace
        className={({ isActive, isPending }) =>
          isActive ? 'send-nav send-nav-active' : 'send-nav'
        }>
        未外呼号码
      </NavLink>
    </div>
  )
}
