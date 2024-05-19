import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Input, Row, Col, Table, Form } from 'antd'
import './index.scss'

type Props = {
  vars: string[]
}

const Fn = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const [form] = Form.useForm()
  const varsItemRef = useRef({})

  const getValues = async () => {
    const values = await form.getFieldsValue()
    return values
  }

  const pasteEvent = async (event, name) => {
    const values = await form.getFieldsValue()
    // 取消默认粘贴行为
    event.preventDefault()
    // 获取粘贴内容
    let pastedText = (event.clipboardData || window.Clipboard).getData('text')
    let numbers = pastedText.split(',')
    let new_address_data = []
    numbers.forEach((item) => {
      new_address_data.push({
        to: item,
        vars: { ...varsItemRef.current },
      })
    })
    let newVal = [...values.address_data]
    Array.prototype.splice.apply(newVal, [name, 1].concat(new_address_data))
    console.log(newVal, new_address_data, 'ee')
    form.setFieldsValue({
      address_data: newVal,
    })
  }

  const initDataSource = () => {
    props.vars.forEach((key) => {
      varsItemRef.current[key] = ''
    })
    form.setFieldsValue({
      address_data: [{ to: '', vars: { ...varsItemRef.current } }],
    })
  }
  useEffect(() => {
    initDataSource()
  }, [props.vars])
  return (
    <>
      <div className='p-24 contacts-content input-content'>
        <Form form={form} className='tabs'>
          <Form.List name='address_data'>
            {(fields, { add, remove }) => (
              <>
                <div className='fx tr'>
                  <div className='tab-cell'>
                    <Form.Item>
                      <div className='cell-title'>手机号</div>
                    </Form.Item>
                  </div>
                  {props.vars.map((item) => (
                    <div className='tab-cell var' key={item}>
                      <Form.Item>
                        <div className='cell-title'>{`${item} 变量`}</div>
                      </Form.Item>
                    </div>
                  ))}
                  <div className='tab-cell var'>
                    <Form.Item>
                      <div className='handle'>添加行</div>
                    </Form.Item>
                  </div>
                  <div className='tab-cell var'>
                    <Form.Item>
                      <div className='handle'>减少行</div>
                    </Form.Item>
                  </div>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <div className='fx tr' key={key}>
                    <div className='tab-cell'>
                      <Form.Item {...restField} name={[name, 'to']}>
                        <Input
                          placeholder=''
                          onPaste={(e) => pasteEvent(e, name)}
                        />
                      </Form.Item>
                    </div>
                    {props.vars.map((item, index) => (
                      <div className='tab-cell var' key={`${key}-${item}`}>
                        <Form.Item {...restField} name={[name, 'vars', item]}>
                          <Input placeholder='' />
                        </Form.Item>
                      </div>
                    ))}
                    <div className='tab-cell var'>
                      <Form.Item>
                        <div className='handle'>
                          <div className='handle-btn' onClick={() => add()}>
                            <span className='icon iconfont icon-jia'></span>
                          </div>
                        </div>
                      </Form.Item>
                    </div>
                    <div className='tab-cell var'>
                      <Form.Item>
                        <div className='handle'>
                          <div
                            className='handle-btn'
                            onClick={() => remove(name)}>
                            <span className='icon iconfont icon-jian'></span>
                          </div>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                ))}
                {fields.length == 0 && (
                  <div
                    className='fx-center-center p-t-16'
                    onClick={() => add()}>
                    <div className='handle-add fx-center-center color-status-primary'>
                      <span className='icon iconfont icon-jia '></span>
                    </div>
                  </div>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </div>
      <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
        <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
        支持复制并粘贴txt文件的号码到手动输入框，建议一次不超过1万个号码，以免造成浏览器卡顿。
      </div>
    </>
  )
}

export default forwardRef(Fn)
