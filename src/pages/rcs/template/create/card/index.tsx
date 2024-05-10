import { useState, useEffect, CSSProperties } from 'react'
import { Space, Tabs, Divider, Image, Form, Select, App } from 'antd'
import type { TabsProps, SelectProps } from 'antd'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import Meteial from '../components/meteial'
import ActionForm from '../components/actionForm'
import MmsCallback from '../components/mmsCallback'
import Page from '../page'
import { Media, Action, Reply, CardLayout, GeneralPurposeCard } from '../type'
import RcsInput from '@/components/rcsInput'
import ANumber from '@/components/aNumber'
import { useDrop } from 'react-dnd'
import { config as dndConfig } from '../dnd'
import errorImg from '@/assets/rcs/error.png'
import { API } from 'apis'
import { createRcsTemp, getMmsList, getRcsTempList } from '@/api'

import { debounce } from 'lodash'

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
  // 模版标题
  const name = decodeURIComponent(searchParams.get('name'))
  const [loading, setLoading] = useState(false)
  // 拖拽的信息
  const [media, setmedia] = useState<Media>()

  // 拖拽素材到指定区域
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: dndConfig.accept,
    drop: (item: API.RcsOnlineMeteialItem, monitor) => {
      console.log('drop', item)
      if (item) {
        setmedia({
          mediaUrl: item.filePath,
          mediaOssUrl: item.storeAt,
          mediaContentType: item.file_type,
          mediaFileSize: item.fileSize,
          height: 'MEDIUM_HEIGHT',
          mediaType: item.type,
        })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver

  // 按钮和悬浮菜单的结构相同，按钮是在message里的suggestions。悬浮菜单是和message同级的suggestions
  // 按钮
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
  // 富文本中-当前编辑的第几个按钮
  const [actionsIndex, setactionsIndex] = useState(-1)
  // 右侧-当前编辑的第几个按钮
  const [btnIndex, setbtnIndex] = useState(0)
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
  const [floatIndex, setfloatIndex] = useState(0)
  const [layout, setlayout] = useState<CardLayout>()

  // 模版-内容标题
  const [richTitle, setRichTitle] = useState<RichText>({
    label: '卡片标题',
    text: '请输入标题，最多100个中文字符',
    b: true,
    i: false,
    u: false,
    min: 1,
    max: 200,
  })
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
  // 彩信列表
  const [mmsList, setMmsList] = useState<API.MmsListItem[]>([])

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
        const generalPurposeCard = info.message.message
          .generalPurposeCard as GeneralPurposeCard
        setmedia({
          ...generalPurposeCard.content.media,
          mediaType: '1',
        })

        let titleStyles = [],
          desStyles = []
        if (generalPurposeCard.layout?.titleFontStyle) {
          titleStyles = generalPurposeCard.layout?.titleFontStyle.split(',')
        }
        if (generalPurposeCard.layout?.descriptionFontStyle) {
          desStyles = generalPurposeCard.layout?.descriptionFontStyle.split(',')
        }
        // 模版-内容标题
        setRichTitle({
          label: '卡片标题',
          text: generalPurposeCard.content.title,
          b: titleStyles.includes('bold'),
          i: titleStyles.includes('italics'),
          u: titleStyles.includes('underline'),
          min: 1,
          max: 200,
        })
        // 模版-内容描述
        setRichDes({
          label: '卡片内容',
          text: generalPurposeCard.content.description,
          b: desStyles.includes('bold'),
          i: desStyles.includes('italics'),
          u: desStyles.includes('underline'),
          min: 1,
          max: 2000,
        })
        // 按钮
        setactions(
          generalPurposeCard.content.suggestions.map((item) => item.action),
        )
        setsuggestions(info.suggestions.suggestions.map((item) => item.action))
        setRichMsg(info.smsContent)
        setMmsInfo({
          mmsSubject: info.mmsSubject,
          sign: info.sign,
        })
        console.log(info)
      }
    } catch (error) {}
  }

  // 编辑按钮
  const changeBtnText = (val, index) => {
    setactions((prevActions) => {
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
  const addBtn = () => {
    setactions((prevActions) => {
      return [
        ...prevActions,
        {
          displayText: '按钮',
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
  const delBtn = () => {
    if (btnIndex == actions.length - 1) {
      setbtnIndex(btnIndex - 1)
    }
    setactions((prevActions) => {
      return [
        ...prevActions.filter((_, index) => index != prevActions.length - 1),
      ]
    })
  }
  const updataAction = (values, idx) => {
    setactions((prevActions) => {
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
    const checkRes = [checkTitle(), checkDes(), checkBtn(), checkFloat()]
    checkRes.forEach((validator) => {
      validator()
        .then(() => {})
        .catch((error) => {})
    })
    let _suggestions: any[] = [
      // {
      //   reply: {
      //     displayText: '上行NO',
      //   },
      // },
    ]
    suggestions.forEach((item) => {
      _suggestions.push({ action: item })
    })

    let msg_suggestions: any[] = [
      // {
      //   reply: {
      //     displayText: '上行NO',
      //   },
      // },
    ]
    actions.forEach((item) => {
      msg_suggestions.push({ action: item })
    })

    // 标题样式，用,链接
    const titleFontStyle = [
      richTitle.b && 'bold',
      richTitle.i && 'italics',
      richTitle.u && 'underline',
    ]
      .filter((item) => Boolean(item))
      .join(',')
    // 内容样式，用,链接
    const descriptionFontStyle = [
      richDes.b && 'bold',
      richDes.i && 'italics',
      richDes.u && 'underline',
    ]
      .filter((item) => Boolean(item))
      .join(',')

    let _media = { ...media }
    delete _media.mediaType

    const message = {
      generalPurposeCard: {
        content: {
          media: _media,
          title: richTitle.text,
          description: richDes.text,
          suggestions: msg_suggestions,
        },
        layout: {
          cardOrientation: 'HORIZONTAL',
          imageAlignment: 'LEFT',
          titleFontStyle: titleFontStyle,
          descriptionFontStyle: descriptionFontStyle,
        },
      },
    }

    console.log(titleFontStyle, descriptionFontStyle, message)
    // if (!mmsInfo) {
    //   messageApi.warning('请选择彩信回落')
    // }
    let params: API.CreateRcsTempParams = {
      id: id,
      type: '2',
      title: name,
      appid: '1024252',
      sms: Boolean(richMsg) ? 'true' : 'false',
      smsContent: richMsg,
      mms: Boolean(mmsInfo) ? 'true' : 'false',
      mmsTemplate: Boolean(mmsInfo) ? mmsInfo.sign : '',
      mmsSubject: Boolean(mmsInfo) ? mmsInfo.mmsSubject : '',
      suggestions: JSON.stringify({
        suggestions: _suggestions,
      }),
      message: JSON.stringify({ message }),
    }
    console.log(suggestions, actions, params)
    setLoading(true)

    try {
      const res = await createRcsTemp(params)
      if (res.status == 'success') {
        messageApi.success('创建成功', 3, () => {
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

  const checkTitle = () => (): Promise<any> => {
    return Promise.resolve()
  }
  const checkDes = () => (): Promise<any> => {
    return Promise.resolve()
  }
  const checkBtn = () => (): Promise<any> => {
    return Promise.resolve()
  }
  const checkFloat = () => (): Promise<any> => {
    return Promise.resolve()
  }

  // const checkEvent = (arr: Action[]): boolean => {
  //   let flag = true
  //   arr.forEach((item) => {
  //     if (!item.displayText) {
  //       flag = false
  //     }
  //     let byteLen = formUtils.byteLength(item.displayText)
  //     if (byteLen > 25) {
  //       flag = false
  //     }
  //   })

  //   return flag
  // }

  useEffect(() => {
    // 编辑
    if (id != '0') {
      getTempInfo()
    }
  }, [id])

  const tempConfig = (
    <div className='p-x-12 p-y-16 g-scroll'>
      <div className='fn16 fw-500'>正文</div>
      <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
        标题文字样式
      </div>
      <Space style={{ margin: '6px 0' }}>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richTitle.b ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichTitle({ ...richTitle, b: !richTitle.b })}>
          <span className='icon iconfont icon-b fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richTitle.i ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichTitle({ ...richTitle, i: !richTitle.i })}>
          <span className='icon iconfont icon-i fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richTitle.u ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichTitle({ ...richTitle, u: !richTitle.u })}>
          <span className='icon iconfont icon-u fn18'></span>
        </div>
      </Space>
      <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
        内容文字样式
      </div>
      <Space style={{ margin: '6px 0' }}>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richDes.b ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichDes({ ...richDes, b: !richDes.b })}>
          <span className='icon iconfont icon-b fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richDes.i ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichDes({ ...richDes, i: !richDes.i })}>
          <span className='icon iconfont icon-i fn18'></span>
        </div>
        <div
          className={`fx-center-center g-radius-4 g-pointer ${
            richDes.u ? 'color-btn-active' : 'color-btn'
          }`}
          style={{ width: 36, height: 36 }}
          onClick={() => setRichDes({ ...richDes, u: !richDes.u })}>
          <span className='icon iconfont icon-u fn18'></span>
        </div>
      </Space>
      <Divider className='m-y-12' />
      <div className='fn16 fw-500' style={{ marginBottom: '12px' }}>
        按钮
      </div>
      <ANumber
        dataSource={actions}
        activeKey='index'
        active={btnIndex}
        min={1}
        max={4}
        onChange={(i) => {
          setactionsIndex(i)
          setbtnIndex(i)
        }}
        onAdd={() => addBtn()}
        onDel={() => delBtn()}
        style={aNumberStyle}
        activeStyle={aNumberActiveStyle}
      />
      <ActionForm
        data={actions}
        activeIndex={btnIndex}
        onChange={updataAction}
        name='btn-form'
      />
      <Divider className='m-y-12' />
      <div className='fn16 fw-500' style={{ marginBottom: '12px' }}>
        悬浮框
      </div>
      <ANumber
        dataSource={suggestions}
        activeKey='index'
        active={floatIndex}
        min={1}
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
      <ActionForm
        data={suggestions}
        activeIndex={floatIndex}
        onChange={updataSuggestions}
        name='suggestions-form'
      />
    </div>
  )

  return (
    <Page
      loading={loading}
      left={<Meteial />}
      content={
        <>
          <div className='center-content card-center-content'>
            <div
              className='banner'
              ref={drop}
              style={{ backgroundImage: media ? 'none' : '' }}>
              {!media && (
                <div className='banner-tips'>
                  {isActive ? '释放' : '拖拽左侧文件到此区域'}
                </div>
              )}
              {media && media.mediaType == '1' && (
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  src={media.mediaOssUrl}
                  preview={false}
                  fallback={errorImg}
                />
              )}
              {media && media.mediaType == '2' && (
                <audio src={media.mediaOssUrl} controls></audio>
              )}
              {media && media.mediaType == '3' && (
                <video src={media.mediaOssUrl} controls></video>
              )}
            </div>
            <div
              className='card-title'
              style={{
                fontWeight: richTitle.b ? 'bold' : 'normal',
                fontStyle: richTitle.i ? 'italic' : 'normal',
                textDecoration: richTitle.u ? 'underline' : 'none',
                fontSize: '14px',
              }}>
              <RcsInput
                text={richTitle.text}
                onChange={(val) => setRichTitle({ ...richTitle, text: val })}
                max={richTitle.max}
                min={richTitle.min}
                label={richTitle.label}
                chineseLen={2}
                showInsertParams
              />
            </div>
            <div
              className='card-des'
              style={{
                fontWeight: richDes.b ? 'bold' : 'normal',
                fontStyle: richDes.i ? 'italic' : 'normal',
                textDecoration: richDes.u ? 'underline' : 'none',
              }}>
              <RcsInput
                text={richDes.text}
                onChange={(val) => setRichDes({ ...richDes, text: val })}
                max={richDes.max}
                min={richDes.min}
                label={richDes.label}
                chineseLen={2}
                showInsertParams
                style={{ minHeight: '48px' }}
              />
            </div>
            {actions.map((item, index) => (
              <div className='card-btn' key={index}>
                <RcsInput
                  text={item.displayText}
                  onChange={(val) => changeBtnText(val, index)}
                  onFocus={() => {
                    setactionsIndex(index)
                    setbtnIndex(index)
                  }}
                  onBlur={() => setactionsIndex(-1)}
                  max={25}
                  min={1}
                  chineseLen={2}
                  label={'按钮'}
                  showInsertParams={false}
                  active={index == actionsIndex}
                  style={{
                    height: 36,
                    lineHeight: '34px',
                    textAlign: 'center',
                    borderRadius: '18px',
                    backgroundColor: '#ECEFF2',
                    overflow: 'auto',
                    padding: '0 16px',
                  }}
                />
              </div>
            ))}
            {actions.length < 4 && (
              <div className='card-btn-add fx-center-center' onClick={addBtn}>
                <span className='icon iconfont icon-jia fn14'></span>
              </div>
            )}
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
                    overflow: 'auto',
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
