import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import ASmsVerify from '@/components/aSmsVerify'

import { useRef } from 'react'
import { Dropdown, Button } from 'antd'

type Props = {
  useCode: boolean
  items: MenuProps['items']
  onExportEvent: (key: string) => void
}

/**
 * 导出
 * @param useCode 是否需要验证码
 * @items MenuProps['items']
 * @event onExportEvent (key: string) => void 导出，key导出类型
 */
export default function AExport(props: Props) {
  const ref = useRef(null)
  const keyRef = useRef('')
  const exportEvent = ({ key }) => {
    keyRef.current = key
    // 偏好设置-导出时需要输入手机验证码
    if (props.useCode) {
      ref.current.open()
    } else {
      props.onExportEvent(key)
    }
  }
  // 验证码验证通过
  const verifySuccess = () => {
    props.onExportEvent(keyRef.current)
  }
  return (
    <>
      <Dropdown
        className='export'
        menu={{ items: props.items, selectable: true, onClick: exportEvent }}
        trigger={['click']}>
        <Button type='primary' className='fx-y-center'>
          <span className='m-r-8'>导 出</span>
          <DownOutlined rev={null} />
        </Button>
      </Dropdown>
      <ASmsVerify ref={ref} onSuccess={verifySuccess} />
    </>
  )
}
