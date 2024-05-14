import { useState, useEffect, useRef, CSSProperties } from 'react'
import { Space, App } from 'antd'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import ActionForm from '../components/actionForm'
import MmsCallback from '../components/mmsCallback'
import CheckContent from '../components/checkContent'
import type { CheckStatusItem } from '../components/checkContent'
import Page from '../page'
import { Action } from '../type'
import RcsInput from '@/components/rcsInput'
import ANumber from '@/components/aNumber'
import { API } from 'apis'
import { createRcsTemp, getRcsTempList } from '@/api'
import { getTextLength } from '@/utils'
import {
  actionTypeArray,
  dialerActionTypeArray,
} from '@/pages/rcs/template/create/type'
import type {
  ActionType,
  SuggestionItem,
  DialerActionType,
} from '@/pages/rcs/template/create/type'

import './index.scss'

/**
 * 富文本编辑
 * text: 文本
 * b: 是否加粗
 * i: 是否倾斜
 * u: 是否有下划线
 */
type RichText = {
  label?: string
  text: string
  b: boolean
  i: boolean
  u: boolean
  min: number
  max: number
}

const aNumberStyle: CSSProperties = {
  border: 'none',
  borderRadius: '4px',
  height: 26,
}
const aNumberActiveStyle: CSSProperties = {
  backgroundColor: '#1764FF',
}

export default function Fn() {
  const { id } = useParams()
  const nav = useNavigate()
  const { message: messageApi } = App.useApp()
  const [searchParams] = useSearchParams()
  const signRef = useRef('0')
  // 模版标题
  const name = decodeURIComponent(searchParams.get('name'))
  const [loading, setLoading] = useState(false)

  // 悬浮菜单
  const [suggestions, setsuggestions] = useState<Action[]>([
    {
      displayText: '悬浮按钮',
      urlAction: {
        openUrl: {
          application: 'browser',
          url: '',
        },
      },
    },
  ])
  // 富文本中-当前编辑的第几个悬浮按钮
  const [suggestionsIndex, setsuggestionsIndex] = useState(-1)
  // 右侧-当前编辑的第几个悬浮按钮
  const [floatIndex, setfloatIndex] = useState(-1)

  // 模版-内容描述
  const [richDes, setRichDes] = useState<RichText>({
    label: '卡片内容',
    text: '请输入内容，最多1000个中文字符',
    b: false,
    i: false,
    u: false,
    min: 1,
    max: 2000,
  })
  // 短信消息回落
  const [richMsg, setRichMsg] = useState('')
  // 彩信回落
  const [mmsInfo, setMmsInfo] = useState<API.UploadMmsLibsRes>()
  // 提审验证-是否显示验证结果
  const [showCheckStatus, setshowCheckStatus] = useState(false)
  // 提审验证-验证结果列表
  const [checkStatus, setcheckStatus] = useState<CheckStatusItem[]>([])

  // 编辑模版-获取模版信息
  const getTempInfo = async () => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        status: 'all',
        id: id,
      })
      if (res.list.length == 1) {
        const info = res.list[0]
        signRef.current = info.sign
        const desText = info.message.message as string

        // 模版-内容描述
        setRichDes({
          label: '卡片内容',
          text: desText,
          b: false,
          i: false,
          u: false,
          min: 1,
          max: 2000,
        })
        setsuggestions(
          info.suggestions?.suggestions
            ? info.suggestions?.suggestions.map((item) => item.action)
            : [],
        )
        setRichMsg(info.smsContent)

        setfloatIndex(0)
        if (info.mmsSubject && info.mmsTemplate) {
          setMmsInfo({
            mmsSubject: info.mmsSubject,
            sign: info.mmsTemplate,
          })
        }
      }
    } catch (error) {}
  }

  // 编辑悬浮按钮
  const changeSuggestionsText = (val, index) => {
    setsuggestions((prevActions) => {
      return prevActions.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            displayText: val,
          }
        } else {
          return item
        }
      })
    })
  }
  const addSuggestions = () => {
    setsuggestions((prevActions) => {
      return [
        ...prevActions,
        {
          displayText: '悬浮按钮',
          urlAction: {
            openUrl: {
              application: 'browser',
              url: '',
            },
          },
        },
      ]
    })
  }
  const delSuggestions = () => {
    if (floatIndex == suggestions.length - 1) {
      setfloatIndex(floatIndex - 1)
    }
    setsuggestions((prevActions) => {
      return [
        ...prevActions.filter((_, index) => index != prevActions.length - 1),
      ]
    })
  }
  const updataSuggestions = (values, idx) => {
    setsuggestions((prevActions) => {
      return [
        ...prevActions.map((item, index) => {
          if (index == idx) {
            let { displayText } = item
            item = { ...values, displayText }
          }
          return item
        }),
      ]
    })
  }

  // 提审
  const submit = async () => {
    // 表单验证
    const checkRes = checkEvent()
    if (!checkRes) {
      return
    }
    let _suggestions: SuggestionItem[] = suggestions.map((item) => {
      return { action: item }
    })

    let params: API.CreateRcsTempParams = {
      id: signRef.current,
      type: '1',
      title: name,
      sms: Boolean(richMsg) ? 'true' : 'false',
      smsContent: richMsg,
      mms: Boolean(mmsInfo) ? 'true' : 'false',
      mmsTemplate: Boolean(mmsInfo) ? mmsInfo.sign : '',
      mmsSubject: Boolean(mmsInfo) ? mmsInfo.mmsSubject : '',
      suggestions: JSON.stringify({
        suggestions: _suggestions,
      }),
      message: JSON.stringify({ message: richDes.text }),
    }
    setLoading(true)

    try {
      const res = await createRcsTemp(params)
      if (res.status == 'success') {
        messageApi.success('提交成功', 3, () => {
          setLoading(false)
          nav('/console/rcs/template/index', { replace: true })
        })
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  // 表单验证
  const checkEvent = (): boolean => {
    const checkRes: CheckStatusItem[] = [checkDes(), checkFloat()]
    setshowCheckStatus(true)
    setcheckStatus(checkRes)
    // 验证未通过
    if (checkRes.map((item) => item.value).includes(false)) {
      return false
    } else {
      return true
    }
  }
  // 验证正文
  const checkDes = (): CheckStatusItem => {
    let value: boolean = true
    if (richDes.text) {
      let len = getTextLength(richDes.text, 2)
      if (len < richDes.min || len > richDes.max) {
        value = false
      }
    } else {
      value = false
    }
    return {
      name: 'des',
      label: '正文',
      value: value,
    }
  }
  // 验证悬浮按钮
  const checkFloat = (): CheckStatusItem => {
    let value: boolean = true
    suggestions.forEach((item) => {
      const status: boolean = checkAction(item)
      if (!status) {
        value = false
      }
    })
    return {
      name: 'floatbtn',
      label: '悬浮按钮',
      value: value,
    }
  }
  // 事件验证
  const checkAction = (item: Action): boolean => {
    let value: boolean = true
    // 标题为空
    if (!item.displayText) {
      return false
    }
    let actionKey = Object.keys(item).find((key) =>
      actionTypeArray.includes(key as ActionType),
    )
    if (actionKey) {
      let actionVal = item[actionKey]
      switch (actionKey) {
        // 浏览器事件验证不通过
        case 'urlAction':
          const urlReg = /^(https?:\/\/)?([\w.-]+\.[a-zA-Z]{2,})(\/\S*)?$/

          if (!actionVal.openUrl.url) {
            value = false
          } else {
            if (!urlReg.test(actionVal.openUrl.url)) {
              value = false
            }
          }
          break
        // 拨号事件验证不通过
        case 'dialerAction':
          // 获取拨号方式
          let dialerTypeKey = Object.keys(actionVal).find((key) =>
            dialerActionTypeArray.includes(key as DialerActionType),
          )
          if (!actionVal[dialerTypeKey]['phoneNumber']) {
            value = false
          }
          break
        // 地图事件验证不通过
        case 'mapAction':
          if (
            !(
              (actionVal.showLocation.latitude.toString() &&
                actionVal.showLocation.longitude.toString()) ||
              actionVal.showLocation.query
            )
          ) {
            value = false
          }
          break
        // 日历事件验证不通过
        case 'calendarAction':
          if (
            !actionVal.createCalendarEvent.title ||
            !actionVal.createCalendarEvent.startTime ||
            !actionVal.createCalendarEvent.endTime
          ) {
            value = false
          }
          break
        default:
      }
    }
    return value
  }

  useEffect(() => {
    // 编辑
    if (id != '0') {
      getTempInfo()
    } else {
      setfloatIndex(0)
    }
  }, [id])

  // 展示验证结果后持续监听字段变化
  useEffect(() => {
    if (showCheckStatus) {
      checkEvent()
    }
  }, [showCheckStatus, richDes, suggestions])

  const tempConfig = (
    <div className='p-x-12 p-y-16 g-scroll'>
      <div className='fn16 fw-500' style={{ marginBottom: '12px' }}>
        悬浮框
      </div>
      <ANumber
        dataSource={suggestions}
        activeKey='index'
        active={floatIndex}
        min={0}
        max={4}
        onChange={(i) => {
          setsuggestionsIndex(i)
          setfloatIndex(i)
        }}
        onAdd={() => addSuggestions()}
        onDel={() => delSuggestions()}
        style={aNumberStyle}
        activeStyle={aNumberActiveStyle}
      />

      {suggestions.length > 0 && (
        <ActionForm
          data={suggestions}
          activeIndex={floatIndex}
          onChange={updataSuggestions}
          name='suggestions-form'
        />
      )}
    </div>
  )

  const checkContentStyle: CSSProperties = {
    width: showCheckStatus ? '160px' : '0',
    height: showCheckStatus ? `calc(41px + ${checkStatus.length * 36}px)` : '0',
  }
  // 提审验证提示
  const checkContent = (
    <CheckContent style={checkContentStyle} items={checkStatus} />
  )
  return (
    <Page
      loading={loading}
      content={
        <>
          <div className='center-content text-center-content p-y-16'>
            <div className='card-des'>
              <RcsInput
                text={richDes.text}
                onChange={(val) => setRichDes({ ...richDes, text: val })}
                max={richDes.max}
                min={richDes.min}
                label={richDes.label}
                chineseLen={2}
                showInsertParams
                style={{ minHeight: '100px' }}
              />
            </div>
          </div>
          <Space className='float-content'>
            {suggestions.map((item, index) => (
              <div className='float-item' key={index}>
                <RcsInput
                  text={item.displayText}
                  onChange={(val) => changeSuggestionsText(val, index)}
                  onFocus={() => {
                    setsuggestionsIndex(index)
                    setfloatIndex(index)
                  }}
                  onBlur={() => setsuggestionsIndex(-1)}
                  max={25}
                  min={1}
                  chineseLen={2}
                  label={'悬浮按钮'}
                  showInsertParams={false}
                  active={index == suggestionsIndex}
                  style={{
                    height: 32,
                    lineHeight: '30px',
                    textAlign: 'center',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    overflowX: 'auto',
                    wordBreak: 'break-all',
                    wordWrap: 'normal',
                    padding: '0 16px',
                  }}
                />
              </div>
            ))}
            {suggestions.length < 4 && (
              <div
                className='float-add-btn fx-center-center'
                onClick={addSuggestions}>
                <span className='icon iconfont icon-jia fn12'></span>
              </div>
            )}
          </Space>
        </>
      }
      checkContent={checkContent}
      tempConfig={tempConfig}
      callbackConfig={
        <MmsCallback
          msg={richMsg}
          mmsInfo={mmsInfo}
          onChangeMms={(data) => setMmsInfo(data)}
          onChangeMsg={(val) => setRichMsg(val)}
        />
      }
      submit={submit}></Page>
  )
}
