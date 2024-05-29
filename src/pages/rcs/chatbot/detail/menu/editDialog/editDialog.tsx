import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Row, Col, Input } from 'antd'
import { API } from 'apis'
import { ActionFormItems } from '@/pages/rcs/template/create/components/actionForm'
import dayjs from 'dayjs'
import {
  actionTypeArray,
  dialerActionTypeArray,
} from '@/pages/rcs/template/create/type'
import type {
  ActionType,
  DialerActionType,
} from '@/pages/rcs/template/create/type'

interface Props {
  onSubmit: (params: Params) => void
}
type Params = {
  menuItem: API.EntriesItem
  index: number
  idx?: number
  type?: 'add' | 'edit'
}
type OpenParams = Params & {
  title: string
  isMainMenu: boolean
}

const Dialog = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [form] = Form.useForm()
  const indexRef = useRef(-1)
  const idxRef = useRef(-1)
  const oldMenuInfoRef = useRef<API.EntriesItem>(null)
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [isMainMenuConfig, setisMainMenuConfig] = useState(true)

  const open = (params: OpenParams) => {
    setShow(true)
    form.resetFields()
    let { title, menuItem, index, idx, isMainMenu } = params
    oldMenuInfoRef.current = menuItem
    indexRef.current = index
    idxRef.current = idx
    setTitle(title)
    setisMainMenuConfig(isMainMenu)
    if (!menuItem) {
      // -1:新增主菜单，否则新增子菜单(不能选择按钮类型为菜单)
      if (index == -1) {
        form.setFieldsValue({
          btntype: 'menu',
        })
      } else {
        form.setFieldsValue({
          btntype: 'reply',
        })
      }
      return
    }
    // 编辑时才往下走
    let displayText =
      menuItem?.action?.displayText ||
      menuItem?.menu?.displayText ||
      menuItem?.reply?.displayText
    if (menuItem?.menu) {
      form.setFieldsValue({
        displayText,
        btntype: 'menu',
      })
    } else if (menuItem.reply) {
      form.setFieldsValue({
        displayText,
        btntype: 'reply',
        reply: {
          displayText,
          postback: {
            data: menuItem.reply?.postback?.data || '',
          },
        },
      })
    } else {
      let itemAction = menuItem['action']
      let actionKey = Object.keys(itemAction).find((key) =>
        actionTypeArray.includes(key as ActionType),
      )
      if (actionKey) {
        let actionVal = itemAction[actionKey]
        setInitValue(
          actionKey,
          actionVal,
          displayText,
          menuItem.action?.postback?.data,
        )
      } else {
        form.setFieldsValue({
          btntype: 'action',
          type: 'urlAction',
          action: {
            displayText,
            postback: {
              data: menuItem.action?.postback?.data || '',
            },
            urlAction: {
              openUrl: {
                application: 'browser',
                url: '',
              },
            },
          },
        })
      }
    }
  }

  const setInitValue = (
    actionKey: string,
    actionVal,
    displayText,
    postbackData = '',
  ) => {
    switch (actionKey) {
      case 'urlAction':
        form.setFieldsValue({
          displayText,
          btntype: 'action',
          type: actionKey,
          action: {
            postback: {
              data: postbackData,
            },
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
          displayText,
          btntype: 'action',
          type: actionKey,
          action: {
            postback: {
              data: postbackData,
            },
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
          displayText,
          btntype: 'action',
          type: actionKey,
          action: {
            postback: {
              data: postbackData,
            },
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
          displayText,
          btntype: 'action',
          type: actionKey,
          action: {
            postback: {
              data: postbackData,
            },
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

  const cancel = () => {
    setShow(false)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      let { displayText } = values
      let params = {}
      if (values.btntype == 'action') {
        let action = values['action']
        let _params = {}
        // 剔除不要的值
        if (action) {
          for (const key in action) {
            switch (key) {
              case 'displayText':
              case 'postback':
              case 'urlAction':
                _params[key] = action[key]
                break
              case 'dialerAction':
                delete action[key].dialType
                _params[key] = action[key]
                break
              case 'mapAction':
                delete action[key].mapType
                _params[key] = action[key]
                break
              case 'calendarAction':
                _params[key] = {
                  createCalendarEvent: {},
                }
                let {
                  title = '',
                  description = '',
                  timer,
                  fallbackUrl = '',
                } = action[key]['createCalendarEvent']
                _params[key]['createCalendarEvent']['title'] = title
                _params[key]['createCalendarEvent']['description'] = description
                _params[key]['createCalendarEvent']['fallbackUrl'] = fallbackUrl
                if (timer) {
                  let startTime = timer[0].format('YYYY-MM-DDTHH:mm:ss[Z]')
                  let endTime = timer[1].format('YYYY-MM-DDTHH:mm:ss[Z]')
                  _params[key]['createCalendarEvent']['startTime'] = startTime
                  _params[key]['createCalendarEvent']['endTime'] = endTime
                } else {
                  _params[key]['createCalendarEvent']['startTime'] = ''
                  _params[key]['createCalendarEvent']['endTime'] = ''
                }
                break
              default:
                break
            }
          }
        }
        params = {
          action: {
            ..._params,
            displayText,
          },
        }
      } else if (values.btntype == 'menu') {
        let entries = []
        if (oldMenuInfoRef.current?.menu) {
          entries = oldMenuInfoRef.current.menu.entries
        }
        params = {
          menu: {
            displayText,
            entries,
          },
        }
      } else {
        params = {
          reply: {
            displayText,
          },
        }
      }
      if (oldMenuInfoRef.current) {
        props.onSubmit({
          menuItem: params,
          index: indexRef.current,
          idx: idxRef.current,
          type: 'edit',
        })
      } else {
        props.onSubmit({
          menuItem: params,
          index: indexRef.current,
          type: 'add',
        })
      }
      setShow(false)
    } catch (error) {}
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
      open={show}
      onCancel={cancel}
      onOk={handleOk}
      title={title}
      width={500}
      closable={false}
      destroyOnClose
      wrapClassName='modal-reset'>
      {open && (
        <Form
          name='chatbot-menu'
          form={form}
          layout='vertical'
          initialValues={{ btnTypes: 'menu' }}
          autoComplete='off'>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label='菜单标题' name='displayText'>
                <Input placeholder='请输入' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <ActionFormItems
                onchangeType={changeType}
                isMainMenuConfig={isMainMenuConfig}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  )
}
export default forwardRef(Dialog)
