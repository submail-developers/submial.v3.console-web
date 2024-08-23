import { useState, forwardRef, useImperativeHandle } from 'react'
import { Input, Row, Col, Form } from 'antd'
import { getPhoneLineBreak } from '@/utils'

type Props = {}
function Fn(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const [form] = Form.useForm()
  const [number, setNumber] = useState(0)
  const getValues = async () => {
    const { address_data } = await form.getFieldsValue()
    return address_data.replace(/\n/g, ',')
  }
  const changeVal = (e) => {
    let value = getPhoneLineBreak(e.target.value)
    form.setFieldValue('address_data', value)
    if (value) {
      let num =
        (value.match(/\n/g) || []).length + (value.endsWith('\n') ? 0 : 1)
      setNumber(num)
    } else {
      setNumber(0)
    }
  }

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
          <Form form={form} name='send-contacts-input-1'>
            <Form.Item name='address_data' className='m-b-0'>
              <Input.TextArea
                style={{ maxWidth: 360 }}
                autoSize={{ minRows: 8, maxRows: 20 }}
                placeholder='请输入联系人手机号码，多个联系人请每行输入一个手机号码'
                onChange={changeVal}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
            <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
            支持复制并粘贴txt文件的号码到手动输入框，建议一次十万左右个号码，以免造成浏览器卡顿。
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default forwardRef(Fn)
