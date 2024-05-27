import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react'
import {
  Modal,
  Form,
  App,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Space,
  TimePicker,
  InputNumber,
} from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { saveFixedMenu } from '@/api'
import { API } from 'apis'
import { ActionFormItems } from '@/pages/rcs/template/create/components/actionForm'
import dayjs from 'dayjs'
import './editDialog.scss'

interface Props {
  open: boolean

  chatbotId: string
  onCancel: () => void
  editList: any
  tip: string
}
interface OpenParams {}
const { Option } = Select

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  useEffect(() => {
    if (props.open) {
    }
  }, [props.open])

  const handleOk = async () => {
    const values = await form.getFieldsValue()
    console.log(values)

    if (values.action) {
      if (values.action.dialerAction) {
        // 电话事件
        const { dialType, ...rest } = values.action.dialerAction
        let _val = {
          action: {
            ...rest,
            ['displayText']: values.displayText,
          },
        }
        submit(_val)
      }
      if (values.action.mapAction) {
        // 地图事件
        const { mapType, ...rest } = values.action.mapAction
        let _val = {
          action: {
            ...rest,
            ['displayText']: values.displayText,
          },
        }
        submit(_val)
      }
      if (values.action.calendarAction) {
        // 日历事件
        const { mapType, ...rest } = values.action.calendarAction
        let _val = {
          action: {
            displayText: values.displayText,
            createCalendarEvent: {
              description:
                values.action.calendarAction.createCalendarEvent.description,
              fallbackUrl:
                values.action.calendarAction.createCalendarEvent.fallbackUrl,
              startTime:
                values.action.calendarAction.createCalendarEvent.timer[0].format(
                  'YYYY-MM-DDTHH:mm:ss[Z]',
                ),
              endTime:
                values.action.calendarAction.createCalendarEvent.timer[1].format(
                  'YYYY-MM-DDTHH:mm:ss[Z]',
                ),
              title: values.action.calendarAction.createCalendarEvent.title,
            },
          },
        }
        submit(_val)
      }
      if (values.action.urlAction) {
        submit(values)
      }
    } else {
      submit(values)
    }
  }
  // 确定
  const submit = async (values) => {
    switch (props.tip) {
      case 'Mainmenu1':
        break
    }
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const mainOptions = [
    {
      value: '1',
      label: '菜单',
    },
    {
      value: '2',
      label: '回复事件',
    },
    {
      value: '3',
      label: '交互事件',
    },
  ]

  // 切换类型后初始化
  const changeType = (val) => {
    switch (val) {
      case 'urlAction':
        form.setFieldsValue({
          urlAction: {
            openUrl: {
              application: 'browser',
            },
          },
        })
        break
      case 'dialerAction':
        form.setFieldsValue({
          type: 'dialerAction',
          dialerAction: {
            dialType: 'dialPhoneNumber',
          },
        })
        break
      case 'mapAction':
        form.setFieldsValue({
          type: 'mapAction',
          mapAction: {
            mapType: '0', // 地图类型 0经纬度1位置
          },
        })
        break
      default:
        break
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      onOk={handleOk}
      title='添加菜单事件'
      width={480}
      style={{ top: 200 }}
      data-class='edit-menu'
      closable={false}
      destroyOnClose
      wrapClassName='modal-reset'>
      <Form
        name='form-01'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label='菜单标题'
              name='displayText'
              validateTrigger='onSubmit'>
              <Input placeholder='请设置该菜单的标题文本' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='菜单类型'
              name='meanType'
              validateTrigger='onSubmit'>
              <Select
                placeholder='请选择'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={mainOptions}
              />
            </Form.Item>
          </Col>

          <ProFormDependency name={['meanType']}>
            {({ meanType }) => {
              return (
                <>
                  <Col span={24}>
                    <Form.Item
                      hidden={meanType != '1'}
                      label=''
                      name='menu'
                      validateTrigger='onSubmit'>
                      <input type='text' hidden />
                    </Form.Item>

                    <Form.Item
                      hidden={meanType != '2'}
                      label='回复事件'
                      name='menuReply'
                      required
                      validateTrigger='onSubmit'>
                      <Input placeholder='请设置该菜单的回复文本' />
                    </Form.Item>

                    <Form.Item
                      hidden={meanType != '3'}
                      validateTrigger='onSubmit'>
                      <ActionFormItems onchangeType={changeType} />
                    </Form.Item>
                  </Col>
                </>
              )
            }}
          </ProFormDependency>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
