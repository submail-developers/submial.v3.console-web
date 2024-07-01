import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  ReactNode,
} from 'react'
import { Modal, Form, Input, Space, Statistic, App } from 'antd'
import type { CountdownProps } from 'antd'
import { verifyDefaultMobCode, getDefaultMobCode } from '@/api'

type Props = {
  title?: ReactNode
  onSuccess: () => void
  onCancel?: () => void
}

const { Search } = Input
const { Countdown } = Statistic

const time = 60 // 倒计时-秒

const EnterButton = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      showTime,
      getStatus,
    }
  })

  const [show, setShow] = useState(false) // 显示倒计时
  const [value, setValue] = useState<number>(0) // 倒计时停止的时间戳

  // 倒计时结束
  const onFinish: CountdownProps['onFinish'] = () => {
    setShow(false)
  }
  //显示倒计时
  const showTime = () => {
    setValue(Date.now() + 1000 * time)
    setShow(true)
  }
  // 返回是否正在倒计时
  const getStatus = (): boolean => {
    return show
  }

  return (
    <Space style={{ width: 70 }} align='center'>
      {!show ? (
        <div className='text-center'>获取验证码</div>
      ) : (
        <div className='fx-center-center' style={{ width: 70 }}>
          <Countdown
            title=''
            value={value}
            format='ss'
            onFinish={onFinish}
            valueStyle={{ color: '#fff' }}
          />
        </div>
      )}
    </Space>
  )
})

/**
 * 默认短信验证
 * @event onSuccess 验证通过
 */
function Fn(props: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const { message } = App.useApp()
  const enterRef = useRef(null)
  const [form] = Form.useForm()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const open = () => {
    form.resetFields()
    setShow(true)
  }
  const handleOk = async () => {
    setLoading(true)
    try {
      const { code } = await form.validateFields()
      if (!code) {
        form.setFields([
          {
            name: 'code',
            errors: ['请输入验证码'],
          },
        ])
        setLoading(false)
        return
      }
      const res = await verifyDefaultMobCode({
        code,
      })
      if (res.status == 'success') {
        // 验证通过
        props.onSuccess()
        setShow(false)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const getCode = async () => {
    try {
      if (enterRef.current.getStatus()) {
        return
      }
      setSendLoading(true)
      const res = await getDefaultMobCode()
      if (res.status == 'success') {
        enterRef.current.showTime()
        message.success('验证码已发送')
      }
      setSendLoading(false)
    } catch (error) {
      setSendLoading(false)
    }
  }
  const onCancel = () => {
    if ('onCancel' in props) {
      props.onCancel()
    }
    setShow(false)
  }

  return (
    <Modal
      onOk={handleOk}
      confirmLoading={loading}
      open={show}
      onCancel={onCancel}
      title={props.title || '短信验证'}
      width={500}>
      <Form
        name='setting-add-mob'
        form={form}
        labelCol={{ span: 4 }}
        layout='horizontal'
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item label='验证码' name='code' required>
          <Search
            placeholder='请输入验证码'
            allowClear={false}
            loading={sendLoading}
            enterButton={<EnterButton ref={enterRef} />}
            onSearch={getCode}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(Fn)
