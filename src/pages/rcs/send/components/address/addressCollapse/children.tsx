import { Row, Col, Image } from 'antd'
import { API } from 'apis'
import address_blue from '@/assets/rcs/address/address_blue.png'
import './children.scss'
type ChangeProps = {
  folder: string
  checkeds: string[]
}
type ChildrenItemProps = {
  item: API.AddressbooksItem[]
  checkeds: string[]
  onChange: (changeinfo: ChangeProps) => void
}

type ItemProps = {
  item: API.AddressbooksItem
  checked: boolean
  onChange: (checked: boolean) => void
}
const Item = (props: ItemProps) => {
  return (
    <div
      className={`address-item fx-col fx-y-center p-y-8 p-x-4 ${
        props.checked ? 'checked' : ''
      }`}
      onClick={() => props.onChange(!props.checked)}>
      <Image src={address_blue} preview={false} width={60} />
      <div className='name'>{props.item.addressbook_name}</div>
      <div className='num'>{props.item.address}个联系人</div>
      <div className='check-btn fx-center-center'>
        <span className='icon iconfont icon-yes fn12 fw-600 m-t-2 primary-color'></span>
      </div>
    </div>
  )
}
const ChildrenItem = (props: ChildrenItemProps) => {
  // 选中与取消
  const change = ({ checked, id, folder }) => {
    if (checked) {
      props.onChange({
        folder: folder,
        checkeds: [...props.checkeds, id],
      })
    } else {
      props.onChange({
        folder: folder,
        checkeds: props.checkeds.filter((item) => item != id),
      })
    }
  }
  return (
    <div className='address-collapse-children-content'>
      <Row gutter={[16, 16]} wrap>
        {props.item.map((item) => (
          <Col key={item.id}>
            <Item
              item={item}
              checked={props.checkeds.includes(item.id)}
              onChange={(checked: boolean) =>
                change({
                  checked: checked,
                  folder: item.folder,
                  id: item.id,
                })
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}
export default ChildrenItem
