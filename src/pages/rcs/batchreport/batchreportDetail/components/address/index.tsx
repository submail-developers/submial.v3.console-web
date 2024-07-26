import { Row, Col, Image, Space } from 'antd'
import { NavLink } from 'react-router-dom'
import { API } from 'apis'
import { getAddressPath } from '@/pages/rcs/address/type'

type Props = {
  address: API.SendAddressItem[]
}

export default function Fn({ address }: Props) {
  return (
    <Row gutter={[16, 16]}>
      {address.map((item, index) => (
        <Col key={item.id} span={24} md={12} lg={8} xl={6}>
          <NavLink
            target='__blank'
            to={`/console/rcs/address/address/detail/${item.id}?name=${item.name}&tag=${item.tag}`}>
            <Space
              className='address-item p-x-12 p-y-12 g-radius-4 w-100'
              style={{ border: '1px solid #ddd' }}>
              <Image
                src={getAddressPath(Number(item.tag))}
                width={60}
                preview={false}
              />
              <div className='g-pointer text-color'>
                <div className='address-name'>{item.name}</div>
                <div className='address-number'>{item.address}个联系人</div>
              </div>
            </Space>
          </NavLink>
        </Col>
      ))}
    </Row>
  )
}
