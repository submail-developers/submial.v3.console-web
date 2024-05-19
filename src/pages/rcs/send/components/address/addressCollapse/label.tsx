import { Flex, Checkbox } from 'antd'
import type { CheckboxProps, GetProp } from 'antd'
import { API } from 'apis'
type ChangeProps = {
  folder: string
  checkeds: string[]
}
// 折叠面板label
type LabelItemProps = {
  item: API.AddressbooksItem[]
  checkeds: string[]
  onChange: (changeinfo: ChangeProps) => void
}
const LabelItem = (props: LabelItemProps) => {
  let name = ''
  let folder = ''
  if (props.item.length > 0) {
    name =
      props.item[0].folder == '0' ? '所有地址簿' : props.item[0].folder_name
    folder = props.item[0].folder
  }
  // 是否全选/一个都没选
  const checkAll = props.checkeds.length == props.item.length
  // 是否未全选
  const indeterminate =
    props.checkeds.length != 0 && props.checkeds.length != props.item.length
  // 修改选中状态
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    let checkeds = []
    if (e.target.checked) {
      props.item.forEach((item) => checkeds.push(item.id))
    }
    props.onChange({
      folder,
      checkeds: checkeds,
    })
  }
  return (
    <Flex justify='space-between' align='center'>
      <span>{name}</span>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}>
        全选
      </Checkbox>
    </Flex>
  )
}

export default LabelItem
