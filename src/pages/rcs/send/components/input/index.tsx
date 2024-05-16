import { useEffect, useState } from 'react'
import { Input, Form, Row, Col, List } from 'antd'
import './index.scss'

type Props = {
  initValues: string
  onChange: (value: string) => void
}

type InputItemProps = {
  initValue: string
  onChange: (data: string | string[]) => void
}
const InputItem = (props: InputItemProps) => {
  const [value, setValue] = useState<string>()
  useEffect(() => {
    if (props.initValue) {
      setValue(props.initValue)
    }
  }, [props.initValue])
  const changeVal = (e) => {
    let val = e.target.value as string
    setValue(val)
  }
  const blurEvent = (e) => {
    let val = e.target.value as string
    props.onChange(val)
  }
  const pasteVal = (event) => {
    // 取消默认粘贴行为
    event.preventDefault()
    // 获取粘贴内容
    var pastedText = (event.clipboardData || window.Clipboard).getData('text')
    let values = pastedText.split(',')
    setValue(values[0])
    props.onChange(values)
  }

  return (
    <Input
      value={value}
      onChange={changeVal}
      onBlur={blurEvent}
      onPaste={pasteVal}
    />
  )
}

export default function Fn(props: Props) {
  const [values, setValues] = useState<string[]>([''])
  const change = (val, i) => {
    if (Array.isArray(val)) {
      let newVal = [...values]
      Array.prototype.splice.apply(newVal, [i, 1].concat(val))
      setValues(newVal)
    } else {
      setValues((prev) => {
        return [
          ...prev.map((item, index) => {
            if (i == index) {
              item = val
            }
            return item
          }),
        ]
      })
    }
  }
  const add = () => {
    setValues([...values, ''])
  }
  const del = (i) => {
    if (values.length == 1) return
    setValues((prev) => {
      return [
        ...prev.filter((item, index) => {
          if (i != index) {
            return item
          }
        }),
      ]
    })
  }
  useEffect(() => {
    props.onChange(values.join(','))
  }, [values])
  useEffect(() => {
    console.log(props.initValues)
    if (props.initValues) {
      setValues(props.initValues.split(','))
    }
  }, [])
  return (
    <>
      <div className='p-24 contacts-content'>
        <Row className='send-address-input'>
          <Col span={24} lg={20} xxl={16}>
            <div className='input-list'>
              <div className='input-item header fx-y-center'>
                <div className='mobile'>手机号码</div>
                <div className='add'>添加行</div>
                <div className='del'>减少行</div>
              </div>
              {values.map((item, index) => (
                <div className='input-item fx-y-center' key={index}>
                  <div className='mobile'>
                    <InputItem
                      initValue={item}
                      onChange={(val) => change(val, index)}
                    />
                  </div>
                  <div className='add'>
                    <div className='handle-btn' onClick={add}>
                      <span className='icon iconfont icon-jia fn18'></span>
                    </div>
                  </div>
                  <div className='del'>
                    <div className='handle-btn' onClick={() => del(index)}>
                      <span className='icon iconfont icon-jian fn18'></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 fn12 m-t-24'>
        <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
        支持复制并粘贴txt文件的号码到手动输入框，建议一次不超过1万个号码，以免造成浏览器卡顿。
      </div>
    </>
  )
}
