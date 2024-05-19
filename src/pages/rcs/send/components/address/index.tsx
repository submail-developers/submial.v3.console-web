import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Collapse, Space } from 'antd'
import type { CollapseProps } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import Item from './item'
import { API } from 'apis'
import { getSendAddress } from '@/api'

// 折叠面板按钮
const expandIcon = (panelProps) => {
  return (
    <Space align='center'>
      <div
        className={`g-transition-300 ${
          panelProps.isActive ? 'g-rotate-180' : 'g-rotate-0'
        }`}>
        <span className='icon iconfont icon-xiangxia fn12'></span>
      </div>
      <span>{panelProps.isActive ? '收起' : '展开'}</span>
    </Space>
  )
}
// 折叠面板label
type LabelItemProps = {
  item: API.AddressbooksItem[]
}
const LabelItem = (props: LabelItemProps) => {
  return <div>123</div>
}

// 地址簿导入
type Props = {}
const Fn = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const [books, setBooks] = useState<API.AddressbooksItem[][]>([])
  const [items, setItems] = useState<CollapseProps['items']>([])
  const getValues = () => {}

  const getAddress = async () => {
    try {
      const res = await getSendAddress({
        page: 1,
        type: 1,
      })
      let _items = []
      if (Array.isArray(res.addressbooks)) {
        setBooks(res.addressbooks)
        res.addressbooks.forEach((item, index) => {
          _items.push({
            key: `${index}`,
            label: <LabelItem item={item} />,
            children: <p>{1}</p>,
          })
        })
      } else {
        Object.values(res.addressbooks).forEach((item, index) => {
          _items.push({
            key: `${index}`,
            label: '123',
            children: <p>{1}</p>,
          })
        })
      }
      setItems(_items)
    } catch (error) {}
  }

  useEffect(() => {
    getAddress()
  }, [])
  return (
    <div className='p-24 contacts-content address-content'>
      <Collapse
        items={items}
        defaultActiveKey={['0']}
        bordered={false}
        collapsible='icon'
        expandIconPosition='right'
        expandIcon={expandIcon}
      />
    </div>
  )
}

export default forwardRef(Fn)
