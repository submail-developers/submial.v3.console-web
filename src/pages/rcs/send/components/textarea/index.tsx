import { useEffect, useState } from 'react'
import { Input, Row, Col } from 'antd'
import { getPhoneLineBreak } from '@/utils'

type Props = {
  initValues: string
  onChange: (value: string) => void
}
export default function Fn(props: Props) {
  const [value, setValue] = useState<string>()
  const [number, setNumber] = useState(0)
  const changeVal = (e) => {
    let val = e.target.value as string
    setValue(getPhoneLineBreak(val))
    props.onChange(val)
  }
  useEffect(() => {
    if (value) {
      let num =
        (value.match(/\n/g) || []).length + (value.endsWith('\n') ? 0 : 1)
      setNumber(num)
    } else {
      setNumber(0)
    }
  }, [value])

  // 切换type后回显之前修改的值
  useEffect(() => {
    if (props.initValues) {
      setValue(props.initValues)
    }
  }, [])
  return (
    <div className='p-24 contacts-content'>
      <Row gutter={{ xs: 12, sm: 16, lg: 24 }}>
        <Col span={8} lg={6}>
          <div style={{ textAlign: 'right' }}>
            <div className='fn16 primary-color m-b-4'>手机号列表</div>
            <div>号码一共有{number}行</div>
          </div>
        </Col>
        <Col span={16} lg={18}>
          <Input.TextArea
            value={value}
            style={{ maxWidth: 360 }}
            autoSize={{ minRows: 8, maxRows: 20 }}
            placeholder='请输入联系人手机号码，多个联系人请每行输入一个手机号码'
            onChange={changeVal}
          />
        </Col>
        <Col span={24}>
          <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 fn12 m-t-24'>
            <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
            支持复制并粘贴txt文件的号码到手动输入框，建议一次十万左右个号码，以免造成浏览器卡顿。
          </div>
        </Col>
      </Row>
    </div>
  )
}
