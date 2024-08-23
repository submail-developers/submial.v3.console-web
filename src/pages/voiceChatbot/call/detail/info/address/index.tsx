import { Image, Row, Col, Space } from 'antd'
import { getAddressPath } from '@/pages/address/type'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { API } from 'apis'

type Props = {
  address: API.GetMobAddressbooksItems[]
}

export default function Fn(props: Props) {
  const loc = useLocation()
  const [rootPath, setRootPath] = useState('')
  useEffect(() => {
    if (loc.pathname) {
      // 获取产品的rootPath
      const regex = /\/console\/(.*?)\/call/
      const match = loc.pathname.match(regex)
      if (match) {
        const _rootPath = match[1]
        setRootPath(_rootPath)
      }
    }
  }, [loc])
  return (
    <Row gutter={[16, 12]}>
      {props?.address &&
        props?.address.map((item) => (
          <Col span={24} xl={12} xxl={8} key={item.id}>
            <NavLink
              to={`/console/${rootPath}/address/detail/${item.id}?name=${item.name}&tag=${item.tag}&folder=${item.folder}`}
              target='__blank'>
              <Space>
                <Image
                  preview={false}
                  width={40}
                  src={getAddressPath(Number(item.tag))}
                />
                <span>{item.name}</span>
              </Space>
            </NavLink>
          </Col>
        ))}
    </Row>
  )
}
