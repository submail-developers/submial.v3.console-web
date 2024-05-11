import { CSSProperties, useEffect, memo } from 'react'
import {
  Input,
  Form,
  Select,
  Radio,
  InputNumber,
  Row,
  Col,
  DatePicker,
} from 'antd'
import dayjs from 'dayjs'
import { ProFormDependency } from '@ant-design/pro-components'
import {
  actions,
  actionTypeArray,
  dialerActionTypeArray,
} from '@/pages/rcs/template/create/type'
import type {
  ActionType,
  DialerActionType,
} from '@/pages/rcs/template/create/type'

import formRules from '@/utils/formRules'
import './index.scss'

type Props = {
  data: any[]
  activeIndex: number
  onChange: (values, activeIndex) => void
  name: string // 表单名
}

const { RangePicker } = DatePicker
const ActionForm = memo(({ activeIndex, data, onChange, name }: Props) => {
  const [form] = Form.useForm()

  // 每次修改activeIndex后回显当前的表单，增加表单需要的额外类型值
  useEffect(() => {
    if (form && activeIndex != -1) {
      form.resetFields()
      let actionKey = Object.keys(data[activeIndex]).find((key) =>
        actionTypeArray.includes(key as ActionType),
      )
      if (actionKey) {
        let actionVal = data[activeIndex][actionKey]
        setInitValue(actionKey, actionVal)
      } else {
        form.setFieldsValue({
          type: 'urlAction',
          urlAction: {
            openUrl: {
              application: 'browser',
              url: '',
            },
          },
        })
      }
    }
  }, [form, activeIndex])

  const setInitValue = (actionKey: string, actionVal) => {
    switch (actionKey) {
      case 'urlAction':
        form.setFieldsValue({
          type: actionKey,
          [actionKey]: actionVal,
        })
        break
      case 'dialerAction':
        // 获取拨号方式
        let dialerTypeKey = Object.keys(actionVal).find((key) =>
          dialerActionTypeArray.includes(key as DialerActionType),
        )
        form.setFieldsValue({
          type: actionKey,
          [actionKey]: { ...actionVal, dialType: dialerTypeKey },
        })
        break
      case 'mapAction':
        // 地图类型 0经纬度1位置
        let mapType = '0'
        if (actionVal?.showLocation) {
          mapType = Number(
            Boolean('query' in actionVal.showLocation.location),
          ).toString()
        }

        form.setFieldsValue({
          type: actionKey,
          [actionKey]: { ...actionVal, mapType: mapType },
        })
        break
      case 'calendarAction':
        let timer
        if (
          actionVal.createCalendarEvent.startTime &&
          actionVal.createCalendarEvent.endTime
        ) {
          timer = [
            dayjs(actionVal.createCalendarEvent.startTime),
            dayjs(actionVal.createCalendarEvent.endTime),
          ]
        }
        form.setFieldsValue({
          type: actionKey,
          [actionKey]: { createCalendarEvent: { ...actionVal, timer } },
        })
        break
      default:
        break
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

  // 每次字段值更新时就更新父组件传过来的值
  const onFieldsChange = (changedFields, allFields) => {
    // 修改事件类型时使用form.setFieldsValue了，需要在这个事件之后再获取表单值
    setTimeout(async () => {
      let values = await form.getFieldsValue()
      let params = {}
      // 剔除不要的值
      for (const key in values) {
        switch (key) {
          case 'displayText':
          case 'postback':
          case 'urlAction':
            params[key] = values[key]
            break
          case 'dialerAction':
            delete values[key].dialType
            params[key] = values[key]
            break
          case 'mapAction':
            delete values[key].mapType
            params[key] = values[key]
            break
          case 'calendarAction':
            params[key] = {
              createCalendarEvent: {},
            }
            let {
              title = '',
              description = '',
              timer,
              fallbackUrl = '',
            } = values[key]['createCalendarEvent']
            params[key]['createCalendarEvent']['title'] = title
            params[key]['createCalendarEvent']['description'] = description
            params[key]['createCalendarEvent']['fallbackUrl'] = fallbackUrl
            if (timer) {
              let startTime = timer[0].format('YYYY-MM-DDTHH:mm:ss[Z]')
              let endTime = timer[1].format('YYYY-MM-DDTHH:mm:ss[Z]')
              params[key]['createCalendarEvent']['startTime'] = startTime
              params[key]['createCalendarEvent']['endTime'] = endTime
            } else {
              params[key]['createCalendarEvent']['startTime'] = ''
              params[key]['createCalendarEvent']['endTime'] = ''
            }
            break
          default:
            break
        }
      }
      onChange(params, activeIndex)
    }, 0)
  }

  return (
    <Form
      name={name}
      className='rcs-action-form'
      form={form}
      layout='vertical'
      autoComplete='off'
      validateTrigger='onBlur'
      onFieldsChange={onFieldsChange}>
      <Form.Item name='type' label='事件类型'>
        <Select options={actions} onChange={changeType} />
      </Form.Item>

      <ProFormDependency name={['type']}>
        {({ type }) => {
          return (
            <>
              {type == 'urlAction' && (
                <>
                  <Form.Item
                    label='浏览器类型'
                    name={[type, 'openUrl', 'application']}
                    initialValue='browser'>
                    <Radio.Group>
                      <Radio value={'browser'}>内置浏览器</Radio>
                      <Radio value={'webview'}>默认浏览器</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <ProFormDependency name={[type, 'openUrl', 'application']}>
                    {({
                      urlAction: {
                        openUrl: { application },
                      },
                    }) => {
                      return (
                        <>
                          {application == 'webview' && (
                            <Form.Item
                              initialValue='full'
                              label='浏览器打开方式'
                              name={[type, 'viewMode']}>
                              <Radio.Group>
                                <Radio value={'full'}>全屏</Radio>
                                <Radio value={'half'}>半屏</Radio>
                                <Radio value={'tall'}>浮屏</Radio>
                              </Radio.Group>
                            </Form.Item>
                          )}
                        </>
                      )
                    }}
                  </ProFormDependency>
                  <Form.Item
                    label='链接地址'
                    name={[type, 'openUrl', 'url']}
                    initialValue=''
                    rules={[
                      {
                        required: true,
                        message: '请输入',
                      },
                      {
                        validator: formRules.validateUrl,
                      },
                    ]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                  <Form.Item
                    label='链接参数（选填）'
                    name={[type, 'openUrl', 'parameters']}
                    initialValue=''
                    rules={[
                      {
                        validator: formRules.validateByteLength(200),
                      },
                    ]}>
                    <Input.TextArea
                      placeholder='格式：id=123&keyword=abc，最多200个字节'
                      autoSize={{ minRows: 2, maxRows: 3 }}
                    />
                  </Form.Item>
                </>
              )}
              {type == 'dialerAction' && (
                <>
                  <Form.Item
                    label='通话类型'
                    name={[type, 'dialType']}
                    initialValue='dialPhoneNumber'>
                    <Radio.Group>
                      <Radio value={'dialPhoneNumber'}>普通通话</Radio>
                      <Radio value={'dialEnrichedCall'}>增强通话</Radio>
                      <Radio value={'dialVideoCall'}>视频通话</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <ProFormDependency name={[type, 'dialType']}>
                    {({ dialerAction: { dialType } }) => {
                      return (
                        <>
                          <Form.Item
                            label='被叫号码'
                            name={[type, dialType, 'phoneNumber']}
                            initialValue=''
                            rules={[
                              {
                                required: true,
                                message: '请输入',
                              },
                            ]}>
                            <Input placeholder='请输入' />
                          </Form.Item>
                          <Form.Item
                            label='话单推送地址（选填）'
                            initialValue=''
                            name={[type, dialType, 'fallbackUrl']}>
                            <Input placeholder='请输入' />
                          </Form.Item>
                        </>
                      )
                    }}
                  </ProFormDependency>
                </>
              )}
              {type == 'mapAction' && (
                <>
                  <Form.Item
                    label='类型'
                    name={[type, 'mapType']}
                    initialValue='0'>
                    <Radio.Group>
                      <Radio value={'0'}>经纬度</Radio>
                      <Radio value={'1'}>地址搜索</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <ProFormDependency name={[type, 'mapType']}>
                    {({ mapAction: { mapType } }) => {
                      return (
                        <>
                          {mapType == '0' && (
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  label='经度'
                                  name={[
                                    type,
                                    'showLocation',
                                    'location',
                                    'longitude',
                                  ]}
                                  initialValue=''
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入',
                                    },
                                  ]}>
                                  <InputNumber
                                    placeholder='请输入'
                                    changeOnWheel={false}
                                    max={180}
                                    min={-180}
                                    step={0.00000000000001}
                                    precision={14}
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  label='纬度'
                                  name={[
                                    type,
                                    'showLocation',
                                    'location',
                                    'latitude',
                                  ]}
                                  initialValue=''
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入',
                                    },
                                  ]}>
                                  <InputNumber
                                    placeholder='请输入'
                                    changeOnWheel={false}
                                    max={180}
                                    min={-180}
                                    step={0.00000000000001}
                                    precision={14}
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          )}
                          {mapType == '1' && (
                            <Form.Item
                              label='地址'
                              name={[type, 'showLocation', 'location', 'query']}
                              initialValue=''
                              rules={[
                                {
                                  required: true,
                                  message: '请输入',
                                },
                                {
                                  validator: formRules.validateByteLength(200),
                                },
                              ]}>
                              <Input.TextArea
                                placeholder='请输入'
                                autoSize={{ minRows: 2, maxRows: 3 }}
                              />
                            </Form.Item>
                          )}
                        </>
                      )
                    }}
                  </ProFormDependency>

                  <Form.Item
                    label='标签（选填）'
                    name={[type, 'showLocation', 'location', 'label']}
                    initialValue=''
                    rules={[
                      {
                        required: false,
                        validator: formRules.validateByteLength(100),
                      },
                    ]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                  <Form.Item
                    label='消息推送地址（选填）'
                    name={[type, 'showLocation', 'fallbackUrl']}
                    initialValue=''
                    rules={[
                      {
                        validator: formRules.validateUrl,
                      },
                    ]}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </>
              )}
              {type == 'calendarAction' && (
                <>
                  <Form.Item
                    label='日程主题'
                    rules={[
                      {
                        required: true,
                        message: '请输入',
                      },
                    ]}
                    name={[type, 'createCalendarEvent', 'title']}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                  <Form.Item
                    label='日程描述'
                    name={[type, 'createCalendarEvent', 'description']}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                  <Form.Item
                    label='开始时间 - 结束时间'
                    required
                    name={[type, 'createCalendarEvent', 'timer']}
                    rules={[
                      {
                        required: true,
                        message: '请选择',
                      },
                    ]}>
                    <RangePicker
                      showTime={true}
                      format='YYYY-MM-DD HH:mm:ss'
                      placeholder={['开始时间', '结束时间']}
                    />
                  </Form.Item>
                  <Form.Item
                    label='回落地址'
                    name={[type, 'createCalendarEvent', 'fallbackUrl']}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </>
              )}
            </>
          )
        }}
      </ProFormDependency>
    </Form>
  )
})

export default ActionForm
