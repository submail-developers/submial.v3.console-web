import { useEffect, memo } from 'react'
import {
  Input,
  Form,
  Select,
  Radio,
  InputNumber,
  Row,
  Col,
  DatePicker,
  ConfigProvider,
} from 'antd'
import dayjs from 'dayjs'
import { ProFormDependency } from '@ant-design/pro-components'
import {
  btnTypes,
  menuTypes,
  actions,
  actionTypeArray,
  dialerActionTypeArray,
} from '@/pages/rcs/template/create/type'
import type {
  ActionType,
  DialerActionType,
} from '@/pages/rcs/template/create/type'

import formRules from '@/utils/formRules'
import { usePoint } from '@/hooks'
import './index.scss'

type Props = {
  data: any[]
  activeIndex: number
  cardsIndex?: number
  onChange: (values, activeIndex) => void
  name: string // 表单名
}

const { RangePicker } = DatePicker

type ActionFormItemsParams = {
  onchangeType: (e) => void
  isMainMenuConfig?: boolean // 是否为主菜单
}
export const ActionFormItems = (props: ActionFormItemsParams) => {
  const point = usePoint('xs')
  return (
    <>
      <Form.Item name='btntype' label='按钮类型'>
        <Radio.Group
          options={props.isMainMenuConfig ? menuTypes : btnTypes}></Radio.Group>
      </Form.Item>
      <ProFormDependency name={['btntype']}>
        {({ btntype }) => {
          return (
            <>
              {btntype == 'menu' && (
                <>
                  <Form.Item
                    hidden
                    label='菜单名称'
                    name={[btntype, 'displayText']}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                </>
              )}
              {btntype == 'reply' && (
                <>
                  <Form.Item
                    hidden
                    label='回复内容'
                    name={[btntype, 'displayText']}>
                    <Input placeholder='请输入' />
                  </Form.Item>
                  <Form.Item
                    hidden
                    label='postback'
                    name={[btntype, 'postback', 'data']}>
                    <Input placeholder='' />
                  </Form.Item>
                </>
              )}

              {btntype == 'action' && (
                <>
                  <Form.Item
                    name='type'
                    label='交互类型'
                    initialValue={'urlAction'}>
                    <Select options={actions} onChange={props.onchangeType} />
                  </Form.Item>
                  <Form.Item
                    hidden
                    label='postback'
                    name={[btntype, 'postback', 'data']}>
                    <Input placeholder='' />
                  </Form.Item>

                  <ProFormDependency name={['type']}>
                    {({ type }) => {
                      return (
                        <>
                          {type == 'urlAction' && (
                            <>
                              <Form.Item
                                label='浏览器类型'
                                name={[
                                  'action',
                                  type,
                                  'openUrl',
                                  'application',
                                ]}
                                initialValue='browser'>
                                <Radio.Group>
                                  <Radio value={'browser'}>内置浏览器</Radio>
                                  <Radio value={'webview'}>默认浏览器</Radio>
                                </Radio.Group>
                              </Form.Item>
                              <ProFormDependency
                                name={[
                                  'action',
                                  type,
                                  'openUrl',
                                  'application',
                                ]}>
                                {({
                                  action: {
                                    urlAction: {
                                      openUrl: { application },
                                    },
                                  },
                                }) => {
                                  return (
                                    <>
                                      {application == 'webview' && (
                                        <Form.Item
                                          initialValue='full'
                                          label='浏览器打开方式'
                                          name={['action', type, 'viewMode']}>
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
                                name={['action', type, 'openUrl', 'url']}
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
                                name={['action', type, 'openUrl', 'parameters']}
                                initialValue=''
                                rules={[
                                  {
                                    validator:
                                      formRules.validateByteLength(200),
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
                                name={['action', type, 'dialType']}
                                initialValue='dialPhoneNumber'>
                                <Radio.Group>
                                  <Radio value={'dialPhoneNumber'}>
                                    普通通话
                                  </Radio>
                                  <Radio value={'dialEnrichedCall'}>
                                    增强通话
                                  </Radio>
                                  <Radio value={'dialVideoCall'}>
                                    视频通话
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                              <ProFormDependency
                                name={['action', type, 'dialType']}>
                                {({
                                  action: {
                                    dialerAction: { dialType },
                                  },
                                }) => {
                                  return (
                                    <>
                                      <Form.Item
                                        label='被叫号码'
                                        name={[
                                          'action',
                                          type,
                                          dialType,
                                          'phoneNumber',
                                        ]}
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
                                        name={[
                                          'action',
                                          type,
                                          dialType,
                                          'fallbackUrl',
                                        ]}>
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
                                name={['action', type, 'mapType']}
                                initialValue='0'>
                                <Radio.Group>
                                  <Radio value={'0'}>经纬度</Radio>
                                  <Radio value={'1'}>地址搜索</Radio>
                                </Radio.Group>
                              </Form.Item>

                              <ProFormDependency
                                name={['action', type, 'mapType']}>
                                {({
                                  action: {
                                    mapAction: { mapType },
                                  },
                                }) => {
                                  return (
                                    <>
                                      {mapType == '0' && (
                                        <Row gutter={16}>
                                          <Col span={24}>
                                            <Form.Item
                                              label='经度'
                                              name={[
                                                'action',
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
                                                'action',
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
                                          name={[
                                            'action',
                                            type,
                                            'showLocation',
                                            'location',
                                            'query',
                                          ]}
                                          initialValue=''
                                          rules={[
                                            {
                                              required: true,
                                              message: '请输入',
                                            },
                                            {
                                              validator:
                                                formRules.validateByteLength(
                                                  200,
                                                ),
                                            },
                                          ]}>
                                          <Input.TextArea
                                            placeholder='请输入'
                                            autoSize={{
                                              minRows: 2,
                                              maxRows: 3,
                                            }}
                                          />
                                        </Form.Item>
                                      )}
                                    </>
                                  )
                                }}
                              </ProFormDependency>

                              <Form.Item
                                label='标签（选填）'
                                name={[
                                  'action',
                                  type,
                                  'showLocation',
                                  'location',
                                  'label',
                                ]}
                                initialValue=''
                                rules={[
                                  {
                                    required: false,
                                    validator:
                                      formRules.validateByteLength(100),
                                  },
                                ]}>
                                <Input placeholder='请输入' />
                              </Form.Item>
                              <Form.Item
                                label='消息推送地址（选填）'
                                name={[
                                  'action',
                                  type,
                                  'showLocation',
                                  'fallbackUrl',
                                ]}
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
                                name={[
                                  'action',
                                  type,
                                  'createCalendarEvent',
                                  'title',
                                ]}>
                                <Input placeholder='请输入' />
                              </Form.Item>
                              <Form.Item
                                label='日程描述'
                                name={[
                                  'action',
                                  type,
                                  'createCalendarEvent',
                                  'description',
                                ]}>
                                <Input placeholder='请输入' />
                              </Form.Item>
                              <Form.Item
                                label='开始时间 - 结束时间'
                                required
                                name={[
                                  'action',
                                  type,
                                  'createCalendarEvent',
                                  'timer',
                                ]}
                                rules={[
                                  {
                                    required: true,
                                    message: '请选择',
                                  },
                                ]}>
                                <ConfigProvider
                                  theme={{
                                    components: {
                                      DatePicker: {
                                        cellWidth: point ? 22 : 36,
                                        cellHeight: point ? 22 : 24,
                                      },
                                    },
                                  }}>
                                  <RangePicker
                                    showTime={true}
                                    className='w-100'
                                    format='YYYY-MM-DD HH:mm:ss'
                                    placeholder={['开始时间', '结束时间']}
                                  />
                                </ConfigProvider>
                              </Form.Item>

                              <Form.Item
                                label='回落地址'
                                name={[
                                  'action',
                                  type,
                                  'createCalendarEvent',
                                  'fallbackUrl',
                                ]}>
                                <Input placeholder='请输入' />
                              </Form.Item>
                            </>
                          )}
                        </>
                      )
                    }}
                  </ProFormDependency>
                </>
              )}
            </>
          )
        }}
      </ProFormDependency>
    </>
  )
}

const ActionForm = memo(
  ({ activeIndex, cardsIndex, data, onChange, name }: Props) => {
    const [form] = Form.useForm()

    // 每次修改activeIndex后回显当前的表单，增加表单需要的额外类型值
    useEffect(() => {
      if (form && activeIndex != -1) {
        form.resetFields()
        let dataItem = data[activeIndex]
        let itemAction = dataItem['action']
        let replyAction = dataItem['reply']
        if (itemAction) {
          form.setFieldValue(
            ['action', 'postback', 'data'],
            itemAction?.postback?.data || '',
          )
          let actionKey = Object.keys(itemAction).find((key) =>
            actionTypeArray.includes(key as ActionType),
          )
          if (actionKey) {
            let actionVal = itemAction[actionKey]
            setInitValue(actionKey, actionVal)
          } else {
            form.setFieldsValue({
              btntype: 'action',
              type: 'urlAction',
              action: {
                urlAction: {
                  openUrl: {
                    application: 'browser',
                    url: '',
                  },
                },
              },
            })
          }
        } else {
          form.setFieldsValue({
            btntype: 'reply',
            reply: replyAction,
          })
        }
      }
    }, [form, activeIndex, cardsIndex])

    const setInitValue = (actionKey: string, actionVal) => {
      switch (actionKey) {
        case 'urlAction':
          form.setFieldsValue({
            btntype: 'action',
            type: actionKey,
            action: {
              [actionKey]: actionVal,
            },
          })
          break
        case 'dialerAction':
          // 获取拨号方式
          let dialerTypeKey = Object.keys(actionVal).find((key) =>
            dialerActionTypeArray.includes(key as DialerActionType),
          )
          form.setFieldsValue({
            btntype: 'action',
            type: actionKey,
            action: {
              [actionKey]: { ...actionVal, dialType: dialerTypeKey },
            },
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
            btntype: 'action',
            type: actionKey,
            action: {
              [actionKey]: { ...actionVal, mapType: mapType },
            },
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
            btntype: 'action',
            type: actionKey,
            action: {
              [actionKey]: {
                createCalendarEvent: {
                  ...actionVal['createCalendarEvent'],
                  timer,
                },
              },
            },
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
            action: {
              urlAction: {
                openUrl: {
                  application: 'browser',
                },
              },
            },
          })
          break
        case 'dialerAction':
          form.setFieldsValue({
            type: 'dialerAction',
            action: {
              dialerAction: {
                dialType: 'dialPhoneNumber',
              },
            },
          })
          break
        case 'mapAction':
          form.setFieldsValue({
            type: 'mapAction',
            action: {
              mapAction: {
                mapType: '0', // 地图类型 0经纬度1位置
              },
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
        if (values.btntype == 'action') {
          let action = values['action']
          let params = {}
          console.log(action, 'action')
          // 剔除不要的值
          if (action) {
            for (const key in action) {
              switch (key) {
                case 'displayText':
                case 'postback':
                case 'urlAction':
                  params[key] = action[key]
                  break
                case 'dialerAction':
                  delete action[key].dialType
                  params[key] = action[key]
                  break
                case 'mapAction':
                  delete action[key].mapType
                  params[key] = action[key]
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
                  } = action[key]['createCalendarEvent']
                  params[key]['createCalendarEvent']['title'] = title
                  params[key]['createCalendarEvent']['description'] =
                    description
                  params[key]['createCalendarEvent']['fallbackUrl'] =
                    fallbackUrl
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
            onChange(
              {
                action: params,
              },
              activeIndex,
            )
          }
        } else {
          onChange(
            {
              reply: values['reply'],
            },
            activeIndex,
          )
        }
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
        initialValues={{
          btntype: 'reply',
        }}
        onFieldsChange={onFieldsChange}>
        <ActionFormItems onchangeType={changeType} />
      </Form>
    )
  },
)

export default ActionForm
