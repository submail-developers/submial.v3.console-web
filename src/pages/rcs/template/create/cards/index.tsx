import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import { Space, Divider, Image, Flex, App } from 'antd'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import Meteial from '../components/meteial'
import { imgTypes, audioTypes, videoTypes } from '../components/meteial/type'
import ActionForm from '../components/actionForm'
import MmsCallback from '../components/mmsCallback'
import CheckContent from '../components/checkContent'
import type { CheckStatusItem } from '../components/checkContent'
import Page from '../page'
import { Media, Action, GeneralPurposeCard } from '../type'
import RcsInput from '@/components/rcsInput'
import ANumber from '@/components/aNumber'
import { useDrop } from 'react-dnd'
import { config as dndConfig } from '../dnd'
import CardItem from './cardItem'
import { API } from 'apis'
import { createRcsTemp, getRcsTempList } from '@/api'
import { getTextLength } from '@/utils'
import {
  actionTypeArray,
  dialerActionTypeArray,
} from '@/pages/rcs/template/create/type'
import type {
  ActionType,
  DialerActionType,
  CardsItem,
  GeneralPurposeCards,
} from '@/pages/rcs/template/create/type'

import './index.scss'

/**
 * 富文本编辑
 * text: 文本
 * b: 是否加粗
 * i: 是否倾斜
 * u: 是否有下划线
 */
export type TextConfig = {
  label?: string
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
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const nav = useNavigate()
  const { message: messageApi } = App.useApp()
  const [searchParams] = useSearchParams()
  const signRef = useRef('0')
  const ref = useRef(null)
  // 模版标题
  const name = decodeURIComponent(searchParams.get('name'))
  const [cards, setCards] = useState<CardsItem[]>([
    {
      media: {
        mediaUrl: '',
        mediaOssUrl: '',
        mediaContentType: '',
        mediaFileSize: '',
        height: 'MEDIUM_HEIGHT',
      },
      title: '请输入标题，最多100个中文字符',
      description: '请输入内容，最多1000个中文字符',
      suggestions: [
        {
          action: {
            displayText: '按钮',
            urlAction: {
              openUrl: {
                application: 'browser',
                url: '',
              },
            },
          },
        },
      ],
    },
    {
      media: {
        mediaUrl: '',
        mediaOssUrl: '',
        mediaContentType: '',
        mediaFileSize: '',
        height: 'MEDIUM_HEIGHT',
      },
      title: '请输入标题，最多100个中文字符',
      description: '请输入内容，最多1000个中文字符',
      suggestions: [
        {
          action: {
            displayText: '按钮',
            urlAction: {
              openUrl: {
                application: 'browser',
                url: '',
              },
            },
          },
        },
      ],
    },
  ])
  const [cardsIndex, setcardsIndex] = useState(0)
  // 富文本中-当前编辑的第几个按钮
  const [actionsIndex, setactionsIndex] = useState(-1)
  // 右侧-当前编辑的第几个按钮
  const [btnIndex, setbtnIndex] = useState(-1)
  const [loading, setLoading] = useState(false)

  // 悬浮菜单
  const [suggestions, setsuggestions] = useState<Action[]>([
    {
      action: {
        displayText: '悬浮按钮',
        urlAction: {
          openUrl: {
            application: 'browser',
            url: '',
          },
        },
      },
    },
  ])
  // 富文本中-当前编辑的第几个悬浮按钮
  const [suggestionsIndex, setsuggestionsIndex] = useState(-1)
  // 右侧-当前编辑的第几个悬浮按钮
  const [floatIndex, setfloatIndex] = useState(-1)

  // 模版-内容标题
  const [richTitleConfig, setRichTitleConfig] = useState<TextConfig>({
    label: '卡片标题',
    b: true,
    i: false,
    u: false,
    min: 1,
    max: 200,
  })
  // 模版-内容描述
  const [richDesConfig, setRichDesConfig] = useState<TextConfig>({
    label: '卡片内容',
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

        const generalPurposeCardCarousel = info.message.message
          .generalPurposeCardCarousel as GeneralPurposeCards

        let _cards: CardsItem[] = []
        let mediaType: '1' | '2' | '3' = '1'
        generalPurposeCardCarousel.content.forEach((item) => {
          let { mediaContentType = '' } = item.media
          const index = [
            imgTypes.includes(mediaContentType),
            audioTypes.includes(mediaContentType),
            videoTypes.includes(mediaContentType),
          ].findIndex((item) => Boolean(item))
          if (index == 0) {
            mediaType = '1'
          } else if (index == 1) {
            mediaType = '2'
          } else if (index == 2) {
            mediaType = '3'
          } else {
          }
          _cards.push({
            ...item,
            media: {
              ...item.media,
              mediaType: mediaType,
            },
            suggestions: item?.suggestions || [],
          })
        })

        setCards(_cards)

        let titleStyles = [],
          desStyles = []
        if (generalPurposeCardCarousel.layout?.titleFontStyle) {
          titleStyles =
            generalPurposeCardCarousel.layout?.titleFontStyle.split(',')
        }
        if (generalPurposeCardCarousel.layout?.descriptionFontStyle) {
          desStyles =
            generalPurposeCardCarousel.layout?.descriptionFontStyle.split(',')
        }
        // 模版-内容标题
        setRichTitleConfig({
          label: '卡片标题',
          b: titleStyles.includes('bold'),
          i: titleStyles.includes('italics'),
          u: titleStyles.includes('underline'),
          min: 1,
          max: 200,
        })
        // 模版-内容描述
        setRichDesConfig({
          label: '卡片内容',
          b: desStyles.includes('bold'),
          i: desStyles.includes('italics'),
          u: desStyles.includes('underline'),
          min: 1,
          max: 2000,
        })

        setsuggestions(info.suggestions?.suggestions || [])
        setbtnIndex(0)
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

  const addCards = () => {
    setCards((prevActions) => {
      return [
        ...prevActions,
        {
          media: {
            mediaUrl: '',
            mediaOssUrl: '',
            mediaContentType: '',
            mediaFileSize: '',
            height: 'MEDIUM_HEIGHT',
          },
          title: '请输入标题，最多100个中文字符',
          description: '请输入内容，最多1000个中文字符',
          suggestions: [
            {
              action: {
                displayText: '按钮',
                urlAction: {
                  openUrl: {
                    application: 'browser',
                    url: '',
                  },
                },
              },
            },
          ],
        },
      ]
    })
  }
  const delCards = () => {
    if (cardsIndex == cards.length - 1) {
      setcardsIndex(cardsIndex - 1)
      setactionsIndex(-1)
      setbtnIndex(0)
    }
    setCards((prevActions) => {
      return prevActions.filter(
        (item, index) => index != prevActions.length - 1,
      )
    })
  }
  const changeMedia = (media: Media, index: number) => {
    setCards((prevActions) => {
      return prevActions.map((item, idx) => {
        if (idx == index) {
          item.media = { ...media }
        }
        return item
      })
    })
  }
  const changeTitle = (val, index) => {
    setCards((prevActions) => {
      return prevActions.map((item, idx) => {
        if (idx == index) {
          item.title = val
        }
        return item
      })
    })
  }
  const changeDes = (val, index) => {
    setCards((prevActions) => {
      return prevActions.map((item, idx) => {
        if (idx == index) {
          item.description = val
        }
        return item
      })
    })
  }
  const changeBtnText = (val, btnIndex, index) => {
    setCards((prevActions) => {
      return prevActions.map((item, cardIndex) => {
        if (cardIndex == index) {
          item.suggestions = item.suggestions.map((itm, idx) => {
            if (btnIndex == idx) {
              if ('action' in itm) {
                itm.action.displayText = val
              } else {
                itm.reply.displayText = val
              }
            }
            return itm
          })
        }
        return item
      })
    })
  }

  // 编辑按钮
  const addBtn = (index) => {
    setCards((prevActions) => {
      return [
        ...prevActions.map((item, idx) => {
          if (idx == index) {
            item.suggestions = [
              ...item.suggestions,
              {
                action: {
                  displayText: '按钮',
                  urlAction: {
                    openUrl: {
                      application: 'browser',
                      url: '',
                    },
                  },
                },
              },
            ]
          }
          return item
        }),
      ]
    })
  }
  const delBtn = (index) => {
    if (btnIndex == cards[index].suggestions.length - 1) {
      setbtnIndex(btnIndex - 1)
    }
    setCards((prevActions) => {
      return [
        ...prevActions.map((item, idx) => {
          if (index == idx) {
            item.suggestions = item.suggestions.filter(
              (_, ix) => ix != item.suggestions.length - 1,
            )
          }
          return item
        }),
      ]
    })
  }
  // values传来的值,idx编辑的按钮,编辑的卡片
  const updataAction = (values, idx, index) => {
    setCards((prevActions) => {
      return [
        ...prevActions.map((item, itemIndex) => {
          if (index == itemIndex) {
            item.suggestions = item.suggestions.map(
              (suggestion, suggestionsIndex) => {
                if (idx == suggestionsIndex) {
                  let displayText = ''
                  if ('action' in suggestion) {
                    displayText = suggestion.action.displayText
                  } else {
                    displayText = suggestion.reply.displayText
                  }
                  if ('action' in values) {
                    suggestion = {
                      action: {
                        ...values['action'],
                        displayText,
                      },
                    }
                  } else {
                    suggestion = {
                      reply: {
                        ...values['reply'],
                        displayText,
                      },
                    }
                  }
                }
                return suggestion
              },
            )
          }
          return item
        }),
      ]
    })
  }

  // 编辑悬浮按钮
  const changeSuggestionsText = (val, index) => {
    setsuggestions((prevActions) => {
      return prevActions.map((item, idx) => {
        if (idx === index) {
          if ('action' in item) {
            item = {
              action: {
                ...item['action'],
                displayText: val,
              },
            }
          } else {
            item = {
              reply: {
                ...item['reply'],
                displayText: val,
              },
            }
          }
        }
        return item
      })
    })
  }
  const addSuggestions = () => {
    setsuggestions((prevActions) => {
      return [
        ...prevActions,
        {
          action: {
            displayText: '悬浮按钮',
            urlAction: {
              openUrl: {
                application: 'browser',
                url: '',
              },
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
            let displayText = ''
            if ('action' in item) {
              displayText = item.action.displayText
            } else {
              displayText = item.reply.displayText
            }
            if ('action' in values) {
              item = {
                action: {
                  ...values['action'],
                  displayText,
                },
              }
            } else {
              item = {
                reply: {
                  ...values['reply'],
                  displayText,
                },
              }
            }
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

    // 标题样式，用,链接
    const titleFontStyle = [
      richTitleConfig.b && 'bold',
      richTitleConfig.i && 'italics',
      richTitleConfig.u && 'underline',
    ]
      .filter((item) => Boolean(item))
      .join(',')
    // 内容样式，用,链接
    const descriptionFontStyle = [
      richDesConfig.b && 'bold',
      richDesConfig.i && 'italics',
      richDesConfig.u && 'underline',
    ]
      .filter((item) => Boolean(item))
      .join(',')

    const message = {
      generalPurposeCardCarousel: {
        content: cards,
        layout: {
          cardWidth: 'MEDIUM_WIDTH',
          titleFontStyle: titleFontStyle,
          descriptionFontStyle: descriptionFontStyle,
        },
      },
    }

    let params: API.CreateRcsTempParams = {
      id: signRef.current,
      type: '3',
      title: name,
      sms: Boolean(richMsg) ? 'true' : 'false',
      smsContent: richMsg,
      mms: Boolean(mmsInfo) ? 'true' : 'false',
      mmsTemplate: Boolean(mmsInfo) ? mmsInfo.sign : '',
      mmsSubject: Boolean(mmsInfo) ? mmsInfo.mmsSubject : '',
      suggestions: JSON.stringify({
        suggestions: suggestions,
      }),
      message: JSON.stringify({ message }),
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
    const checkRes: CheckStatusItem[] = [
      checkBanner(),
      checkTitle(),
      checkDes(),
      checkBtn(),
      checkFloat(),
    ]
    setshowCheckStatus(true)
    setcheckStatus(checkRes)
    // 验证未通过
    if (checkRes.map((item) => item.value).includes(false)) {
      return false
    } else {
      return true
    }
  }

  // 验证banner
  const checkBanner = (): CheckStatusItem => {
    let value: boolean = true
    cards.forEach((item) => {
      if (!item.media) {
        value = false
      }
    })
    return {
      name: 'banner',
      label: '卡片',
      value: value,
    }
  }
  // 验证标题
  const checkTitle = (): CheckStatusItem => {
    let value: boolean = true
    cards.forEach((item) => {
      if (item.title) {
        let len = getTextLength(item.title, 2)
        if (len < richTitleConfig.min || len > richTitleConfig.max) {
          value = false
        }
      } else {
        value = false
      }
    })
    return {
      name: 'title',
      label: '标题',
      value: value,
    }
  }
  // 验证正文
  const checkDes = (): CheckStatusItem => {
    let value: boolean = true
    cards.forEach((item) => {
      if (item.description) {
        let len = getTextLength(item.description, 2)
        if (len < richDesConfig.min || len > richDesConfig.max) {
          value = false
        }
      } else {
        value = false
      }
    })
    return {
      name: 'des',
      label: '正文',
      value: value,
    }
  }
  // 验证按钮
  const checkBtn = (): CheckStatusItem => {
    let value: boolean = true
    cards.forEach((item) => {
      item.suggestions.forEach((itm) => {
        const status: boolean = checkAction(itm)
        if (!status) {
          value = false
        }
      })
    })
    return {
      name: 'btn',
      label: '按钮',
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
    if (
      ('action' in item && !item.action.displayText) ||
      ('reply' in item && !item.reply.displayText)
    ) {
      return false
    }
    if ('action' in item) {
      let actionKey = Object.keys(item['action']).find((key) =>
        actionTypeArray.includes(key as ActionType),
      )
      if (actionKey) {
        let actionVal = item['action'][actionKey]
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
      } else {
        value = false
      }
    }
    return value
  }

  // 初始化
  useEffect(() => {
    // 编辑
    if (id != '0') {
      getTempInfo()
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '编辑模版',
        }),
      )
    } else {
      setbtnIndex(0)
      setfloatIndex(0)
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '创建模版',
        }),
      )
    }
  }, [id])

  // 展示验证结果后持续监听字段变化
  useEffect(() => {
    if (showCheckStatus) {
      checkEvent()
    }
  }, [showCheckStatus, suggestions])

  // 切换cards，滚动到指定cards
  useEffect(() => {
    if (ref.current && cardsIndex >= 0) {
      // 最大滚动位置
      const maxScrollLeft = ref.current.scrollWidth - ref.current.clientWidth
      // 当前滚动位置
      let currentLeft = ref.current.scrollLeft
      // 是否是首尾的index, 不是首尾当前的居中显示
      const isTrim = cardsIndex == 0 || cardsIndex == cards.length - 1
      // 240:单个item的宽度; 16:gap;
      let toLeft = Math.min((240 + 16) * cardsIndex, maxScrollLeft)

      var step = (currentLeft - toLeft) / 25 // 每15帧滚动的距离

      // 使用requestAnimationFrame实现动画效果
      function animation() {
        if (step >= 0 && currentLeft > 0 && currentLeft > toLeft) {
          // 往左
          currentLeft -= step
          ref.current.scrollLeft = Math.max(currentLeft, toLeft)
          requestAnimationFrame(animation)
        }
        // 往右
        if (step < 0 && currentLeft < toLeft) {
          currentLeft -= step
          ref.current.scrollLeft = Math.min(currentLeft, toLeft)
          requestAnimationFrame(animation)
        }
      }
      requestAnimationFrame(animation)
    }
  }, [cardsIndex, ref.current])

  const tempConfig = (
    <div className='p-x-12 p-y-16 g-scroll'>
      <div className='fn16 fw-500'>正文</div>
      <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
        标题文字样式
      </div>
      <Space style={{ margin: '6px 0' }}>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richTitleConfig.b ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichTitleConfig({ ...richTitleConfig, b: !richTitleConfig.b })
          }>
          <span className='icon iconfont icon-b fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richTitleConfig.i ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichTitleConfig({ ...richTitleConfig, i: !richTitleConfig.i })
          }>
          <span className='icon iconfont icon-i fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richTitleConfig.u ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichTitleConfig({ ...richTitleConfig, u: !richTitleConfig.u })
          }>
          <span className='icon iconfont icon-u fn18'></span>
        </div>
      </Space>
      <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
        内容文字样式
      </div>
      <Space style={{ margin: '6px 0' }}>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richDesConfig.b ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichDesConfig({ ...richDesConfig, b: !richDesConfig.b })
          }>
          <span className='icon iconfont icon-b fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richDesConfig.i ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichDesConfig({ ...richDesConfig, i: !richDesConfig.i })
          }>
          <span className='icon iconfont icon-i fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer g-transition-300 ${
            richDesConfig.u ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() =>
            setRichDesConfig({ ...richDesConfig, u: !richDesConfig.u })
          }>
          <span className='icon iconfont icon-u fn18'></span>
        </div>
      </Space>
      <Divider className='m-y-12' />
      <div className='fn16 fw-500 m-b-12'>卡片</div>
      <ANumber
        dataSource={cards}
        activeKey='index'
        active={cardsIndex}
        min={2}
        max={12}
        onChange={(i) => {
          setactionsIndex(-1)
          setcardsIndex(i)
        }}
        onAdd={addCards}
        onDel={delCards}
        style={aNumberStyle}
        activeStyle={aNumberActiveStyle}
      />
      <Divider className='m-y-12' />
      <div className='fn16 fw-500' style={{ marginBottom: '12px' }}>
        按钮
      </div>
      <BtnForm
        cardsIndex={cardsIndex}
        btnIndex={btnIndex}
        suggestions={cards[cardsIndex].suggestions}
        onAdd={addBtn}
        onDel={delBtn}
        onChange={(i) => setbtnIndex(i)}
        onUpdataAction={updataAction}
      />
      <Divider className='m-y-12' />
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
      left={<Meteial />}
      content={
        <>
          <Flex
            gap={16}
            className='center-content cards-center-content'
            ref={ref}>
            {cards.map((item, index) => (
              <CardItem
                key={index}
                item={item}
                active={index == cardsIndex}
                actionsIndex={index == cardsIndex ? actionsIndex : -1}
                btnIndex={index == cardsIndex ? btnIndex : -1}
                titleConfig={richTitleConfig}
                desConfig={richDesConfig}
                onHandle={() => {
                  setcardsIndex(index)
                }}
                onChangeActionsIndex={(i) => setactionsIndex(i)}
                onChangeBtnIndex={(i) => setbtnIndex(i)}
                onChangeMedia={(info) => changeMedia(info, index)}
                onChangeTitle={(val) => changeTitle(val, index)}
                onChangeDes={(val) => changeDes(val, index)}
                onChangeBtnText={(val, idx) => changeBtnText(val, idx, index)}
                onAddBtn={() => addBtn(index)}
              />
            ))}
          </Flex>
          <Space className='float-content'>
            {suggestions.map((item, index) => (
              <div className='float-item' key={index}>
                <RcsInput
                  text={
                    item.action?.displayText || item.reply?.displayText || ''
                  }
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

type BtnFormProps = {
  suggestions: Action[]
  cardsIndex: number
  btnIndex: number
  onAdd: (cardsIndex: number) => void
  onDel: (cardsIndex: number) => void
  onChange: (btnIndex: number) => void
  onUpdataAction: (values, btnIndex, cardsIndex) => void
}
const BtnForm = ({
  suggestions,
  cardsIndex,
  btnIndex,
  onAdd,
  onDel,
  onChange,
  onUpdataAction,
}: BtnFormProps) => {
  const cardsIndexRef = useRef(0)
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    if (cardsIndexRef.current != cardsIndex) {
      setIndex(0)
    } else {
      setIndex(btnIndex)
    }
    cardsIndexRef.current = cardsIndex
  }, [cardsIndex, btnIndex])

  return (
    <>
      <ANumber
        dataSource={suggestions}
        activeKey='index'
        active={index}
        min={0}
        max={4}
        onChange={(i) => {
          onChange(i)
        }}
        onAdd={() => onAdd(cardsIndex)}
        onDel={() => onDel(cardsIndex)}
        style={aNumberStyle}
        activeStyle={aNumberActiveStyle}
      />
      {suggestions.length > 0 && (
        <ActionForm
          data={suggestions}
          cardsIndex={cardsIndex}
          activeIndex={index}
          onChange={(values, idx) => onUpdataAction(values, idx, cardsIndex)}
          name='btn-form'
        />
      )}
    </>
  )
}
