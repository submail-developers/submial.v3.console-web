import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  CSSProperties,
} from 'react'
import {
  Flex,
  Space,
  Tabs,
  Checkbox,
  Divider,
  Image,
  Input,
  Form,
  Select,
  App,
} from 'antd'
import type { TabsProps, SelectProps } from 'antd'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import Meteial from '../components/meteial'
import ActionForm from '../components/actionForm'
import Page from '../page'
import { Media, Action, Reply, SuggestionItem, CardLayout } from '../type'
import RcsInput from '@/components/rcsInput'
import ANumber from '@/components/aNumber'
import { useDrop } from 'react-dnd'
import { config as dndConfig } from '../dnd'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import videoTypeImg from '@/assets/rcs/fileType/video.png'
import errorImg from '@/assets/rcs/error.png'
import { API } from 'apis'
import { createRcsTemp, getMmsList } from '@/api'
import formUtils from '@/utils/formRules'

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

const SearchInput = (props) => {
  const [data, setData] = useState<SelectProps['options']>([])
  const [value, setValue] = useState<string>()

  const handleSearch = debounce(async (newValue: string) => {
    if (!newValue) {
      setData([])
      return
    }
    const res = await getMmsList({
      page: 1,
      limit: 20,
      id: newValue,
    })
    setData(res.data)
  }, 200)

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <Select
      showSearch
      value={value}
      placeholder='请输入模版ID'
      defaultActiveFirstOption={false}
      style={{ width: '100%' }}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      options={(data || []).map((d) => ({
        value: d.sign,
        label: d.sign,
      }))}
    />
  )
}

export default function Fn() {
  const { message: messageApi } = App.useApp()
  const [searchParams] = useSearchParams()
  const name = decodeURIComponent(searchParams.get('name'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [media, setmedia] = useState<Media>()

  // 拖拽素材到指定区域
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: dndConfig.accept,
    drop: (item: API.RcsOnlineMeteialItem, monitor) => {
      if (item) {
        setmedia({
          mediaUrl: item.storeAt,
          mediaContentType: 'image/png',
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
      postback: {
        data: '',
      },
      urlAction: {
        openUrl: {
          application: 'browser',
          url: '',
        },
      },
    },
  ])
  const [actionsIndex, setactionsIndex] = useState(-1)
  const [btnIndex, setbtnIndex] = useState(0)
  // 悬浮菜单
  const [suggestions, setsuggestions] = useState<Action[]>([
    {
      displayText: '悬浮按钮',
      postback: {
        data: '',
      },
      urlAction: {
        openUrl: {
          application: 'browser',
          url: '',
        },
      },
    },
  ])
  const [suggestionsIndex, setsuggestionsIndex] = useState(-1)
  const [floatIndex, setfloatIndex] = useState(0)
  // 上行回复
  const [reply, setreply] = useState<Reply[]>([])
  const [layout, setlayout] = useState<CardLayout>()

  const [richTitle, setRichTitle] = useState<RichText>({
    label: '卡片标题',
    text: '请输入标题，最多100个中文字符',
    b: true,
    i: false,
    u: false,
    min: 1,
    max: 200,
  })
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
  const [mmsInfo, setMmsInfo] = useState<API.MmsListItem>()
  const [mmsList, setMmsList] = useState<API.MmsListItem[]>([])

  const searchMmsList = debounce(async (newValue: string) => {
    if (!newValue) {
      setMmsList([])
      return
    }
    const res = await getMmsList({
      page: 1,
      limit: 20,
      id: newValue,
    })
    setMmsList(res.data)
  }, 200)

  const changeMmsValue = (val) => {
    const info = mmsList.find((item) => item.sign == val)
    if (info) {
      setMmsInfo(info)
    }
  }

  const [activeKey, setactiveKey] = useState('1')
  const onChange = (key: string) => {
    setactiveKey(key)
  }

  // 按钮
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
          postback: {
            data: '',
          },
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
            let { displayText, postback } = item
            item = { ...values, displayText, postback }
          }
          return item
        }),
      ]
    })
  }

  // 悬浮按钮
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
          postback: {
            data: '',
          },
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
            let { displayText, postback } = item
            item = { ...values, displayText, postback }
          }
          return item
        }),
      ]
    })
  }

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
      //     postback: {
      //       data: '1536309659126861824',
      //     },
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
      //     postback: {
      //       data: '1536309659126861824',
      //     },
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
      type: '2',
      title: name,
      appid: '1024252',
      sms: Boolean(richMsg) ? 'true' : 'false',
      smsContent: richMsg,
      mms: Boolean(mmsInfo) ? 'true' : 'false',
      mmsTemplate: '',
      mmsSubject: '这里是彩信标题',
      suggestions: JSON.stringify(_suggestions),
      message: JSON.stringify({ message }),
    }
    console.log(suggestions, actions, params)

    const res = createRcsTemp(params)
    console.log(res)
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

  const getMms = async () => {
    const res = await getMmsList({
      page: 1,
      limit: 20,
    })
    console.log(res)
  }

  useEffect(() => {
    getMms()
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <span
            className='icon iconfont icon-card fn18'
            style={{ marginRight: '2px' }}></span>
          <span>模版配置</span>
        </>
      ),
      children: (
        <div className='base-config'>
          {/* <div className='title'>单卡片</div> */}
          {/* <div>卡片缩略图</div>
          <div>
            不选择缩略图 <Checkbox></Checkbox>
          </div> */}
          {/* <Divider /> */}
          <div className='fn16 fw-500'>正文</div>
          <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
            标题文字样式
          </div>
          <Space style={{ margin: '6px 0' }}>
            <div
              className={`fx-center-center rich-style-btn ${
                richTitle.b ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichTitle({ ...richTitle, b: !richTitle.b })}>
              <span className='icon iconfont icon-b'></span>
            </div>
            <div
              className={`fx-center-center rich-style-btn ${
                richTitle.i ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichTitle({ ...richTitle, i: !richTitle.i })}>
              <span className='icon iconfont icon-i'></span>
            </div>
            <div
              className={`fx-center-center rich-style-btn ${
                richTitle.u ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichTitle({ ...richTitle, u: !richTitle.u })}>
              <span className='icon iconfont icon-u'></span>
            </div>
          </Space>
          <div className='fn14 gray-color' style={{ marginTop: '8px' }}>
            内容文字样式
          </div>
          <Space style={{ margin: '6px 0' }}>
            <div
              className={`fx-center-center rich-style-btn ${
                richDes.b ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichDes({ ...richDes, b: !richDes.b })}>
              <span className='icon iconfont icon-b'></span>
            </div>
            <div
              className={`fx-center-center rich-style-btn ${
                richDes.i ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichDes({ ...richDes, i: !richDes.i })}>
              <span className='icon iconfont icon-i'></span>
            </div>
            <div
              className={`fx-center-center rich-style-btn ${
                richDes.u ? 'color-btn-active' : 'color-btn'
              }`}
              onClick={() => setRichDes({ ...richDes, u: !richDes.u })}>
              <span className='icon iconfont icon-u'></span>
            </div>
          </Space>
          <Divider />
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
          <Divider />
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
      ),
    },
    {
      key: '2',
      label: (
        <>
          <span
            className='icon iconfont icon-jiaohu fn18'
            style={{ marginRight: '2px' }}></span>
          <span>消息回落配置</span>
        </>
      ),
      children: (
        <div className='message-config hide-scrollbar'>
          <div className='fn16 fw-500'>回落配置</div>
          <Form.Item
            label='短信回落信息（选填）'
            colon={false}
            style={{ margin: '4px 0 0' }}></Form.Item>
          <RcsInput
            text={richMsg}
            onChange={(val) => setRichMsg(val)}
            onBlur={() => setactionsIndex(-1)}
            min={0}
            chineseLen={2}
            label={'短信消息回落'}
            showInsertParams
            active
            style={{
              height: 120,
              lineHeight: '24px',
              backgroundColor: '#fff',
              overflow: 'auto',
              padding: '0',
              // borderStyle: 'solid',
              // borderColor: '#ccc',
              border: 'none',
            }}
            wrapStyle={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              // overflow: 'auto',
              borderRadius: '4px',
            }}
          />

          {/* <Divider /> */}

          {/* <div className='fn16 fw-500' style={{ margin: '16px 0 8px' }}>
            多媒体彩信消息回落
          </div> */}
          <Form.Item
            label='多媒体彩信回落（选填）'
            colon={false}
            style={{ margin: '4px 0 0' }}></Form.Item>

          <Select
            showSearch
            value={(mmsInfo && mmsInfo.sign) || null}
            placeholder='请输入模版ID'
            defaultActiveFirstOption={false}
            style={{ width: '100%' }}
            filterOption={false}
            onSearch={searchMmsList}
            onChange={changeMmsValue}
            fieldNames={{ label: 'sign', value: 'sign' }}
            options={mmsList}
          />
        </div>
      ),
    },
  ]
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <div className='tabs'>
      {items.map((item) => (
        <div
          key={item.key}
          className={`tab-item ${activeKey == item.key ? 'active' : ''}`}
          onClick={() => setactiveKey(item.key)}>
          {item.label}
        </div>
      ))}
    </div>
  )

  return (
    <Page
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
                    width: '120px',
                    height: '40px',
                    objectFit: 'contain',
                  }}
                  src={media.mediaUrl}
                  preview={false}
                  fallback={errorImg}
                />
              )}
              {media && media.mediaType == '3' && (
                <video src={media.mediaUrl} poster={videoTypeImg}></video>
              )}
            </div>
            <div
              className='card-title'
              style={{
                fontWeight: richTitle.b ? 'bold' : 'normal',
                fontStyle: richTitle.i ? 'italic' : 'normal',
                textDecoration: richTitle.u ? 'underline' : 'none',
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
                    backgroundColor: '#F3F7FA',
                    overflow: 'auto',
                    padding: '0 16px',
                  }}
                />
              </div>
            ))}
            {actions.length < 4 && (
              <div className='card-btn-add fx-center-center' onClick={addBtn}>
                <span className='icon iconfont icon-jia'></span>
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
            <div
              className='float-add-btn fx-center-center'
              onClick={addSuggestions}>
              <span className='icon iconfont icon-jia fn12'></span>
            </div>
          </Space>
        </>
      }
      right={
        <Tabs
          renderTabBar={renderTabBar}
          activeKey={activeKey}
          items={items}
          onChange={onChange}
        />
      }
      submit={submit}></Page>
  )
}
