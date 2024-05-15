import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
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
import type { TimePickerProps, DatePickerProps } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { saveFixedMenu } from '@/api'
import { API } from 'apis'
import { ActionFormItems } from '@/pages/rcs/template/create/components/actionForm'
import './editDialog.scss'
import formRules from '@/utils/formRules'
import type {
  ActionType,
  SuggestionItem,
  DialerActionType,
} from '@/pages/rcs/template/create/type'
import { Action } from '@/pages/rcs/template/create/type'

interface Props {
  open: boolean
  onCancel: () => void
}
interface OpenParams {}
type RichText = {
  label?: string
  text: string
  b: boolean
  i: boolean
  u: boolean
  min: number
  max: number
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const [actions, setactions] = useState<Action[]>([
    {
      displayText: '按钮',
      urlAction: {
        openUrl: {
          application: 'browser',
          url: '',
        },
      },
    },
  ])

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  const { Option } = Select
  type PickerType = 'time' | 'date'
  const PickerWithType = ({
    type,
    onChange,
  }: {
    type: PickerType
    onChange: TimePickerProps['onChange'] | DatePickerProps['onChange']
  }) => {
    if (type === 'time') return <TimePicker onChange={onChange} />
    if (type === 'date') return <DatePicker onChange={onChange} />
    return <DatePicker picker={type} onChange={onChange} />
  }

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [type, setType] = useState<PickerType>('time')

  const open = (params: OpenParams) => {}

  // 提审
  const submit = async () => {
    let msg_suggestions: SuggestionItem[] = actions.map((item) => {
      console.log(item, 'itemitemitem')
      return { action: item }
    })

    const message = {
      menu: {
        entries: {
          suggestions: msg_suggestions,
        },
        layout: {},
      },
    }
    let params: API.SaveFixedMenuParams = {
      appid: '111',
      message: JSON.stringify({ message }),
    }

    console.log(params, 'paramsparamsparams')
  }

  const handleOk = async () => {
    // const values = await form.getFieldsValue()
    // console.log(values, 'values')
    submit()
  }

  const handleCancel = () => {
    props.onCancel()
  }

  useEffect(() => {
    if (open && form) {
      form.resetFields()
    }
  }, [open, form])
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
  const detailEventData = [
    {
      value: '4',
      label: '链接事件',
    },
    {
      value: '5',
      label: '拨号事件',
    },
    {
      value: '6',
      label: '地图事件',
    },
    {
      value: '7',
      label: '日历事件',
    },
  ]
  const mapFatData = [
    {
      value: '1',
      label: '显示指定地图位置',
    },
    {
      value: '2',
      label: '发送地理位置到Chatbot',
    },
  ]

  const changemeanType = (value) => {
    if (value == 3) {
      form.setFieldValue('detailEvent', '4')
    }
  }
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
      title='编辑主菜单事件'
      width={480}
      style={{ top: 200 }}
      data-class='chose-editDlog'
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
            <Form.Item label='菜单标题' name='displayText'>
              <Input placeholder='请设置该菜单的标题文本' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='菜单类型' name='meanType'>
              <Select
                placeholder='请选择'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={mainOptions}
                onChange={changemeanType}
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
                      name='account'
                      validateTrigger='onSubmit'></Form.Item>

                    <Form.Item
                      hidden={meanType != '2'}
                      label='回复事件'
                      name='reply'
                      required>
                      <Input placeholder='请设置该菜单的回复文本' />
                    </Form.Item>

                    <Form.Item
                      hidden={meanType != '3'}
                      label=''
                      validateTrigger='onSubmit'
                      name='detailEvent'>
                      {/* <Select
                        placeholder='请选择'
                        optionFilterProp='children'
                        fieldNames={{ label: 'label', value: 'value' }}
                        filterOption={(input, option) =>
                          (option?.label + option.value ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={detailEventData}
                      /> */}
                      <ActionFormItems onchangeType={changeType} />
                    </Form.Item>
                  </Col>

                  <ProFormDependency name={['detailEvent']} hidden>
                    {({ detailEvent }) => {
                      return (
                        <>
                          <Col span={24}>
                            <Form.Item
                              hidden={detailEvent != '4' || meanType != '3'}
                              label='链接url'
                              name='url'
                              validateTrigger='onSubmit'
                              rules={[
                                {
                                  required: true,
                                  message: '请输入',
                                },
                                {
                                  validator: formRules.validateUrl,
                                },
                              ]}>
                              <Input placeholder='请输入链接' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '5' || meanType != '3'}
                              label='被叫号码'
                              name='mob'>
                              <Input placeholder='请输入手机号码' />
                            </Form.Item>

                            {/* 地图事件 */}
                            <Form.Item
                              hidden={detailEvent != '6' || meanType != '3'}
                              label='地图方式'
                              validateTrigger='onSubmit'
                              name='mapFa'>
                              <Select
                                placeholder='请选择'
                                optionFilterProp='children'
                                defaultValue={mapFatData[0]}
                                fieldNames={{
                                  label: 'label',
                                  value: 'value',
                                }}
                                filterOption={(input, option) =>
                                  (option?.label + option.value ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                options={mapFatData}
                              />
                            </Form.Item>
                            <Form.Item
                              hidden={detailEvent != '6' || meanType != '3'}
                              label='地图标签'
                              name='mobTip'>
                              <Input placeholder='请输入地图标签' />
                            </Form.Item>
                            <Form.Item
                              hidden={detailEvent != '6' || meanType != '3'}
                              label='经度'
                              name='jingdu'>
                              <Input placeholder='请输入经度' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '6' || meanType != '3'}
                              label='纬度'
                              name='weidu'>
                              <Input placeholder='请输入纬度' />
                            </Form.Item>

                            {/*日历事件  */}
                            <Form.Item
                              hidden={detailEvent != '7' || meanType != '3'}
                              label='日历名称'
                              validateTrigger='onSubmit'
                              name='date'>
                              <div className='startTimeCont'>
                                <label>开始时间</label>
                                <Space direction='vertical'>
                                  <DatePicker onChange={onChange} />
                                </Space>
                                <Space>
                                  <PickerWithType
                                    type={type}
                                    onChange={(value) => console.log(value)}
                                  />
                                </Space>
                              </div>

                              <div className='endTimeCont'>
                                <label>结束时间</label>
                                <Space direction='vertical'>
                                  <DatePicker onChange={onChange} />
                                </Space>
                                <Space>
                                  <PickerWithType
                                    type={type}
                                    onChange={(value) => console.log(value)}
                                  />
                                </Space>
                              </div>
                            </Form.Item>
                          </Col>
                        </>
                      )
                    }}
                  </ProFormDependency>
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
