import { NavLink } from 'react-router-dom'
import { Space } from 'antd'

type Props = {
  path: string
}

export default function Fn({ path }: Props) {
  return (
    <NavLink to={path} target='__blank'>
      <Space>
        <span className='icon iconfont icon-lianjie'></span>
        <span>联系人文件地址</span>
      </Space>
    </NavLink>
  )
}
