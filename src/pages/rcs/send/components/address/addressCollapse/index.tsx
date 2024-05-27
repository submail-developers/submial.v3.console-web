import { useState, forwardRef, useImperativeHandle } from 'react'
import { Collapse, Space } from 'antd'
import type { CollapseProps } from 'antd'
import { API } from 'apis'
import LabelItem from './label'
import ChildrenItem from './children'

import './index.scss'

type Props = {
  books: API.AddressbooksItem[][]
}
type CheckedIds = {
  [key in string]: string[]
}

// 折叠面板按钮
const expandIcon = (panelProps) => {
  return (
    <Space align='center'>
      <div
        className={`g-transition-300 ${
          panelProps.isActive ? 'g-rotate-180' : 'g-rotate-0'
        }`}>
        <span
          className='icon iconfont icon-xiangxia'
          style={{ fontSize: 7 }}></span>
      </div>
      <span className='fn14'>{panelProps.isActive ? '收起' : '展开'}</span>
    </Space>
  )
}

function Fn(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const [checkedIds, setcheckedIds] = useState<CheckedIds>({})
  const change = ({ folder, checkeds }) => {
    setcheckedIds({ ...checkedIds, [folder]: checkeds })
  }
  const getValues = () => {
    // 将checkedIds的value输出为一位数组
    return Object.values(checkedIds).flat()
  }

  let _items: CollapseProps['items'] = []
  props.books.forEach((item, index) => {
    let checkeds = []
    if (item.length > 0) {
      checkeds = checkedIds[item[0].folder] || []
    }
    _items.push({
      key: `${index}`,
      label: <LabelItem item={item} checkeds={checkeds} onChange={change} />,
      children: (
        <ChildrenItem item={item} checkeds={checkeds} onChange={change} />
      ),
    })
  })

  return (
    <Collapse
      className='address-collapse'
      items={_items}
      defaultActiveKey={['0']}
      bordered={false}
      collapsible='icon'
      expandIconPosition='end'
      expandIcon={expandIcon}
      ghost
    />
  )
}

export default forwardRef(Fn)
