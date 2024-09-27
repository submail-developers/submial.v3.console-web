import { useEffect, useState } from 'react'
import { Modal, Form, App, Input } from 'antd'
import { testTalk } from '@/api'
import formRules from '@/utils/formRules'

interface Props {
  id: string
  open: boolean
  onCancel: () => void
}

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}

export default function Fn(props: Props) {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.resetFields()
  }, [props.open])

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const res = await testTalk({
        id: props.id,
        ...values,
      })
      if (res.status == 'success') {
        message.success('创建成功，请注意接听电话', 5)
      }
      props.onCancel()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='测试话术'
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <Form
        name='form-test-talk'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item
          label='测试号码'
          name='mob'
          extra={
            <Extra>
              <div>说明：</div>
              <div>1.单个账号一天最多允许测试五次，每次1个号码；</div>
              <div>2.若出现”线路配置异常“提示，请联系客服配置通话路线。</div>
            </Extra>
          }
          rules={[
            {
              validator: formRules.validateMobile,
            },
          ]}>
          <Input placeholder='请输入手机号码' autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  )
}
