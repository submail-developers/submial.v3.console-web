import { Image, Row, Col, Space } from 'antd'
import { getAddressPath } from '@/pages/address/type'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { API } from 'apis'

type Props = {
  loading?: boolean
  address?: API.GetMobAddressbooksItems[] // 地址簿
  addressfile_oss_path?: string // 文件地址
}

export default function Fn(props: Props) {
  const { id } = useParams()
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
      {props.addressfile_oss_path && (
        <Col span={24}>
          <NavLink to={props.addressfile_oss_path} target='__blank'>
            <Space>
              <span className='icon iconfont icon-lianjie'></span>
              <span>外呼号码文件地址</span>
            </Space>
          </NavLink>
        </Col>
      )}
      {!(props.address.length > 0 || props.addressfile_oss_path) &&
        !props.loading && (
          <Col span={24}>
            <div className='gray-color'>
              手动粘贴的号码请查看
              <NavLink
                to={`/console/voiceChatbot/call/detail/${id}/sendList/called`}>
                外呼明细
              </NavLink>
            </div>
          </Col>
        )}
    </Row>
  )
}
